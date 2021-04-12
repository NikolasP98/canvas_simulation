import Particle from './classes/particle.js';
import { slider, checkbox } from './classes/shapes.js';

const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

let particlesArray;

export let alignSlider,
	cohesionSlider,
	separationSlider,
	checkAlign,
	checkCohesion,
	checkSeparation;

const mouse = {
	x: null,
	y: null,
	radius: 10,
};

// add particles to clicked coordinate
canvas.addEventListener('click', (e) => {
	mouse.x = e.x;
	mouse.y = e.y;
	for (let i = 0; i < 10; i++) {
		particlesArray.push(
			new Particle(
				mouse.x + Math.random() * 5,
				mouse.y + Math.random() * 5,
				Math.random() * 2 + 1
			)
		);
	}
	console.log(particlesArray.length, mouse.x, mouse.y);
});

// change canvas size as browser window resizes
window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
// setup function runs once before animation begins
const setup = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	particlesArray = [];
	alignSlider = slider(0, 5, 1, 0.1, 'controls');
	checkAlign = checkbox(false, 'controls');
	cohesionSlider = slider(0, 5, 1, 0.1, 'controls');
	checkCohesion = checkbox(false, 'controls');
	separationSlider = slider(0, 5, 1, 0.1, 'controls');
	checkSeparation = checkbox(false, 'controls');

	window.requestAnimationFrame(animate);
};

// animation loop runs indefinately
const animate = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// particlesArray = particlesArray
	// 	.filter((x) => x.position.y < canvas.height)
	// 	.filter((x) => x.position.x < canvas.width);

	for (const vec of particlesArray) {
		vec.edges();
		vec.flock(particlesArray);
	}
	for (const vec of particlesArray) {
		vec.update();
	}

	// console.log(vec.position.x);
	// console.log(innerWidth);
	window.requestAnimationFrame(animate);
};

setup();
