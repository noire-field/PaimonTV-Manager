import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase';

import QueueProcessor from './QueueProcessor';
import { QueueItemDocument, QueueItemModel, QueueStatus } from './../types/Queue';

class Queue {
    connected: boolean = false;
    queueList: QueueItemModel[] = [];
    firebaseDB!: firebase.database.Database;
    queueProcessors!: QueueProcessor[];

    constructor() {
        this.queueList = [];
        console.log(this.queueList);
    }

    Connect(ref: firebase.database.Database) {
        this.connected = true;
        this.firebaseDB = ref;

        this.queueProcessors = [
            new QueueProcessor(1, ref),
            new QueueProcessor(2, ref)//,
            //new QueueProcessor(3, ref)
        ]

        setInterval(this.CheckQueue.bind(this), 500);
        console.log("Queue Connected");
    }

    async Add(item: QueueItemDocument) {
        if(!this.connected) {
            console.log(`[Queue] Unable to add to queue because not connected to firebase`);
            return;
        }

        const queueId = uuidv4();

        this.queueList.push({
            ...item,
            id: queueId,
            createdAt: new Date().getTime(),
            fileSize: 0,
            progress: 0
        });

        this.firebaseDB.ref('queue').child(queueId).set({
            ...item,
            createdAt: new Date().getTime()
        })
    
        console.log(`[Queue] Added ${item.movieId} / ${item.episodeId} (User: ${item.userId})`);
    }

    private CheckQueue() {
        if(!this.connected || this.queueList.length <= 0)
            return;

        var readyProcessor = null;
        for(let i = 0; i < this.queueProcessors.length; i++) {
            const processor = this.queueProcessors[i];

            if(processor.GetStatus() == QueueStatus.Ready) {
                readyProcessor = processor;
                break;
            }
        }
        
        if(readyProcessor) {
            const item = this.queueList.shift();
            this.SendToProcessor(readyProcessor, item!);
        }
    }

    private SendToProcessor(processor: QueueProcessor, item: QueueItemModel) {
        processor.Process(item, async (success: boolean, data: string) => {
            if(!success) { // Fail? Put it b
                return;
            }

            // Delete it on done
            await this.firebaseDB.ref('queue').child(item.id).remove();
        });
    }
}

export const queue = new Queue();

/* 
    Todo:
    1. On Process fail, remove it from queue and add log to user
    2. Can not edit or update if the item is being processed
    3. Try catch all the firebase shit in Queue/QueueProcessor

*/