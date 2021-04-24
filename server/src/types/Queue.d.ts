export interface QueueItemDocument {
    userId: string;
    movieId: string;
    episodeId: string;
    status: number;
}

export interface QueueItemModel {
    id: string;
    userId: string;
    movieId: string;
    episodeId: string;
    status: number;
    createdAt: number;
}

export const enum QueueStatus {
    Ready = 'Ready',
    Verifying = 'Verifying',
    Downloading = 'Downloading',
    Uploading = 'Uploading'
}