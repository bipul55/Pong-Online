function Ball(n, width, height) {
  this.x;
  this.y;
  this.draw = function () {
    fill(255, 204, 0);
    ellipse(this.x, this.y, 20, 20);
  };
  this.setvalue = function (x, y) {
    this.x = x;
    this.y = y;
  };
  this.update = function (player) {
    if (this.y > 350) {
      socket.emit("hitwall", [0, -1]);
    } else if (this.y < 20) {
      socket.emit("hitwall", [0, 1]);
    }
    if (this.x < 50) {
      if (player.pos == 1 && this.y > player.y && this.y < player.y + 100) {
        socket.emit("hitwall", [1, 0]);
      } else {
        socket.emit("score", { pos: 2 });
        this.x = 500;
      }
    }
    if (this.x > 950) {
      if (player.pos == 2 && this.y > player.y && this.y < player.y + 100) {
        console.log(this.y > player.y && this.y < player.y + 100);
        socket.emit("hitwall", [-1, 0]);
      } else {
        socket.emit("score", { pos: 1 });
        this.x = 500;
      }
    }
  };
}
