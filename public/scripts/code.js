// DOM elements
// ------------------------------------------------------------
const userForm = document.querySelector("#userForm");
const messageForm = document.querySelector("#messageForm");
const chat = document.querySelector("#chat");
const userInput = document.querySelector("#user");
const messageInput = document.querySelector("#message");
const canvas = document.querySelector("canvas");



// application variables / dependencies
// ------------------------------------------------------------

// use WebSocket
// https://websockets.spec.whatwg.org/
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
const websocket = new WebSocket("ws://localhost:8082");


// canvas - importera klassen - se till att ange filtypen ifall VS code missar det...
import { MyCanvas } from "./MyCanvas.js";
const ctx = canvas.getContext("2d");

import { Circle } from "./Circle.js";

// variabel för att hantera samtliga cirklar som instansierats med klassen Circle
const circles = [];

const myCanvas = new MyCanvas(canvas, ctx);
// myCanvas.drawCircle(canvas.width / 2, canvas.height / 2, 5, "green");



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

        case "drawCircle":
            // myCanvas.drawCircle(obj.x, obj.y, obj.radius, obj.color);
            break;

        case "chat":
            renderChatMessage(obj);
            break;

        case "broadcast":

            console.log("wow - nu kör vi!", obj);
            animate();

            break;

        case "broadcastSry":

            console.log("oooops", obj);

            break;

        case "newCircle":
            
            // skapa en ny cirkel med klassen Circle baserat på objektets egenskaper
            // owner och id...
            const circle = new Circle(canvas, ctx, obj.circle.owner, obj.circle.id, obj.circle.x, obj.circle.y, obj.circle.radius, "red", obj.circle.dx, obj.circle.dy);

            // lägg till cirkeln i array circles så att den kan renderas i animationsloopen
            circles.push(circle);

            break;

        default:
            break;
    }

});


canvas.addEventListener("click", (e) => {
    console.log(e);

    // kontrollera boolean runGame
    if (!runGame) { return };

    // om man ex vill bestämma färg och radie på cirklar så kan man
    // kanske implementera ngn form av toolbar .... color picker

    const color = "pink";
    const radius = 12;

    // exempel på att begränsa antalet cirklar som kan skapas
    if (circles.length > 9) { return }

    // instansiera ny cirkel baserat på klassen Circle
    // owner och id...
    const circle = new Circle(canvas, ctx, userInput.value, "new", e.offsetX, e.offsetY, 5, "yellow", randomDirection(), randomDirection());

    // OBS - om servern ger ett unikt id så pusha inte direkt...
    // lägg till cirkeln i array circles
    // circles.push(circle);

    // skicka websocket information om ny cirkel 
    let obj = {type: "newCircle", circle: circle};
    websocket.send(JSON.stringify(obj));
});





// functions
// ------------------------------------------------------------

/**
 *
 *
 * @param {object} obj 
 */
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

/**
 * animate using requestAnimationFrame
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
 *
 */
function animate() {

    throttle(fps).then(() => {
        requestAnimationFrame(animate);
    });

    // animaion - se till att canvas elementet rensas...
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // animera en game loop - exempel på ordning:
    // - hantera användare instruktioner som ex mus klick, keyboard tangenter, 
    // - renderar objekt
    // - förändra position på objekt...
    // - ta bort objekt som inte ska med

    renderCircles();

    // se upp med att använda console.log i en requestanimationframe
    // man kan ex logga var 10:e frame under utveckling
    // använd modulus operatorn som anger ett restvärde
    // ex 12 % 10 är 2

    if (frames % 10 === 0) {
        console.log(circles);
    }

    frames++;
}


/**
 * funktion för att styra hastigheten via Promise
 *
 * @param {number} fps
 * @return {*} 
 */
function throttle(fps) {
    return new Promise((resolve) => {

        setTimeout(() => {
            resolve();
        }, 1000 / fps);

    });
}


function renderCircles() {

    // iteration av samtliga cirklar i array circles
    // circles.forEach(circle => {
    //     circle.draw();
    //     circle.move();
    // });


    // vad ska hända med cirklar som inte längre syns ...
    // ta bort metoder från en array: filter, pop, shift, splice, slice 
    // array filter: knepigare att använda eftersom den returnerar en ny array
    // array splice: förändrar en array
    // for loop: fördel går att avbryta
    // om man tar bort ett element i en array under iteration så redindexeras arrayen...
    // tips är att istället räkna nedåt istället för uppåt

    // for(let i = 0; i < circles.length; i++) {
    for(let i = circles.length - 1; i >= 0; i--) {

        circles[i].draw();
        circles[i].move();

        // ta bort cirkel som inte längre syns, dvs x < 0 || x > canvas.width
        const c = circles[i];

        // inkludera cirkelns radie i kontrollen 
        if (c.x < 0 + c.radius || c.x > canvas.width - c.radius || c.y < 0 + c.radius || c.y > canvas.height - c.radius) {
            
            // istället för att ta bort en cirkel kanske den kan studsa ...
            // x-axis
            if (c.x < 0 + c.radius || c.x > canvas.width - c.radius) {
                c.dx = -c.dx;
            }

            // y-axis
            if (c.y < 0 + c.radius || c.y > canvas.height - c.radius) {
                c.dy = -c.dy;
            }
            
            // circles.splice(i, 1);
        }
    }

    // uppgift den som vill och har möjlighet
    // antingen hantera collisions - alltså kollision av cirklar
    // collision detection

    

}


function randomDirection() {

    // hastighet - ex mellan 1 och 5
    const speed = Math.ceil(Math.random() * 5);
    
    // riktning - 50% chans att vara negativ eller positiv
    const direction = Math.random() < 0.5 ? -speed : speed;

    return direction;
}