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
    console.log(`New client connected, number of clients: ${wss.clients.size}`);
    
    if (drawer === null) {
        drawer = ws; // Första spelaren blir ritare
        ws.send(JSON.stringify({ type: "role", role: "drawer" }));
    } else {
        ws.send(JSON.stringify({ type: "role", role: "guesser" }));
    }
    
    ws.on('close', () => {
        console.log(`Client left, number of clients: ${wss.clients.size}`);
        if (ws === drawer) {
            drawer = null; // Om ritaren lämnar, välj en ny
            assignNewDrawer();
        }
    });

    ws.on('message', (stream) => {
        const obj = JSON.parse(stream);
        
        switch (obj.type) {
            case "draw":
                broadcast(obj);
                break;
            case "clue":
                console.log(`${obj.datetime}: ${obj.user} säger ${obj.message}`);
                broadcast(obj);
                break;
            case "reset":  // RESET FUNKTIONEN
                drawer = null; // Nollställ ritaren
                assignNewDrawer();
                broadcast({ type: "reset" }); // Skicka reset-meddelande till alla klienter
                break;
            default:
                break;
        }
    });
});

// Välj en ny ritare om den gamla lämnar
function assignNewDrawer() {
    wss.clients.forEach(client => {
        if (drawer === null && client.readyState === 1) { // Kontrollera om klienten är aktiv
            drawer = client;
            client.send(JSON.stringify({ type: "role", role: "drawer" }));
        }
    });
}

// Skickar ett meddelande till alla aktiva klienter
function broadcast(obj) {
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // Kolla att anslutningen är öppen
            client.send(JSON.stringify(obj));
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
