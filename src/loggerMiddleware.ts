import { Request, Response, NextFunction } from 'express';
import { EdgeRequest, isUpdate, Update } from './types';

// Logger middleware
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

// Middleware to check for JSON content type and validate "updates" field
// export const jsonOnlyMiddleware = (req: TypedRequestBody<{ updates: Update[] }>, res: Response, next: NextFunction) => {
export const jsonOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.is('application/json')) {
        console.log(req.body);
        const mupdates: Update[]  = req.body.updates;
        if (Array.isArray(mupdates) && mupdates.every(isUpdate)) {
            res.status(200).json("{}");
            next();
        } else {
            res.status(400).json({ error: 'Invalid JSON format. "updates" field is required and must contain an array of { identifier, entity_definition, operation, and entity_culture}.' });
        }
        //next();
    } else {
        res.status(400).json({ error: 'Only JSON format is accepted' });
    }
};
