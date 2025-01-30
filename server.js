import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = 8082;
app.use(express.static("public"));
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

let drawer = null; // Spelaren som ritar

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
});

wss.on('connection', (ws) => {
    console.log(`new client connection, number of clients: ${wss.clients.size}`);
    
    if (drawer === null) {
        drawer = ws; // Första spelaren som ansluter blir ritare
        ws.send(JSON.stringify({ type: "role", role: "drawer" }));
    } else {
        ws.send(JSON.stringify({ type: "role", role: "guesser" }));
    }
    
    ws.on('close', () => {
        console.log(`client left..., number of clients: ${wss.clients.size}`);
        if (ws === drawer) {
            drawer = null; // Om ritaren lämnar, tillåt ny ritare
            assignNewDrawer();
        }
    });

    ws.on('message', (stream) => {
        const obj = JSON.parse(stream);
        
        switch (obj.type) {
            case "draw":
                broadcast(wss, obj);
                break;
            case "chat":
                console.log(`${obj.datetime}: ${obj.user} säger ${obj.message}`);
                broadcast(wss, obj);
                break;
            default:
                break;
        }
    });
});

function assignNewDrawer() {
    wss.clients.forEach(client => {
        if (drawer === null) {
            drawer = client;
            client.send(JSON.stringify({ type: "role", role: "drawer" }));
        }
    });
}

function broadcast(wss, obj) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(obj));
    });
}

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
