var socket;
var ball;
var playerMe; //my player
var playerEnemy; //enemy player
var ready;
var id; // id assigned by the socket.io when connected to the server
var score = [0, 0]; //keep track of the scores
var textMsg = "Waiting for players....";

// setup
function setup() {
  // initiallly not ready to play
  ready = false;
  // connect to server
  socket = io.connect("https://bipul-pong-online.herokuapp.com/");
  // if connected find id and assine it
  socket.on("connect", () => {
    id = socket.id;
  });
  // error handelling.

  socket.on("error", (data) => {
    ready = false;
    // if disconnected
    if (data == "disconnected") {
      console.log("disconnected");
      textMsg = "Player Disconnected ...";
    }
    // if more 2 playera are already playing then
    if (data == "many players") {
      textMsg = "Too Many playes at the moment..";
    }
  });
  // if everything is okay, start the game
  socket.on("GameStart", (data) => {
    ready = true;
  });
  // if we are connected to the server, we create our player as well as enemy player
  // pos determines whether we are in right or left
  // pos==1 , we are on left.
  // pos ==2 , we are no right
  socket.on("ready", (data) => {
    playerMe = new Player(data.pos, width, height, data.id);
    if (data.pos == 1) {
      playerEnemy = new Player(2, width, height);
    } else {
      playerEnemy = new Player(1, width, height);
    }
  });
  // we get the location of enemy player from the server then we update it.
  socket.on("updatedPlayers", (data) => {
    if (data.x.id == id) {
      playerMe.setValue(data.x.y);
    } else {
      playerEnemy.setValue(data.x.y);
    }
    if (data.y.id == id) {
      playerMe.setValue(data.y.y);
    } else {
      playerEnemy.setValue(data.y.y);
    }
  });
  // new ball object
  ball = new Ball();
  // update the positio of the ball by the value we obtaioned from the server
  // server handles all the moment of the ball
  socket.on("update", (circle) => {
    ball.setvalue(circle[0], circle[1]);
  });
  // when we are in ready state,we set the ball position
  socket.on("ready", (circle) => {
    ball.setvalue(circle[0], circle[1]);
  });
  // update hte scores from the server
  socket.on("score", (data) => {
    score = data;
  });
  // creating the canvas
  createCanvas(1000, 400);
  // text setup
  textSize(22);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);
  // only start the game if ready to play
  if (ready) {
    ball.update(playerMe);
    ball.draw();
    playerMe.update();
    playerMe.draw();
    playerEnemy.draw();
    text(score[0] + " : " + score[1], 500, 200);
  } else {
    // if not ready to play show Error message
    fill(255);
    text(textMsg, 500, 200);
  }
}
