import {WebSocket, WebSocketServer} from "ws";

const matchSubscribers = new Map();

export const subscribe = (matchId, socket) => {
    if(!matchSubscribers.has(matchId)){
        matchSubscribers.set(matchId, new Set());
    }
    matchSubscribers.get(matchId).add(socket);
}

export const unsubscribe = (matchId, socket) => {
    const subscribers = matchSubscribers.get(matchId);
    if(!subscribers){
        return;
    }
    subscribers.delete(socket);
    if(subscribers.size === 0){
        matchSubscribers.delete(matchId);
    }
}

const cleanupSubscriptions = (socket) => {
    for(const matchId of socket.subscriptions){
        unsubscribe(matchId, socket);
    }
}

const broadcastToMatch = (matchId, payload) => {
    const subscribers = matchSubscribers.get(matchId);
    if(!subscribers){
        return;
    }
    const message = JSON.stringify(payload);
    for(const client of subscribers){
        if(client.readyState === WebSocket.OPEN){
            client.send(message);
        }
    }
}

const handleMessage = (socket, data) => {
    let message;
    try {
        message = JSON.parse(data);
        
    } catch (error) {
        sendJson(socket, {type: "error", message: "Invalid JSON"});
        return;
    }

    if(message?.type === "subscribe" && Number.isInteger(message.matchId)){
        subscribe(message.matchId, socket);
        socket.subscriptions.add(message.matchId);
        sendJson(socket, {type: "subscribed", matchId: message.matchId});
        return;
    }

    if(message?.type === "unsubscribe" && Number.isInteger(message.matchId)){
        unsubscribe(message.matchId, socket);
        socket.subscriptions.delete(message.matchId);
        sendJson(socket, {type: "unsubscribed", matchId: message.matchId});
        return;
    }
}

export const sendJson = (socket, payload) => {
    if(socket.readyState !== WebSocket.OPEN){
        return;
    }
    socket.send(JSON.stringify(payload));
}

export const broadcast = (wss, payload) => {
    for(const client of wss.clients){
        if(client.readyState !== WebSocket.OPEN){
            continue;
        }
        client.send(JSON.stringify(payload));
    }
}

export const setupWebSocketServer = (httpServer) => {
    const wss = new WebSocketServer({ server: httpServer, path: "/ws", maxPayload: 1024 * 1024 });
    
    wss.on('connection', (socket) => {
        socket.isAlive = true;
        socket.on("pong", () => {
            socket.isAlive = true;
        });

        socket.subscriptions = new Set();
        
       sendJson(socket, {type: "welcome"});

       socket.on("message", (data) => handleMessage(socket, data));

       socket.on("close", () => {
        cleanupSubscriptions(socket);
       });

       socket.on("error", console.error);
    });

    const interval = setInterval(() => {
        wss.clients.forEach((client) => {
            if(client.isAlive === false){
                return client.terminate();
            }
            client.isAlive = false;
            client.ping();
        });
    }, 30000);

    wss.on("close", () => {
        clearInterval(interval);
    });

    const broadcastMatchCreated = (match) => {
        broadcast(wss, {
            type: "match.created",
            data: match
        })
    }

    const broadcastCommentary = (matchId, comment) => {
        broadcastToMatch(matchId, {
            type: "commentary.added",
            data: comment
        })
    }
    
    return {broadcastMatchCreated, broadcastCommentary};
}
