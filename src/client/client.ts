import { Voxel } from "./Entities/Voxel";
import * as THREE from "three";
// import Stats from "three/examples/jsm/libs/stats.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
// import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
// import { inherits } from "util";

let container, stats;

let worldDepth = 200,
  worldWidth = 200;

let camera: THREE.PerspectiveCamera,
  controls,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  mesh: THREE.Mesh;

function init(): void {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x00ff00);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let far = 20000;

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    far
  );
  camera.position.set(0, 0, 1000);
  camera.rotation.x = Math.PI / 2;

  scene = new THREE.Scene();

  let light = new THREE.AmbientLight(0xffffff, 0.5);
  let pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.z = 2000;

  const voxel = new Voxel();

  const heightMap = generateHeightMap();

  // add voxels
  for (let x = 0; x < worldWidth; x++)
    for (let y = 0; y < worldDepth; y++) {
      voxel.addToScene(
        scene,
        x * 100 - (worldWidth / 2) * 100,
        y * 100 - (worldDepth / 2) * 100,
        getHeightMap(heightMap, x, y)
      );
    }

  // // add control
  // let controls = new FirstPersonControls(camera, renderer.domElement);
  // controls.lookAt(worldWidth, worldDepth, 1000);

  scene.add(light);
  scene.add(pointLight);
  renderer.render(scene, camera);
  window.addEventListener("keydown", onKeyPress);
}

function render(): void {
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function generateHeightMap(): number[] {
  const data = [],
    perlin = new ImprovedNoise(),
    size = worldWidth * worldDepth,
    z = Math.random() * 100;

  let quality = 2;

  // loop over and add same noise values
  for (let j = 0; j < 4; j++) {
    if (j === 0) for (let i = 0; i < size; i++) data[i] = 0;

    for (let i = 0; i < size; i++) {
      const y = i % worldWidth,
        x = (i / worldDepth) | 0;
      data[i] += perlin.noise(x / quality, y / quality, z) * quality;
    }

    quality *= 4;
  }

  return data;
}

function onKeyPress(event: KeyboardEvent): void {
  const offset = 100;
  if (event.key === "w") {
    camera.position.y += offset;
  }
  if (event.key === "a") {
    camera.position.x -= offset;
  }
  if (event.key === "s") {
    camera.position.y -= offset;
  }
  if (event.key === "d") {
    camera.position.x += offset;
  }
}

function getHeightMap(heightMap: number[], x: number, y: number): number {
  return heightMap[x * worldWidth + worldDepth] * 20;
}

init();
render();
