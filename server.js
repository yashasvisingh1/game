const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const move_piece = require("./game");

app.set("view engine", "ejs");
app.use(express.static("public"));
const ejs = require("ejs");
app.get("/", (req, res) => {
  res.render("monopoly_board");
});

let clients = 0;
let player_data = {
  socket_id: 0,
  name: 0,
  curr_pos: 0,
};
let players = [{
  socket_id: 0,
  name: 1,
  curr_pos: 0,
},
{
  socket_id: 0,
  name: 2,
  curr_pos: 0,
},{
  socket_id: 0,
  name: 3,
  curr_pos: 0,
},{
  socket_id: 0,
  name: 4,
  curr_pos: 0,
}
];
var roomno = 1;
io.on("connection", function (socket) {
  if (clients < 4) {
    socket.join("room-" + roomno);
    players[clients].socket_id = socket.id;
    console.log(players[clients].name + " just connected");
    clients++;
    console.log(players);
    socket.emit("begin_game");
    socket.on("move", function () {
      let i=0;
      while (i<=clients) {
        console.log(socket.id)
        if (socket.id == players[i].socket_id) {
          console.log(players[i].name + " moved");
          let a = move_piece(players[i].curr_pos);
          console.log(a);
          io.sockets.in("room-"+roomno).emit("update", {
            name: players[i].name,
            curr_pos: players[i].curr_pos,
            new_pos: a,
          });
          players[i].curr_pos = a;
          break;
        }
        i++;
      }
    });
  } else {
    console.log("room is full");
  }
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// var roomno = 1;
// io.on('connection', function(socket){
//    socket.join("room-"+roomno);
//    //Send this event to everyone in the room.
//    io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
// })
