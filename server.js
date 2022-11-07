const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const {move_piece,decision} = require("./game");
const ejs = require("ejs");
const mongoose=require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("monopoly_board");
});
const go="go",city="city",company="company",chest="chest",chance="chance",jail="jail",go_jail="go_jail",park="park";
let places=[
  {
  cell:0,
  name:go,
  price:0,
  ownership:0,
  cell_name:"Start"
  },
  {
  cell:1,
  name:city,
  price:60,
  ownership:0,
  cell_name:"MEDITERRANIAN AVE"
  },
  {
    cell:2,
    name:chest,
    price:0,
    ownership:0,
  cell_name:"COMMUNITY CHEST"
  },
  {
    cell:3,
    name:city,
    price:100,
    ownership:0,
    cell_name:"ORIENTAL AVE"
  },
  {
    cell:4,
    name:chance,
    price:0,
    ownership:0,
    cell_name:"CHANCE"
  },
  {
    cell:5,
    name:city,
    price:120,
    ownership:0,
    cell_name:"CONNECTICUT AVE"
  },
  {
    cell:6,
    name:jail,
    price:0,
    ownership:0,
    cell_name:"JAIL"
  },
  {
    cell:7,
    name:city,
    price:140,
    ownership:0,
    cell_name:"ST.CHARLES PLACE"
  },
  {
    cell:8,
    name:company,
    price:150,
    ownership:0,
    cell_name:"ELEC.COMP"
  },
  {
    cell:9,
    name:city,
    price:160,
    ownership:0,
    cell_name:"VIRGINIA AVE"
  },
  {
    cell:10,
    name:chest,
    price:0,
    ownership:0,
    cell_name:"COMMUNITY CHEST" 
  },
  {
    cell:11,
    name:city,
    price:200,
    ownership:0,
    cell_name:"NY AVE"
  },
  {
    cell:12,
    name:park,
    price:0,
    ownership:0,
    cell_name:"FREE PARKING"
  },
  {
    cell:13,
    name:city,
    price:220,
    ownership:0,
    cell_name:"KENTUCY AVE"
  },
  {
    cell:14,
    name:chance,
    price:0,
    ownership:0,
    cell_name:"CHANCE"
  },
  {
    cell:15,
    name:city,
    price:240,
    ownership:0,
    cell_name:"ILLINOIS AVE"
  },
  {
    cell:16,
    name:company,
    price:150,
    ownership:0,
    cell_name:"WATER WORKS"
  },
  {
    cell:17,
    name:city,
    price:280,
    ownership:0,
    cell_name:"MARVIN GARDENS"
  },
  {
    cell:18,
    name:go_jail,
    price:0,
    ownership:0,
    cell_name:"GO TO JAIL"
  },
  {
    cell:19,
    name:city,
    price:300,
    ownership:0,
    cell_name:"PACIFIC AVE"
  },
  {
    cell:20,
    name:chest,
    price:0,
    ownership:0,
    cell_name:"COMMUNITY CHEST"
  },
  {
    cell:21,
    name:city,
    price:320,
    ownership:0,
    cell_name:"PENNSYLVANIA AVE"
  },
  {
    cell:22,
    name:chance,
    price:0,
    ownership:0,
    cell_name:"CHANCE"
  },
  {
    cell:23,
    name:city,
    price:400,
    ownership:0,
    cell_name:"BOARDWALK"
  }
]
let clients = 0;

let players = [{
  socket_id: 0,
  name: 1,
  curr_pos: 0,
  money:300,
  turn:1,
  in_game:1
},
{
  socket_id: 0,
  name: 2,
  curr_pos: 0,
  money:300,
  turn:0,
  in_game:1
},
{
  socket_id: 0,
  name: 3,
  curr_pos: 0,
  money:300,
  turn:0,
  in_game:1
},
{
  socket_id: 0,
  name: 4,
  curr_pos: 0,
  money:300,
  turn:0,
  in_game:1
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
        if (socket.id == players[i].socket_id && players[i].turn==1 && players[i].in_game==1) {
          console.log(players[i].name + " moved");
          let a = move_piece(players[i].curr_pos);
          console.log(a);
          io.sockets.in("room-"+roomno).emit("update", {
            name: players[i].name,
            curr_pos: players[i].curr_pos,
            new_pos: a,
          });
          players[i].curr_pos = a;
        
          let choice=decision(players[i].name,places[a].ownership,players[i].money,places[a].price,places[a].name);
          console.log("hello "+choice);

          let count=0;

          if(choice==1){//rent case
            players[i].money=players[i].money-(places[a].price*0.1);
            players[places[a].ownership-1].money =players[places[a].ownership-1].money+(places[a].price*0.1);
            console.log(players);
            io.sockets.in("room-"+roomno).emit("update_money",{player_name:players[i].name,player_money:players[i].money});
            io.sockets.in("room-"+roomno).emit("update_money",{player_name:players[places[a].ownership-1].name,player_money:players[places[a].ownership-1].money});
            if(players[i].money<0){
              players[i].in_game==0;
              console.log(players[i].name+" is out");
            }
          }
          if(choice==0){//buy city case
            io.to(socket.id).emit("player_decision",players[i].name);
          }
          socket.on("buy",function(player_name){
            if(count<1&&choice==0){

              players[i].money=players[i].money-places[a].price;
              places[a].ownership=player_name;
              io.sockets.in("room-"+roomno).emit("update_stats",{player_name:players[i].name,place_name:places[a].cell_name});
              io.sockets.in("room-"+roomno).emit("update_money",{player_name:players[i].name,player_money:players[i].money});
              console.log(players);
              count++;
            }
          })

          players[i].turn = 0;
          players[(i+1)%clients].turn=1;
          
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

