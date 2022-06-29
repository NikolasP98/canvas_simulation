import { ctx } from '../main.js';

export const ellipse = (x, y, rad) => {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
};
