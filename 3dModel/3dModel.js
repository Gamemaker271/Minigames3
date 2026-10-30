/* 
"Sukhoi Su-34 - Figther Jet - Free" (https://skfb.ly/pMIAW) by bohmerang 
is licensed under CC Attribution-NonCommercial-ShareAlike 
(http://creativecommons.org/licenses/by-nc-sa/4.0/). 
*/

const canvas = document.getElementById('3dModelCanvas');
//const ctx = canvas.getContext('2d');

import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const w = canvas.width;
const h = canvas.height;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias : true });
renderer.setSize(w, h);
//document.body.appendChild(renderer.domElement);

const fov = 60;
const aspect = w / h;
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();

//model
const loader = new GLTFLoader();

// f22
loader.load(
    'Resources/f22/f22.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.03, 0.03, 0.03);
        model.rotation.set(0, THREE.MathUtils.degToRad(270), 0);
        model.position.set(4, 0, -1);
        model.traverse((child) => {
        if (child.isMesh) {
            // Apply to the existing material
            //child.material.map = albedoTexture;
            
            // Optional: Reset base color to white so it doesn't tint your texture
            child.material.color.setHex(0xff0000); 
            
            // Tell Three.js the material needs to recompile
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
// suzanne
loader.load(
    'Resources/a/Suzanne.gltf',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    },
    (xhr) => {},
    (error) => {
        console.error('error with loading mesh:', error);
    }
);
// cone
loader.load(
    'Resources/cone/Scene.gltf',
    (gltf) => {
        // left
        const cone1 = gltf.scene;
        cone1.name = "cone1";
        cone1.position.set(-1.5, -0.5, 0);
        scene.add(cone1);
        // right
        const cone2 = cone1.clone();
        cone2.name = "cone2";
        cone2.position.set(1.5, -0.5, 0);
        scene.add(cone2);
        // back
        const cone3 = cone1.clone();
        cone3.name = "cone3";
        cone3.position.set(0, -0.5, -1.5);
        scene.add(cone3);
        // left back
        const cone4 = cone1.clone();
        cone4.name = "cone4";
        cone4.position.set(-1.06, -0.5, -1.06);
        scene.add(cone4);
        // right back
        const cone5 = cone1.clone();
        cone5.name = "cone5";
        cone5.position.set(1.06, -0.5, -1.06);
        scene.add(cone5);
        // left front
        const cone6 = cone1.clone();
        cone6.name = "cone6";
        cone6.position.set(-1.06, -0.5, 1.06);
        scene.add(cone6);
        // right front
        const cone7 = cone1.clone();
        cone7.name = "cone7";
        cone7.position.set(1.06, -0.5, 1.06);
        scene.add(cone7);
        // front
        const cone8 = cone1.clone();
        cone8.name = "cone8";
        cone8.position.set(0, -0.5, 1.5);
        scene.add(cone8);
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

camera.position.x = -0.86;
camera.position.z = 3.15;
camera.rotation.y = -0.24;

floorMesh.position.y = -0.55;
floorMesh.scale.x = 20;
floorMesh.scale.y = 0.1;
floorMesh.scale.z = 20;

function animate(t = 0){
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
    //console.log("position: " + camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
    //console.log("rot: " + camera.rotation.y);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);