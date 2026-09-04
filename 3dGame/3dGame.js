const canvas = document.getElementById('3dGameCanvas');

import * as THREE from "three";

const w = canvas.width;
const h = canvas.height;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias : true });
renderer.setSize(w, h);
//document.body.appendChild(renderer.domElement);

/*----- Textures -----*/
const textureLoader = new THREE.TextureLoader();

const cubeTexture = textureLoader.load('Images/emptychildface.png');

/*----- Objects -----*/
const fov = 60;
const aspect = w / h;
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();

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

// walls
const wallGeo = new THREE.BoxGeometry(1,1,1);
const wallMat = new THREE.MeshStandardMaterial({
    color: 0x666666
});
var walls = [
  {x: 2, y: 1},
  {x: 4, y: 3}
];

for (let i = 0; i < walls.length; i++){
  let wallMesh = new THREE.Mesh(wallGeo, wallMat);
  scene.add(wallMesh);
  wallMesh.position.x = walls[i].x;
  wallMesh.position.z = walls[i].y;
}

//light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
scene.add(hemiLight);

const speed = 0.05;
const rotSpeed = 0.03;

var upkey = false;
var downkey = false;
var leftkey = false;
var rightkey = false;
var leftspinkey = false;
var rightspinkey = false;
var lastupkey = false;
var lastdownkey = false;
var lastleftkey = false;
var lastrightkey = false;
var lastleftspinkey = false;
var lastrightspinkey = false;

function handleKeyDown(event){
  lastupkey = upkey;
  lastdownkey = downkey;
  lastleftkey = leftkey;
  lastrightkey = rightkey;
  lastleftspinkey = leftspinkey;
  lastrightspinkey = rightspinkey;
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
}

camera.position.z = 2;

//floor
floorMesh.position.y = -0.55;
floorMesh.scale.x = 64;
floorMesh.scale.y = 0.1;
floorMesh.scale.z = 64;
//ceiling
ceilingMesh.position.y = 0.55;
ceilingMesh.scale.x = 64;
ceilingMesh.scale.y = 0.1;
ceilingMesh.scale.z = 64;

function animate(){
    if(upkey){
        camera.position.z += Math.cos(camera.rotation.y + Math.PI) * speed;
        camera.position.x += Math.sin(camera.rotation.y + Math.PI) * speed;
    }
    if(downkey){
        camera.position.z -= Math.cos(camera.rotation.y + Math.PI) * speed;
        camera.position.x -= Math.sin(camera.rotation.y + Math.PI) * speed;
    }
    if(leftkey){
        camera.position.z += Math.sin(camera.rotation.y) * speed;
        camera.position.x -= Math.cos(camera.rotation.y) * speed;
    }
    if(rightkey){
        camera.position.z -= Math.sin(camera.rotation.y) * speed;
        camera.position.x += Math.cos(camera.rotation.y) * speed;
    }
    if(leftspinkey){
        camera.rotation.y += rotSpeed;
    }
    if(rightspinkey){
        camera.rotation.y -= rotSpeed;
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);