const canvas = document.getElementById('3dJetGameCanvas');
//const ctx = canvas.getContext('2d');

import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const w = canvas.width;
const h = canvas.height;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias : true });
renderer.setSize(w, h);

const fov = 60;
const aspect = w / h;
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();
const loader = new GLTFLoader();
// f22
loader.load(
    'Resources/f22_2/f22.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.name = "f22";
        model.scale.set(0.03, 0.03, 0.03);
        //model.rotation.set(0, THREE.MathUtils.degToRad(90), 0);
        model.position.set(0, 0.11, -3);
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.color.setHex(0xff0000);
            child.material.needsUpdate = true;
          }
        });
        scene.add(model);
    },
    (xhr) => {},
    (error) => {
        console.error('error with loading mesh:', error);
    }
);

// floor
const floorGeo = new THREE.BoxGeometry(1,1,1);
const floorMat = new THREE.MeshStandardMaterial({
    color: 0x00ff00
});
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
scene.add(floorMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // white, 0.8 intensity
scene.add(ambientLight);

// highlights, shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // white, 1 intensity
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

var upkey = false;
var downkey = false;
var leftkey = false;
var rightkey = false;
var upspinkey = false;
var downspinkey = false;
var leftspinkey = false;
var rightspinkey = false;
var lastupkey = false;
var lastdownkey = false;
var lastleftkey = false;
var lastrightkey = false;
var lastupspinkey = false;
var lastdownspinkey = false;
var lastleftspinkey = false;
var lastrightspinkey = false;

function handleKeyDown(event){
  lastupkey = upkey;
  lastdownkey = downkey;
  lastleftkey = leftkey;
  lastrightkey = rightkey;
  lastupspinkey = leftkey;
  lastdownspinkey = rightkey;
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
  if (event.key === 'ArrowUp') {
    upspinkey = true;
  }
  if (event.key === 'ArrowDown') {
    downspinkey = true;
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
  if (event.key === 'ArrowUp') {
    upspinkey = false;
  }
  if (event.key === 'ArrowDown') {
    downspinkey = false;
  }
  if (event.key === 'ArrowLeft') {
    leftspinkey = false;
  }
  if (event.key === 'ArrowRight') {
    rightspinkey = false;
  }
}

const speed = 0.05;
const rotSpeed = 0.03;

var playerx = 0;
var playery = 0;
var playerz = 0;
var playeryaw = 0;
var playerpitch = 0;
var playerroll = 0;

camera.position.x = 0;
camera.position.z = 0;
camera.rotation.y = 0;
floorMesh.position.y = -0.55;
floorMesh.scale.x = 20;
floorMesh.scale.y = 0.1;
floorMesh.scale.z = 20;

function animate(t = 0){
    // get models/objects
    let f22model = scene.getObjectByName("f22");

    if(upkey){
        //playerz += Math.cos(playeryaw + Math.PI) * speed;
        //playerx += Math.sin(playeryaw + Math.PI) * speed;
        let movementvector = new THREE.Vector3();
        if(f22model){
          //f22model.rotation.set(playerpitch, playeryaw, playerroll);
          f22model.getWorldDirection(movementvector);
        }
        movementvector.multiplyScalar(speed);
        playerx += -movementvector.x;
        playery += -movementvector.y;
        playerz += -movementvector.z;
    }
    if(downkey){
        //playerz -= Math.cos(playeryaw + Math.PI) * speed;
        //playerx -= Math.sin(playeryaw + Math.PI) * speed;
    }
    if(leftkey){
        playeryaw -= rotSpeed;
    }
    if(rightkey){
        playeryaw += rotSpeed;
    }
    if(upspinkey){
        playerpitch -= rotSpeed;
    }
    if(downspinkey){
        playerpitch += rotSpeed;
    }
    if(leftspinkey){
        playerroll += rotSpeed;
    }
    if(rightspinkey){
        playerroll -= rotSpeed;
    }

    camera.position.set(playerx, playery + 2, playerz + 2.75);
    camera.rotation.x = THREE.MathUtils.degToRad(340);
    if(f22model){
      f22model.position.set(playerx, playery, playerz);
      f22model.rotation.set(playerpitch, playeryaw, playerroll);
    }

    //console.log("position: " + camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
    //console.log("rot: " + camera.rotation.y);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);