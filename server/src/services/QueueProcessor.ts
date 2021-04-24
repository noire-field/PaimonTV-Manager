
import firebase from 'firebase';
import { QueueItemModel, QueueStatus } from './../types/Queue';

class QueueProcessor {
    id: number;
    item!: QueueItemModel;
    firebaseRef!: firebase.database.Reference;
    status: QueueStatus;

    constructor(id: number, firebaseRef: firebase.database.Reference) {
        this.id = id;
        this.firebaseRef = firebaseRef;
        this.status = QueueStatus.Ready;
    }

    GetStatus() { return this.status; }
    async Process(item: QueueItemModel) {
        console.log(`[Queue Processor #${this.id}] Accepted: ${item.id}`);
        this.status = QueueStatus.Verifying;

        // Confirm with Firebase first (In case the user deleted it there)
        const queueItem = await this.firebaseRef.child(item.id).get();
        if(!queueItem) { // This item is deleted in Firebase
            this.status = QueueStatus.Ready;
            return;
        }

        await this.firebaseRef.child(item.id).child('status').set(1);
        this.item = item;
    }
}

export default QueueProcessor;