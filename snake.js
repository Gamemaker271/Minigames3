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
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
loop = setInterval(Update, 16); // 33 = 30 fps, 100 = 10fps
