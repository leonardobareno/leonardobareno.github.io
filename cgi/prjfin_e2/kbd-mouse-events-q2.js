/* 
 * Rutinas para manejo de mouse y teclado, extraidos de:
 * http://media.tojicode.com/q2bsp/
 */

/*
 * Copyright (c) 2009 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */
 
			var zAngle = 0;
			var xAngle = Math.PI/2;
			//var cameraPosition = [-1024, -512, -512];
			var cameraPosition = [-20.0, 0.0, -50.0];
			
			var escalaRotacion = 0.006;
 
function getAvailableContext(canvas, contextList) {
	if (canvas.getContext) {
		for(var i = 0; i < contextList.length; ++i) {
			try {
				var context = canvas.getContext(contextList[i]);
				if(context != null)
					return context;
			} catch(ex) { }
		}
	}
	return null;
}

	//from glMatrix-min.js
    function multiplyVec3(c,a,b,c){
	c||(c=b);
	var d=b[0],e=b[1];
	b=b[2];
	c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];
	c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];
	c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];
	return c;
	}			
			
			// Set up event handling
			function initEvents() {
				var movingModel = false;
				var lastX = 0;
				var lastY = 0;
				
				var speed = 0.8;
				var pressed = new Array(128);
				var cameraMat = mat4.create();
				
				$(window).keydown(function(event) {
					pressed[event.keyCode] = true;
				});
				
				$(window).keyup(function(event) {
					pressed[event.keyCode] = false;
				});
					
				setInterval(function() {
					// This is our first person movement code. It's not really pretty, but it works
					var dir = [0, 0, 0];
					if(pressed['W'.charCodeAt(0)]) {
						//console.log("kbd W");
						dir[2] += speed;
					}
					if(pressed['S'.charCodeAt(0)]) {
						//console.log("kbd S");
						dir[2] -= speed;
					}
					if(pressed['A'.charCodeAt(0)]) {
						dir[0] += speed;
					}
					if(pressed['D'.charCodeAt(0)]) {
						dir[0] -= speed;
					}
					if(pressed['E'.charCodeAt(0)]) {
						dir[1] += speed;
					}
					if(pressed['Q'.charCodeAt(0)]) {
						dir[1] -= speed;
					}
					
					mat4.identity(cameraMat);
					mat4.rotateX(cameraMat,cameraMat, xAngle-Math.PI/2);
					mat4.rotateY(cameraMat,cameraMat, zAngle);//Y es el Up
					mat4.invert(cameraMat, cameraMat);
					
					multiplyVec3(cameraMat, cameraMat, dir);
					vec3.add(cameraPosition, cameraPosition, dir);
				}, 33);
				
				$('#glcanvas').mousedown(function(event) {
					//console.log("mousedown");
					if(event.which == 1) {
						movingModel = true;
					}
					lastX = event.pageX;
					lastY = event.pageY;
				});
				
				$('#glcanvas').mouseup(function(event) {
					movingModel = false;
				});
				
				$('#glcanvas').mousemove(function(event) {
					//console.log("mousemove " + movingModel);
					var xDelta = event.pageX  - lastX;
					var yDelta = event.pageY  - lastY;
					lastX = event.pageX;
					lastY = event.pageY;
					
					if (movingModel) {
						zAngle += xDelta*escalaRotacion;
						while (zAngle < 0)
							zAngle += Math.PI*2;
						while (zAngle >= Math.PI*2)
							zAngle -= Math.PI*2;
							
						xAngle += yDelta*escalaRotacion;
						while (xAngle < 0)
							xAngle = 0;
						while (xAngle > Math.PI*2)
							xAngle = Math.PI*2;
						
						//console.log(xAngle + "|" + zAngle);
					}
				});
				
				
			}
