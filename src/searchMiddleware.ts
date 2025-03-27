import { Response, NextFunction } from 'express';
import { EdgeRequest, Item, GraphQLResponseData } from './types';

// const REGION = "discover";
// const DOMAIN_ID = "120111945";
// const SOURCE_ID = "1068834";
// const METHOD = "PATCH";
// const API_KEY = "01-b33998c8-219b38569ada34db2326dba12cfe39c8d52ce6ee"; // `${process.env.PROD_API_KEY}`

export const updateSearch = async (req: EdgeRequest, res: Response, next: NextFunction) => {
    const {REGION, DOMAIN_ID, SOURCE_ID, METHOD, SEARCH_API_KEY, ENTITY_TYPE} = process.env;
    console.log("REGION", REGION);
    const itemsToUpdate: GraphQLResponseData = req.body.graphqlData;
    // entity extraction
    // ...TODO
    // by default it uses the env var ENTITY_TYPE

    const requests = itemsToUpdate.items.map(async (item: Item) => {
        item.locale = (item.locale === "en")? "en_us":item.locale;
        const response = await fetch(`https://${REGION}.sitecorecloud.io/ingestion/v1/domains/${DOMAIN_ID}/sources/${SOURCE_ID}/entities/${ENTITY_TYPE}/documents/${item.id}?locale=${item.locale}`, {
            method: METHOD,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': SEARCH_API_KEY as string
            },
            body: JSON.stringify({
                document: {
                    id: item.id,
                    fields: {
                        name: item.name,
                        description: item.description
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update item with id ${item.id}: ${response.status} ${response.statusText}`);
        }

        return response.json();
    });
    console.log('All items updated, WAITING....');
    try {
        const results = await Promise.all(requests);
        console.log('All items updated successfully:', results);
        req.body.batches = results;

        next();
    } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Error updating items' + error });
    }
};
