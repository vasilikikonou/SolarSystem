import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

//Scene
const scene = new THREE.Scene();
export { scene as default };

//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(70, 0, 50);

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
});
renderer.setPixelRatio(2); //smoother sphere
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);

//CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 15;
controls.maxDistance = 80;
controls.enableDamping = true; //more weight
controls.enablePan = false; //not moving around

controls.update();
export { controls };

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);

///Dir Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(-18, 58, 12);
scene.add(directionalLight);

//PLanets
let allplanets =
  [{ name: "Mercury", position: new THREE.Vector3(-50, 0, 50), scale: new THREE.Vector3(0.0022, 0.0022, 0.0022) },
  { name: "Venus", position: new THREE.Vector3(-40, 0, 40), scale: new THREE.Vector3(0.003, 0.003, 0.003) },
  { name: "earth", position: new THREE.Vector3(-30, 0, 30), scale: new THREE.Vector3(0.004, 0.004, 0.004) },
  { name: "Mars", position: new THREE.Vector3(-20, 0, 20), scale: new THREE.Vector3(0.003, 0.003, 0.003) },
  { name: "Jupiter", position: new THREE.Vector3(-10, 0, 10), scale: new THREE.Vector3(0.01, 0.01, 0.01) },
  { name: "Saturn", position: new THREE.Vector3(4, 0, -4), scale: new THREE.Vector3(0.008, 0.008, 0.008) },
  { name: "Uranus", position: new THREE.Vector3(15, 0, -15), scale: new THREE.Vector3(0.005, 0.005, 0.005) },
  { name: "Neptune", position: new THREE.Vector3(25, 0, -25), scale: new THREE.Vector3(0.0049, 0.0049, 0.0049) }];

const loader = new GLTFLoader(); // Create a loader instance

export function loadPlanet(scene, loader, fileName, position, scale) {
  loader.load(`${fileName}.glb`, function (gltf) {
    let planet = gltf.scene;
    planet.position.set(position.x, position.y, position.z); // position
    planet.scale.set(scale.x, scale.y, scale.z); // scale
    scene.add(planet);
    if (fileName == "Saturn") {
      planet.rotateX(Math.PI / 4);//Rotate
    }
  },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );
}

allplanets.forEach(planet => { loadPlanet(scene, loader, planet.name, planet.position, planet.scale); });

//Sun Glow
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85 );
bloomPass.threshold = -2;
bloomPass.strength = 0.5; //intensity of glow
bloomPass.radius = 2;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);

//sun object
const color = new THREE.Color("#FDB813");
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshBasicMaterial({ color: color });
const Sunsphere = new THREE.Mesh(geometry, material);
Sunsphere.position.set(-79, 0, 79);
Sunsphere.scale.set(22, 22, 22);
Sunsphere.layers.set(1);
scene.add(Sunsphere);

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(90, 94, 94);
const gtexture = new THREE.TextureLoader().load("galaxy1.png");

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: gtexture,
  side: THREE.BackSide,
  transparent: true,
});

// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

const animate = () => {
  requestAnimationFrame(animate);
  starMesh.rotation.y += 0.0005;
  bloomComposer.render();
};
animate();

//BloomPass
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);
camera.layers.enableAll(); // Render all layers
bloomComposer.render();

//WINDOW SIZE
window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
