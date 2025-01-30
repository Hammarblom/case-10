// DOM elements
// ------------------------------------------------------------
const userForm = document.querySelector("#userForm");
const messageForm = document.querySelector("#messageForm");
const chat = document.querySelector("#chat");
const userInput = document.querySelector("#user");
const messageInput = document.querySelector("#message");
// const canvas = document.querySelector("canvas");

// WebSocket
const websocket = new WebSocket("ws://localhost:8082");

// deklarera objektet som ligger till grund för socket meddelanden
let obj = {};
const fps = 20;
let frames = 0;
let runGame = false;

// event listeners
// ------------------------------------------------------------
userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // när en användare har angett sitt namn så kan spelet köras...
    runGame = true;

    // användaren ska inte kunna ändra sitt namn...
    userInput.setAttribute("disabled", true);

    // visa formulär för att skriva text, ta bort klassen 'hidden'
    messageForm.classList = "";

    // gör fältet för att skriva meddelande aktivt
    messageInput.focus();

    obj.user = userInput.value;
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // ange obj property type
    obj.type = "chat";

    obj.message = messageInput.value;

    // ange ev tidszon för landet 
    obj.datetime = new Date().toLocaleTimeString("sv");

    // radera innehållet i input fältet
    messageInput.value = "";

    // anropa funktion för att uppdatera chat historik
    renderChatMessage(obj);

    // skicka objekt till servern via wesocket
    websocket.send(JSON.stringify(obj));
});

websocket.addEventListener('message', (event) => {

    console.log("event", event);

    // event.data innehållet det objekt som skickats
    const obj = JSON.parse(event.data);

    // se till att alla meddelanden som sänds via websocket 
    // kan kontrolleras via en property med namnet 'type'

    switch (obj.type) {

        case "chat":
            renderChatMessage(obj);
            break;
    }

});

// chat -> ledtrådar
function renderChatMessage(obj) {

    // obj example: {message: "Lorem ipsum", user: ""}
    const div = document.createElement("div");
    const p = document.createElement("p");
    // p.textContent = obj.message + " " + obj.datetime;
    // \n anger en manuell radbrytning - funkar med metoden innerText
    p.innerText = obj.message + "\n" + obj.datetime;

    // ev innerHTML ... eller ett passande html element

    const span = document.createElement("span");
    span.textContent = obj.user;

    div.appendChild(p);
    div.appendChild(span);
    // appendChild placerar elementet sist...
    // chat.appendChild(div);
    // vilken metod kan användas för att placera element först...
    chat.prepend(div);
}