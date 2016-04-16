$(document).ready(function() {
  Crafty.init();

Crafty.scene("main", function(){
    Crafty.background("black")
    var screen = Crafty.e("2D, Mouse, DOM")
       .attr({ w:1000, h:1000, x:0, y:0 })
       //screen.background("red")
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
             player.rotation = -Engine.degree(pos1, pos2,false);


         })
         .bind("MouseDown", function(e){
           if(player.mode === 0)
              player.attack(Crafty.mousePos.x, Crafty.mousePos.y);
           else if(player.mode === 1)
            player.dash(Crafty.mousePos.x, Crafty.mousePos.y);
         })


    var score = Crafty.e("2D, DOM, Text")
      .text("Score: 0")
      .attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
      .css({color: "#fff"});
      var enemy = Crafty.e("2D, DOM, Collsion, Enemy, Tween, Color")
      enemy.attr({x:50, y:50, w:15, h:15})
      enemy.color("pink")



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
        var tmpDir = Engine.degree({x:x,y:y}, {x:player.x+player.w/2,y:player.y+player.w/2},true);
        var tmpX = (player.x+player.w/2) + (250 *  Math.cos(tmpDir-Math.PI/2));
        var tmpY = player.y+player.w/2 + (250 * Math.sin(tmpDir+Math.PI/2));
        player.tween({x:tmpX,y:tmpY},300,0.7)
      },
      attack: function(x,y){
        var tmpDir = Engine.degree({x:x,y:y}, {x:player.x+player.w/2,y:player.y+player.w/2},true);
        var tmpX = (player.x+player.w/2) + (player.w/2 *  Math.cos(tmpDir-Math.PI/2));
        var tmpY = player.y+player.w/2 + (player.w/2 * Math.sin(tmpDir+Math.PI/2));
        var atkHitBox = Crafty.e("2D,Collision,SolidHitBox,Attack")
        .origin("center")
        .attr({x:tmpX,y:tmpY,w:30,h:30})
        .rotation(tmpDir)

        this.attach(atkHitBox)
      }

    })

    var player = Crafty.e("2D, DOM, Controls, Collision, Fourway, Player, Tween")
      player.attr({x: Crafty.viewport.width/2, y: Crafty.viewport.height/2, h:50, w:50})
      player.addComponent('Color').color("red")
      player.origin("center")
      player.fourway(200)
      .bind("enterframe", function(){
        if(this._x > Crafty.viewport.bounds.w){
          this.x = Crafty.viewport.bounds.w
        }
        if(this._x < -64){
          this.x = -64
        }
        if(this._y > Crafty.viewport.bounds.h) {
					this.y = Crafty.viewport.bounds.h;
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
      .collision()
      .onHit("Enemy", function(e){
        if(this.mode !== 2)
          Crafty.scene("main")
      })

    var Engine = {
	     degree: function(pos2, pos1, inRad) {
    		var dy = pos2.x - pos1.x;
    		var dx = pos2.y - pos1.y;
    		var theta = Math.atan2(dy,dx);
    		return theta *= inRad ? 1 : (180/Math.PI);
      }
     }
     Crafty.c("Triangle", {
    Triangle: function(height, width, color, alpha) {
        this.h = height; // TODO check for bad values
        this.w = width; // TODO check for bad values
        this.color = color || "#000000";
        this.alpha = alpha; // TODO check for bad values

        return this;
      },
      draw: function() {
          var context = Crafty.canvas.context;
  		// Set the style properties.
  		context.fillStyle   = this.color;
  		context.strokeStyle = "#000000";
  		context.lineWidth   = 1;
  		context.globalAlpha = this.alpha;

  		context.beginPath();
  		// Start from the top-left point.
  		context.moveTo(this.x+this.w/3, this.y+(2*this.h)/3); // give the (x,y) coordinates
  		context.lineTo(this.x+this.w/2, this.y+this.h/3);
  		context.lineTo(this.x+(2*this.w)/3, this.y+(2*this.h)/3);
  		context.lineTo(this.x+this.w/3, this.y+(2*this.h)/3);

  		// Done! Now fill the shape, and draw the stroke.
  		// Note: your shape will not be visible until you call any of the two methods.
  		context.fill();
  		context.stroke();
  		context.closePath();
      }
});




   })
   Crafty.scene("main")
});
