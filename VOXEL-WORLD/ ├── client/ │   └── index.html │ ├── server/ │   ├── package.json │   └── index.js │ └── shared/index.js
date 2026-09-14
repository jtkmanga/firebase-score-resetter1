const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        status: "online",
        server: "VOXEL WORLD",
        websocket: "ready"
    }));
});

const wss = new WebSocket.Server({
    server: httpServer
});

let playerCount = 0;

wss.on("connection", (ws) => {
    playerCount++;

    console.log(`Player connected. Players: ${playerCount}`);

    ws.send(JSON.stringify({
        type: "welcome",
        message: "Connected to VOXEL WORLD",
        players: playerCount
    }));

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());

            console.log("Received:", data);

            if (data.type === "ping") {
                ws.send(JSON.stringify({
                    type: "pong",
                    time: Date.now()
                }));
            }

        } catch (error) {
            console.error("Invalid message:", error.message);
        }
    });

    ws.on("close", () => {
        playerCount--;

        console.log(`Player disconnected. Players: ${playerCount}`);
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error.message);
    });
});

httpServer.listen(PORT, () => {
    console.log("=================================");
    console.log("VOXEL WORLD GAME SERVER");
    console.log(`HTTP Port: ${PORT}`);
    console.log("WebSocket: READY");
    console.log("=================================");
});
