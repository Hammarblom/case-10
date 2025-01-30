const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let role = "guesser"; // Standardroll tills vi får en roll från servern
const websocket = new WebSocket("ws://localhost:8082");

// Lyssna på rolltilldelning från servern
websocket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    
    if (data.type === "role") {
        role = data.role;
        console.log(`Du är en: ${role}`);
    }

    if (data.type === "draw") {
        drawLine(data.x, data.y);
    }
};

canvas.addEventListener('mousedown', () => {
    if (role !== "drawer") return;
    isDrawing = true;
});

canvas.addEventListener('mousemove', (event) => {
    if (!isDrawing || role !== "drawer") return;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);

    websocket.send(JSON.stringify({ type: "draw", x: event.offsetX, y: event.offsetY }));
});

canvas.addEventListener('mouseup', () => {
    if (role !== "drawer") return;
    isDrawing = false;
    ctx.beginPath();
});

function drawLine(x, y) {
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}
