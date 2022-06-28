import {
	ctx,
	alignSlider,
	cohesionSlider,
	separationSlider,
	checkAlign,
	checkCohesion,
	checkSeparation,
	perceptionSlider,
} from '../main.js';
import Vector from './vector.js';
import { ellipse } from './shapes.js';

export default class Particle {
	constructor(x = 0, y = 0, rad = 1, color = 'white') {
		this.position = new Vector(x, y);
		this.velocity = new Vector(Math.random(), Math.random()).setMagnitude(
			Math.random() * 2 + 2
		);
		this.acceleration = new Vector(0, 0);
		this.radius = rad;
		this.color = color;
		this.maxForce = 0.2;
		this.maxSpeed = 4;
		this.largestRad = 0;
	}

	edges() {
		if (this.position.x > canvas.width) {
			// console.log('invaded right');
			this.position._x = 0;
		} else if (this.position.x < 0) {
			// console.log('invaded left');
			this.position._x = canvas.width;
		}
		if (this.position.y > canvas.height) {
			// console.log('invaded down');
			this.position._y = 0;
		} else if (this.position.y < 0) {
			// console.log('invaded up');
			this.position._y = canvas.height;
		}
	}

	flock(boids) {
		let alignment = this.align(boids).mult(alignSlider.value);
		let cohesion = this.cohesion(boids).mult(cohesionSlider.value);
		let separation = this.separation(boids).mult(separationSlider.value);

		this.acceleration = this.acceleration
			.add(alignment)
			.add(cohesion)
			.add(separation);
	}

	align(boids) {
		let perception = (perceptionSlider.value / this.radius) * 1.2;
		this.largestRad = perception;
		// // view perception radius
		if (checkAlign.checked) {
			ctx.fillStyle = 'rgba(0,0,0,0)';
			ctx.strokeStyle = 'yellow';
			ellipse(this.position.x, this.position.y, perception);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
		}
		let avg = new Vector();
		let amount = 0;
		for (let boid of boids) {
			let d = this.position.dist(boid.position);
			if (d < perception && boid != this) {
				avg = avg.add(boid.velocity);
				amount++;
			}
		}
		if (amount > 0) {
			avg = avg
				.div(amount)
				.setMagnitude(this.maxSpeed)
				.sub(this.velocity)
				.limit(this.maxForce);
		}
		return avg;
	}

	cohesion(boids) {
		let perception = 0.9 * this.largestRad;
		// // view perception radius
		if (checkCohesion.checked) {
			ctx.fillStyle = 'rgba(0,0,0,0)';
			ctx.strokeStyle = 'green';
			ellipse(this.position.x, this.position.y, perception);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
		}
		let avg = new Vector();
		let amount = 0;
		for (let boid of boids) {
			let d = this.position.dist(boid.position);
			if (d < perception && boid != this) {
				avg = avg.add(boid.position);
				amount++;
			}
		}
		if (amount > 0) {
			avg = avg
				.div(amount)
				.sub(this.position)
				.setMagnitude(this.maxSpeed)
				.sub(this.velocity)
				.limit(this.maxForce);
		}
		return avg;
	}

	separation(boids) {
		let perception = 0.25 * this.largestRad;
		// // view perception radius
		if (checkSeparation.checked) {
			ctx.fillStyle = 'rgba(0,0,0,0)';
			ctx.strokeStyle = 'red';
			ellipse(this.position.x, this.position.y, perception);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
		}
		let avg = new Vector();
		let amount = 0;
		for (let boid of boids) {
			let d = this.position.dist(boid.position);
			if (d < perception && boid != this) {
				let diff = this.position.sub(boid.position);
				diff = diff.div(Math.pow(d, 2));
				avg = avg.add(diff);
				amount++;
			}
		}
		if (amount > 0) {
			avg = avg
				.div(amount)
				.setMagnitude(this.maxSpeed)
				.sub(this.velocity)
				.limit(this.maxForce);
		}
		return avg;
	}

	show() {
		ctx.fillStyle = this.color;
		ellipse(this.position.x, this.position.y, this.radius);
	}

	update(boids) {
		this.flock(boids);
		this.position = this.position.add(this.velocity);
		this.edges();
		this.velocity = this.velocity
			.add(this.acceleration)
			.limit(this.maxSpeed);
		this.acceleration = this.acceleration.mult(0);
		this.show();
	}
}
