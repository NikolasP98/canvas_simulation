import Particle from './classes/particle.js';
import QuadTree from './classes/quadtree.js';

const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

let qtree;
let particlesArray = [];
let drawQuadtree = document.getElementById('quadtree');

export const settings = {
	alignment: 2.5,
	showAlignment: true,

	cohesion: 2.5,
	showCohesion: true,

	separation: 2.5,
	showSeparation: true,

	sizeRandomness: 2.5,
	perception: 2.5,

	shape: 'triangle',
};

const mouse = {
	x: null,
	y: null,
	radius: 10,
};

export const getControls = (obj) => {
	obj.alignment =
		parseFloat(document.getElementById('alignment').value) || 2.5;
	obj.showAlignment =
		document.getElementById('alignment-check').checked || false;

	obj.cohesion = parseFloat(document.getElementById('cohesion').value) || 2.5;
	obj.showCohesion =
		document.getElementById('cohesion-check').checked || false;

	obj.separation =
		parseFloat(document.getElementById('separation').value) || 2.5;
	obj.showSeparation =
		document.getElementById('separation-check').checked || false;

	obj.sizeRandomness =
		parseFloat(document.getElementById('size-randomness').value) || 2.5;
	obj.perception =
		parseFloat(document.getElementById('perception').value) || 2.5;

	obj.shape = document.getElementById('boid-shape').value || 'triangle';
};

// setup function runs once before animation begins
const setup = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	particlesArray = [];

	qtree = new QuadTree({
		x: 0,
		y: 0,
		width: canvas.width,
		height: canvas.height,
	});

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
			width: vec.radius * 2,
			height: vec.radius * 2,
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

	if (drawQuadtree.checked) {
		qtree.root.draw(ctx);
	}

	window.requestAnimationFrame(animate);
};

/* ---------------------------
   ----- EVENT LISTENERS -----
   --------------------------- */

// run setup function
window.onload = () => {
	setup();
};

// change canvas size as browser window resizes
window.addEventListener('resize', () => {
	setup();
});

// add particles to clicked coordinate
canvas.addEventListener('click', (e) => {
	mouse.x = e.x;
	mouse.y = e.y;

	for (let i = 0; i < 5; i++) {
		particlesArray.push(
			new Particle(
				mouse.x + Math.random() * 50,
				mouse.y + Math.random() * 50,
				Math.random() * settings.sizeRandomness * 5 + 5
			)
		);
	}
});
