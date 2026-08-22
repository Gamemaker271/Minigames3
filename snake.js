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
    
  }
}

function Update() {
  Logic();
  Draw();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
loop = setInterval(Update, 16); // 33 = 30 fps, 100 = 10fps
