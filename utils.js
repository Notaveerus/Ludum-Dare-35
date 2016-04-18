var Engine = {
   degree: function(pos2, pos1, inRad) {
    var dy = pos2.x - pos1.x;
    var dx = pos2.y - pos1.y;
    var theta = Math.atan2(dy,dx);
    return theta *= inRad ? 1 : (180/Math.PI);
  },
  getRotation: function(playerPos,mousePos){
    var pos1 = {
      x: mousePos.x,
      y: mousePos.y
    }


      return -Engine.degree(pos1, playerPos,false);
    },
    getSpawn: function(viewport, area){
      var x1 = viewport.x//-area;
      var x2 = viewport.width//+area;
      var y1 = viewport.y//-area;
      var y2 = viewport.height//+area;
      var spawnA = {x:x1,y:y1}
      var spawnB = {x:x1,y:y2}
      var spawnC = {x:x2,y:y1}
      var spawnD = {x:x2,y:y2}
      var spawnList = [spawnB,spawnC,spawnD]
      return spawnList[Crafty.math.randomInt(0,2)];

    }

  }
