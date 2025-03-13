import express, { Response, NextFunction } from 'express';
import { loggerMiddleware, jsonOnlyMiddleware } from './loggerMiddleware';
import { graphqlMiddleware } from './graphqlMiddleware';
import { EdgeRequest } from './types';
import { updateSearch } from './searchMiddleware';
import dotenv from 'dotenv';

dotenv.config({path:__dirname+'/../.env.local'});

const app = express();

app.use(express.json());

app.use(loggerMiddleware); // Use the logger middleware

// Define a simple route
app.get('/', (req: EdgeRequest, res: Response) => {
    res.send('Hello, World!');
});

// Define the /published route with JSON-only and GraphQL middleware
app.post('/published', jsonOnlyMiddleware, graphqlMiddleware, updateSearch, (req: EdgeRequest, res: Response) => {
    console.log('--- completed, invocation_id:', req.body.invocation_id); // Access the updates field here
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
