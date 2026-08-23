const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

var loop;

const screenw = 10;
const screenh = 10;

const gridSize = 50;

var xpos = 0;
var ypos = 0;

/*----- Input -----*/
var upkey = false;
var lastupkey = false;
var downkey = false;
var lastdownkey = false;
var leftkey = false;
var lastleftkey = false;
var rightkey = false;
var lastrightkey = false;

function handleKeyDown(event){
  lastupkey = upkey;
  lastdownkey = downkey;
  lastleftkey = leftkey;
  lastrightkey = rightkey;
  // controls
  if (event.key === 'ArrowUp') {
    upkey = true;
  }
  if (event.key === 'ArrowDown') {
    downkey = true;
  }
  if (event.key === 'ArrowLeft') {
    leftkey = true;
  }
  if (event.key === 'ArrowRight') {
    rightkey = true;
  }
}

function Logic(){
  if(upkey){
    ypos -= 1;
  }
  if(downkey){
    ypos += 1;
  }
  if(leftkey){
    xpos -= 1;
  }
  if(rightkey){
    xpos += 1;
  }

  // boundaries
  if(xpos < 0)
  {
    xpos = 0;
  }
  if(xpos > screenw)
  {
    xpos = screenw;
  }
  if(ypos < 0)
  {
    ypos = 0;
  }
  if(ypos > screenh)
  {
    ypos = screenh;
  }
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

  upkey = false;
  downkey = false;
  leftkey = false;
  rightkey = false;
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
loop = setInterval(Update, 16); // 33 = 30 fps, 100 = 10fps
