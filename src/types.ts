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
