// types.d.ts

import { Request } from 'express';

export interface Update {
    identifier: string;
    entity_definition: string;
    operation: string;
    entity_culture: string;
}

export interface EdgeRequest extends Request {
    updates?: Update[];
    invocation_id?: string;
    continues?: boolean;
}

export function isUpdate(obj: any): obj is Update {
    return obj && typeof obj === 'object' &&
        'identifier' in obj &&
        'entity_definition' in obj &&
        'operation' in obj &&
        'entity_culture' in obj;
}


export interface Item {
    id: string;
    path: string;
    name: string;
    description: string;
    locale: string;
}

export interface GraphQLResponseData {
    total: number;
    items: Item[];
}

// Repository and invocation management types
export interface InvocationData {
    invocation_id: string;
    updates: Update[];
    timestamp: number;
}

export interface IInvocationRepository {
    addUpdates(invocation_id: string, updates: Update[]): void;
    getInvocation(invocation_id: string): InvocationData | undefined;
    getAllInvocations(): InvocationData[];
    removeInvocation(invocation_id: string): void;
}

// Pure calculation functions
export function isLayoutUpdate(update: Update): boolean {
    return update.identifier.includes('-layout');
}

export function filterLayoutUpdates(updates: Update[]): Update[] {
    return updates.filter(update => isUpdate(update) && isLayoutUpdate(update));
}

export function validateUpdatesArray(updates: any): updates is Update[] {
    return Array.isArray(updates);
}
