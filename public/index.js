var socket=io();

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

