var socket=io();

let stats_player1=document.getElementById('stats_p1');
let stats_player2=document.getElementById('stats_p2');
let stats_player3=document.getElementById('stats_p3');
let stats_player4=document.getElementById('stats_p4');

stats=[stats_player1,stats_player2,stats_player3,stats_player4];

function begin(){
    for(let i=1;i<24;i++){

        document.querySelector("#cell"+i+ " .p1").classList.add("hidden");
        document.querySelector("#cell"+i+ " .p2").classList.add("hidden");
        document.querySelector("#cell"+i+ " .p3").classList.add("hidden");
        document.querySelector("#cell"+i+ " .p4").classList.add("hidden");
    }
}
socket.on("begin_game",function(){
    begin();
});

document.addEventListener("keydown",function (event){
console.log(event.key)
let a=event.key;
if(a=="ArrowLeft"){
    console.log("emit function triggerd");
    socket.emit("move");
}
});

function update_position(player_name,curr_pos,new_pos){
    document.querySelector("#cell"+curr_pos+" .p"+player_name).classList.add("hidden");
    document.querySelector("#cell"+new_pos+" .p"+player_name).classList.remove("hidden");
}

socket.on("update",function(a){
    update_position(a.name,a.curr_pos,a.new_pos);
})

socket.on("player_decision",function(player_name){
        document.getElementById('button').onclick = function() {
            console.log("button was clicked");
            socket.emit("buy",player_name);
    }
})

function update_stats(player_name,place_name){
    let item=document.createElement('li');
    item.textContent=place_name;
    let a=stats[player_name-1];
    a.appendChild(item);
}

socket.on("update_stats",function(a){
    update_stats(a.player_name,a.place_name);
})