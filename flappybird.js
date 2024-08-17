//Variales for the board
let board;
let boardWidth = 864;
let boardHeight = 768;
let context;

//Variable for the bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 20;
let birdY = boardHeight / 2;
let birdImg;

//Creating bird object
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//Variables for the pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Game physics
let velocityX = -2; // Speed of pipes moving left
let velocityY = 0; // Jump speed of bird
let gravity = 0.4;

//Collision variable for game over
let gameOver = false;

//Score Variable
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;

  //Used for drawing on the board
  context = board.getContext("2d");

  /*Drawing the bird
  context.fillStyle = "green";
  context.fillRect(birdX, birdY, bird.width, bird.height);*/

  //Loading the bird image
  birdImg = new Image();
  birdImg.src = "./bird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  //Loading the pipe images
  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);
  //Generation of pipes, interval 1.5s
  setInterval(placePipes, 1500);
  //Generating the jump function
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return; //Prevents canvas from being drawn due to collision
  }
  context.clearRect(0, 0, board.width, board.height);

  //Drawing the bird repeatedly for each frame
  velocityY += gravity;
  //bird.y += velocityY;
  //To ensure bird doesnt move beyond canvas
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true; //Stops game when bird goes below canvas
  }

  //Drawing the pipes repeatedly every 1.5s
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    //Counting score
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //Because there are 2 pipes
      pipe.passed = true;
    }

    //Checking Collision
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //Clearing pipes going left the canvas
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //Removes 1st element from array
  }

  //Generating Score
  context.fillStyle = "white";
  context.font = "45px Montserrat";
  context.fillText(score, 5, 45);

  //Showing "Game Over" after collision
  if (gameOver) {
    context.fillText("GAME OVER", 300, 90);
  }
}
function placePipes() {
  if (gameOver) {
    return; //Prevents pipes from being generated due to collision
  }
  //Randomising height of pipes as they move to the left
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

  //Defining space between bottom and top pipe
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false, //Check if bird has passed the pipes
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //Jump function
    velocityY = -6;

    //Reseting game for requestAnimationFrame
    if (gameOver) {
      (bird.y = birdY), (pipeArray = []), (score = 0), (gameOver = false);
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
