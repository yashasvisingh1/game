const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const move_piece = require("./game");
const mongoose=require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
const ejs = require("ejs");
app.get("/", (req, res) => {
  res.render("monopoly_board");
});
const go="go",city="city",company="company",chest="chest",chance="chance",jail="jail",go_jail="go_jail",park="park";
let places=[
  {
  cell:0,
  name:go,
  price:0
  },
  {
  cell:1,
  name:city,
  price:60
  },
  {
    cell:2,
    name:chest,
    price:0
  },
  {
    cell:3,
    name:city,
    price:100
  },
  {
    cell:4,
    name:chance,
    price:0
  },
  {
    cell:5,
    name:city,
    price:120
  },
  {
    cell:6,
    name:jail,
    price:0
  },
  {
    cell:7,
    name:city,
    price:140
  },
  {
    cell:8,
    name:company,
    price:150
  },
  {
    cell:9,
    name:city,
    price:160
  },
  {
    cell:10,
    name:chest,
    price:0
  },
  {
    cell:11,
    name:city,
    price:200
  },
  {
    cell:12,
    name:park,
    price:0
  },
  {
    cell:13,
    name:city,
    price:220
  },
  {
    cell:14,
    name:chance,
    price:0
  },
  {
    cell:15,
    name:city,
    price:240
  },
  {
    cell:16,
    name:company,
    price:0
  },
  {
    cell:17,
    name:city,
    price:280
  },
  {
    cell:18,
    name:go_jail,
    price:0
  },
  {
    cell:19,
    name:city,
    price:300
  },
  {
    cell:20,
    name:chest,
    price:0
  },
  {
    cell:21,
    name:city,
    price:320
  },
  {
    cell:22,
    name:chance,
    price:0
  },
  {
    cell:23,
    name:city,
    price:400
  }
]
let clients = 0;

let players = [{
  socket_id: 0,
  name: 1,
  curr_pos: 0,
  money:300,
  turn:1
},
{
  socket_id: 0,
  name: 2,
  curr_pos: 0,
  money:300,
  turn:0
},
{
  socket_id: 0,
  name: 3,
  curr_pos: 0,
  money:300,
  turn:0
},
{
  socket_id: 0,
  name: 4,
  curr_pos: 0,
  money:300,
  turn:0
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
      while (i<clients) {
        console.log(socket.id)
        if (socket.id == players[i].socket_id && players[i].turn==1) {
          console.log(players[i].name + " moved");
          let a = move_piece(players[i].curr_pos);
          console.log(a);
          io.sockets.in("room-"+roomno).emit("update", {
            name: players[i].name,
            curr_pos: players[i].curr_pos,
            new_pos: a,
          });
          players[i].curr_pos = a;
          players[i].turn = 0;
          players[(i+1)%4].turn=1;
          
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

