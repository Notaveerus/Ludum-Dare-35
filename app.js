$(document).ready(function() {
  Crafty.init();


    Crafty.background("black")
    Crafty.e("2D, Mouse, DOM")
       .attr({ w:1000, h:1000, x:0, y:0 })
       .bind('MouseMove', function(e)
       {
             var pos1 = {
               x: Crafty.mousePos.x,
               y: Crafty.mousePos.y
             }
             var pos2 = {
               x: player.x+player.w/2,
               y: player.y+player.w/2
             }
             player.rotation = 0;
             player.rotation = -Engine.degree(pos1, pos2);


         })
         .bind("MouseDown", function(e){
           player.dash(Crafty.mousePos.x, Crafty.mousePos.y);
         })


    var score = Crafty.e("2D, DOM, Text")
      .text("Score: 0")
      .attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
      .css({color: "#fff"});

    Crafty.c("Player", {
      mode: 0,
      canAttack:false,
      canDash:false,
      canBlock: false,
      aMode: function(){
        this.color("red"),
        this.fourway(250)
        this.canAttack = true;
        this.canDash = false;
        this.canBlock = false;
        this.mode = 0;
      },
      sMode: function(){
        this.shape = new Crafty.polygon([50, 0, 100, 100, 0, 100]);
        this.movespeed = 15;
        this.block = true;
        this.color("blue")
        this.fourway(450)
        this.canAttack = false;
        this.canDash = true;
        this.canBlock = false;
        this.mode = 1;

      },
      dMode: function(){
        this.color("green")
        this.fourway(130)
        this.canAttack = false;
        this.canDash = false;
        this.canBlock = true;
        this.mode = 2
      },
      dash: function(x, y){
        var xDistance = mouseX - ship.x;
        var yDistance = mouseY - ship.y;
        var distance = Math.sqrt(yDistance / xDistance );
        player.tween({x:x,y:y},500,0.7)
      },
      attack: function(x,y){

      }

    })
    var player = Crafty.e("2D, DOM, Controls, Collision, Fourway, Player, Tween")
      player.attr({x: Crafty.viewport.width/2, y: Crafty.viewport.height/2, h:50, w:50})
      player.addComponent('Color').color("red")
      player.origin("center")
      player.fourway(200)
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
      .bind("KeyDown", function(e){
        console.log("test")
        if(e.keyCode === Crafty.keys.SPACE){
          player.sMode();
        }
        if(e.keyCode === Crafty.keys.SHIFT){
          this.dMode();
        }
        if(e.keyCode === Crafty.keys.ALT){
          this.aMode();
        }
      })

    var Engine = {
	     degree: function(pos2, pos1) {
    		var dy = pos2.x - pos1.x;
    		var dx = pos2.y - pos1.y;
    		var theta = Math.atan2(dy,dx);
    		return theta *= 180/Math.PI;
	     }
     }





});
