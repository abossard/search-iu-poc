import { IInvocationRepository, InvocationData, Update } from './types';

/**
 * Lightweight in-memory repository for managing invocations and their updates.
 * Follows single responsibility principle - only manages invocation data.
 */
export class InvocationRepository implements IInvocationRepository {
    private invocations: Map<string, InvocationData> = new Map();
    /**
     * Add updates to an invocation (pure domain operation)
     */
    addUpdates(invocation_id: string, updates: Update[]): void {
        const existing = this.invocations.get(invocation_id);
        
        if (existing) {
            // Append new updates to existing invocation
            existing.updates.push(...updates);
            existing.timestamp = Date.now();
        } else {
            // Create new invocation
            this.invocations.set(invocation_id, {
                invocation_id,
                updates: [...updates],
                timestamp: Date.now()
            });
        }
    }

    /**
     * Get invocation data (pure calculation)
     */
    getInvocation(invocation_id: string): InvocationData | undefined {
        return this.invocations.get(invocation_id);
    }

    /**
     * Get all invocations (pure calculation)
     */
    getAllInvocations(): InvocationData[] {
        return Array.from(this.invocations.values());
    }

    /**
     * Remove completed invocation (action)
     */
    removeInvocation(invocation_id: string): void {
        this.invocations.delete(invocation_id);
    }

    /**
     * Get statistics for monitoring
     */
    getStats() {
        const total_invocations = this.invocations.size;
        const total_items = Array.from(this.invocations.values()).reduce((sum, inv) => sum + inv.updates.length, 0);

        return { total_invocations, total_items };
    }
}

// Singleton instance for the application
export const invocationRepository = new InvocationRepository();
