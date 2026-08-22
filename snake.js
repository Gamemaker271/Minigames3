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
  lasrightkey = rightkey;
  // controls
  if (event.key === 'UpArrow') {
    upkey = true;
  }
  else{
    upkey = false;
  }
  if (event.key === 'DownArrow') {
    downkey = true;
  }
  else{
    downkey = false;
  }
  if (event.key === 'LeftArrow') {
    leftkey = true;
  }
  else{
    leftkey = false;
  }
  if (event.key === 'RightArrow') {
    rightkey = true;
  }
  else{
    rightkey = false;
  }
}

function Logic(){


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
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
loop = setInterval(Update, 16); // 33 = 30 fps, 100 = 10fps
