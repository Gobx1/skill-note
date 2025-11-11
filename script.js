////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////  Define Constant  ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const startText = document.getElementById("start-text");
const homeScreen = document.getElementById("home-screen");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;

///////////////////////////////////
/////////  Player object  /////////
///////////////////////////////////
const player = {
  x: 100,
  y: 0,
  width: 24,
  height: 46,
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpPower: -12,
  grounded: false,
  facingRight: true,
  image: new Image()
};
player.image.src = "caracter.png";
const gravity = 0.6;
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////



///////////////////////////////////
/////////////  Blocs  /////////////
///////////////////////////////////
computer = new Image();
computer.src = "computer.png";

const tileSize = 40; // size of each block

const tileTypes = {
  "0": { solid: false, color: "transparent" },
  "1": { solid: true, color: "#0ff" },

  //Link to other pages
  "%": { solid: false, special: "door" , link: "index.html", image:computer}, //GO TO CARACTER SHEET
  "&": { solid: false, special: "door" , link: "cv.html", image:computer}, //GO TO CV 



  "?": { solid: false, special: "portal", id: "home", color:"#dafb1e39"}, //TP TO HOME
  "!": { solid: false, special: "computer", id: "caracter", image: computer }, //TP TO CARACTER
  "$": { solid: false, special: "computer", id: "experience", image: computer } //TP TO CARACTER
};





let map_index = 0;

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
// Controls
const keys = {};
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  if (e.code === "Enter" && !activeDialog.visible) {
    // Try to start a dialog
    const npc = (currentMap.npcs || []).find(n =>
      Math.abs(player.x - n.x) < 80 && Math.abs(player.y - n.y) < 80
    );
    if (npc) {
      startAutoDialog(npc);
    }
  }
});


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


// Example map: 0 = empty, 1 = platform
const maps = [
  {
    id: "tutorial",
    layout:[
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","?","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    background: "blablb",
    message: "a",
    images: [
      /*{x:500, y:300, w:180, h:180, path:"arrows.png",image: new Image()}*/
    ],
    texts: [
      {x:110, y:500, w:180, h:180, text:"<Press ENTER>", color:"rgba(32, 137, 95, 1)",size:20},
    ],
    npcs: [
      {
        x: 140, y: 514, w: 24, h: 46, path:"gobx1.png", image:new Image(),go_right:false, dialog: [
                                                                                              "Oh, another one...",
                                                                                              "(Where is my script...)",
                                                                                              "Ah right. Welcome in this experience",
                                                                                              "We dont have much time here",
                                                                                              "Use the ARROWS to move LEFT and RIGHT",
                                                                                              "You may press ENTER to interact",
                                                                                              "Interact with that yellow thing over there",
                                                                                              "Follow me..."
                                                                                    ]
      }
    ]
  },
  {
    id: "home",
    spawn:{x:600,y:500},
    layout:[
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","!","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","$","0","0","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    background: "blablb",
    message: "Home",
    images: [
    ],
    texts:[
      {x:150, y:400, w:180, h:180, text:"Informations", color:"rgba(201, 147, 38, 1)",size:40},
      {x:1000, y:400, w:180, h:180, text:"Analyse Experiences", color:"rgba(201, 147, 38, 1)",size:40},
    ],
    npcs: [
      {
        x: 650, y: 514, w: 24, h: 46, path:"gobx1.png", image:new Image(),go_up:false, dialog: [
                                                                                              "Wow you made it!",
                                                                                              "That was impressive right",
                                                                                              "What you just interact with is a portal",
                                                                                              "It just took some coding here and there",
                                                                                              "And BOOM i change the map and your coordinate",
                                                                                              "(Im losing the point here...)",
                                                                                              "Welcome to MY world",
                                                                                              "Here you will be able to learn more about me",
                                                                                              "By simply exploring around",
                                                                                              "You should start on the left",
                                                                                              "You will be able to see more about me...",
                                                                                              "See you soon..."
                                                                                    ]
      }
    ]
  },
  {
    id: "caracter",
    spawn:{x:100,y:300},
    layout:[
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","%","0","0","0","0","0","&","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
      ["1","?","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    background: "blablb",
    message: "Home",
    images: [
    ],
    texts:[
      {x:820, y:250, w:180, h:180, text:"Who Am I", color:"rgba(201, 147, 38, 1)",size:25},
      {x:1060, y:250, w:180, h:180, text:"More Details (CV)", color:"rgba(201, 147, 38, 1)",size:25},
    ],
    npcs: [
      {
        x: 140, y: 394, w: 24, h: 46, path:"gobx1.png", image:new Image(), dialog: [
                                                                                    "take the portal on the left to go back home"
                                                                                    ]
      }
    ]
  },
  {
    id: "experience",
    spawn:{x:100,y:500},
    layout:[
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1"],
      ["1","?","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    background: "blablb",
    message: "Home",
    images: [
    ],
    texts:[
      {x:870, y:160, w:180, h:180, text:"SQL/Database", color:"rgba(201, 147, 38, 1)",size:25},
      {x:520, y:160, w:180, h:180, text:"Networks/Telecom", color:"rgba(201, 147, 38, 1)",size:25},
      {x:170, y:160, w:180, h:180, text:"Soft Skills/Analysis", color:"rgba(201, 147, 38, 1)",size:25},
    ],
    npcs: [
      {
        x: 180, y: 514, w: 24, h: 46, path:"gobx1.png", image:new Image(), dialog: [
                                                                                      "Here is one of my experience i want to share",
                                                                                      "Feel free to go talk to my clones up there",
                                                                                      "They only ever say the same thing",
                                                                                      "Because i didnt want to work too much on them",
                                                                                      "(I dont want them to replace me...)"
                                                                                    ]
      },
      {
        x: 860, y: 314, w: 24, h: 46, path:"talker.png", image:new Image(), dialog: [
                                                                                      "At Lemnia, I managed client databases using SQL.",
                                                                                      "I created and updated tables to organize customer data efficiently",
                                                                                      "I ran queries to extract, sort, and analyze information",
                                                                                      "I also learned about relational models and data security best practices"
                                                                                    ]
      },
      {
        x: 510, y: 314, w: 24, h: 46, path:"talker.png", image:new Image(), dialog: [
                                                                                      "I installed and configured domestic telephone networks for clients.",
                                                                                      "I diagnosed connection issues and resolved them quickly.",
                                                                                      "I gained hands-on knowledge of cabling, connectors, and communication protocols.",
                                                                                      "Following technical standards and safety procedures was essential."
                                                                                    ]
      },
      {
        x: 160, y: 314, w: 24, h: 46, path:"talker.png", image:new Image(), dialog: [
                                                                                      "I developed autonomy and rigor, handling technical tasks precisely.",
                                                                                      "I learned to plan interventions and follow up operations effectively.",
                                                                                      "Communication was key: I coordinated with clients and the technical team.",
                                                                                      "I adapted easily between database work and field network installations.",
                                                                                      "Overall, this experience gave me a clear vision of technical operations and a useful versatility for digital professions."
                                                                                    ]
      },

    ]
  }
];



///////////////////////////////////
/////////   Important   //////////
///////////////////////////////////



for (let m =0; m<maps.length; m++){
  for (let img = 0; img<maps[m].images.length; img++) {
    maps[m].images[img].image.src = maps[m].images[img].path;
  }
  for (let n = 0; n<maps[m].npcs.length; n++) {
    maps[m].npcs[n].image.src = maps[m].npcs[n].path;
  }
}






let activeDialog = {
  npc: null,
  index: 0,
  visible: false
};

let currentMap = maps.find(m => m.id === "experience");

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////    Utility Functions    //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadMap(id) {
  const next = maps.find(m => m.id === id);
  if (!next) return;
  currentMap = next;
  player.x = next.spawn.x;
  player.y = next.spawn.y;
  showMessage(next.message);
}


function showMessage(text) {
  const popup = document.getElementById("popup");
  popup.textContent = text;
  popup.style.display = "block";
  setTimeout(() => popup.style.display = "none", 4000);
}


function isColliding(a, b){
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function handleSolidColision(block){
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


function getBlock(row, col){
  return {
    x: col * tileSize,
    y: row * tileSize,
    width: tileSize,
    height: tileSize
  };
}

function solidColision(row,col){
  block = getBlock(row,col);
    // AABB collision
    if (isColliding(player, block)) {
      handleSolidColision(block);
    }
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

function drawPlayer() {
  ctx.save(); // save current canvas state

  if (!player.facingRight) {
    // Flip horizontally
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.scale(-1, 1); // flip x-axis
    ctx.drawImage(player.image, -player.width / 2, -player.height / 2, player.width, player.height);
  } else {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
  }

  ctx.restore(); // restore original canvas state
}

// Draw function
function drawText(x,y,text, color, size){
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Jersey 10'`;       // Font size and family
  ctx.textAlign = "center";      // horizontal alignment
  ctx.textBaseline = "middle";   // vertical alignment
  ctx.fillText(text, x, y);  
}


function drawDialog(x, y, text) {
  ctx.save();
  ctx.font = "18px 'Jersey 10', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  // Break long text into lines
  const maxWidth = 220;
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Bubble dimensions
  const padding = 10;
  const boxWidth = maxWidth + padding * 2;
  const boxHeight = lines.length * 24 + padding * 2;

  ctx.fillStyle = "rgba(0, 255, 255, 0.15)";
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x - boxWidth / 2, y - boxHeight, boxWidth, boxHeight, 8);
  ctx.fill();
  ctx.stroke();

  // Draw each line
  ctx.fillStyle = "#0ff";
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y - boxHeight + 28 + i * 22);
  }

  ctx.restore();
}




function drawNPCs() {
  for (const npc of currentMap.npcs || []) {
    // Draw the NPC (placeholder)
    ctx.drawImage(npc.image,npc.x,npc.y,npc.w,npc.h)

    // If this NPC is currently talking
    if (activeDialog.visible && activeDialog.npc === npc) {
      const text = npc.dialog[activeDialog.index];
      if (text) {
        drawDialog(npc.x + npc.w / 2, npc.y - 20, text);
      }
      else{
        if (npc.go_right===false){
          npc.x+=10
        }
        if (npc.go_up===false){
          npc.y-=10
        }
      }
    }
  }
}

function startAutoDialog(npc) {
  activeDialog.npc = npc;
  console.log(npc)
  activeDialog.index = 0;
  activeDialog.visible = true;

  function showNextLine() {
    if (!activeDialog.visible) return;

    // If all lines have been shown, stop the dialog
    if (activeDialog.index >= npc.dialog.length) {
      activeDialog.visible = false;
      activeDialog.npc = null;

      // Example: move NPC after finishing dialog
      if (npc.go_right === false) npc.x += 10;
      if (npc.go_up === false) npc.y -= 10;

      return;
    }

    // Wait 2.5 seconds before showing the next line
    setTimeout(() => {
      activeDialog.index++;
      showNextLine();
    }, 2500);
  }

  // Start showing dialog (beginning with the first line)
  showNextLine();
}




function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw player
  ctx.fillStyle = "#0ff";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "cyan";
  
  drawNPCs()

  // Draw map blocks
  ctx.fillStyle = "#0ff4";
  ctx.shadowBlur = 0;
  map = currentMap.layout
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      let tile = map[row][col];
      let tileData = tileTypes[tile];


      if (tileData.special === "portal"){
        ctx.fillStyle = tileData.color;
        ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);
      }


      if (tileData.special === "door"){
        ctx.drawImage(tileData.image,col*tileSize, row*tileSize, tileSize, tileSize)
      }


      if (tileData.special==="computer"){
        ctx.drawImage(tileData.image,col*tileSize, row*tileSize, tileSize, tileSize)
      }



      if (map[row][col] === "1") {
        ctx.fillStyle = "#0ff4";
        ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);
      }



      if (map[row][col] === "2") {
        ctx.fillStyle = "rgba(44, 158, 22, 0.27)";
        ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);
      }



    } 
  }
  for (let img = 0; img<currentMap.images.length; img++) {
    ctx.drawImage(currentMap.images[img].image,currentMap.images[img].x,currentMap.images[img].y,currentMap.images[img].w,currentMap.images[img].h);
  } 

  for (let txt = 0; txt<currentMap.texts.length; txt++) {
    drawText(currentMap.texts[txt].x,currentMap.texts[txt].y,currentMap.texts[txt].text,currentMap.texts[txt].color, currentMap.texts[txt].size);
  } 
 drawPlayer(); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











// Game loop
function update() {
  map = maps[map_index];


  if (player.x > canvas.width) {
    nextMap();  
  }
  if (player.x < 0) {
    previousMap();  
  }
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
  if (keys["ArrowUp"] && player.grounded) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }

  // Apply gravity
  player.velocityY += gravity;

  // Update position
  player.x += player.velocityX;
  player.y += player.velocityY;
  map = currentMap.layout
  // Collision detection
  player.grounded = false;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      let tile = map[row][col];
      let tileData = tileTypes[tile];

      if (tileData.solid){   // if block is solid create colision
        solidColision(row,col);
      }



      if (tileData.special === "portal"){
        if (isColliding(player,getBlock(row,col))){
          loadMap(tileData.id)
        }
      }


      if (tileData.special === "computer"){
        if (isColliding(player,getBlock(row,col)) && keys["Enter"]){
          loadMap(tileData.id)
        }
      }



      if (tileData.special === "door"){
        if (isColliding(player,getBlock(row,col))){
          console.log("test")
        }

        if (isColliding(player,getBlock(row,col)) && keys["Enter"]){
          open(tileData.link);
        }
        
        
      }

      
    }
    
  
    
  }
  
  draw();
  requestAnimationFrame(update);
  keys["Enter"] = false;
}
