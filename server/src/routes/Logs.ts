import express, { Request, Response } from 'express';

import { InternalServerError } from '../errors/InternalServerError';
import { CurrentUser } from '../middlewares/CurrentUser';
import { RequireAuth } from '../middlewares/RequireAuth';

const router = express.Router();

// Get list
router.get('/', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    const logsRef = req.userFirebaseRef.child('logs');

    // Processing
    try {
        var logs = await logsRef.limitToLast(20).get();
    } catch(e) {
        console.log(e);
        throw new InternalServerError('Unable to fetch logs from firebase');
    }

    var logList = [];

    if(logs) {
        const rawLogs = logs.val();
        for(const logId in rawLogs) {
            const thisLog = rawLogs[logId];
            logList.push({
                id: logId,
                ...thisLog
            })
        }
    }

    logList.reverse();
    //logList.sort((a: any, b: any) => b.createdAt - a.createdAt);
    
    res.status(200).send({
        success: true,
        logs: logList
    });
});

export default router;