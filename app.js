$(document).ready(function() {
  Crafty.init(1280,500);

Crafty.scene("main", function(){
    Crafty.background("black")
    var screen = Crafty.e("2D, Mouse, DOM")
       .attr({ w:1280, h:500, x:0, y:0 })
       //screen.background("red")
       .bind('MouseMove', function(e)
       {
         var playerPos = {
           x: player.x+player.w/2,
           y: player.y+player.w/2
         }
         player.rotation = Engine.getRotation(playerPos,Crafty.mousePos);


         })
         .bind("MouseDown", function(e){
           if(player.canAttack)
              player.attack(Crafty.mousePos.x, Crafty.mousePos.y);
           else if(player.canDash)
            player.dash(Crafty.mousePos.x, Crafty.mousePos.y,250,500);
         })

         Crafty.c("Enemy", {
           type: 0,
           fireDelay: 0,
           range: 650,
           ranged: function(){
             var targetPos = {
               x: player.x+player.w/2,
               y: player.y+player.w/2
             }
             var currPos = {
               x:this.x,
               y:this.y
             }
             this.rotation = Engine.getRotation(currPos,targetPos);
             var dist = Math.sqrt((currPos.x-=targetPos.x)*currPos.x + (currPos.y-=targetPos.y)*currPos.y)
             console.log(dist)
             if(dist<this.range && !(this.fireDelay > 0)){
               this.cancelTween;
               console.log("shoot")
               var bullet = Crafty.e("2D,Color, Collision,Bullet,DOM, Motion")
               .attr({x:this.x-this.w/2,y:this.y-this.w/2,w:5,h:5})
               .color("green")
               var vel = bullet.velocity()
               var spread = Math.floor(Math.random()*201)-100
               targetPos.x += spread;
               targetPos.y += spread;
               var angle = Engine.degree(targetPos,currPos,true)
               vel.x = 750 * Math.cos(angle -Math.PI/2)
               vel.y = 750 * Math.sin(angle +Math.PI/2)

               Crafty.e("Delay").delay(function() {
                 bullet.destroy();

               }, 4000);
               this.fireDelay = 15
             }
             else if(this.fireDelay === 0 && dist>this.range){
               var tmpDir = Engine.degree({x:targetPos.x,y:targetPos.y}, {x:this.x+this.w/2,y:this.y+this.w/2},true);
               var tmpX = (this.x) + ((dist-this.range)*  Math.cos(tmpDir-Math.PI/2));
               var tmpY = (this.y) + ((dist-this.range) * Math.sin(tmpDir+Math.PI/2));
               this.tween({x:tmpX,y:tmpY},dist,"linear")
             }
             else{
               this.fireDelay--;
             }
           },
           melee: function(){

             var targetPos = {
               x: player.x+player.w/2,
               y: player.y+player.w/2
             }
             var currPos = {
               x:this.x,
               y:this.y
             }
             console.log((targetPos.x-currPos.x)+", "+(targetPos.y-currPos.y))
             this.rotation = Engine.getRotation(currPos,targetPos);
             var dist = Math.sqrt(targetPos.x*currPos.x)+(targetPos.y*currPos.y)

             var tmpDir = Engine.degree({x:targetPos.x,y:targetPos.y}, {x:this.x+this.w/2,y:this.y+this.w/2},true);
             var tmpX = (this.x) + (dist *  Math.cos(tmpDir-Math.PI/2));
             var tmpY = (this.y) + (dist * Math.sin(tmpDir+Math.PI/2));
             this.tween({x:tmpX,y:tmpY},6*dist,"linear")


           },
           shielded: function(){

           }


         })
    var score = Crafty.e("2D, DOM, Text")
      .text("Score: 0")
      .attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
      .css({color: "#fff"});
      var enemy = Crafty.e("2D, DOM, Collision, Enemy, Tween, Color")
      enemy.attr({x:50, y:50, w:15, h:15})
      enemy.color("pink")
      .bind("EnterFrame",function(){

        this.ranged()
      })
      .collision()
      .onHit("Attack",function(){
        this.destroy();
      })



    Crafty.c("Player", {
      mode: 0,
      canAttack:true,
      canDash:false,
      canBlock: false,
      canMove: true,
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
      dash: function(x, y,dist,time){
        var tmpDir = Engine.degree({x:x,y:y}, {x:this.x+this.w/2,y:this.y+this.w/2},true);
        var tmpX = (this.x) + (dist *  Math.cos(tmpDir-Math.PI/2));
        var tmpY = (this.y) + (dist * Math.sin(tmpDir+Math.PI/2));
        this.tween({x:tmpX,y:tmpY},time,"easeOutQuad")
      },
      attack: function(x,y){
        var scale = 70;
        var offset = 20;
        var tmpDir = Engine.degree({x:x,y:y}, {x:player.x+player.w/2,y:player.y+player.w/2},true);
        var tmpX = (player.x+player.w/2) + ((player.w/2+scale/2-offset) *  Math.cos(tmpDir-Math.PI/2));
        var tmpY = player.y+player.w/2 + ((player.w/2+scale/2-offset) * Math.sin(tmpDir+Math.PI/2));
        var atkHitBox = Crafty.e("2D,Collision,SolidHitBox,Attack,Delay")
        .attr({x:tmpX-scale/2,y:tmpY-scale/2,w:scale,h:scale})
        .origin("center")
        atkHitBox.rotation = player.rotation
        this.attach(atkHitBox)
        player.dash(x,y,20, 200)
        player.canMove = false;
        Crafty.e("Delay").delay(function() {
          atkHitBox.destroy();
          player.canMove = true;
        }, 200);

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
      .onHit("Bullet", function(e){
        Crafty.scene("main")
      })


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
