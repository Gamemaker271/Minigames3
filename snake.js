const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

var loop;

const screenw = 500;
const screenh = 500;

/*----- Input -----*/
var spacekey = false;
var lastspacekey = false;

function handleKeyDown(event){
  lastspacekey = spacekey;
  lastmenu = menu;
  // controls
  if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w') {
    spacekey = true;
    if(menu && lastmenu){
      menu = false;
      Reset();
    }
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
  if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w') {
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

}

function Draw(){
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // menu screen
  if(menu){
    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    ctx.fillText('Press e to exit', 160, 48);
  }
  // game screen
  else{
    // draw trail
    for (let i = 0; i < trailpositions.length; i++) {
      // move trail piece to the left
      trailpositions[i].x -= speed;

      // draw it
      if(trailpositions[i].y == 0 || trailpositions[i].y == screenh - playerheight){
        ctx.fillStyle = 'red';
        let smallbox = gridSize * 0.65;
        ctx.fillRect(trailpositions[i].x + (gridSize - smallbox) / 2, trailpositions[i].y + (gridSize - smallbox) / 2, smallbox, smallbox);

      }
      else{
        let centerX = trailpositions[i].x + gridSize / 2;
        let centerY = trailpositions[i].y + gridSize / 2;
        let radius = gridSize / 2;

        // draw the diamond shaped path
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius); // Top vertex
        ctx.lineTo(centerX + radius, centerY); // Right vertex
        ctx.lineTo(centerX, centerY + radius); // Bottom vertex
        ctx.lineTo(centerX - radius, centerY); // Left vertex
        ctx.closePath();

        ctx.fillStyle = 'red';
        ctx.fill();
      }
    }
    // draw player
    if(noclip){
      ctx.fillStyle = 'grey';
    }else{
      ctx.fillStyle = 'blue';
    }
    ctx.fillRect(playerx + playerwidth * 0.125, playery + playerheight * 0.125, playerwidth, playerheight);
    //draw player border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(playerx + playerwidth * 0.125, playery + playerheight * 0.125, playerwidth, playerheight);
    //obstacles
    handleAndDrawObstacles();
  }
}

async function Reset(){
  playery = screenh - playerheight;
  obstacles = [];
  trailpositions = [];
  levelposition = -10 * gridSize;
  let selectedlevel;
  if(selectedlevelnum == 1){
    selectedlevel = await loadLevelFromFile("level1.txt");
    speed = 5;
  }
  else if(selectedlevelnum == 2){
    selectedlevel = await loadLevelFromFile("level2.txt");
    speed = 5;
  }
  else if(selectedlevelnum == 3){
    selectedlevel = await loadLevelFromFile("level3.txt");
    speed = 5;
  }
  else if(selectedlevelnum == 4){
    selectedlevel = await loadLevelFromFile("level4.txt");
    speed = 5;
  }
  else if(selectedlevelnum == 5){
    selectedlevel = await loadLevelFromFile("level5.txt");
    speed = 5;
  }
  else if(selectedlevelnum == 6){
    selectedlevel = await loadLevelFromFile("level6.txt");
    speed = 10;
  }
  else if(selectedlevelnum == 7){
    selectedlevel = await loadLevelFromFile("level7.txt");
    speed = 5;
  }

  // use array to create obstacles 
  for (let r = 0; r < selectedlevel.length; r++) {
    for (let c = 0; c < selectedlevel[r].length; c++) {
      if (selectedlevel[r][c] === '#') {
        spawnObstacle(c * gridSize, r * gridSize, 'cube');
      } else if (selectedlevel[r][c] === 'e') { 
        spawnObstacle(c * gridSize, r * gridSize, 'end'); // end trigger
      } else if (selectedlevel[r][c] === 'g') { 
        spawnObstacle(c * gridSize, r * gridSize, 'cGrav'); // end trigger
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
