const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

var loop;

const screenw = 10;
const screenh = 10;

const gridSize = 50;

var xpos = 0;
var ypos = 0;

var direction = "stop";

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
function handleKeyUp(event){
  // controls
  if (event.key === 'ArrowUp') {
    upkey = false;
  }
  if (event.key === 'ArrowDown') {
    downkey = false;
  }
  if (event.key === 'ArrowLeft') {
    leftkey = false;
  }
  if (event.key === 'ArrowRight') {
    rightkey = false;
  }
}

function Reset(){
  xpos = Math.floor(screenw / 2);
  ypos = Math.floor(screenh / 2);
  direction = "stop";
}

function Logic(){
  // set direction
  if(upkey){
    direction = "up";
  }
  if(downkey){
    direction = "down";
  }
  if(leftkey){
    direction = "left";
  }
  if(rightkey){
    direction = "right";
  }

  // move
  if(direction == "up"){
    ypos -= 1;
  }
  if(direction == "down"){
    ypos += 1;
  }
  if(direction == "left"){
    xpos -= 1;
  }
  if(direction == "right"){
    xpos += 1;
  }

  // boundaries
  if(xpos < 0)
  {
    //xpos = 0;
    Reset();
  }
  if(xpos > screenw - 1)
  {
    //xpos = screenw - 1;
    Reset();
  }
  if(ypos < 0)
  {
    //ypos = 0;
    Reset();
  }
  if(ypos > screenh - 1)
  {
    //ypos = screenh - 1;
    Reset();
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
  ctx.fillRect(xpos * gridSize, ypos * gridSize, gridSize, gridSize);
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
loop = setInterval(Update, 100); // 16 = 60fps 33 = 30 fps, 100 = 10fps
Reset();
