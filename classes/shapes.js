import { ctx } from '../main.js';

export const cone = (x, y, rad, theta = 0) => {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, rad, theta - Math.PI / 6, theta + Math.PI / 6);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
};

export const ellipse = (x, y, rad) => {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
};
