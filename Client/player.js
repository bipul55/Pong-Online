function Player(n, width, height, id) {
  this.x = n == 1 ? 20 : 960;
  this.y = 100;
  this.pos = n;
  this.windowW = width;
  this.windowH = height;
  this.id = id;
  this.draw = function () {
    fill(255);
    rect(this.x, this.y, 20, 100);
  };
  this.setValue = function (y) {
    this.y = y;
  };
  this.update = function (KeyCode) {
    if (keyIsDown(40)) {
      // move down
      if (this.y <= 300) {
        this.y += 10;
        socket.emit("Playerupdated", { pos: this.pos, y: this.y });
      }
    } else if (keyIsDown(38)) {
      // move up
      if (this.y > 0) {
        this.y -= 10;
        socket.emit("Playerupdated", { pos: n, y: this.y });
      }
    }
  };
}
