const startText = document.getElementById("start-text");
const homeScreen = document.getElementById("home-screen");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;


startText.addEventListener("click", () => {
  // Hide home screen, show game
  homeScreen.style.display = "none";
  canvas.style.display = "block";

  // Start the game loop
  startGame();
});

function startGame() {
  update();
}

const tileSize = 40; // size of each block
const playerImage = new Image();
playerImage.src = "caracter.png";

let map_index = 0;
// Example map: 0 = empty, 1 = platform
const maps = [
  [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,2,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]
  ],

  [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

// Player object
const player = {
  x: 0,
  y: 0,
  width: 24,
  height: 46,
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpPower: -12,
  grounded: false,
  facingRight: true
};

const gravity = 0.6;

function nextMap() {
  map_index++;
  if (map_index >= maps.length) map_index = 0; // Loop back to start
  
  map = maps[map_index];
  resetPlayer(true);
}
function previousMap() {
  map_index-=1;
  if (map_index < 0) map_index = maps.length(); // Loop back to start
  
  map = maps[map_index];
  resetPlayer(false);
}

function resetPlayer(next) {
  if (next == true){
    player.x = 15;
    player.velocityX = 0;
    player.velocityY = 0;
  }
  else{
    player.x = canvas.width-45;
    player.velocityX = 0;
    player.velocityY = 0;
  }
}

// Controls
const keys = {};
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);


function drawPlayer() {
  ctx.save(); // save current canvas state

  if (!player.facingRight) {
    // Flip horizontally
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.scale(-1, 1); // flip x-axis
    ctx.drawImage(playerImage, -player.width / 2, -player.height / 2, player.width, player.height);
  } else {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  }

  ctx.restore(); // restore original canvas state
}



// Game loop
function update() {
  map = maps[map_index];


  if (player.x > canvas.width) {
    nextMap();  
  }
  if (player.x < 0) {
    previousMap();  
  }
  console.log(player.x);
  console.log(canvas.width);
  // Horizontal movement
  if (keys["ArrowLeft"]){
    player.velocityX = -player.speed;
    player.facingRight = false;
  }
  else if (keys["ArrowRight"]){
    player.velocityX = player.speed
    player.facingRight = true;
  }
  else {
    player.velocityX = 0;
  }

  // Jump
  if (keys["Space"] && player.grounded) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }

  // Apply gravity
  player.velocityY += gravity;

  // Update position
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Collision detection
  player.grounded = false;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === 2 && keys["Enter"]){
        const block = {
          x: col * tileSize,
          y: row * tileSize,
          width: tileSize,
          height: tileSize
        };
        if (
          player.x < block.x + block.width &&
          player.x + player.width > block.x &&
          player.y < block.y + block.height &&
          player.y + player.height > block.y
        ) {
            console.log("hagrah");
            open("index.html");
        }
        
        keys["Enter"] = false;
      }
      if (map[row][col] === 1) {
        const block = {
          x: col * tileSize,
          y: row * tileSize,
          width: tileSize,
          height: tileSize
        };

        // AABB collision
        if (
          player.x < block.x + block.width &&
          player.x + player.width > block.x &&
          player.y < block.y + block.height &&
          player.y + player.height > block.y
        ) {
          // Calculate overlap
          const overlapX = (player.x + player.width/2) - (block.x + block.width/2);
          const overlapY = (player.y + player.height/2) - (block.y + block.height/2);
          const halfWidths = (player.width + block.width)/2;
          const halfHeights = (player.height + block.height)/2;

          if (Math.abs(overlapX) < halfWidths && Math.abs(overlapY) < halfHeights) {
            const diffX = halfWidths - Math.abs(overlapX);
            const diffY = halfHeights - Math.abs(overlapY);

            if (diffX < diffY) {
              // Horizontal collision
              if (overlapX > 0) player.x += diffX;
              else player.x -= diffX;
              player.velocityX = 0;
            } else {
              // Vertical collision
              if (overlapY > 0) {
                // Hit from below
                player.y += diffY;
                player.velocityY = 0;
              } else {
                // Land on top
                player.y -= diffY;
                player.velocityY = 0;
                player.grounded = true;
              }
            }
          }
        }
      }
    }
  }

  draw();
  drawText();
  requestAnimationFrame(update);
}

// Draw function
function drawText(){
  ctx.fillStyle = "rgba(255, 0, 0, 1)";
  ctx.font = "24px Arial";       // Font size and family
  ctx.textAlign = "center";      // horizontal alignment
  ctx.textBaseline = "middle";   // vertical alignment
  ctx.fillText("LEVEL 25 DEVELOPER", canvas.width/2, 50,);  
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw player
  ctx.fillStyle = "#0ff";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "cyan";
  drawPlayer();

  // Draw map blocks
  ctx.fillStyle = "#0ff4";
  ctx.shadowBlur = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === 1) {
        ctx.fillStyle = "#0ff4";
        ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);
      }
      if (map[row][col] === 2) {
        ctx.fillStyle = "rgba(44, 158, 22, 0.27)";
        ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);
      }
    }      // Text color
  ctx.font = "24px Arial";       // Font size and family
  ctx.textAlign = "center";      // horizontal alignment
  ctx.textBaseline = "middle";   // vertical alignment
  ctx.fillText("LEVEL 25 DEVELOPER", canvas.width/2, 50,);  
  }
}






















