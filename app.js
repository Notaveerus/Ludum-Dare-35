$(document).ready(function() {
  Crafty.init(1280,500);

  Crafty.scene("main", function(){
    Crafty.background("black")
    var enemyCount = 1;
    var lastCount;
    var screen = Crafty.e("2D, Mouse, DOM")
    .attr({ w:1280, h:500, x:0, y:0 })
    .bind('MouseMove', function(e) {
      var playerPos = {
        x: player.x+player.w/2,
        y: player.y+player.w/2
      }
      player.rotation = Engine.getRotation(playerPos,Crafty.mousePos);


    })
    .bind("MouseDown", function(e){
      if(e.mouseButton === Crafty.mouseButtons.LEFT){
        if(player.canAttack)
          player.attack(Crafty.mousePos.x, Crafty.mousePos.y);
        else if(player.canDash)
          player.dash(Crafty.mousePos.x, Crafty.mousePos.y,250,500);
      }
      if(e.mouseButton === Crafty.mouseButtons.RIGHT){
          player.aMode();
      }
    })
    .bind("EnterFrame",function(){
      if(enemyCount ===1 && lastCount > 1){
        console.log(" yes")
        initEnemies(lastCount*1.2)
      }
      else if(enemyCount === 1)
        initEnemies(5)
    })

    Crafty.c("Enemy", {
      required: "2D, DOM, Collision, Tween, Color, Motion",
      fireDelay: 0,
      range: 650,
      init: function(){
        this.w = 20;
        this.h = 20;
        this.x = Crafty.math.randomInt(0,Crafty.viewport.width)
        this.y = Crafty.math.randomInt(0,Crafty.viewport.height)
        this.origin("center")
        this.typeArray = [this.ranged,this.melee,this.shielded]
        this.type = this.typeArray[Math.floor(Math.random()*this.typeArray.length)]
        this.onHit("Attack",function(){
          this.destroy();
          enemyCount--;
          console.log(enemyCount)
        })
      },
      ranged: function(){
        this.color("green")
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

        if(dist<this.range && !(this.fireDelay > 0)){
          this.cancelTween;

          var bullet = Crafty.e("2D,Color, Collision,Bullet,DOM, Motion")

          .attr({
              x:this.x-this.w/2,
              y:this.y-this.w/2,
              w:5,
              h:5,
              rotation: this._rotation,
              xspeed: 5 * Math.sin(this._rotation/57.3),
              yspeed: 5 * Math.cos(this._rotation/57.3)

            })
          .color("green")

            var spread= Crafty.math.randomInt(-5,5)
          bullet.bind("EnterFrame",function(){
            this.x-= this.xspeed
            this.y+=this.yspeed
          })
          Crafty.e("Delay").delay(function() {
            bullet.destroy();

          }, 2000);
          this.fireDelay = 35
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
        this.color("red")
        var targetPos = {
          x: player.x+player.w/2,
          y: player.y+player.w/2
        }
        var currPos = {
          x:this.x,
          y:this.y
        }

        this.rotation = Engine.getRotation(currPos,targetPos);
        var dist = Math.sqrt(targetPos.x*currPos.x)+(targetPos.y*currPos.y)

        var tmpDir = Engine.degree({x:targetPos.x,y:targetPos.y}, {x:this.x+this.w/2,y:this.y+this.w/2},true);
        var tmpX = (this.x) + (dist *  Math.cos(tmpDir-Math.PI/2));
        var tmpY = (this.y) + (dist * Math.sin(tmpDir+Math.PI/2));
        this.tween({x:tmpX,y:tmpY},6*dist,"linear")


      },
      shielded: function(){
        this.color("blue")
        var targetPos = {
          x: player.x+player.w/2,
          y: player.y+player.w/2
        }
        var currPos = {
          x:this.x,
          y:this.y
        }

        var rotate = Engine.getRotation(currPos,targetPos);
        this.tween({rotation:rotate},1000,"linear")

        var dist = Math.sqrt(targetPos.x*currPos.x)+(targetPos.y*currPos.y)
        var tmpDir = Engine.degree({x:targetPos.x,y:targetPos.y}, {x:this.x+this.w/2,y:this.y+this.w/2},true);
        var tmpX = (this.x) + ((dist-this.range)*  Math.cos(tmpDir-Math.PI/2));
        var tmpY = (this.y) + ((dist-this.range) * Math.sin(tmpDir+Math.PI/2));
        this.tween({x:tmpX,y:tmpY},dist*15,"linear")

      },
      events: {
        "EnterFrame": function(){
          this.type()
        }
      }

    })


    var score = Crafty.e("2D, DOM, Text")
      .text("Score: 0")
      .attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
      .css({color: "#fff"});


    Crafty.c("Player", {
      mode: 0,
      canAttack:true,
      canDash:false,
      canBlock: false,
      canMove: true,
      invincible: false,
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
        this.shape.color ="green"
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
        this.invincible = true;
        this.alpha = 0.7;
        Crafty.e("Delay").delay(function(){
          player.invincible = false;
          player.alpha = 1;
        }, time)
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
          console.log("Destroyed")
          player.canMove = true;
        }, 200);

      }

    })

    var player = Crafty.e("2D, DOM, Controls, Collision, Fourway, Player, Tween")
      player.attr({x: Crafty.viewport.width/2, y: Crafty.viewport.height/2, h:50, w:50})
      player.addComponent('Color').color("red")
      player.origin("center")
      player.fourway(200)
      .bind("EnterFrame", function(){
        if(this._x > Crafty.viewport.width-this.w){
          this.x = Crafty.viewport.width-this.w;
        }
        if(this._x < 0){
          this.x = 0
        }
        if(this._y > Crafty.viewport.height-this.w) {
          this.y = Crafty.viewport.height-this.w;
        }
        if(this._y < 0) {
          this.y = 0;
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

        }
      })
      .collision()
      .onHit("Enemy", function(e){
        if(this.mode !== 2&& !this.invincible)
        Crafty.scene("main")
      })
      .onHit("Bullet", function(e){
        if(this.mode !== 2 && !this.invincible){
          Crafty.scene("main")
        }
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
    var initEnemies = function(num){
      enemyCount = num;
      lastCount = num;
      for(var i=1;i<num;i++){
        Crafty.e("Enemy");
      }
    }



  })
  Crafty.scene("main")
});
