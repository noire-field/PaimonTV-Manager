export interface QueueItemDocument {
    userId: string;
    movieId: string;
    episodeId: string;
    status: number;
}

/*
    status: 0 - Wait for processing / 1 - Downloading / 2 - Uploading / 3 - Completed / 4 - Failured
*/
export interface QueueItemModel {
    id: string;
    userId: string;
    movieId: string;
    episodeId: string;
    status: number;
    createdAt: number;
    fileSize: number;
    progress: number;
}

export interface QueueData {
    fileSize: number;
    fetchedSize: number;
}

export const enum QueueStatus {
    Ready = 'Ready',
    Verifying = 'Verifying',
    Transcoding = 'Transcoding',
    Downloading = 'Downloading',
    Uploading = 'Uploading'
}

export interface Callback {
    (success: boolean, message: string): void;
} 

export interface AliveCheck {
    lastStep: number;
    previousFetchedSize: number;
    checkCount: number;
    lastCheckTime: number;
    interval: any;
}