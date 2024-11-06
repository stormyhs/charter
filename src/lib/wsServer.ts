import { WebSocketServer } from "ws";
import type { BroadcastMessage } from "../types";

let wsServer: WebSocketServer;

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
        console.log(`Client connected`);
    });

    wsServer.on("error", (error) => {
        console.log(`WebSocket server error: ${error}`);
    });

    return wsServer;
}

export function broadcast(data: BroadcastMessage) {
    wsServer.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
}

createServer();

