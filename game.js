const PLAYER_VELOCITY_MAX = 2;
const AFK_VELOCITY_MAX = 3;

let canvas;
let context;


let x = 0;
let y = 0;
let oldX = 0;
let oldY = 0;
let veryOldX = 0;
let veryOldY = 0;
let velocityX = 0;
let velocityY = 0;
let afkX = 0;
let afkVelocityX = AFK_VELOCITY_MAX;
let leftKeyPressed = false;
let rightKeyPressed = false;
let upKeyPressed = false;
let downKeyPressed = false;

function onload(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    window.requestAnimationFrame(gameLoop);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
}

function gameLoop(){
    draw();
    update();
    window.requestAnimationFrame(gameLoop);
}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'green';

    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();

    context.beginPath();
    context.arc(oldX, oldY, 5, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();

    context.beginPath();
    context.arc(veryOldX, veryOldY, 5, 0, 2 * Math.PI, false);
    context.fillStyle = 'blue';
    context.fill();

    context.fillStyle = 'red';
    context.fillRect(afkX, 200, 20, 20);
}

function update(){
    velocityX = 0;
    velocityY = 0;
    if(leftKeyPressed){
        velocityX -= PLAYER_VELOCITY_MAX;
    }
    if(rightKeyPressed){
        velocityX += PLAYER_VELOCITY_MAX;
    }
    if(upKeyPressed){
        velocityY -= PLAYER_VELOCITY_MAX;
    }
    if(downKeyPressed){
        velocityY += PLAYER_VELOCITY_MAX;
    }

    x += velocityX;
    y += velocityY;
    oldX = x - (velocityX * 5);
    oldY = y - (velocityY * 5);
    veryOldX = oldX - (velocityX * 5);
    veryOldY = oldY - (velocityY * 5);

    afkX+= afkVelocityX;
    if(afkX >= 400) {
        afkVelocityX = -AFK_VELOCITY_MAX;
    }
    else if(afkX <= 0) {
        afkVelocityX = AFK_VELOCITY_MAX;
    }
}

function keyDown(event){
    switch(event.code){
        case "Space":

            break;
        case "KeyA":
            leftKeyPressed = true;
            break;
        case "KeyD":
            rightKeyPressed = true;
            break;
        case "KeyW":
            upKeyPressed = true;
            break;
        case "KeyS":
            downKeyPressed = true;
            break;
        default:
            console.log("heya");
    }
}
function keyUp(event){
    switch(event.code){
        case "Space":

            break;
        case "KeyA":
            leftKeyPressed = false;
            break;
        case "KeyD":
            rightKeyPressed = false;
            break;
        case "KeyW":
            upKeyPressed = false;
            break;
        case "KeyS":
            downKeyPressed = false;
            break;
    }
}


onload();