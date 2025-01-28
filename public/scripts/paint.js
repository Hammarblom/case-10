const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', () => {
  isDrawing = true;
});

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

// Gissningsfunktion
const guessInput = document.getElementById('guessInput');
const submitGuess = document.getElementById('submitGuess');
const resultMessage = document.getElementById('resultMessage');

submitGuess.addEventListener('click', () => {
  const playerGuess = guessInput.value.trim().toLowerCase();

  if (playerGuess) {
    resultMessage.textContent = `Du gissade: "${playerGuess}". Fråga den andra spelaren om det är rätt!`;
  } else {
    resultMessage.textContent = "Du måste skriva en gissning!";
  }
});

// Återställ canvas och input vid omstart
const resetGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
  guessInput.value = ""; // Töm input
  resultMessage.textContent = ""; // Töm meddelandet
};

 // Koppla återställ-knappen till funktionen
 const resetButton = document.getElementById('resetButton');
 resetButton.addEventListener('click', resetGame);