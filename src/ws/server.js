import {WebSocket, WebSocketServer} from "ws";

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
        
       sendJson(socket, {type: "welcome"});

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
    
    return {broadcastMatchCreated};
}
