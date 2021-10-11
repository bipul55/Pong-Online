const express = require("express");
const app = express();
require("dotenv").config();
//attrubutes for the ball
var circle = [50, 200];
var vel = [5, 5];
var score = [0, 0];
//attributes for the players
var players = { x: { y: null, id: null }, y: { y: null, id: null } };
var socket = require("socket.io");
app.use(express.static("./Client"));

const server = app.listen(process.env.PORT || 9000, () => {
  console.log("server running");
});
const io = socket(server);

// player joins the server
io.on("connection", (socket) => {
  // if both player space is already occupied then no allow them
  if (players.x.id && players.y.id) {
    socket.emit("error", "many players");
    console.log("couldnt join");
  } else {
    // if player space is allocated then continue
    console.log("joined");
    // if first postion of player is available store it there
    if (!players.x.id) {
      players.x.id = socket.id;
      var data = {
        id: socket.id,
        pos: 1,
      };
    } else {
      // else store the player in second slot
      players.y.id = socket.id;
      var data = {
        id: socket.id,
        pos: 2,
      };
    }
    // if both the sloth are full, send the client to start the game
    if (players.x.id && players.y.id) {
      // send the initialized score to clients
      socket.broadcast.emit("score", score);
      socket.emit("score", score);

      socket.broadcast.emit("GameStart", true);
      socket.emit("GameStart", true);
    }
    // send ready signat to the user client sending them the id and their position
    socket.emit("ready", data);
    // update the postition of both the player and broadcast them to both the players
    socket.on("Playerupdated", (data) => {
      if (data.pos == 1) {
        players.x.y = data.y;
      }
      if (data.pos == 2) {
        players.y.y = data.y;
      }
      socket.broadcast.emit("updatedPlayers", players);
    });
    // if the ball hit wall then bounce
    // postion of the ball is calculated here
    socket.on("hitwall", (val) => {
      if (val[0] > 0) {
        vel[0] = 5;
      } else if (val[0] < 0) {
        vel[0] = -5;
      }
      if (val[1] > 0) {
        vel[1] = 5;
      } else if (val[1] < 0) {
        vel[1] = -5;
      }
    });
    // update the score
    socket.on("score", (val) => {
      circle[0] = 500;
      if (val.pos == 1) {
        score[0] = score[0] + 1;
      } else {
        score[1] = score[1] + 1;
      }
      socket.broadcast.emit("score", score);
      socket.emit("score", score);
    });
  }
  //if the player is disconnected remove it
  socket.on("disconnect", (reason) => {
    console.log("disconnected", socket.id);
    if (players.x.id == socket.id) {
      players.x.id = null;
      players.x.y = null;
    } else if (players.y.id == socket.id) {
      players.y.id = null;
      players.y.y = null;
    }
    socket.broadcast.emit("error", "disconnected");
    // set the score back to normal
    score = [0, 0];
  });
});
// broadcast the postion of ball every 30 sec

setInterval(() => {
  if (players.x.id && players.y.id) {
    io.sockets.emit("update", circle);
    circle[0] = circle[0] + vel[0];
    circle[1] = circle[1] + vel[1];
  }
}, 300);
