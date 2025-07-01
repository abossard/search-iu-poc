import { Request, Response, NextFunction } from 'express';
import { EdgeRequest, validateUpdatesArray, filterLayoutUpdates } from './types';

// Logger middleware
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

/**
 * Enhanced JSON middleware following SOLID principles
 * Single responsibility: Validate JSON format and filter layout updates
 */
export const jsonOnlyMiddleware = (req: EdgeRequest, res: Response, next: NextFunction) => {
    if (!req.is('application/json')) {
        res.status(400).json({ error: 'Only JSON format is accepted' });
        return;
    }

    console.log('Request body:', req.body);

    // Validate updates array structure
    const rawUpdates = req.body.updates;
    if (!validateUpdatesArray(rawUpdates)) {
        res.status(400).json({ 
            error: 'Invalid JSON format. "updates" field is required and must contain an array of { identifier, entity_definition, operation, and entity_culture}.' 
        });
        return;
    }

    // Filter to only layout updates (pure calculation)
    const layoutUpdates = filterLayoutUpdates(rawUpdates);
    
    if (layoutUpdates.length === 0) {
        console.log('No layout updates found, skipping processing');
        res.status(200).json({ message: 'No layout updates to process' });
        return;
    }

    // Store filtered updates for downstream middleware
    req.updates = layoutUpdates;
    
    console.log(`Found ${layoutUpdates.length} layout items from ${rawUpdates.length} total items`);
    next();
};
