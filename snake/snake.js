const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

var loop;

const screenw = 10;
const screenh = 10;

const gridSize = 50;

var xpos = 0;
var ypos = 0;

var applex = 0;
var appley = 0;

var score = 0;

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
  score = 0;
  xpos = Math.floor(screenw / 2) - 1;
  ypos = Math.floor(screenh / 2) - 1;
  direction = "stop";
}

function Apple(){
  score++;
  applex = Math.floor(Math.random() * screenw);// 0 to screenw - 1
  appley = Math.floor(Math.random() * screenh);// 0 to screenh - 1
  while (xpos == applex && ypos == appley){
    applex = Math.floor(Math.random() * screenw);
    appley = Math.floor(Math.random() * screenh);
  }
}

function Logic(){
  // set direction
  if(upkey && !lastupkey){
    direction = "up";
  }
  if(downkey && !lastdownkey){
    direction = "down";
  }
  if(leftkey && !lastleftkey){
    direction = "left";
  }
  if(rightkey && !lastrightkey){
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

  if(xpos == applex && ypos == appley){
    Apple();
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
  
  // apple
  ctx.fillStyle = 'red';
  ctx.fillRect(applex * gridSize, appley * gridSize, gridSize, gridSize);

  // head
  ctx.fillStyle = 'green';
  ctx.fillRect(xpos * gridSize, ypos * gridSize, gridSize, gridSize);

  // score
  ctx.fillStyle = 'black';
  ctx.font = '16px sans-serif';
  ctx.fillText(score, ((screenw / 2) * gridSize) - 4, gridSize);
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
loop = setInterval(Update, 200); // 16 = 60fps, 33 = 30 fps, 100 = 10fps, 200 = 5fps
Reset();
