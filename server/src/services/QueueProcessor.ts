
import http, { ClientRequest, IncomingMessage } from 'http';
import https from 'https';
import _ from 'lodash';
import fs from 'fs';
import { getVideoDurationInSeconds } from 'get-video-duration';
import AWS from 'aws-sdk';
import firebase from 'firebase';

import { s3, S3_BUCKET } from './../utils/aws';
import { storage as gcStorage, GCS_BUCKET } from './../utils/gcloud';

import { DurationSecondToText } from './../utils/movies';
import { QueueItemModel, QueueStatus, Callback, QueueData, AliveCheck } from './../types/Queue';
import { Episode } from './../types/Episode';

class QueueProcessor {
    id: number;
    item!: QueueItemModel;
    data: QueueData = {
        fileSize: 0,
        fetchedSize: 0
    };
    aliveChecker: AliveCheck = {
        lastStep: 0,
        previousFetchedSize: 0,
        checkCount: 0,
        lastCheckTime: 0,
        interval: null
    };
    episode!: Episode;
    movie!: any;
    firebaseDB: firebase.database.Database;
    status: QueueStatus;
    client!: any;
    downloadRequest!: ClientRequest;
    uploadRequest!: AWS.S3.ManagedUpload;
    writeStream!: fs.WriteStream;
    readStream!: fs.ReadStream;
    callback!: Callback;

    constructor(id: number, firebaseDB: firebase.database.Database) {
        this.id = id;
        this.firebaseDB = firebaseDB;
        this.status = QueueStatus.Ready;
    }

    GetStatus() { return this.status; }
    GetFileUrl() { return './tmp'+this.item.id; }

    async Process(item: QueueItemModel, callback: Callback) {
        this.Log(`Accepted: ${item.id}`);
        this.status = QueueStatus.Verifying;
        this.item = item;

        // In case something went wrong, we can have a fallback log
        // @ts-ignore
        this.episode = { title: item.episodeId, url: "Unknown" };
        this.movie = { title: item.movieId };
        this.data.fetchedSize = 0;

        // Confirm with Firebase first (In case the user deleted it there)
        const queueItem = await this.firebaseDB.ref('queue').child(item.id).get();
        if(!queueItem || queueItem.val().status > 0) { // This item is deleted in Firebase or is processed by other processor
            this.status = QueueStatus.Ready;
            return;
        }

        const movieRef = await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}`).get();
        if(!movieRef.exists()) { // Movie can not be found, delete it
            this.ProcessError(`Movie information not found`);
            return;
        }

        const movie = movieRef.val();
        
        //const episodeRef = await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}`).get();
        if(!movie.episodes || !movie.episodes[this.item.episodeId]) { // Episode can not be found, delete it
            this.ProcessError(`Episode information not found`);
            return;
        }

        this.movie = movie;
        const episodeInfo = movie.episodes[this.item.episodeId];

        this.episode = {
            id: episodeInfo.id,
            title: episodeInfo.title,
            url: episodeInfo.url, //'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', // 'https://speed.hetzner.de/100MB.bin', 
            status: episodeInfo.status,
            duration: episodeInfo.duration,
            progress: episodeInfo.progress
        }

        if(episodeInfo.status > 0) { // No longer need to process
            this.ProcessError(`This episode doesn't need to be processed as its status is ${episodeInfo.status}`);
            return;
        }

        await this.firebaseDB.ref('queue').child(item.id).update({
            movieTitle: this.movie.title,
            episodeTitle: this.episode.title,
            status: 1
        });
        await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}/status`).set(1);

        if(this.episode.url.startsWith('https')) this.client = https;
        else this.client = http;

        // Clear data
        this.aliveChecker.lastStep = 0;
        this.aliveChecker.previousFetchedSize = 0;
        this.aliveChecker.checkCount = 0;
        this.aliveChecker.lastCheckTime = 0;
    
        // Connect
        this.writeStream = fs.createWriteStream(this.GetFileUrl());
        this.downloadRequest = this.client.get(this.episode.url, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0' 
            } 
        }, this.RequestResponse.bind(this));

        this.downloadRequest.on('error', async (err) => {
            await fs.unlinkSync(this.GetFileUrl());
            this.Log(`Deleted file: ${this.item.id}`);
            
            this.ProcessError(err.message);
        })

        this.aliveChecker.interval = setInterval(this.TimeCheck.bind(this), 1000);
        this.callback = callback;
    }

    private async TimeCheck() {
        if(this.status == QueueStatus.Downloading) {
            // In case connection is corrupted
            const currentTime = new Date().getTime();
            if(currentTime > this.aliveChecker.lastCheckTime + (1 * 1000)) {
                if(this.aliveChecker.previousFetchedSize != this.data.fetchedSize) {
                    this.aliveChecker.checkCount = 0;
                    this.aliveChecker.previousFetchedSize = this.data.fetchedSize;

                    var percent = 0;
                    if(this.data.fileSize > 1) {// Not 0
                        percent = Math.round(this.data.fetchedSize / this.data.fileSize * 100);
                    } else { // Unable to retrieve the file name, we show mb instead
                        percent = Math.round(this.BytesToMB(this.data.fetchedSize));
                    }
                    
                    if(percent > this.aliveChecker.lastStep) {
                        this.aliveChecker.lastStep = percent;
                        this.Log(`Downloading ${percent}${this.data.fileSize > 1 ? '%' : 'MB'}`);
                        this.firebaseDB.ref('queue').child(`${this.item.id}/progress`).set(percent);
                    }
                } else {
                    this.aliveChecker.checkCount++;
                    this.Log(`Download paused... retrying ${this.aliveChecker.checkCount}/10`);
                    if(this.aliveChecker.checkCount >= 10) {
                        this.downloadRequest.destroy();

                        await fs.unlinkSync(this.GetFileUrl());
                        this.Log(`Deleted file: ${this.item.id}`);

                        this.ProcessError(`File stopped downloading`);
                    }
                }

                this.aliveChecker.lastCheckTime = currentTime;
            }
        }
    }

    private RequestResponse(response: IncomingMessage) {

        // Start Downloading
        this.status = QueueStatus.Downloading;
        this.Log(`Start downloading...`);

        this.data.fileSize = response.headers['content-length'] ? parseInt(response.headers['content-length'], 10) : 1; // In case size can not be retrieved?
        
        this.firebaseDB.ref('queue').child(`${this.item.id}/fileSize`).set(this.data.fileSize > 1 ? this.data.fileSize : 0);

        response.on("data", async (chunk: any) => {
            this.data.fetchedSize += chunk.length;

            //console.log("Downloading " + (100.0 * fetchedSize / fileSize).toFixed(2) + "% " + (fetchedSize / 1048576).toFixed(2) + " mb / Total size: " + fileSizeInMB.toFixed(2) + " mb");
        });
        
        response.pipe(this.writeStream);

        response.on("end", this.DownloadComplete.bind(this));
    }

    private async DownloadComplete() {
        this.writeStream.close();
        this.Log(`Downloading completed, verifying file...`);

        this.status = QueueStatus.Verifying;
        var second = 0;

        try {
            second = await getVideoDurationInSeconds(this.GetFileUrl());
            this.Log(`Video file verified, duration: ${DurationSecondToText(second)}`);
        } catch(e) {
            await fs.unlinkSync(this.GetFileUrl());
            this.Log(`Deleted file: ${this.item.id}`);
            this.ProcessError(`Unable to verify video file.`)
        }

        await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}/duration`).set(Math.round(second));
     
        if(!second) return;

        await await this.firebaseDB.ref('queue').child(this.item.id).child('status').set(2);

        this.StartUpload();
    }

    private async StartUpload() {
        this.status = QueueStatus.Uploading;
        this.readStream = fs.createReadStream(this.GetFileUrl());

        switch(process.env.USE_CLOUD) {
            case 'AWS':
                this.Log(`Start uploading to AWS S3...`);
                this.uploadRequest = s3.upload({ 
                    Bucket: S3_BUCKET!, 
                    Key: `users/${this.item.userId}/${this.item.id}`,
                    Body: this.readStream, 
                    ACL: 'public-read' 
                },  async (err: any, data: AWS.S3.ManagedUpload.SendData) => {
                        if(err) {
                            await fs.unlinkSync(this.GetFileUrl());
                            this.Log(`Deleted file: ${this.item.id}`);
                            this.readStream.close();
                            this.ProcessError(err.code);
                            return;
                        }
        
                        // Upload Completed
                        await this.firebaseDB.ref('queue').child(this.item.id).child('status').set(3);
        
                        const url = data.Location;
                        this.Log(`Upload completed`);
                        
                        await fs.unlinkSync(this.GetFileUrl());
                        this.Log(`Deleted file: ${this.item.id}`);
        
                        await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}/status`).set(2);
                        await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}/url`).set(url);
                        
                        this.readStream.close();

                        this.status = QueueStatus.Ready;
                        this.Log(`Processor is ready`);
    
                        this.callback(true, url);
                    }
                );
        
                this.uploadRequest.on('httpUploadProgress', this.UploadProgressAWS.bind(this));
                break;
            case 'GC':
                this.Log(`Start uploading to Google Cloud Storage...`);
                const targetFile = gcStorage.bucket(GCS_BUCKET!).file(`users/${this.item.userId}/${this.item.id}`);
                const uploadStream = targetFile.createWriteStream();

                var uploadedBytes = 0;
                var throttledProgress = _.throttle(this.UploadProgressGD, 1000).bind(this);

                this.readStream.on('data', (chunk) => {
                    uploadedBytes += chunk.length;
                    throttledProgress(uploadedBytes, this.data.fileSize);
                });
                
                this.readStream.on('error', async (err) => {
                    await fs.unlinkSync(this.GetFileUrl());
                    this.Log(`Deleted file: ${this.item.id}`);

                    this.readStream.close();
                    this.ProcessError(err.message);
                });

                uploadStream.on('finish', async () => {
                    await targetFile.makePublic();
                    await this.firebaseDB.ref('queue').child(this.item.id).child('status').set(3);
        
                    const url = targetFile.publicUrl();
                    this.Log(`Upload completed`);
                    
                    await fs.unlinkSync(this.GetFileUrl());
                    this.Log(`Deleted file: ${this.item.id}`);
    
                    await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}/status`).set(2);
                    await this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}/url`).set(url);
                    
                    this.readStream.close();

                    this.status = QueueStatus.Ready;
                    this.Log(`Processor is ready`);

                    this.callback(true, url);
                })

                uploadStream.on('error', async (err) => {
                    await fs.unlinkSync(this.GetFileUrl());
                    this.Log(`Deleted file: ${this.item.id}`);

                    this.readStream.close();
                    this.ProcessError(err.message);
                })

                this.readStream.pipe(uploadStream);

                break;
            default: 
                await fs.unlinkSync(this.GetFileUrl());
                this.Log(`Deleted file: ${this.item.id}`);
                
                this.ProcessError('There is no uploading service');
                return;
        }
    }

    private async UploadProgressAWS(progress: AWS.S3.ManagedUpload.Progress) {
        const percent = Math.round(progress.loaded / progress.total * 100);
        this.Log(`Uploading ${percent}%`);
        this.firebaseDB.ref('queue').child(`${this.item.id}/progress`).set(percent);
    }

    private async UploadProgressGD(uploadedBytes: number, fileSize: number) {
        const percent = Math.round(uploadedBytes / fileSize * 100);
        this.Log(`Uploading ${percent}%`);
        this.firebaseDB.ref('queue').child(`${this.item.id}/progress`).set(percent);
    }

    private async ProcessError(message: string) {
        const promises = [
            this.firebaseDB.ref('queue').child(this.item.id).child('status').set(4),
            this.firebaseDB.ref('users').child(`${this.item.userId}/logs/`).push({
                message: `Processing Error: ${message}`,
                reference: `Movie: ${this.movie.title} / Episode: ${this.episode.title}`,
                url: this.episode.url,
                createdAt: new Date().getTime()
            }),
            this.firebaseDB.ref('users').child(`${this.item.userId}/movies/${this.item.movieId}/episodes/${this.item.episodeId}/status`).set(3)
        ]
        try {
            await Promise.all(promises);
        } catch(e) {
            // Skippable errors no worry
        }
        
        this.Log(`Processing Error: ${message}`);
        this.callback(false, message);
        
        if(this.aliveChecker.interval) {
            clearInterval(this.aliveChecker.interval);
            this.aliveChecker.interval = null;
        }
        
        this.status = QueueStatus.Ready;
        this.Log(`Reset and ready`);
    }

    private Log(message: string) {
        console.log(`[Queue Processor #${this.id}] ${message}`);
    }

    private BytesToMB(bytes: number) {
        return bytes / 1048576;
    }
}

export default QueueProcessor;