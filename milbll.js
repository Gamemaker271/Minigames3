const canvas = document.getElementById('milbllCanvas');
const ctx = canvas.getContext('2d');

var loop;
var menu = true;
var lastmenu = true;

const screenw = 400;
const screenh = 300;

var speed = 5;

var dblock = true;

const gridSize = 25;

const playerxoffset = 4 * gridSize;
var playerx = 0;
var playery = 0;
const playerwidth = gridSize * 0.75;
const playerheight = gridSize * 0.75;

var noclip = false;
var macro = false;

var mob1x = 0; // offset
var mob1y = 0;

var levelposition = 0;

var trailpositions = [];
const MAX_TRAIL_LENGTH = 30;

var obstacleMode = 0; // 0 blocks, 1 triangles

let obstacles = [];
const OBSTACLE_SIZE = gridSize;

let effects = [];

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
    let drawY = obs.y;

    // --- DRAWING LOGIC ---
    ctx.fillStyle = '#FF4136';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    if (obs.type === 'cube') {
      ctx.fillRect(drawX, obs.y, obs.width, obs.height);
      ctx.strokeRect(drawX, obs.y, obs.width, obs.height);
    } else if (obs.type === 'mob') {
      if(obs.x === Math.floor(obs.x)){
        ctx.fillStyle = 'green';
      } else {
        ctx.fillStyle = 'red';
      }
      ctx.fillRect(drawX + mob1x * gridSize, obs.y + mob1y * gridSize, obs.width, obs.height);
      ctx.strokeRect(drawX + mob1x * gridSize, obs.y + mob1y * gridSize, obs.width, obs.height);
    } else if (obs.type === 'end') {
      ctx.fillStyle = 'yellow';
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

    // --- COLLISION LOGIC --- //
    // First step: broad AABB check (is the player even touching the general tile zone?)
    
    if(obstacles.type === 'mob'){
      drawX += mob1x * gridSize;
      drawY += mob1y * gridSize;
    }

    let boxCollision = 0;
    if(obs.type === 'mob'){
      if(
        playerx < drawX + mob1x * gridSize + obs.width &&
        playerx + playerwidth > drawX + mob1x * gridSize &&
        playery < drawY + mob1y * gridSize + obs.height &&
        playery + playerheight > drawY + mob1y * gridSize
      ){
        if(
          playerx < drawX + mob1x * gridSize + obs.width &&
          playerx + playerwidth > drawX + mob1x * gridSize &&
          playery < drawY + mob1y * gridSize + obs.height / 2 &&
          playery + playerheight > drawY + mob1y * gridSize
        ){
          boxCollision = 1;
        }else{
          boxCollision = 2;
        }
      }
    }else{
      if(
        playerx < drawX + obs.width &&
        playerx + playerwidth > drawX &&
        playery < drawY + obs.height &&
        playery + playerheight > drawY
      ){
        boxCollision = 1;
      }
    }

    if (boxCollision == 1 || boxCollision == 2) {
      if (obs.type === 'cube' && !noclip) {
        if(dblock && spacekey){
            playery += speed * 2;
        }else if(dblock){
            playery -= speed * 2;
        }else{
            menu = true; // die
        }
      }else if (obs.type == 'mob' && !noclip) {
        if(dblock && boxCollision == 2){
            playery += speed * 2;
        }else if(dblock && boxCollision == 1){
            playery -= speed * 2;
        }else{
            menu = true; // die
        }
      } else if (obs.type === 'end') {
        menu = true; // win condition
      } else {
        // if inside cube, check if is also inside the triangle
        if (checkTriangleCollision(drawX, obs.y, obs.width, obs.type) && !noclip) {
          if(dblock && spacekey){
            playery += speed * 2;
          }else if(dblock){
            playery -= speed * 2;
          }else{
            menu = true;
          }
        }
      }
    }

    // Clean up off-screen items
    if (drawX + obs.width < 0 && obs.type != 'mob') {
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
  if (event.key === 'd') {
    if(dblock){
      dblock = false;
    }
    else{
      dblock = true;
    }
  }
}

function dashorb(){
  for (let i = 0; i < effects.length; i++) {
    if(effects[i].size > 0){
      ctx.fillStyle = 'purple';
      ctx.beginPath();
      ctx.arc(effects[i].x, effects[i].y, effects[i].size * 0.9, 0, 2 * Math.PI);
      ctx.fill();
      effects[i].size -= 2;
      //effects[i].x -= speed;
    }else{
      effects.splice(i, 1);;
    }
  }
  for (let i = 0; i < effects.length; i++) {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(effects[i].x, effects[i].y, effects[i].size * 1.1, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
function spawneffect(){
  effects.push({x: playerx + 8, y: playery + 8, size: 30});
}

function Logic(){
  levelposition += speed;
  if(levelposition > 680){
    mob1x += 0.2;
  } if(levelposition > 720 && levelposition < 740){
    mob1y += 0.05;
  } if(levelposition > 760 && levelposition < 820){
    mob1y -= 0.1;
  } if(levelposition > 820 && levelposition < 1000){
    mob1y += 0.025;
  } if(levelposition > 1000 && levelposition < 1100){
    mob1y -= 0.05;
  } if(levelposition > 1100 && levelposition < 1200){
    mob1y -= 0.1;
  } if(levelposition > 1200 && levelposition < 1500){
    mob1y += 0.05;
  } if(levelposition > 1500 && levelposition < 1550){
    mob1y += 0.15;
  } if(levelposition > 1550 && levelposition < 1650){
    mob1y -= 0.1;
  } if(levelposition > 1650 && levelposition < 1800){
    mob1y += 0.05;
  } if(levelposition > 1800 && levelposition < 1900){
    mob1y -= 0.1;
  } if(levelposition > 1900 && levelposition < 2000){
    mob1y -= 0.05;
  } if(levelposition > 2000 && levelposition < 2100){
    mob1y += 0.05;
  } if(levelposition > 2100 && levelposition < 2150){
    mob1y -= 0.15;
  } if(levelposition > 2150 && levelposition < 2300){
    mob1y += 0.075;
  } if(levelposition > 2300 && levelposition < 2400){
    mob1y -= 0.05;
  }

  // trail stuff
  // Save current position to the start of array
  trailpositions.unshift({ x: playerx, y: playery });
  // pop end of array
  if (trailpositions.length > MAX_TRAIL_LENGTH) {
    trailpositions.pop();
  }
  playerx = playerxoffset;

  if (spacekey || (macro && levelposition % 2 == 0)) {
    playery -= speed;
  }
  else{
    playery += speed;
  }

  if( ((spacekey && !lastspacekey) || macro) && levelposition > 680 ){
    spawneffect();
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
    ctx.fillText('MILBLL', 165, 16);

    ctx.fillText('Noclip', 150, 32);
    if(noclip){
      ctx.fillStyle = 'green';
      ctx.fillText('ON', 200, 32);
    }else{
      ctx.fillStyle = 'red';
      ctx.fillText('OFF', 200, 32);
    }
    ctx.fillStyle = 'white';
    ctx.fillText('Macro', 150, 48);
    if(macro){
      ctx.fillStyle = 'green';
      ctx.fillText('ON', 200, 48);
    }else{
      ctx.fillStyle = 'red';
      ctx.fillText('OFF', 200, 48);
    }
    ctx.fillStyle = 'white';
    ctx.fillText('D-Block', 145, 64);
    if(dblock){
      ctx.fillStyle = 'green';
      ctx.fillText('ON', 205, 64);
    }else{
      ctx.fillStyle = 'red';
      ctx.fillText('OFF', 205, 64);
    }
    ctx.fillStyle = 'white';
    ctx.fillText('Selected level:', 95, 80);
    ctx.fillText('MILBLLlife', 205, 80);
  }
  // game screen
  else{
    dashorb();

    // draw trail
    for (let i = 0; i < trailpositions.length; i++) {
      // move trail piece to the left
      trailpositions[i].x -= speed;

      // draw it
      if(trailpositions[i].y == 0 || trailpositions[i].y == screenh - playerheight){
        ctx.fillStyle = 'white';
        let smallbox = gridSize * 0.65;
        if(i > 1){
            ctx.fillRect(trailpositions[i].x + (gridSize - smallbox) / 2, trailpositions[i].y + (gridSize - smallbox) / 2, smallbox, smallbox);
        }
      }
      else{
        let centerX = trailpositions[i].x + gridSize / 2;
        let centerY = trailpositions[i].y + gridSize / 2;
        let radius = gridSize / 2;

        // draw the diamond shaped path
        if(i > 0){
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - radius); // Top vertex
            ctx.lineTo(centerX + radius, centerY); // Right vertex
            ctx.lineTo(centerX, centerY + radius); // Bottom vertex
            ctx.lineTo(centerX - radius, centerY); // Left vertex
            ctx.closePath();

            ctx.fillStyle = 'white';
            ctx.fill();
        }
      }
    }
    // draw player
    /*
    ctx.fillStyle = noclip ? 'grey' : 'blue';
    ctx.fillRect(playerx + playerwidth * 0.125, playery + playerheight * 0.125, playerwidth, playerheight);
    //draw player border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(playerx + playerwidth * 0.125, playery + playerheight * 0.125, playerwidth, playerheight);
    */
    // AI triangle sht
    ctx.fillStyle = noclip ? 'grey' : 'lightgrey';
    ctx.strokeStyle = 'darkgrey';
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

    ctx.save(); // 1. Save state

    // 2. Rotate around center point
    if(!(playery == 0 || playery == screenh - playerheight)){
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.translate(-centerX, -centerY);
    }

    // 3. Define triangle path ONCE
    ctx.beginPath();
    ctx.moveTo(x + playerwidth, y + playerheight / 2); // Front tip
    ctx.lineTo(x, y + 0);                               // Top back corner
    ctx.lineTo(x, y - 0 + playerheight);                // Bottom back corner
    ctx.closePath();

    // 4. Fill and Stroke the single path
    ctx.fill();
    ctx.stroke();

    ctx.restore(); // 5. Cleanly restore canvas state

    // Obstacles
    handleAndDrawObstacles();
  }
}

async function Reset(){
  playery = screenh - playerheight;
  obstacles = [];
  trailpositions = [];
  effects = [];
  levelposition = -10 * gridSize;
  mob1x = 0;
  mob1y = 0;
  let selectedlevel = await loadLevelFromFile("wavelevels/milbll.txt");

  // use array to create obstacles 
  for (let r = 0; r < selectedlevel.length; r++) {
    for (let c = 0; c < selectedlevel[r].length; c++) {
      if (selectedlevel[r][c] === '#') {
        spawnObstacle(c * gridSize, r * gridSize, 'cube');
      } else if (selectedlevel[r][c] === 'm') { 
        spawnObstacle(c * gridSize, r * gridSize, 'mob'); // mobile objects
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
  lastspacekey = spacekey;
  lastmenu = menu;
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
loop = setInterval(Update, 16); // 33 = 30 fps, 100 = 10fps