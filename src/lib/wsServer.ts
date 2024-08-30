import { WebSocketServer } from "ws";

let wsServer: WebSocketServer;

// TODO: svelte is randomly recreating this, causing the client list to be lost. This is probably not where the websocket server should be created.
export function createServer() {
    if(wsServer) {
        return wsServer;
    }

    try {
        wsServer = new WebSocketServer({ port: 8080 });
    } catch {
        console.log("Failed to create WebSocket server, assuming it already exists.");
        return wsServer;
    }

    wsServer.on("connection", (socket) => {
        socket.send("Hello! I am a WebSocket server.");
        socket.on("message", (message) => {
            console.log(`Received message => ${message}`);
        });
    });

    wsServer.on("error", (error) => {
        console.log(`WebSocket server error: ${error}`);
    });

    return wsServer;
}

export function broadcast(data: any) {
    wsServer.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
}

createServer();

