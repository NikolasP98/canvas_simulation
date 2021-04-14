import { ctx } from '../main.js';

export class Point {
	constructor(x, y, data = undefined) {
		this._x = x;
		this._y = y;
		this._data = data;
	}

	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get data() {
		return this._data;
	}

	// Pythagorus: a^2 = b^2 + c^2
	distance(point) {
		const dx = point.x - this._x;
		const dy = point.y - this._y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	show(color = 'white') {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
		ctx.fill();
	}
}

export class Circle {
	constructor(x, y, r) {
		this._x = x;
		this._y = y;
		this._r = r;
		this.rSq = r * r;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get r() {
		return this._r;
	}
	contains(point) {
		// check if the point is in the circle by checking if the euclidean distance of
		// the point and the center of the circle if smaller or equal to the radius of
		// the circle
		let d = Math.pow(point.x - this._x, 2) + Math.pow(point.y - this._y, 2);
		return d <= this.rSq;
	}

	intersects(range) {
		let xDist = Math.abs(range.x - this._x);
		let yDist = Math.abs(range.y - this._y);

		// radius of the circle
		let r = this._r;

		let w = range.w / 2;
		let h = range.h / 2;

		let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

		// no intersection
		if (xDist > r + w || yDist > r + h) return false;

		// intersection within the circle
		if (xDist <= w || yDist <= h) return true;

		// intersection on the edge of the circle
		return edges <= this.rSquared;
	}

	show(color = 'white') {
		ctx.strokeStyle = color;
		ctx.fillStyle = 'rgba(0,0,0,0)';

		ctx.beginPath();
		ctx.arc(this._x, this._y, this._r, 0, Math.PI * 2);
		ctx.stroke();
	}
}

export class Rectangle {
	constructor(x, y, w, h) {
		this._x = x;
		this._y = y;
		this._w = w;
		this._h = h;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get w() {
		return this._w;
	}
	get h() {
		return this._h;
	}

	contains(point) {
		return (
			point.x >= this._x - this._w &&
			point.x <= this._x + this._w &&
			point.y >= this._y - this._h &&
			point.y <= this._y + this._h
		);
	}

	intersects(range) {
		return !(
			range.x - range.w > this._x + this._w ||
			range.x + range._w < this._x - this._w ||
			range.y - range.h > this._y + this._h ||
			range.y + range._h < this._y - this._h
		);
	}
	show(color = 'white') {
		ctx.strokeStyle = color;

		ctx.strokeRect(
			this._x - this._w,
			this._y - this._h,
			this._w * 2,
			this._h * 2
		);
	}
}

export class QuadTree {
	constructor(boundary, capacity = 4) {
		this.boundary = boundary;
		this.capacity = capacity;
		this.points = [];
		this.divided = false;
	}

	get children() {
		if (this.divided) {
			return [this.ne, this.nw, this.se, this.sw];
		} else {
			return [];
		}
	}

	set bounds(bound) {
		this.boundary = bound;
	}

	subdivide() {
		const x = this.boundary.x;
		const y = this.boundary.y;
		const w = this.boundary.w;
		const h = this.boundary.h;

		const tr = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
		const tl = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
		const br = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
		const bl = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);

		this.ne = new QuadTree(tr, this.capacity);
		this.nw = new QuadTree(tl, this.capacity);
		this.se = new QuadTree(br, this.capacity);
		this.sw = new QuadTree(bl, this.capacity);

		this.divided = true;
	}

	insert(point) {
		if (!this.boundary.contains(point)) {
			return false;
		}
		if (this.points.length < this.capacity) {
			this.points.push(point);
			return true;
		} else {
			if (!this.divided) {
				console.log('subdivided');
				this.subdivide();
			}
			return (
				this.ne.insert(point) ||
				this.nw.insert(point) ||
				this.se.insert(point) ||
				this.sw.insert(point)
			);
		}
	}

	query(range, found) {
		if (!found) {
			found = [];
		}
		if (!range.intersects(this.boundary)) {
			return found;
		} else {
			for (let p of this.points) {
				if (range.contains(p)) {
					found.push(p);
				}
			}
			if (this.divided) {
				this.ne.query(range, found);
				this.nw.query(range, found);
				this.se.query(range, found);
				this.sw.query(range, found);
			}
		}
		return found;
	}

	show() {
		this.boundary.show();

		if (this.divided) {
			this.ne.show();
			this.nw.show();
			this.se.show();
			this.sw.show();
		}
		for (let p of this.points) {
			p.show();
		}
	}
}
