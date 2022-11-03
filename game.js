module.exports=(
    move_piece

)

function roll_dice(){
    let a,b;
    a=Math.floor(Math.random()*6)+1;
    b=Math.floor(Math.random()*6)+1;
    return a+b;
}

function move_piece(curr_pos){
    let c=roll_dice();
    let new_pos=(curr_pos+c)%23;
    return new_pos;
}