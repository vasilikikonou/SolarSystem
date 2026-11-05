import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import scene from "./main.js";
import { loadPlanet, controls } from './main.js';

//Load Planets and Buttons
document.addEventListener("DOMContentLoaded", function () {
  const buttons = ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
  buttons.forEach((buttonName, i) => {
    document.getElementById(buttonName).addEventListener("click", () => loadSelectedPlanet(allplanets[i]));
  });
});

function loadSelectedPlanet(planetData) {
  if (scene.children.length > 0) {
    clearScene(); // Clear the scene if there's an existing planet
  }
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  ambientLight.position.set(0, 0, 0);
  scene.add(ambientLight);
  loadPlanet(scene, new GLTFLoader(), planetData.name, new THREE.Vector3(0, 0, 0), planetData.scale);
  controls.enableZoom = false;

//STARS
  function addStar() {
    const geometry = new THREE.SphereGeometry(0.1, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
  
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(200));
  
    star.position.set(x, y, z);
    scene.add(star);
  }
  
  Array(1500).fill().forEach(addStar); 
}

function clearScene() {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
}

//PLanets
let allplanets =
  [{ name: "sun", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(2.5, 2.5, 2.5) },
  { name: "Mercury", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) },
  { name: "Venus", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) },
  { name: "earth", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) },
  { name: "Mars", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) },
  { name: "Jupiter", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) },
  { name: "Saturn", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) },
  { name: "Uranus", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) },
  { name: "Neptune", position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(0.05, 0.05, 0.05) }
  ];

//HOME BUTTON
document.addEventListener("DOMContentLoaded", function () {
  const homeButton = document.getElementById("homeButton");
  // Each page load starts with the full solar system, including on GitHub Pages.
  homeButton.style.visibility = 'hidden';
  const navbarItems = document.querySelectorAll(".navbar a");  // Select all links inside navbar

  // Add click event listener to all navbar links
  navbarItems.forEach(function (item) {
    item.addEventListener("click", function () {
      homeButton.style.visibility = 'visible'; // Show button on any navbar click
    });
  });

  // Function to navigate to home page
  function goToHomePage() {
    window.location.href = import.meta.env.BASE_URL;
  }

  document.getElementById("homeButton").addEventListener("click", goToHomePage);
});
