const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

var loop;

const screenw = 10;
const screenh = 10;

const gridSize = 50;

var xpos = 0;
var ypos = 0;

/*----- Input -----*/
var spacekey = false;
var lastspacekey = false;

function handleKeyDown(event){
  lastspacekey = spacekey;
  // controls
  if (event.key === ' ') {
    spacekey = true;
  }
}
function handleKeyUp(event){
  // controls
  if (event.key === ' ') {
    spacekey = false;
  }
}

function Logic(){

}

function Draw(){
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '16px sans-serif';
  ctx.fillText('something', 160, 48);

  // head
  ctx.fillStyle = 'green';
  ctx.fillRect(xpos, ypos, gridSize, gridSize);
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
loop = setInterval(Update, 16); // 33 = 30 fps, 100 = 10fps
