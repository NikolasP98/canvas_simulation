import { ctx } from '../main.js';
import { cone, ellipse } from './shapes.js';
import Vector from './vector.js';

// debug settings
const settings = {
	alignment: 1,
	showAlignment: false,

	cohesion: 1,
	showCohesion: false,

	separation: 1.5,
	showSeparation: false,

	sizeRandomness: 2.5,
	perception: 25,

	shape: 'ghost',
	closedMap: false,
};

export default class Particle {
	#MAX_STRENGTH = 3;
	static debug = false;

	static sprite;
	static spriteSettings = {
		columns: 4,
		frameWidth: null,
		frameHeight: null,
	};

	constructor(x = 0, y = 0, color = 'white') {
		this.position = new Vector(x, y);
		this.velocity = new Vector(Math.random(), Math.random()).setMagnitude(
			Math.random() * 4 - 2
		);
		this.acceleration = new Vector();
		this.theta = this.velocity.getAngle();
		this.radius = Math.random() * settings.sizeRandomness * 5 + 5;
		this.color = color;
		this.maxForce = 0.02;
		this.maxSpeed = 1;
		this.largestRad = 0;

		this.currentFrame = 0;
		this.spriteX = 0;

		this.loadSprite();
	}

	static debugger(gui) {
		// Debugging
		if (!this.debug) {
			this.debug = true;
			const boidFolder = gui.addFolder('Boid');

			boidFolder.add(settings, 'cohesion', 0.1, 3, 0.1).name('Cohesion');
			boidFolder.add(settings, 'showCohesion').name('Show Cohesion');
			boidFolder
				.add(settings, 'alignment', 0.1, 3, 0.1)
				.name('Alignment');
			boidFolder.add(settings, 'showAlignment').name('Show Alignment');
			boidFolder
				.add(settings, 'separation', 0.1, 3, 0.1)
				.name('Separation');
			boidFolder.add(settings, 'showSeparation').name('Show Separation');
			boidFolder
				.add(settings, 'perception', 0.1, 100, 0.1)
				.name('Perception Radius');
			boidFolder
				.add(settings, 'shape', {
					Ghost: 'ghost',
					Triangle: 'triangle',
					Circle: 'circle',
					Square: 'square',
				})
				.name('Boid Shape');

			boidFolder
				.add(settings, 'sizeRandomness', 0, 10, 0.1)
				.name('Size Randomness');

			// TODO: toggle teleport or "bounce" off edges
			boidFolder.add(settings, 'closedMap').name('Repel from Walls');
		}
	}

	loadSprite() {
		if (!Particle.sprite) {
			Particle.sprite = new Image();

			Particle.sprite.onload = () => {
				Particle.spriteSettings.frameWidth =
					Particle.sprite.width / Particle.spriteSettings.columns;
				Particle.spriteSettings.frameHeight = Particle.sprite.height;
			};

			Particle.sprite.src = './assets/ghost.png';
		}
	}

	edges() {
		// TODO: toggle teleport or "bounce" off edges
		if (this.position.x > canvas.width) {
			// console.log('invaded right');
			this.position.x = 0;
		} else if (this.position.x < 0) {
			// console.log('invaded left');
			this.position.x = canvas.width;
		}
		if (this.position.y > canvas.height) {
			// console.log('invaded down');
			this.position.y = 0;
		} else if (this.position.y < 0) {
			// console.log('invaded up');
			this.position.y = canvas.height;
		}
	}

	flock(boids) {
		const separation = this.separation(boids).mult(settings.separation);
		const alignment = this.alignment(boids).mult(settings.alignment);
		const cohesion = this.cohesion(boids).mult(settings.cohesion);

		this.acceleration.add(separation).add(alignment).add(cohesion);
	}

	seek(target) {
		const desired = Vector.sub(target, this.position);
		desired.normalize().mult(this.maxSpeed);

		const steer = Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);
		return steer;
	}

	cohesion(boids) {
		const perception = (settings.perception * this.radius) / 2;
		this.largestRad = perception;

		// draw: view perception radius
		if (settings.showCohesion) {
			const str = settings.cohesion / (this.#MAX_STRENGTH * 4);
			ctx.fillStyle = `rgba(0,255,0,${str})`;
			ctx.strokeStyle = 'rgb(0,255,0)';
			cone(this.position.x, this.position.y, perception, this.theta);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
		}
		// end draw: view perception radius

		const avg = new Vector();
		let amount = 0;

		if (!boids.length) {
			return avg;
		}

		for (let boid of boids) {
			let d = this.position.dist(boid.position);
			if (d < perception && boid != this) {
				avg.add(boid.position);
				amount++;
			}
		}
		if (amount > 0) {
			avg.div(amount);
			return this.seek(avg);
		}
		return avg;
	}

	alignment(boids) {
		const perception = this.radius + 0.3 * this.largestRad;

		// draw: view perception radius
		if (settings.showAlignment) {
			const str = settings.alignment / (this.#MAX_STRENGTH * 4);
			ctx.fillStyle = `rgba(255,255,0,${str})`;
			ctx.strokeStyle = 'rgb(255,255,0)';
			cone(this.position.x, this.position.y, perception, this.theta);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
		}
		// end draw: view perception radius

		const avg = new Vector();
		let amount = 0;

		if (!boids.length) {
			return avg;
		}

		for (let boid of boids) {
			const d = this.position.dist(boid.position);

			if (d < perception && boid != this) {
				avg.add(boid.velocity);
				amount++;
			}
		}

		if (amount > 0) {
			avg.div(amount)
				.normalize()
				.mult(this.maxSpeed)
				.sub(this.velocity)
				.limit(this.maxForce);
		}
		return avg;
	}

	separation(boids) {
		const perception = this.radius + 0.1 * this.largestRad;

		// draw: view perception radius
		if (settings.showSeparation) {
			const str = settings.separation / (this.#MAX_STRENGTH * 4);
			ctx.fillStyle = `rgba(255,0,0,${str})`;
			ctx.strokeStyle = 'rgb(255,0,0)';
			cone(this.position.x, this.position.y, perception, this.theta);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
		}
		// end draw: view perception radius

		const avg = new Vector();
		let amount = 0;

		if (!boids.length) {
			return avg;
		}

		for (let boid of boids) {
			let d = this.position.dist(boid.position);
			if (d < perception && boid != this) {
				let diff = Vector.sub(this.position, boid.position);
				diff.normalize().div(d);
				avg.add(diff);
				amount++;
			}
		}
		if (amount > 0) {
			avg.div(amount)
				.normalize()
				.mult(this.maxSpeed)
				.sub(this.velocity)
				.limit(this.maxForce);
		}
		return avg;
	}

	drawShape(shape) {
		if (shape === 'circle') {
			ellipse(this.position.x, this.position.y, this.radius);
		} else if (shape === 'triangle') {
			ctx.beginPath();
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.rotate(this.theta);
			ctx.moveTo(-this.radius, -this.radius / 1.5);
			ctx.lineTo(-this.radius, this.radius / 1.5);
			ctx.lineTo(this.radius, 0);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			ctx.restore();
		} else if (shape === 'square') {
			ctx.fillRect(
				this.position.x,
				this.position.y,
				this.radius,
				this.radius
			);
		} else if (shape === 'ghost') {
			// TODO: ghost is off-center

			if (this.currentFrame % 60 == 0) {
				if (this.spriteX < 2) this.spriteX++;
				else this.spriteX = 0;
			}

			ctx.drawImage(
				Particle.sprite,
				this.spriteX * Particle.spriteSettings.frameWidth,
				0,
				Particle.spriteSettings.frameWidth,
				Particle.spriteSettings.frameHeight,
				this.position.x - this.radius,
				this.position.y - this.radius,
				this.radius * 2,
				this.radius * 2
			);

			// ctx.strokeStyle = '#fff';

			// ctx.beginPath();
			// ctx.rect(
			// 	this.position.x - this.radius,
			// 	this.position.y - this.radius,
			// 	this.radius * 2,
			// 	this.radius * 2
			// );
			// ctx.closePath();
			// ctx.stroke();

			this.currentFrame++;
		}
	}

	show() {
		ctx.fillStyle = this.color;
		ctx.strokeStyle = 'rgba(0,0,0)';
		// this.drawShape(settings.shape);
		this.drawShape(settings.shape);
	}

	update(boids) {
		this.theta = this.velocity.getAngle();

		this.flock(boids);
		this.position.add(this.velocity);
		this.edges();
		this.velocity.add(this.acceleration).limit(this.maxSpeed);
		this.acceleration.mult(0);
		this.show();
	}
}
