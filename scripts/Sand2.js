// With help from ChatGPT and The Coding Train (youtube: https://www.youtube.com/watch?v=L4u7Zy_b868)
// Sounds of sand from ZapSplat: https://www.zapsplat.com/music/sand-pour/
const canvas = document.getElementById("sand-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CELL_SIZE = 5;  // Size of each grid cell
const gridWidth = Math.floor(canvas.width / CELL_SIZE);
const gridHeight = Math.floor(canvas.height / CELL_SIZE);

let grid = [];

// Get the audio element
const sandSound = document.getElementById('sand-sound');
const sandSoundReversed = document.getElementById('sand-sound-reversed');

let isPlayingSandSound = false;

// Event listeners to alternate playback
sandSound.addEventListener('ended', () => {
  if (isPlayingSandSound) {
    sandSoundReversed.currentTime = 0;
    sandSoundReversed.play();
  }
});

sandSoundReversed.addEventListener('ended', () => {
  if (isPlayingSandSound) {
    sandSound.currentTime = 0;
    sandSound.play();
  }
});

function playSandSound() {
  if (!isPlayingSandSound) {
    isPlayingSandSound = true;
    sandSoundReversed.pause();
    sandSoundReversed.currentTime = 0;
    sandSound.currentTime = 0;
    sandSound.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }
}

function pauseSandSound() {
  if (isPlayingSandSound) {
    isPlayingSandSound = false;
    sandSound.pause();
    sandSoundReversed.pause();
  }
}

// Define an array of sand colors
const sandColors = [
  '#c2b280', // Original sand color
  '#bca66b',
  '#d1b181',
  '#b59c6e',
  '#d4b483',
  '#c9a66e',
  '#bea76b'
];

// Initialize grid
for (let x = 0; x < gridWidth; x++) {
  grid[x] = [];
  for (let y = 0; y < gridHeight; y++) {
    grid[x][y] = null;
  }
}

//// Walls (open box)
//for (let y = 0; y < gridHeight; y++) {
//  // Left wall
//  grid[0][y] = { type: 'wall' };
//  // Right wall
//  grid[gridWidth - 1][y] = { type: 'wall' };
//}
//// Bottom wall
//for (let x = 0; x < gridWidth; x++) {
//  grid[x][gridHeight - 1] = { type: 'wall' };
//}

// Initialize grid with the text
function initializeGridWithText() {
  // Create an off-screen canvas
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');

  // Set the off-screen canvas size
  offCanvas.width = gridWidth;
  offCanvas.height = gridHeight;

  // Set font size relative to the grid size
  let fontSize = Math.floor(gridWidth / 10); // Adjust divisor to change text size
  offCtx.font = `${fontSize}px Arial`;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';

  // The text to display
  const text = 'Click to Add Sand';

  // Calculate the position to center the text
  const textX = offCanvas.width / 2;
  const textY = offCanvas.height / 2;

  // Fill the background with transparent pixels
  offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);

  // Set text color to white
  offCtx.fillStyle = 'white';

  // Render the text
  offCtx.fillText(text, textX, textY);

  // Get image data from the off-screen canvas
  const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  const data = imageData.data;

  // Initialize the grid based on the image data
  for (let x = 0; x < gridWidth; x++) {
    grid[x] = []; // Ensure grid[x] is initialized
    for (let y = 0; y < gridHeight; y++) {
      const index = (y * gridWidth + x) * 4; // Correct index calculation
      const alpha = data[index + 3]; // Get the alpha value

      if (alpha > 128) { // If pixel is opaque
        // Choose a random color from the sandColors array
        let randomColor = sandColors[Math.floor(Math.random() * sandColors.length)];
        grid[x][y] = {
          type: 'sand',
          color: randomColor
        };
      } else {
        grid[x][y] = null;
      }
    }
  }

  // Add walls (open box)
  for (let y = 0; y < gridHeight; y++) {
    // Left wall
    grid[0][y] = { type: 'wall' };
    // Right wall
    grid[gridWidth - 1][y] = { type: 'wall' };
  }
  // Bottom wall
  for (let x = 0; x < gridWidth; x++) {
    grid[x][gridHeight - 1] = { type: 'wall' };
  }
}


// Function to draw the grid onto the canvas
function drawGrid() {
  // Clear canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let cell = grid[x][y];
      if (cell) {
        if (cell.type === 'sand') {
          ctx.fillStyle = cell.color;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (cell.type === 'wall') {
          ctx.fillStyle = '#2D688D'; // Wall color
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }
}

// Call the initialization function
initializeGridWithText();
// Draw grid with text
drawGrid();

let animationStarted = false;

function update() {
  // Clear canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Check if sand is moving
  let sandIsMoving = false;

  // Update particles
  for (let y = gridHeight - 2; y >= 0; y--) { // Start from second to last row
    let xStart, xEnd, xStep;
    if (y % 2 === 0) {
      // Even rows: left to right
      xStart = 1;
      xEnd = gridWidth - 1;
      xStep = 1;
    } else {
      // Odd rows: right to left
      xStart = gridWidth - 2;
      xEnd = 0;
      xStep = -1;
    }

    for (let x = xStart; x !== xEnd; x += xStep) {
      let cell = grid[x][y];
      if (cell && cell.type === 'sand') {
        // Try to move down
        if (grid[x][y + 1] === null) {
          grid[x][y + 1] = cell;
          grid[x][y] = null;
        } else {
          // Randomize movement direction to prevent bias
          let dirs = [-1, 1];
          // Randomly choose left or right first
          if (Math.random() < 0.5) dirs.reverse();
          let moved = false;
          for (let dir of dirs) {
            if (grid[x + dir] && grid[x + dir][y + 1] === null) {
              grid[x + dir][y + 1] = cell;
              grid[x][y] = null;
              moved = true;
              sandIsMoving = true;
              break;
            }
          }
        }
      }
    }
  }

  // Play Sand Sound
  if (sandIsMoving) {
    playSandSound();
  }
  else{
    pauseSandSound();
  }

  // Draw grid
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let cell = grid[x][y];
      if (cell) {
        if (cell.type === 'sand') {
          ctx.fillStyle = cell.color;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (cell.type === 'wall') {
          ctx.fillStyle = '#2D688D'; // Wall color
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }

  requestAnimationFrame(update);
}

// Mouse and Touch event handlers
let isDrawing = false;
let mouseX = 0;
let mouseY = 0;
let sandTimer;

// Combined function to handle both mouse and touch start
function startDrawing(x, y) {
  isDrawing = true;
  mouseX = x;
  mouseY = y;
  sandTimer = setInterval(() => {
    addSand(mouseX, mouseY);
  }, 42);
  // Play the sand sound
  // playSandSound();
}

// Combined function to handle both mouse and touch move
function moveDrawing(x, y) {
  if (isDrawing) {
    mouseX = x;
    mouseY = y;
  }
}

// Combined function to handle both mouse and touch end
function stopDrawing() {
  isDrawing = false;
  clearInterval(sandTimer);
  // Stop the sand sound
  // pauseSandSound();
}

// Mouse Events
canvas.addEventListener('mousedown', (e) => {
  if (!animationStarted) {
    animationStarted = true;
    update();
  }
  startDrawing(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', (e) => {
  moveDrawing(e.clientX, e.clientY);
});

canvas.addEventListener('mouseup', (e) => {
  stopDrawing();
});

canvas.addEventListener('mouseleave', (e) => {
  stopDrawing();
});

// Touch Events
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!animationStarted) {
    animationStarted = true;
    update();
  }
  let touch = e.touches[0];
  startDrawing(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  let touch = e.touches[0];
  moveDrawing(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  stopDrawing();
});

//function addSand(clientX, clientY) {
//  let x = Math.floor(clientX / CELL_SIZE);
//  let y = Math.floor(clientY / CELL_SIZE);
//  if (x > 0 && x < gridWidth - 1 && y > 0 && y < gridHeight - 1) {
//    if (grid[x][y] === null) {
//      // Choose a random color from the sandColors array
//      let randomColor = sandColors[Math.floor(Math.random() * sandColors.length)];
//      grid[x][y] = {
//        type: 'sand',
//        color: randomColor
//      };
//    }
//  }
//}

function addSand(clientX, clientY) {
  let xCenter = Math.floor(clientX / CELL_SIZE);
  let yCenter = Math.floor(clientY / CELL_SIZE);
  let brushRadius = 2; // Adjust this value to change the brush size

  for (let x = xCenter - brushRadius; x <= xCenter + brushRadius; x++) {
    for (let y = yCenter - brushRadius; y <= yCenter + brushRadius; y++) {
      // Ensure the coordinates are within the grid boundaries
      if (x > 0 && x < gridWidth - 1 && y > 0 && y < gridHeight - 1) {
        // Optional: Use a circular brush instead of a square brush
        let dx = x - xCenter;
        let dy = y - yCenter;
        if (dx * dx + dy * dy <= brushRadius * brushRadius) {
          if (grid[x][y] === null) {
            // Choose a random color from the sandColors array
            let randomColor = sandColors[Math.floor(Math.random() * sandColors.length)];
            grid[x][y] = {
              type: 'sand',
              color: randomColor
            };
          }
        }
      }
    }
  }
}


//update();
