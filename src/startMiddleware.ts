import { Request, Response, NextFunction } from 'express';

// startUpdates middleware is responsible to disable the incremental updates when it receives a `publish:begin` (Full) from XMC
// and enable back when it receives an `onEnd` notification from EDGE
export const startUpdates = (req: Request, res: Response, next: NextFunction) => {
    if (req.is('application/json')) {
        console.log('global.sharedState.isIncrementalUpdatesEnabled ', (globalThis as any).__IS_INCREMENTAL_UPD_ENABLED );
        // TODO: based on notfication, it turns the incremental updates to true or false
        next();
    } else {
        res.status(400).json({ error: 'Only JSON format is accepted' });
    }
};
