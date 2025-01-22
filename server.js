import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';

// en express server...
const app = express();
const PORT = 8082;

// express hanterar mappen 'public' som förvald resurs 
app.use(express.static("public"));

// http som en 'wrapper' om express
const server = http.createServer(app);

// starta en websocket server, port: 8083
const wss = new WebSocketServer({ noServer: true });

// se till att hantera websocket kommunikation
server.on('upgrade', (req, socket, head) => {

    console.log(`client upgrade ...`);

    // verifiera eventuellt vas som krävs för att starta websocket kommunikation
    // ngn form av autenistering kanske...?
    // return;

    wss.handleUpgrade(req, socket, head, (ws) => {
        console.log(`client connected...`);

        // se till att skicka vidare socket kommunikationen
        wss.emit('connection', ws, req);

    });

});


// lyssna på websocket händelser
wss.on('connection', (ws) => {
    console.log(`new client connection, number of clients: ${wss.clients.size}`);

    // testa att skicka ut ett meddelande initierat av servern ifall 2 klienter
    // finns med
    if (wss.clients.size === 2) {
        broadcast(wss, {type: "broadcast", info: "Spelet kan börja..."});
    } else if (wss.clients.size > 2) {
        broadcast(wss, {type: "broadcastSry", info: "Spelet har redan startat...sry"});
    }

    // lyssna på event close
    ws.on('close', () => {
        console.log(`client left..., number of clients: ${wss.clients.size}`);
    });

    // lyssna på event - hantera alla meddelanden som JSON 
    ws.on('message', (stream) => {

        // console.log("%s", stream);
        const obj = JSON.parse(stream);

        // eftersom obj kan innehålla olika typer: obj.type
        // så kan det hantera om man vill på serversidan genom att 
        // ange en switch statement

        switch (obj.type) {

            case "drawCircle":

                broadcastExclude(wss, ws, obj);
                break;

            case "newCircle":

                // se till att cirkeln får ett unikt id från servern
                const id = nanoid();
                console.log("id", id);

                // byt ut id
                obj.circle.id = id;

                // broadcastExclude(wss, ws, obj);
                broadcast(wss, obj);
                break;

            case "chat":

                // följande meddelande togs emot:
                console.log(`${obj.datetime}: ${obj.user} säger ${obj.message}`);

                broadcastExclude(wss, ws, obj);
                break;

            default:
                break;
        }

    });

});



// hjälpfunktioner för att hantera socket meddelanden
function broadcast(wss, obj) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(obj));
    });
}

function broadcastExclude(wss, ws, obj) {
    wss.clients.forEach(client => {
        if (client !== ws) {
            client.send(JSON.stringify(obj));
        }
    });
}


server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});