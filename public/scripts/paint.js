const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

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