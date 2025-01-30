const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

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



canvas.addEventListener('mousedown', () => {
  isDrawing = true;
});

// Att rita på canvas direkt
canvas.addEventListener('mousemove', (event) => {
  if (isDrawing) {
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  ctx.beginPath();
});