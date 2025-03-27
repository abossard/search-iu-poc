import express, { Response, NextFunction } from 'express';
import { loggerMiddleware, jsonOnlyMiddleware } from './loggerMiddleware';
import { graphqlMiddleware } from './graphqlMiddleware';
import { EdgeRequest } from './types';
import { updateSearch } from './searchMiddleware';
import dotenv from 'dotenv';
import { startUpdates } from './startMiddleware';

dotenv.config({path:__dirname+'/../.env.local'});

const app = express();

app.use(express.json());

app.use(loggerMiddleware); // Use the logger middleware

// Define a simple route
app.get('/', (req: EdgeRequest, res: Response) => {
    res.send('Hello, World!');
});

// Define a simple route
app.get('/ping', (req: EdgeRequest, res: Response) => {
    res.send('Pong');
});

// Define the /published route with JSON-only and GraphQL middleware
app.post('/published', jsonOnlyMiddleware, graphqlMiddleware, updateSearch, (req: EdgeRequest, res: Response) => {
    console.log('--- completed, invocation_id:', req.body.invocation_id); // Access the updates field here
    res.setHeader('content-type', 'application/json');
    res.send(`{ invocation_id: ${req.body.invocation_id}}`);
});

// Define the /start route to dis/enable the incremental Updates
app.post('/start', startUpdates, (req: express.Request, res: Response) => {
    // startUpdates middleware is responsible to disable the incremental updates when it receives a `publish:begin` (Full) from XMC
    // and enable back when it receives an `onEnd` notification from EDGE
    console.log('--- completed, incremental updates:', (globalThis as any).__IS_INCREMENTAL_UPD_ENABLED); 
    res.setHeader('content-type', 'application/json');
    res.send(`{incremental_update: ${(globalThis as any).__IS_INCREMENTAL_UPD_ENABLED}}`);
});

// dis/enable the incremental updates by default
(globalThis as any).__IS_INCREMENTAL_UPD_ENABLED = (process.env.IS_IUP_ENABLED === 'true');
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
