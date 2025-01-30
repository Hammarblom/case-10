const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let role = null; // Uppdateras från servern!
const websocket = new WebSocket("ws://localhost:8082");

websocket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    
    if (data.type === "role") {
        role = data.role; // Uppdatera spelarens roll
        document.getElementById("roleMessage").innerText = `Du är en: ${role === "drawer" ? "Ritare 🎨" : "Gissare 🤔"}`;
    }

    if (data.type === "draw" && role !== "drawer") {
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
