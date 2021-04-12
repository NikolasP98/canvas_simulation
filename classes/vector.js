export default class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this._x = x;
		this._y = y;
		this._z = z;
	}

	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get z() {
		return this._z;
	}

	add = (otherVector) => {
		return new Vector(
			this._x + otherVector.x,
			this._y + otherVector.y,
			this._z + otherVector.z
		);
	};

	sub(otherVector) {
		return new Vector(
			this._x - otherVector.x,
			this._y - otherVector.y,
			this._z - otherVector.z
		);
	}
	mult(scalar) {
		return new Vector(this._x * scalar, this._y * scalar, this._z * scalar);
	}

	div(scalar) {
		return new Vector(this._x / scalar, this._y / scalar, this._z / scalar);
	}

	magnitude() {
		return Math.sqrt(
			Math.pow(this._x, 2) + Math.pow(this._y, 2) + Math.pow(this._z, 2)
		);
	}

	normalized() {
		return this.div(this.magnitude());
	}

	dist(otherVector) {
		let newVec = this.sub(otherVector);
		return Math.sqrt(Math.pow(newVec.x, 2) + Math.pow(newVec.y, 2));
	}

	limit(max) {
		let mag = Math.pow(this.magnitude(), 2);
		// console.log(this);
		if (mag > Math.pow(max, 2)) {
			return this.normalized().mult(max);
		}
		return this;
	}

	setMagnitude(x) {
		return this.normalized().mult(x);
	}
}
