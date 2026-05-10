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
  "%": { solid: false, special: "door" , link: "caracterSheet.html", image:computer}, //GO TO CARACTER SHEET
  "&": { solid: false, special: "door" , link: "cv.html", image:computer}, //GO TO CV 



  "?": { solid: false, special: "portal", id: "home", color:"#dafb1e39"}, //TP TO HOME
  "!": { solid: false, special: "computer", id: "caracter", image: computer }, //TP TO CARACTER
  "$": { solid: false, special: "computer", id: "experience", image: computer }, //TP TO CARACTER
  "€": { solid: false, special: "computer", id: "competences", image: computer }, //TP TO CARACTER
  "#": { solid: false, special: "computer", id: "lep", image: computer }, //TP TO CARACTER
  "~": { solid: false, special: "computer", id: "valeurs", image: computer }, //TP TO CARACTER
  "+": { solid: false, special: "computer", id: "futur", image: computer } //TP TO CARACTER
  
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

// --- FONCTIONNALITÉ : TÉLÉPORTATION AU CLIC ---
canvas.addEventListener("mousedown", (e) => {
  // Calculer la position de la souris par rapport au canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Déplacer le joueur aux coordonnées du clic
  // On centre le joueur sur le clic (en soustrayant la moitié de sa largeur/hauteur)
  player.x = mouseX - player.width / 2;
  player.y = mouseY - player.height / 2;

  // Réinitialiser les vitesses pour éviter qu'il ne garde une inertie de saut ou de chute
  player.velocityX = 0;
  player.velocityY = 0;
  
  console.log(`Joueur téléporté en X: ${Math.round(player.x)}, Y: ${Math.round(player.y)}`);
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
        x: 140, y: 514, w: 24, h: 46, path: "gobx1.png", image: new Image(), go_right: false, dialog: [
          "Oh, encore un visiteur...",
          "(Où est passé mon script...)",
          "Ah, voilà. Bienvenue dans cette expérience !",
          "On n'a pas beaucoup de temps ici.",
          "Utilise les FLÈCHES pour te déplacer à GAUCHE et à DROITE.",
          "La TOUCHE DU HAUT te permet de sauter.",
          "Tu peux appuyer sur ENTRÉE pour interagir avec les objets.",
          "Essaie d'interagir avec le truc jaune là-bas.",
          "Suis-moi..."
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
      ["1","0","0","0","0","0","0","0","0","0","0","+","0","0","0","0","0","0","~","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","$","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","#","0","0","1","1"],
      ["1","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1"],
      ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
      ["1","0","0","!","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","0","0","0","€","0","0","1","1"],
      ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    background: "blablb",
    message: "Home",
    images: [
    ],
    texts:[
      {x:150, y:500, w:180, h:180, text:"Informations / CV", color:"rgba(201, 147, 38, 1)",size:30},
      {x:150, y:380, w:180, h:180, text:"Profil, Parcours, Formation", color:"rgba(201, 147, 38, 1)",size:30},
      {x:1050, y:500, w:180, h:180, text:"Compétences", color:"rgba(201, 147, 38, 1)",size:30},
      {x:1050, y:380, w:180, h:180, text:"Mon projet Bénévole", color:"rgba(201, 147, 38, 1)",size:30},
      {x:460, y:290, w:180, h:180, text:"Moi dans le futur", color:"rgba(201, 147, 38, 1)",size:30},
      {x:750, y:290, w:180, h:180, text:"Mes valeurs", color:"rgba(201, 147, 38, 1)",size:30},
    ],
    npcs: [
      {
        x: 650, y: 514, w: 24, h: 46, path: "gobx1.png", image: new Image(), go_up: false, dialog: [
          "Wow, tu as réussi !",
          "C'était impressionnant, non ?",
          "Ce que tu viens d'utiliser, c'est un portail.",
          "Un peu de code par-ci, par-là...",
          "Et BOUM ! Je change la carte et tes coordonnées.",
          "(Je m'égare un peu là...)",
          "Bienvenue dans MON monde !",
          "Ici, tu pourras en apprendre plus sur moi.",
          "Il suffit d'explorer les environs.",
          "Tu devrais commencer par la gauche.",
          "Tu vas découvrir pas mal de choses...",
          "À tout de suite !"
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
      {x:820, y:250, w:180, h:180, text:"Qui je suis", color:"rgba(201, 147, 38, 1)",size:25},
      {x:1060, y:250, w:180, h:180, text:"Mon CV", color:"rgba(201, 147, 38, 1)",size:25},
    ],
    npcs: [
      {
        x: 140, y: 394, w: 24, h: 46, path:"gobx1.png", image:new Image(), dialog: [
                                                                                    "Prends le portail sur la gauche pour revenir au hub"
                                                                                    ]
      }
    ]
  },
  {
    id: "experience", // On garde l'ID pour que tes liens existants fonctionnent
    spawn: { x: 100, y: 500 },
    layout: [
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
    background: "stage_bg",
    message: "Mon Parcours",
    images: [],
    texts: [
        { x: 870, y: 160, text: "Stage Cybersécurité", color: "rgba(201, 147, 38, 1)", size: 22 },
        { x: 520, y: 160, text: "Stage Pédagogique", color: "rgba(201, 147, 38, 1)", size: 22 },
        { x: 170, y: 160, text: "Profil & Formation", color: "rgba(201, 147, 38, 1)", size: 22 },
    ],
    npcs: [
        {
            x: 180, y: 514, w: 24, h: 46, path: "gobx1.png", image: new Image(), dialog: [
                "Bienvenue dans la section de mon parcours !",
                "Je suis étudiant ingénieur à l’ESAIP, spécialisé en IA.",
                "Passionné de programmation et de jeux vidéo...",
                "Je souhaite allier ces univers dans mon futur métier.",
                "N'hésite pas à monter voir les détails de mes expériences !"
            ]
        },
        {
            x: 160, y: 314, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Ici, c'est mon profil académique.",
                "Mon cursus à l'ESAIP me permet de maîtriser l'IA et le dev logiciel.",
                "Je suis quelqu'un de curieux et très motivé par les technologies interactives."
            ]
        },
        {
            x: 510, y: 314, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "J'ai réalisé un stage d'ateliers scientifiques ludiques pour enfants.",
                "C'était passionnant ! J'ai appris à vulgariser des concepts complexes.",
                "Cela m'a aussi énormément appris sur le travail en équipe."
            ]
        },
        {
            x: 860, y: 314, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Mon stage chez Lemnia m'a plongé dans la cybersécurité.",
                "J'y ai découvert le monde professionnel de l'informatique.",
                "C'est là que j'ai compris que la cybersécurité est un domaine tout aussi intéressant et complexe que l'IA"
            ]
        }
    ]
 },
 {
    id: "competences",
    spawn: { x: 100, y: 500 },
    layout: [
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","?","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    background: "skills_bg",
    message: "Mes Compétences",
    images: [],
    texts: [
        { x: 400, y: 314, text: "Comportementales", color: "#00ffcc", size: 25 },
        { x: 700, y: 200, text: "Techniques", color: "#ff00ff", size: 25 },
        { x: 850, y: 400, text: "Transversales", color: "#ffff00", size: 25 },
    ],
    npcs: [
        {
            x: 200, y: 314, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Côté Soft Skills, je mise sur l'adaptabilité.",
                "Je suis quelqu'un de curieux avec une grande capacité d'apprentissage.",
                "Mon esprit d'analyse et ma créativité m'aident à résoudre des problèmes complexes.",
                "Et bien sûr, j'adore le travail d'équipe et l'autonomie !"
            ]
        },
        {
            x: 600, y: 194, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Ici, c'est le coeur de mon métier.",
                "Je développe en Python (Objet, Algorithmique).",
                "Je maîtrise l'IA et le Machine Learning avec TensorFlow, PyTorch et OpenCV.",
                "Pour la gestion de données : SQL (MySQL) et Git/GitHub pour le versioning."
            ]
        },
        {
            x: 1000, y: 394, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Les compétences transversales sont mes outils bonus.",
                "Grâce à mes stages, j'ai appris la vulgarisation scientifique et la pédagogie.",
                "Je sais gérer mon temps et m'organiser sur des projets longs.",
                "Ma capacité d'adaptation est ma plus grande force !"
            ]
        }
    ]
 },
 {
    id: "lep",
    spawn: { x: 100, y: 500 },
    layout: [
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"], // Zone 5
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"], // Zone 4
        ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"], // Zone 3
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"], // Zone 2
        ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"], // Zone 1
        ["1","?","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    message: "Mon LEP : Game-Design & IA",
    images: [],
    texts: [
        { x: 485, y: 520, text: "1. Reinforcement Learning", color: "#4db8ff", size: 20 },
        { x: 1000, y: 520, text: "2. Deep Learning", color: "#bf80ff", size: 20 },
        { x: 120, y: 395, text: "3. AI & Ethics", color: "#ff4d4d", size: 20 },
        { x: 1000, y: 280, text: "4. XAI (Explainable)", color: "#ffffff", size: 20 },
        { x: 480, y: 160, text: "5. Multi-Criteria Optimization", color: "#ffcc00", size: 20 },
    ],
    npcs: [
        {
            x: 350, y: 514, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Bienvenue dans mon projet LEP : Expliquer l'IA par le jeu.",
                "Zone 1 : Reinforcement Learning.",
                "Ici, le joueur apprend les règles (saut, boutons) par essais-erreurs.",
                "C'est la base de l'apprentissage par feedback : succès ou échec."
            ]
        },
        {
            x: 900, y: 514, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Zone 2 : Deep Learning.",
                "On ne découvre plus les touches, on combine des patterns complexes.",
                "Comme un réseau de neurones, on finit par agir 'automatiquement' par expérience."
            ]
        },
        {
            x: 200, y: 394, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Zone 3 : AI & Ethics (Le danger).",
                "Le monde devient instable : les règles changent brutalement.",
                "Cela illustre les biais : une IA est dangereuse si son environnement change ou si les données sont faussées."
            ]
        },
        {
            x: 850, y: 275, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Zone 4 : XAI (L'IA explicable).",
                "Pourquoi as-tu suivi ce chemin ? Obéissance ou compréhension ?",
                "Ici, on questionne la capacité de l'IA à justifier ses propres décisions."
            ]
        },
        {
            x: 300, y: 154, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Zone 5 : Optimisation multicritère.",
                "Gérer le temps, les pièces et les dangers en même temps.",
                "L'IA, comme le joueur, doit faire des compromis entre objectifs contradictoires."
            ]
        }
    ]
 },
 {
    id: "valeurs",
    spawn: { x: 100, y: 500 }, // Apparition au centre
    layout: [
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],  
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1"],
        ["1","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","0","1"],
        ["1","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","0","1"],
        ["1","?","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","1"],
        ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    message: "Éthique et Valeurs",
    images: [],
    texts: [
        { x: 270, y: 280, text: "Mes Valeurs", color: "#00ffcc", size: 30 },
        { x: 920, y: 280, text: "Anti-Valeurs", color: "#ff4d4d", size: 30 },
        { x: 800, y: 400, text: "Mon Éthique Professionnelle", color: "#ffffff", size: 20 }
    ],
    npcs: [
        {
            x: 150, y: 274, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Ici c'est le cœur de ma motivation : l'Innovation et la Curiosité.",
                "Je crois au partage des connaissances, hérité de mon expérience en animation.",
                "La persévérance face aux bugs et la rigueur sont mes piliers.",
                "Travailler avec respect et autonomie est essentiel pour moi."
            ]
        },
        {
            x: 1050, y: 274, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Attention ! Zone d'instabilité.",
                "Le manque de communication et le travail non-collaboratif sont mes bêtes noires.",
                "Je refuse la routine sans créativité et la négligence de la sécurité.",
                "L'absence d'éthique n'a pas sa place dans mes projets."
            ]
        },
        {
            x: 600, y: 394, w: 24, h: 46, path: "gobx1.png", image: new Image(), dialog: [
                "Le code, c'est bien, mais les valeurs, c'est mieux !",
                "Explore les plateformes en haut pour découvrir ce qui m'anime.",
                "À gauche : ce que je recherche. À droite : ce que je fuis."
            ]
        }
    ]
    
 },
 {
    id: "futur",
    spawn: { x: 100, y: 500 },
    layout: [
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","0","0","0","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","0","0","0","0","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","?","0","0","0","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"],
        ["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
    ],
    message: "Objectif : Horizon 2030",
    texts: [
        { x: 850, y: 230, text: "Ma Vision à 3-5 ans", color: "#00d4ff", size: 30 },
        { x: 320, y: 540, text: "L'IA au service de l'immersion", color: "#ffffff", size: 18 }
    ],
    npcs: [
        {
            x: 1000, y: 235, w: 24, h: 46, path: "talker.png", image: new Image(), dialog: [
                "Dans 3 à 5 ans, mon terrain de jeu sera l'industrie vidéoludique.",
                "Mon but ? Lier l'IA et le Game Design pour créer des mondes vivants.",
                "Je ne parle pas de générer du code, mais de créer des NPCs intelligents.",
                "Imaginez des personnages uniques, capables d'interactions imprévisibles et naturelles...",
                "C'est cette frontière entre technologie et émotion que je veux explorer."
            ]
        },
        {
            x: 150, y: 514, w: 24, h: 46, path: "gobx1.png", image: new Image(), dialog: [
                "Vous êtes arrivés au bout de mon parcours !",
                "Mon projet professionnel est clair : rendre le virtuel plus humain.",
                "Merci d'avoir exploré mon univers !"
            ]
        }
    ],
    images: []
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

let currentMap = maps.find(m => m.id === "home");

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

function drawControls() {
  ctx.save(); // Sauvegarde l'état du contexte
  
  const x = canvas.width - 220; // Position à droite
  const y = 30;
  
  // Petit fond semi-transparent pour la lisibilité
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(x - 10, y - 20, 210, 110);
  
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  
  ctx.fillText("CONTRÔLES :", x, y);
  ctx.font = "14px Arial";
  ctx.fillText("• Flèches : Se déplacer / Sauter", x, y + 25);
  ctx.fillText("• Entrée : Interagir (PC / Portes)", x, y + 45);
  ctx.fillText("• Clic Souris : Se téléporter", x, y + 65);
  
  ctx.restore(); // Restaure l'état
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
 drawControls();
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
          keys["Enter"] = false;
          draw();
          requestAnimationFrame(update);
          return
        }
      }


      if (tileData.special === "computer"){
        if (isColliding(player,getBlock(row,col)) && keys["Enter"]){
          loadMap(tileData.id)
          keys["Enter"] = false;
          draw();
          requestAnimationFrame(update);
          return
        }
      }



      if (tileData.special === "door"){

        if (isColliding(player,getBlock(row,col)) && keys["Enter"]){
          open(tileData.link);
          keys["Enter"] = false;
          draw();
    
          return
        }
        
        
      }

      
    }
    
  
    
  }
  keys["Enter"] = false;
  draw();
  requestAnimationFrame(update);
 
}
