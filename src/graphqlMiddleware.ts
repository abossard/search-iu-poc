import { Response, NextFunction } from 'express';
//import fetch from 'node-fetch';
import { EdgeRequest, Update } from './types';
import { convertToUUID, toUUID } from './utility';

const LAYOUT = "-layout";
const LAYOUT_DATA = "LayoutData";
const METHOD = "POST";

// const SITECORE_EE_URL: string = process.env.SITECORE_EE_URL as string;
// const GQL_TOKEN: string = process.env.GQL_TOKEN as string;
// const TEMPLATE_ID = process.env.TEMPLATE_ID;


export const graphqlMiddleware = async (req: EdgeRequest, res: Response, next: NextFunction) => {
    try {
        const {SITECORE_EE_URL, GQL_TOKEN, TEMPLATE_ID} = process.env
        console.log("SITECORE_EE_URL", SITECORE_EE_URL);

        const mupdates: Update[]  = req.body.updates;
        //console.log(mupdates); // Print the updates field to the console
        req.body.graphqlData = [];

        if (mupdates) {
            const pagesToRefresh: string[] = [];
            pagesToRefresh.push(...mupdates.filter(x => x.entity_definition === LAYOUT_DATA).map(x => convertToUUID(x.identifier.replace(new RegExp(LAYOUT, 'g'), ''))));
            console.log('pagesToRefresh', SITECORE_EE_URL, pagesToRefresh);
            let itemIDs: string = pagesToRefresh.map(identifier => `{name: "_path", value: "${identifier}", operator: CONTAINS }`).join('');

            const response = await fetch(SITECORE_EE_URL as string, {
                method: METHOD,
                headers: { 'Content-Type': 'application/json', 'X-GQL-Token': GQL_TOKEN as string },
                body: JSON.stringify({
                    query: `query {
                        search(first: ${pagesToRefresh.length}, where: {
                            AND: [
                                { name: "_templates", value: "${TEMPLATE_ID}", operator: CONTAINS },
                                { OR: [${itemIDs}] },
                                { name: "_language", value: "${mupdates[0].entity_culture}" }
                            ]
                        }) {
                            total
                            results {
                                id
                                name
                                path
                                language { name }
                                Name: field(name: "Title") { name, jsonValue }
                                Description: field(name: "Content") { name, jsonValue }
                            }
                        }
                    }`
                })
            });

            const jsonResp = await response.json();
            console.log('jsonResp', jsonResp.data.search);
            const items = jsonResp.data.search.results.map((item: { id: string; path: any; Name: { jsonValue: { value: any; }; }; Description: { jsonValue: { value: any; }; }; language: { name: any; }; }) => ({
                id: toUUID(item.id).toLowerCase(),
                path: item.path,
                name: item.Name?.jsonValue?.value,
                description: item.Description?.jsonValue?.value,
                locale: item.language?.name,
            }));
            req.body.graphqlData = {
                total: jsonResp.data.search.total,
                items: items
            }
            console.log('graphqlData', req.body.graphqlData);
            next();
        }
        // else
        //     res.status(404).json({ error: 'ItemID(s) not found in the update webhook' });
    } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Failed to fetch data from GraphQL endpoint' });
    }
};
