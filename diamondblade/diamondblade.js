const canvas = document.getElementById('diamondbladeCanvas');
const ctx = canvas.getContext('2d');

var loop;
var menu = true;
var lastmenu = true;

const screenw = 400;
const screenh = 300;

var speed = 5;

var gamemode = "wave";

const gridSize = 25;

const playerxoffset = 4 * gridSize;
var playerx = 0;
var playery = 0;
const playerwidth = gridSize * 0.75;
const playerheight = gridSize * 0.75;

var noclip = false;
var macro = false;
var selectedlevelnum = 1;

var levelposition = 0;

var trailpositions = [];
const MAX_TRAIL_LENGTH = 50; //30

var obstacleMode = 0; // 0 blocks, 1 triangles

let obstacles = [];
const OBSTACLE_SIZE = gridSize;

function spawnObstacle(_x, _y, type = 'cube') {
  obstacles.push({
    x: _x,
    y: _y,
    width: OBSTACLE_SIZE,
    height: OBSTACLE_SIZE,
    type: type // FIXED: Sets type explicitly so rendering logic catches it
  });
}
function handleAndDrawObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    let drawX = obs.x - levelposition;

    // drawing
    ctx.fillStyle = 'black'; //#FF413;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    if (obs.type === 'cube') {
      ctx.fillRect(drawX, obs.y, obs.width, obs.height);
      ctx.strokeRect(drawX, obs.y, obs.width, obs.height);
    } else if (obs.type === 'spike') {
      let side = obs.width;
      const h = side * (Math.sqrt(3) / 2);
      let cx = drawX;
      let cy = obs.y;
      ctx.beginPath();
      // top
      ctx.moveTo((cx + 0.5 * gridSize), (cy + 0.5 * gridSize) - h / 2);
      // bottom left
      ctx.lineTo((cx + 0.5 * gridSize) - side / 2, (cy + 0.5 * gridSize) + h / 2);
      // bottom right
      ctx.lineTo((cx + 0.5 * gridSize) + side / 2, (cy + 0.5 * gridSize) + h / 2);
      ctx.closePath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.fill();
    } else if (obs.type === 'invertspike') {
      let side = obs.width;
      const h = side * (Math.sqrt(3) / 2);
      let cx = drawX;
      let cy = obs.y;
      ctx.beginPath();
      // top
      ctx.moveTo((cx + 0.5 * gridSize), (cy + 0.5 * gridSize) + h / 2);
      // bottom left
      ctx.lineTo((cx + 0.5 * gridSize) - side / 2, (cy + 0.5 * gridSize) - h / 2);
      // bottom right
      ctx.lineTo((cx + 0.5 * gridSize) + side / 2, (cy + 0.5 * gridSize) - h / 2);
      ctx.closePath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.fill();
    } else if (obs.type === 'end') {
      ctx.fillStyle = 'yellow';
      ctx.strokeStyle = 'black';
      ctx.fillRect(drawX, obs.y, obs.width, obs.height);
      ctx.strokeRect(drawX, obs.y, obs.width, obs.height);
    } else {
      // Draw 1:1 right-angle triangles using paths
      ctx.beginPath();
      if (obs.type === 'tr_bl') { // Corner Bottom-Left
        ctx.moveTo(drawX, obs.y);
        ctx.lineTo(drawX, obs.y + obs.height);
        ctx.lineTo(drawX + obs.width, obs.y + obs.height);
      } else if (obs.type === 'tr_br') { // Corner Bottom-Right
        ctx.moveTo(drawX + obs.width, obs.y);
        ctx.lineTo(drawX + obs.width, obs.y + obs.height);
        ctx.lineTo(drawX, obs.y + obs.height);
      } else if (obs.type === 'tr_tl') { // Corner Top-Left
        ctx.moveTo(drawX, obs.y + obs.height);
        ctx.lineTo(drawX, obs.y);
        ctx.lineTo(drawX + obs.width, obs.y);
      } else if (obs.type === 'tr_tr') { // Corner Top-Right
        ctx.moveTo(drawX, obs.y);
        ctx.lineTo(drawX + obs.width, obs.y);
        ctx.lineTo(drawX + obs.width, obs.y + obs.height);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // collision //
    // First step: broad AABB check (is the player even touching the general tile zone?)
    let colpx = playerx + playerwidth * 0.375;
    let colpy = playery + playerheight * 0.375;
    let colpw = playerwidth * 0.5;
    let colph =  playerheight * 0.5;
    let boxCollision = (
      colpx < drawX + obs.width &&
      colpx + colpw > drawX &&
      colpy < obs.y + obs.height &&
      colpy + colph > obs.y
    );

    if (boxCollision) {
      if (obs.type === 'cube' && !noclip) {
        menu = true; // Instant crash for basic block
      } else if (obs.type === 'end') {
        menu = true; // win condition
      } else {
        // if inside cube, check if is also inside the triangle
        if (checkTriangleCollision(drawX, obs.y, obs.width, obs.type) && !noclip) {
          menu = true;
        }
      }
    }

    // Clean up off-screen items
    if (drawX + obs.width < 0) {
      obstacles.splice(i, 1);
    }
  }
}
function checkTriangleCollision(tx, ty, size, type) {
  // Find player corners relative to the triangle tile origin (0 to size)
  let px1 = playerx - tx;
  let px2 = (playerx + playerwidth) - tx;
  let py1 = playery - ty;
  let py2 = (playery + playerheight) - ty;

  // Clamp values inside bounds of the tile grid block
  let minX = Math.max(0, px1);
  let maxX = Math.min(size, px2);

  if (minX > maxX) return false;

  if (type === 'tr_bl') {
    // Slope line: y = x. Hazard zone is when player Y goes deep down (higher value)
    // Check top-right corner of player against the hypotenuse
    return py2 > minX; 
  }
  if (type === 'tr_br') {
    // Slope line: y = size - x. 
    return py2 > (size - maxX);
  }
  if (type === 'tr_tl') {
    // Slope line: y = size - x. Hazard zone is when player Y is near top (lower value)
    return py1 < (size - minX);
  }
  if (type === 'tr_tr') {
    // Slope line: y = x.
    return py1 < maxX;
  }
  return false;
}
async function loadLevelFromFile(filePath) {
  try {
    // Wait for the raw fetch response
    const response = await fetch(filePath);
    // Wait for the text conversion
    const textData = await response.text();
    
    // Process the text data into the 2D array
    const rows = textData.trim().split(/\r?\n/);
    const levelarray = rows.map(row => row.split(''));
    
    return levelarray; 
  } catch (error) {
    console.error("Error loading the map file:", error);
  }
}

/*----- Input -----*/
var spacekey = false;
var lastspacekey = false;

function handleKeyDown(event){
  lastspacekey = spacekey;
  lastmenu = menu;
  // controls
  if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'f' || event.key === 'j') {
    spacekey = true;
    if(menu && lastmenu){
      menu = false;
      Reset();
    }
  }
  //levels
  if (event.key === '1') {
    selectedlevelnum = 1;
  }
  if (event.key === '2') {
    selectedlevelnum = 2;
  }
  if (event.key === '3') {
    selectedlevelnum = 3;
  }
  if (event.key === '4') {
    selectedlevelnum = 4;
  }
  if (event.key === '5') {
    selectedlevelnum = 5;
  }

  // exit etc
  if (event.key === 'e') {
    if(!menu){
      menu = true;
    }
  }
  if (event.key === 'Enter') {
    if(menu){
      menu = false;
      Reset();
    }
  }
}
function handleKeyUp(event){
  // controls
  if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'f' || event.key === 'j') {
    spacekey = false;
  }
  if (event.key === 'n') {
    if(noclip){
      noclip = false;
    }
    else{
      noclip = true;
    }
  }
  if (event.key === 'm') {
    if(macro){
      macro = false;
    }
    else{
      macro = true;
    }
  }
}

function Logic(){
  levelposition += speed;

  // trail stuff
  // Save current position to the start of array
  if(speed == 2 && (playerx % 2 == 0) || (speed > 2))
  trailpositions.unshift({ x: playerx, y: playery });
  // pop end of array
  if (trailpositions.length > MAX_TRAIL_LENGTH) {
    trailpositions.pop();
  }
  playerx = playerxoffset;

if (gamemode === "wave"){
  if (spacekey || (macro && levelposition % 2 == 0)) {
    playery -= speed;
  }
  else{
    playery += speed;
  }
}
 //collisions
  if(playerx < 0){
    playerx = 0;
  }
  if(playerx > screenh - playerheight){
    playerx = screenh - playerheight;
  }
  if(playery < 0){
    playery = 0;
  }
  if(playery > screenh - playerheight){
    playery = screenh - playerheight;
  }
}

function Draw(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // menu screen
  if(menu){
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.fillText('Wave Game', 165, 16);
    ctx.fillText('Press enter to play', 145, 32);
    ctx.fillText('Press e to exit', 160, 48);

    ctx.fillText('Noclip', 170, 64);
    if(noclip){
      ctx.fillStyle = 'green';
      ctx.fillText('ON', 220, 64);
    }else{
      ctx.fillStyle = 'red';
      ctx.fillText('OFF', 220, 64);
    }
    ctx.fillStyle = 'white';
    ctx.fillText('Macro', 170, 80);
    if(macro){
      ctx.fillStyle = 'green';
      ctx.fillText('ON', 220, 80);
    }else{
      ctx.fillStyle = 'red';
      ctx.fillText('OFF', 220, 80);
    }
    ctx.fillStyle = 'white';

    ctx.fillText('Selected level:', 150, 96);
    ctx.fillText(selectedlevelnum, 260, 96);
  }
  // game screen
  else{
    // draw trail
    for (let i = 0; i < trailpositions.length; i++) {
      // move trail piece to the left
      trailpositions[i].x -= speed;

      // draw it
      if(trailpositions[i].y == 0 || trailpositions[i].y == screenh - playerheight){
        ctx.fillStyle = 'white';
        let smallbox = gridSize * 0.5;//0.65
        ctx.fillRect(trailpositions[i].x + (gridSize - smallbox) / 2, trailpositions[i].y + (gridSize - smallbox) / 2, smallbox, smallbox);

      }
      else{
        let centerX = trailpositions[i].x + gridSize / 2; // grid/2
        let centerY = trailpositions[i].y + gridSize / 2; // grid/2
        let radius = gridSize / 3; // grid/2

        // draw the diamond shaped path
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius); // Top vertex
        ctx.lineTo(centerX + radius, centerY); // Right vertex
        ctx.lineTo(centerX, centerY + radius); // Bottom vertex
        ctx.lineTo(centerX - radius, centerY); // Left vertex
        ctx.closePath();

        ctx.fillStyle = 'white';
        if(i > 1){
          ctx.fill();
        }
      }
    }
    // draw player
    /*if(noclip){
      ctx.fillStyle = 'grey';
    }else{
      ctx.fillStyle = 'black';
    }
    ctx.fillRect(playerx + playerwidth * 0.125, playery + playerheight * 0.125, playerwidth, playerheight);*/
    //draw player border
    //ctx.strokeStyle = 'white';
    //ctx.lineWidth = 2;
    //ctx.strokeRect(playerx + playerwidth * 0.125, playery + playerheight * 0.125, playerwidth, playerheight);

    // AI triangle sht
    ctx.fillStyle = noclip ? 'grey' : 'black';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    let x = playerx + playerwidth * 0.125;
    let y = playery + playerheight * 0.125;
    if(macro){
        x -= 5;
        y += 2;
    }

    // Target angle: UP (-45deg) vs DOWN (+45deg)
    let angle = spacekey ? -Math.PI / 4 : Math.PI / 4;

    // Calculate rotation center
    let centerX = x + playerwidth / 2;
    let centerY = y + playerheight / 2;

    ctx.save(); // save state

    // rotate around center point
    if(!(playery == 0 || playery == screenh - playerheight)){
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.translate(-centerX, -centerY);
    }

    // define triangle path
    ctx.beginPath();
    ctx.moveTo(x + playerwidth, y + playerheight / 2); // Front tip
    ctx.lineTo(x, y + 0);                               // Top back corner
    ctx.lineTo(x, y - 0 + playerheight);                // Bottom back corner
    ctx.closePath();

    // fill and stroke the path
    ctx.fill();
    ctx.stroke();

    ctx.restore(); // restore canvas state

    //hitbox
    ctx.strokeStyle = "red"
    ctx.strokeRect(playerx + playerwidth * 0.375, playery + playerheight * 0.375, playerwidth * 0.5, playerheight * 0.5);

    //obstacles
    handleAndDrawObstacles();
  }
}

async function Reset(){
  playery = screenh - playerheight;
  obstacles = [];
  trailpositions = [];
  levelposition = -10 * gridSize;
  speed = 5;
  gamemode = "wave";
  let selectedlevel;
  if(selectedlevelnum == 1){
    speed = 3;
    selectedlevel = await loadLevelFromFile("wavelevels/level1.txt");
  }
  else if(selectedlevelnum == 2){
    speed = 4;
    selectedlevel = await loadLevelFromFile("wavelevels/level2.txt");
  }
  else if(selectedlevelnum == 3){
    speed = 3;
    selectedlevel = await loadLevelFromFile("wavelevels/level3.txt");
  }
  else if(selectedlevelnum == 4){
    speed = 2;
    selectedlevel = await loadLevelFromFile("wavelevels/level3.txt");
  }
  else if(selectedlevelnum == 5){
    speed = 3;
    selectedlevel = await loadLevelFromFile("wavelevels/level4.txt");
  }

  // use array to create obstacles 
  for (let r = 0; r < selectedlevel.length; r++) {
    for (let c = 0; c < selectedlevel[r].length; c++) {
      if (selectedlevel[r][c] === '#') {
        spawnObstacle(c * gridSize, r * gridSize, 'cube');
      } else if (selectedlevel[r][c] === 's') { 
        spawnObstacle(c * gridSize, r * gridSize, 'spike');
      } else if (selectedlevel[r][c] === 'z') { 
        spawnObstacle(c * gridSize, r * gridSize, 'invertspike');
      } else if (selectedlevel[r][c] === 'e') { 
        spawnObstacle(c * gridSize, r * gridSize, 'end'); // end trigger
      } else if (selectedlevel[r][c] === 'L') { 
        spawnObstacle(c * gridSize, r * gridSize, 'tr_bl'); // Bottom-Left
      } else if (selectedlevel[r][c] === 'J') { 
        spawnObstacle(c * gridSize, r * gridSize, 'tr_br'); // Bottom-Right
      } else if (selectedlevel[r][c] === 'r') { 
        spawnObstacle(c * gridSize, r * gridSize, 'tr_tl'); // Top-Left
      } else if (selectedlevel[r][c] === '7') { 
        spawnObstacle(c * gridSize, r * gridSize, 'tr_tr'); // Top-Right
      }
    }
  }
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
loop = setInterval(Update, 16); // 33 = 30 fps, 100 = 10fps