import { Response, NextFunction } from 'express';
import { EdgeRequest } from './types';
import { invocationRepository } from './invocationRepository';

/**
 * CollectAndProcessMiddleware - Manages batching of updates by invocation_id
 * Follows Single Responsibility Principle: Only collects and determines when to process
 */
export const collectAndProcessMiddleware = (req: EdgeRequest, res: Response, next: NextFunction) => {
    const { invocation_id, continues } = req.body;
    const updates = req.updates || [];

    // Validate required fields
    if (!invocation_id) {
        console.log('No invocation_id provided, processing immediately');
        next();
        return;
    }

    console.log(`Processing invocation ${invocation_id}, continues: ${continues}, updates: ${updates.length}`);

    // Webhook-specific logic: Handle based on continues flag
    if (continues === false) {
        // Batch is complete - get existing data and merge with current updates
        const existingInvocation = invocationRepository.getInvocation(invocation_id);
        const existingUpdates = existingInvocation ? existingInvocation.updates : [];
        
        // Merge existing updates with current ones (don't add to repository)
        const allUpdates = [...existingUpdates, ...updates];
        const totalUpdates = allUpdates.length;
        const threshold = parseInt(process.env.UPDATE_THRESHOLD || '100');

        console.log(`Invocation ${invocation_id} complete. Total updates: ${totalUpdates} (${existingUpdates.length} existing + ${updates.length} current), Threshold: ${threshold}`);

        // Clean up repository if there was existing data
        if (existingInvocation) {
            invocationRepository.removeInvocation(invocation_id);
        }

        // Check threshold (pure calculation)
        if (totalUpdates > threshold) {
            console.log(`Invocation ${invocation_id} exceeds threshold (${totalUpdates} > ${threshold}), skipping processing`);
            res.status(200).json({ 
                message: `Invocation ${invocation_id} exceeded threshold and was skipped`,
                total_updates: totalUpdates,
                threshold 
            });
            return;
        }

        // Forward all merged updates for processing
        req.updates = allUpdates;
        req.body.updates = allUpdates; // Maintain backward compatibility
        
        console.log(`Forwarding ${totalUpdates} merged updates for processing`);
        next();
        return;
    } else {
        // Batch is not complete yet - add updates to repository for later
        invocationRepository.addUpdates(invocation_id, updates);
        
        // Acknowledge receipt
        const stats = invocationRepository.getStats();
        console.log(`Invocation ${invocation_id} batched. Repository stats:`, stats);
        
        res.status(200).json({ 
            message: `Collected ${updates.length} items for ${invocation_id}`,
            invocation_id,
            continues: true,
            repository_stats: stats
        });
        return;
    }
};
