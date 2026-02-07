import express from 'express';
import matchRouter from './routes/matches.js';
import http from 'http';
import { setupWebSocketServer } from './ws/server.js';
import 'dotenv/config';


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";


const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use("/matches", matchRouter);

const {broadcastMatchCreated} = setupWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const add = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server is running on ${add}`);
    console.log(`WebSocket server is running on ${add.replace("http", "ws")}/ws`);
});
