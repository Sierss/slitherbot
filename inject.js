//the attempt//

//makes sure it doesn't loop into itself
var redraw_;
if (!redraw_) redraw_ = redraw;

render_mode = 1;
var foodrel;
var closestfood;
//executes additional after the original function is done
var redraw = function() {
	redraw_();

	//the canvas
	var c = mc.getContext("2d");
	
	//mid of screen
	var mx = mc.width/2;
	var my = mc.height/2;
	c.fillStyle = "#000000";
	c.fillRect(mx-5,my-5,10,10);//center the square

	//loop through each snake
	for(var i=0,max=snakes.length;i<max;i++) {
		var snake = snakes[i];

		//the accurate snake head position reconstruction
		//now longer experimental -- implementing line 2022 beautified from redraw() render_mode == 1; recompiling snake position accurately
		var x = mx + (snake.xx + snake.fx - view_xx) * gsc; // line 2036
		var y = my + (snake.yy + snake.fy - view_yy) * gsc;
		c.fillStyle = "#00FFFF";
		c.fillRect(x-5,y-5,10,10);

		//Precedes SUPER EXPERIMENTAL
		c.beginPath();
		c.moveTo(x, y);

		//draw the tail of each snake
		for (var f=snake.pts.length-1,fmin=0;f>=fmin&&f>=snake.pts.length-Math.floor(snake.cfl);f--) {
			//EXPERIMENTAL -- snake head method does not seem to work out the same way for the tail
			//todo: reverse engineer this line of code: 2047 
			var pt = snake.pts[f];
			var ptx = mx + (pt.xx + pt.fx - view_xx) * gsc;
			var pty = my + (pt.yy + pt.fy - view_yy) * gsc;
			c.fillStyle = "#000000";
			c.fillRect(ptx-5,pty-5,10,10);
		}
		c.stroke();
	}
	//relative food positions
	foodrel = [];

	//draw the food
	for (var i=0,max=foods.length;i<max;i++) {
		var food = foods[i];
		if (food === null) continue;
		var x = mx + (food.xx - view_xx)*gsc;
		var y = my + (food.yy - view_yy)*gsc;
		c.fillStyle = "#FF00FF";
		c.fillRect(x-5,y-5,10,10);

		foodrel.push([x,y]);
	}
	//find the closest food
	closestfood = [];
	var closestdistance = 10000;
	for (var i=0,max=foodrel.length;i<max;i++){
		var x = foodrel[i][0];
		var y = foodrel[i][1];
		var distance = Math.sqrt(Math.pow(x-mx,2)+Math.pow(y-my,2));
		if (closestdistance > distance) {
			closestfood = [x,y];
			closestdistance = distance;
		}
	}

	//draw line to closest food
	c.strokeStyle="#FFFFFF";
	c.beginPath();
	c.moveTo(mx,my);
	c.lineTo(closestfood[0],closestfood[1]);
	c.stroke();

	//move mouse to best position
	movemouse(closestfood[0],closestfood[1]);
}


window.onmousemove = function() {
	//original code is over written for the bot
	/*window.onmousemove = function(b) {
	 (b = b || window.event) && "undefined" != typeof b.clientX && (xm = b.clientX - ww / 2, ym = b.clientY - hh / 2)
	};*/
};
//control mouse 
movemouse = function(x,y) {
	sx = x*window.innerWidth/mc.width;
	sy = y*window.innerHeight/mc.height;
	xm = sx - ww / 2, ym = sy - hh / 2;
	var c = mc.getContext("2d");
	//supposed to be
	c.beginPath();
	c.arc(x, y, 5, 0, 2 * Math.PI, false);
	c.fillStyle = '#0000FF';
	c.fill();
	c.stroke();
}
