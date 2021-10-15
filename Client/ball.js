function Ball(n, width, height) {
  this.x;
  this.y;
  this.vel = {
    x: null,
    y: null,
  };
  this.draw = function () {
    fill(255, 204, 0);
    ellipse(this.x, this.y, 20, 20);
  };
  this.setvalue = function (ball) {
    this.x = ball.x;
    this.y = ball.y;
    this.vel.x = ball.vel.x;
    this.vel.y = ball.vel.y;
  };
  this.update = function (player) {
    this.x = this.x + this.vel.x;
    this.y = this.vel.y + this.y;
    if (this.y > 350) {
      this.vel.y = -5;
      // socket.emit("hitwall", this);
    } else if (this.y < 20) {
      this.vel.y = 5;

      // socket.emit("hitwall", this);
    }
    if (this.x < 50) {
      if (player.pos == 1 && this.y > player.y && this.y < player.y + 100) {
        this.vel.x = 5;
        socket.emit("hitwall", this);
      } else {
        this.x = 500;
        socket.emit("score", { pos: 2 });
        this.vel.x = 0;
        this.vel.y = 0;
      }
    }
    if (this.x > 950) {
      if (player.pos == 2 && this.y > player.y && this.y < player.y + 100) {
        this.vel.x = -5;
        socket.emit("hitwall", this);
      } else {
        this.x = 500;
        socket.emit("score", { pos: 1 });
        this.vel.x = 0;
        this.vel.y = 0;
      }
    }
  };
}
