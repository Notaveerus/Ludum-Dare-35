$(document).ready(function() {
  Crafty.init();
  Crafty.canvas();

    Crafty.background("black")
    Crafty.e("mouseTracking, 2D, Mouse, Touch, Canvas")
       .attr({ w:1000, h:1000, x:0, y:0 })
       .bind("MouseMove", function(e)
       {
             console.log("MouseDown:"+ e.x +","+e.y);
            //get hero
             var pos1 = {
               x: e.x,
               y: e.y
             }
             var pos2 = {
               x: player.x,
               y: player.y
             }
             player.rotation = 0;
             player.rotation = -Engine.degree(pos1, pos2);


         });

    var score = Crafty.e("2D, DOM, Text")
      .text("Score: 0")
      .attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
      .css({color: "#fff"});
    var player = Crafty.e("2D, Canvas, Controls, Collision, Fourway, Mouse")
      player.attr({x: Crafty.viewport.width/2, y: Crafty.viewport.height/2, h:100, w:100})
      player.addComponent('Color').color("#F00")
      .origin("center")
      .fourway(10)
      .bind("enterframe", function(){
        if(this._x > Crafty.viewport.width){
          this.x = Crafty.viewport.width
        }
        if(this._x < -64){
          this.x = -64
        }
        if(this._y > Crafty.viewport.height) {
					this.y = Crafty.viewport.height;
				}
				if(this._y < -64) {
					this.y = -64;
				}
      })

      player.addComponent("Mouse");

 player.bind('Click', function(e) {
 alert("Clicked");
 });
    var Engine = {
	     degree: function(pos1, pos2) {
    		var dy = pos2.x - pos1.x;
    		var dx = pos2.y - pos1.y;
    		var theta = Math.atan2(dy,dx);
    		return theta *= 180/Math.PI;
	     }
     }





});
