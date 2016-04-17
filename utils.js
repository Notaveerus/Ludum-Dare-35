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
    }
  }
 
