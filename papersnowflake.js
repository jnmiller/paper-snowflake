var canvas = document.getElementById("snowflakeCanvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var c = [w/2, h/2];
var r = Math.min(w,h)
var m = r/20;

function drawBackground() {
	// folded triangle for reference
	ctx.strokeStyle = "#DDD";
	ctx.beginPath();
	ctx.fillStyle = "#DDD";
	ctx.moveTo(c[0], c[1]);
	ctx.lineTo(c[0], m);
	ctx.lineTo(c[0] + (r/2-m)*Math.cos(-60*Math.PI/180), c[1] + (r/2-m)*Math.sin(-60*Math.PI/180));
	ctx.stroke();
	ctx.fill();
	ctx.closePath();

	// draw 5 more axes (arm centerlines) for reference
	ctx.save();
	for(i = 0; i < 5; i++) {
		ctx.translate(c[0], c[1]);
		ctx.rotate(60*Math.PI/180);
		ctx.translate(-c[0], -c[1]);
		ctx.beginPath();
		ctx.moveTo(c[0], c[1]);
		ctx.lineTo(c[0], m);
		ctx.stroke();
		ctx.closePath();
	}
	ctx.restore();
	ctx.strokeStyle = "#AACCEE";
}

function eraseCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground();
}

function isInTriangle(x, y) {
	return x >= c[0] && 
		(c[1]-y) >= Math.tan(60*Math.PI/180)*(x - c[0]) &&
		(c[1]-y) <= Math.tan(-15*Math.PI/180)*(x - c[0]) + r/2-m;
}

function draw(cvs, x, y) {
    cvs.getContext("2d").lineTo(x, y);
    cvs.getContext("2d").stroke();
}

var prevX = 0;
var prevY = 0;

canvas.addEventListener("mousedown", function(e) {
	prevX = e.pageX - this.offsetLeft;
	prevY = e.pageY - this.offsetTop;

	this.getContext("2d").moveTo(
		prevX,
		prevY
	);
	ctx.beginPath();
}, false);

canvas.addEventListener("mouseup", function(e) {
	ctx.closePath();
}, false);

canvas.addEventListener("mousemove", function (e) {
    // if button is down AND we are inside the triangle, then draw.
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    if(e.buttons == 1 && isInTriangle(x, y)) {
    	ctx.save();
    	// draw each of the 6 arms
    	for(i = 0; i < 6; i++) {

	    	// initial half-section
	    	ctx.translate(c[0], c[1]);
	    	ctx.rotate((i == 0? 0 : 60)*Math.PI/180);
	    	ctx.translate(-c[0], -c[1]);
	    	ctx.moveTo(prevX, prevY);
	    	draw(this, x, y);
			ctx.save();
	    	
	    	// reflection
	    	ctx.translate(c[0], c[1]);
			ctx.scale(-1, 1);
			ctx.translate(-c[0], -c[1]);
			ctx.moveTo(prevX, prevY);
	    	draw(this, x, y);
			ctx.restore();
	    }
    	
    	prevX = x;
    	prevY = y;
    	ctx.restore();
    }
}, false);

drawBackground();