import express, { Request, Response } from 'express';
import firebase from 'firebase';

import { queue as QueueHandler } from './../services/Queue';
import { InternalServerError } from '../errors/InternalServerError';

const router = express.Router();

// Get list
router.get('/', async (req: Request, res: Response) => {
    // Processing
    try {
        var queue = await firebase.database().ref('queue').get();
    } catch(e) {
        console.log(e);
        throw new InternalServerError('Unable to fetch queue from firebase');
    }

    var queueList = [];
    var queueRawData = queue.val();

    if(queueRawData) {
        for(const queueId in queueRawData) {
            const thisQueue = queueRawData[queueId];
            queueList.push({
                ...thisQueue
            })
        }
    }

    queueList.sort((a, b) => a.createdAt - b.createdAt);
    queueList = queueList.map((q) => {
        delete q.userId;
        return q;
    })

    // Processors
    var processorList = QueueHandler.GetProcessors().map((p) => {
        return {
            id: p.id,
            status: p.GetStatus()
        }
    })
   
    res.status(200).send({
        success: true,
        processing: queueList,
        processors: processorList
    });
});

export default router;