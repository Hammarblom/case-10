// DOM elements
const userForm = document.querySelector("#userForm");
const messageForm = document.querySelector("#messageForm");
const clue = document.querySelector("#clue");
const userInput = document.querySelector("#user");
const messageInput = document.querySelector("#message");

// Canvas setup
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// WebSocket
const websocket = new WebSocket("ws://localhost:8082");

// Deklarera objektet som ligger till grund för socket-meddelanden
let obj = {};
let runGame = false;

// Event listeners
userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    runGame = true;
    userInput.setAttribute("disabled", true);
    messageForm.classList.remove("hidden");
    messageInput.focus();
    obj.user = userInput.value;
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    obj.type = "clue";
    obj.message = messageInput.value;
    obj.datetime = new Date().toLocaleTimeString("sv");
    
    messageInput.value = "";
    
    renderChatMessage(obj);
    websocket.send(JSON.stringify(obj));
});

// WebSocket-meddelanden
websocket.addEventListener("message", (event) => {
    const obj = JSON.parse(event.data);
    
    switch (obj.type) {
        case "role":
            document.getElementById("roleMessage").innerText = `Du är en: ${obj.role === "drawer" ? "Ritare 🎨" : "Gissare 🤔"}`;
            break;
        case "clue":
            renderChatMessage(obj);
            break;
        case "draw":
            drawOnCanvas(obj);
            break;
    }
});

// Rendera chattmeddelande utan dubbletter
function renderChatMessage(obj) {
    const existingMessages = [...clue.querySelectorAll("p")].map(p => p.innerText);
    const messageText = `${obj.user}: ${obj.message} (${obj.datetime})`;

    if (existingMessages.includes(messageText)) {
        return; // Undvik dubbletter
    }

    const div = document.createElement("div");
    const p = document.createElement("p");
    p.innerText = messageText;
    
    div.appendChild(p);
    clue.prepend(div);
}

// Rita på canvas
function drawOnCanvas(data) {
    if (!ctx) return; // Förhindra krasch om canvas saknas

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
}
