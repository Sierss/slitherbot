//the attempt//

//makes sure it doesn't loop into itself
var redraw_;
if (!redraw_) redraw_ = redraw;
var botControl = true;
render_mode = 1;
var foodRel;
var closestFood;
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

		//draw head angle
		getSnakeheadAngle(c,snake);

		//the accurate snake head position reconstruction
		//implementing line 2022 beautified from redraw() render_mode == 1; recompiling snake position accurately
		var x = mx + (snake.xx + snake.fx - view_xx) * gsc; // line 2036
		var y = my + (snake.yy + snake.fy - view_yy) * gsc;
		c.fillStyle = "#00FFFF";
		c.fillRect(x-5,y-5,10,10);

		//Precedes SUPER EXPERIMENTAL
		c.beginPath();
		c.moveTo(x, y);

		//draw the tail of each snake
		for (var f=snake.pts.length-1,fmin=0;f>=fmin&&f>=snake.pts.length-snake.cfl;f--) {
			var pt = snake.pts[f];
			var ptx = mx + (pt.xx + pt.fx - view_xx) * gsc;
			var pty = my + (pt.yy + pt.fy - view_yy) * gsc;
			c.fillStyle = "#000000";
			c.fillRect(ptx-5,pty-5,10,10);
		}
		c.stroke();
	}
	//relative food positions
	foodRel = [];

	//draw the food
	for (var i=0,max=foods.length;i<max;i++) {
		var food = foods[i];
		if (food === null) continue;
		var x = getScreenX(food.xx);
		var y = getScreenY(food.yy);
		//c.fillStyle = "#FF00FF";
		//c.fillRect(x-5,y-5,10,10);
		c.font="20px Georgia";
		c.fillStyle = "#FF0000";
		c.fillText(food.cv2,x,y);

		foodRel.push([x,y]);
	}

	//find the closest food
	closestFood = findClosestFood(foodRel, mx, my);

	//draw line to closest food
	c.strokeStyle="#FFFFFF";
	c.beginPath();
	c.moveTo(mx,my);
	c.lineTo(closestFood[0],closestFood[1]);
	c.stroke();

	//move mouse to best position
	moveMouse(closestFood[0],closestFood[1]);
}

function findClosestFood(foodscreenpos, x, y) {
	var closestFood = [];
	var closestdistance = 10000;
	for (var i=0,max=foodscreenpos.length;i<max;i++){
		var foodx = foodscreenpos[i][0];
		var foody = foodscreenpos[i][1];
		var distance = Math.sqrt(Math.pow(foodx-x,2)+Math.pow(foody-y,2));
		if (closestdistance > distance) {
			closestFood = [foodx,foody];
			closestdistance = distance;
		}
	}
	return closestFood;
}
function getSnakeheadAngle(c,snake) {
	//mid of screen
	var mx = mc.width/2;
	var my = mc.height/2;

	//radius of the line coming out of the snakes head for direction pointer
	var r = 100;

	//snake head ehang == wang for other snakes except self
	var x = getScreenX(snake.xx + snake.fx);
	var y = getScreenY(snake.yy + snake.fy);
	var x1 = x+r*Math.cos(snake.wehang);
	var y1 = y+r*Math.sin(snake.wehang);
	var x2 = x+r*Math.cos(snake.wang);
	var y2 = y+r*Math.sin(snake.wang);
	var x3 = x+r*Math.cos(snake.ang);
	var y3 = y+r*Math.sin(snake.ang);

	//draw the line
	c.strokeStyle="#FFFFFF";
	c.beginPath();
	c.moveTo(x,y);
	c.lineTo(x1,y1);
	c.stroke();

	//what way the snake wants to go (not mouse) //not showing for other snakes
	c.strokeStyle="#FF0000";
	c.beginPath();
	c.moveTo(x,y);
	c.lineTo(x2,y2);
	c.stroke();

	//jumpy way the snake is pointing
	c.strokeStyle="#FFFF00";
	c.beginPath();
	c.moveTo(x,y);
	c.lineTo(x3,y3);
	c.stroke();
}
window.onmousemove = function(b) {
	//original code is over written for the bot
	if (botControl) return;
	(b = b || window.event) && "undefined" != typeof b.clientX && (xm = b.clientX - ww / 2, ym = b.clientY - hh / 2)
};

//control mouse 
moveMouse = function(x,y) {
	if (!botControl) return;
	//screen to game coordinates
	sx = x*window.innerWidth/mc.width;
	sy = y*window.innerHeight/mc.height;
	xm = sx - ww / 2, ym = sy - hh / 2;//xm and ym are read by the slither

	var c = mc.getContext("2d");
	//supposed to be
	c.beginPath();
	c.arc(x, y, 5, 0, 2 * Math.PI, false);
	c.fillStyle = '#0000FF';
	c.fill();
	c.stroke();
}

//game coordinates to screen cordinates
function getScreenX(gameX) {
	return mc.width/2 + (gameX - view_xx) * gsc;
}
function getScreenY(gameY) {
	return mc.height/2 + (gameY - view_yy) * gsc;
}
