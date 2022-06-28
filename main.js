import Particle from './classes/particle.js';
import { checkbox, slider } from './classes/shapes.js';
import QuadTree from './classes/quadtree.js';

const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

let qtree;
let particlesArray;

export let alignSlider,
	cohesionSlider,
	separationSlider,
	checkAlign,
	checkCohesion,
	checkSeparation,
	sizeSlider,
	perceptionSlider;

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
				Math.random() * sizeSlider.value + 1
			)
		);
	}
	// console.log(particlesArray.length, mouse.x, mouse.y);
});

// change canvas size as browser window resizes
window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
alignSlider = slider(0, 10, 2.5, 0.1, 'aligner', 'slider1');
checkAlign = checkbox(false, undefined, 'slider1', 'checkbox');

cohesionSlider = slider(0, 10, 2.5, 0.1, 'cohesions', 'slider2');
checkCohesion = checkbox(false, undefined, 'slider2', 'checkbox');

separationSlider = slider(0, 10, 2.5, 0.1, 'separator', 'slider3');
checkSeparation = checkbox(false, undefined, 'slider3', 'checkbox');

sizeSlider = slider(1, 9, 5, 0.1, 'size-rand', 'slider4');
perceptionSlider = slider(100, 200, 150, 1, 'perception', 'slider5');
// setup function runs once before animation begins
const setup = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	particlesArray = [];

	qtree = new QuadTree(
		{
			x: 0,
			y: 0,
			width: canvas.width,
			height: canvas.height,
		},
		4
	);

	window.requestAnimationFrame(animate);
};

// animation loop runs indefinately
const animate = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	qtree.clear();

	for (let vec of particlesArray) {
		let p = {
			x: vec.position.x,
			y: vec.position.y,
			width: vec.largestRad * 2,
			height: vec.largestRad * 2,
		};

		qtree.insert({ bounds: p, data: vec });
	}

	for (let vec of particlesArray) {
		let p = {
			x: vec.position.x,
			y: vec.position.y,
			width: vec.largestRad * 2,
			height: vec.largestRad * 2,
		};
		let points = qtree.query(p);
		let others = points.map((x) => x.data);
		vec.update(others);
	}
	qtree.root.draw(ctx);
	window.requestAnimationFrame(animate);
};

window.onload = () => {
	setup();
};
