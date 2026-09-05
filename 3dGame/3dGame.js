const canvas = document.getElementById('3dGameCanvas');

import * as THREE from "three";

const w = canvas.width;
const h = canvas.height;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias : true });
renderer.setSize(w, h);
//document.body.appendChild(renderer.domElement);

/*----- Textures -----*/
const textureLoader = new THREE.TextureLoader();

var cubeTexture = textureLoader.load('Textures/birdwall.png');
cubeTexture.magFilter = THREE.NearestFilter;
cubeTexture.minFilter = THREE.NearestFilter;
var wallTexture = textureLoader.load('Textures/wall.png');
wallTexture.magFilter = THREE.NearestFilter;
wallTexture.minFilter = THREE.NearestFilter;

/*----- Objects -----*/
const fov = 60;
const aspect = w / h;
const near = 0.01; // 0.1
const far = 30; // 50
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();

//light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
scene.add(hemiLight);

// floor
const floorGeo = new THREE.BoxGeometry(1,1,1);
const floorMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa
});
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
scene.add(floorMesh);

// ceiling
const ceilingGeo = new THREE.BoxGeometry(1,1,1);
const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x333333
});
const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
scene.add(ceilingMesh);

//cube
const cubeGeo = new THREE.BoxGeometry(1,1,1);
const cubeMat = new THREE.MeshStandardMaterial({
    //color: 0xff0000,
    map: cubeTexture
});
const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cubeMesh);

// map
const map = [
  ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
  ['#','_','_','_','_','_','#','_','_','#','_','#','_','_','_','#'],
  ['#','_','_','#','_','_','#','_','_','_','_','#','_','_','_','#'],
  ['#','_','_','#','_','_','#','_','_','#','_','_','_','_','_','#'],
  ['#','_','_','_','_','_','#','#','#','#','_','#','#','_','#','#'],
  ['#','#','#','#','_','_','#','_','_','_','_','#','_','_','_','#'],
  ['#','_','_','#','_','_','#','_','_','_','_','#','#','_','#','#'],
  ['#','_','_','_','_','_','_','_','#','#','_','_','_','_','_','#'],
  ['#','_','_','#','_','_','#','_','a','_','_','#','_','_','_','#'],
  ['#','#','#','#','_','_','#','_','_','_','_','#','#','_','#','#'],
  ['#','_','_','_','_','_','_','_','_','_','_','_','#','_','_','#'],
  ['#','_','_','#','_','_','#','#','_','#','#','_','#','_','_','#'],
  ['#','_','_','#','_','_','#','_','_','_','#','_','_','_','_','#'],
  ['#','_','_','_','_','_','#','_','_','_','_','_','_','_','_','#'],
  ['#','_','_','#','_','_','#','_','_','_','#','_','#','#','#','#'],
  ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#']
];

// walls
const wallGeo = new THREE.BoxGeometry(1,1,1);
const wallMat = new THREE.MeshStandardMaterial({
    //color: 0x666666,
    map: wallTexture
});

var walls = [];
// add coords from map to array
for (let i = 0; i < map.length; i++){
  for (let j = 0; j < map[i].length; j++){
    if(map[i][j] == '#'){
      walls.push({x: j - 7.5, y: i - 7.5, type: 0});
    }else if(map[i][j] == 'a'){
      walls.push({x: j - 7.5, y: i - 7.5, type: 1});
    }
  }
}
// add walls to scene
for (let i = 0; i < walls.length; i++){
  let tempMat = wallMat.clone();
  let wallMesh = new THREE.Mesh(wallGeo, tempMat);
  if(walls[i].type == 0){
    wallTexture = textureLoader.load('Textures/wall.png');
  } else if (walls[i].type == 1){
    wallTexture = textureLoader.load('Textures/birdwall.png');
  } else {
    wallTexture = textureLoader.load('Textures/wall.png');
  }

  wallTexture.magFilter = THREE.NearestFilter;
  wallTexture.minFilter = THREE.NearestFilter;

  wallMesh.material.map = wallTexture;

  scene.add(wallMesh);
  wallMesh.position.x = walls[i].x;
  wallMesh.position.z = walls[i].y;
}
//walls.push({x: 0.5, y: 0.5, type: 1});

// gun
const gunTexture = new THREE.TextureLoader().load( "Textures/pistol.png" );
const gunMaterial = new THREE.SpriteMaterial( { map: gunTexture, color: 0xffffff, sizeAttenuation: false } );
const gunShootTexture = new THREE.TextureLoader().load( "Textures/pistol-shoot.png" );
const gunShootMaterial = new THREE.SpriteMaterial( { map: gunShootTexture, color: 0xffffff, sizeAttenuation: false } );
const gunSprite = new THREE.Sprite( gunMaterial );
scene.add( gunSprite );

const speed = 0.05;
const rotSpeed = 0.03;

var upkey = false;
var downkey = false;
var leftkey = false;
var rightkey = false;
var leftspinkey = false;
var rightspinkey = false;
var firekey = false;
var lastupkey = false;
var lastdownkey = false;
var lastleftkey = false;
var lastrightkey = false;
var lastleftspinkey = false;
var lastrightspinkey = false;
var lastfirekey = false;

function handleKeyDown(event){
  lastupkey = upkey;
  lastdownkey = downkey;
  lastleftkey = leftkey;
  lastrightkey = rightkey;
  lastleftspinkey = leftspinkey;
  lastrightspinkey = rightspinkey;
  lastfirekey = firekey;
  // controls
  if (event.key === 'w') {
    upkey = true;
  }
  if (event.key === 's') {
    downkey = true;
  }
  if (event.key === 'a') {
    leftkey = true;
  }
  if (event.key === 'd') {
    rightkey = true;
  }
  if (event.key === 'ArrowLeft') {
    leftspinkey = true;
  }
  if (event.key === 'ArrowRight') {
    rightspinkey = true;
  }
  if (event.key === 'Shift') {
    firekey = true;
  }
  /*if(
    event.ctrlKey && event.key.toLowerCase() === 'w' || 
    event.ctrlKey && event.key.toLowerCase() === 's' || 
    event.ctrlKey && event.key.toLowerCase() === 'a' || 
    event.ctrlKey && event.key.toLowerCase() === 'd'
  ){
    event.preventDefault();
  }*/
}
function handleKeyUp(event){
  // controls
  if (event.key === 'w') {
    upkey = false;
  }
  if (event.key === 's') {
    downkey = false;
  }
  if (event.key === 'a') {
    leftkey = false;
  }
  if (event.key === 'd') {
    rightkey = false;
  }
  if (event.key === 'ArrowLeft') {
    leftspinkey = false;
  }
  if (event.key === 'ArrowRight') {
    rightspinkey = false;
  }
  if (event.key === 'Shift') {
    firekey = false;
  }
}

camera.position.x = 0.5;
camera.position.z = 2.5;

cubeMesh.position.x = 0.5;
cubeMesh.position.z = 0.5;

//floor
floorMesh.position.y = -0.55;
floorMesh.scale.x = 16;
floorMesh.scale.y = 0.1;
floorMesh.scale.z = 16;
//ceiling
ceilingMesh.position.y = 0.55;
ceilingMesh.scale.x = 16;
ceilingMesh.scale.y = 0.1;
ceilingMesh.scale.z = 16;

function boxCollision(px, py, boxMinX, boxMinY, boxMaxX, boxMaxY) {
    return px >= boxMinX && px <= boxMaxX &&
           py >= boxMinY && py <= boxMaxY;
}

function animate(){
  if(upkey){
    camera.position.z += Math.cos(camera.rotation.y + Math.PI) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.z -= Math.cos(camera.rotation.y + Math.PI) * speed;
      }
    }
    camera.position.x += Math.sin(camera.rotation.y + Math.PI) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.x -= Math.sin(camera.rotation.y + Math.PI) * speed;
      }
    }
  }
  if(downkey){
    camera.position.z -= Math.cos(camera.rotation.y + Math.PI) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.z += Math.cos(camera.rotation.y + Math.PI) * speed;
      }
    }
    camera.position.x -= Math.sin(camera.rotation.y + Math.PI) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.x += Math.sin(camera.rotation.y + Math.PI) * speed;
      }
    }
  }
  if(leftkey){
    camera.position.z += Math.sin(camera.rotation.y) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.z -= Math.sin(camera.rotation.y) * speed;
      }
    }
    camera.position.x -= Math.cos(camera.rotation.y) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.x += Math.cos(camera.rotation.y) * speed;
      }
    }
  }
  if(rightkey){
    camera.position.z -= Math.sin(camera.rotation.y) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.z += Math.sin(camera.rotation.y) * speed;
      }
    }
    camera.position.x += Math.cos(camera.rotation.y) * speed;
    for(let i = 0; i < walls.length; i++){
      if(boxCollision(camera.position.x + 0.5, camera.position.z + 0.5, walls[i].x, walls[i].y, walls[i].x + 1, walls[i].y + 1)){
        camera.position.x -= Math.cos(camera.rotation.y) * speed;
      }
    }
  }
  if(leftspinkey){
    camera.rotation.y += rotSpeed;
  }
  if(rightspinkey){
    camera.rotation.y -= rotSpeed;
  }
  if(firekey && !lastfirekey){
    gunSprite.material = gunShootMaterial;
  }else{
    gunSprite.material = gunMaterial;
  }

  camera.position.x += Math.sin(camera.rotation.y) * 0.02;
  camera.position.z += Math.cos(camera.rotation.y) * 0.02;

  // gun
  gunSprite.position.x = camera.position.x - Math.sin(camera.rotation.y) * 0.02;
  gunSprite.position.z = camera.position.z - Math.cos(camera.rotation.y) * 0.02;
  gunSprite.position.y = -0.0016;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  camera.position.x -= Math.sin(camera.rotation.y) * 0.02;
  camera.position.z -= Math.cos(camera.rotation.y) * 0.02;
}
animate();
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);