const canvas = document.getElementById('my3dCanvas');
const ctx = canvas.getContext('2d');

import * as THREE from "three";

const w = canvas.width;
const h = canvas.height;

const renderer = new THREE.WebGLRenderer({ antialias : true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);