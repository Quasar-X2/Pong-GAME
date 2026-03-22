let ballX, ballY, ballSpeedX, ballSpeedY;
let ballRadius = 7.5;

let leftPaddleY, rightPaddleY;
let paddleWidth = 10;
let paddleHeight = 50;
let cornerRadius = 10;

let leftScore, rightScore;

let gameState = "menu";
let timer = 3;
let fadeAlpha = 0;

function setup() {
  createCanvas(600, 600);
  resetBall(1);
  leftPaddleY = 250;
  rightPaddleY = 250;
  leftScore = 0;
  rightScore = 0;
}

function draw() {
  background(0);

  if (gameState === "menu") {
    showMenu();
  } else if (gameState === "countdown") {
    showCountdown();
  } else if (gameState === "play") {
    playGame();
  } else if (gameState === "gameOver") {
    showGameOver();
  }
}

function showMenu() {
  fill(255);
  textAlign(CENTER);
  textSize(50);
  text("PONG", width / 2, height / 2 - 50);
  textSize(20);
  text("Left Player Controls: W & S", width / 2, height / 2 + 20);
  text("Right Player Controls: Up & Down Arrows", width / 2, height / 2 + 50);
  textSize(25);
  fill(245, 243, 152);
  text("Press SPACE to Start", width / 2, height / 2 + 120);
  if (keyIsDown(32)) {
    gameState = "countdown";
    timer = 3;
    fadeAlpha = 0; 
  }
}

function showCountdown() {
  drawArena();
  filter(BLUR, 3); // Applies blur to everything drawn so far
  
  fill(255);
  noStroke();
  textSize(100);
  textAlign(CENTER, CENTER);
  text(ceil(timer), width / 2, height / 2);
  
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }
  if (timer <= 0) {
    gameState = "play";
  }
}

function playGame() {
  drawArena();
  movePaddles();
  
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY - ballRadius < 0 || ballY + ballRadius > height) {
    ballSpeedY *= -1;
  }

  if (ballX - ballRadius < 30 && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
    if (ballSpeedX < 0) {
      ballSpeedX *= -1;
      ballX = 30 + ballRadius;
    }
  }

  if (ballX + ballRadius > 570 && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
    if (ballSpeedX > 0) {
      ballSpeedX *= -1;
      ballX = 570 - ballRadius;
    }
  }

  if (ballX < 0) {
    rightScore++;
    if (rightScore >= 5) gameState = "gameOver";
    else resetBall(1);
  } else if (ballX > width) {
    leftScore++;
    if (leftScore >= 5) gameState = "gameOver";
    else resetBall(-1);
  }
}

function showGameOver() {
  drawArena();
  
  noStroke();
  fill(0, fadeAlpha);
  rect(0, 0, width, height);
  if (fadeAlpha < 255) fadeAlpha += 5;

  if (fadeAlpha >= 200) {
    fill(255);
    textAlign(CENTER);
    textSize(50);
    if (leftScore >= 5) {
      fill(0, 255, 255);
      text("BLUE WINS!", width / 2, height / 2 - 20);
    } else {
      fill(255, 100, 0);
      text("ORANGE WINS!", width / 2, height / 2 - 20);
    }
    fill(255);
    textSize(20);
    text("Press SPACE to Play Again", width / 2, height / 2 + 50);
    if (keyIsDown(32)) {
      leftScore = 0;
      rightScore = 0;
      fadeAlpha = 0;
      gameState = "countdown";
      timer = 3;
      resetBall(1);
    }
  }
}

function drawArena() {
  stroke(255);
  strokeWeight(6);
  line(300, 0, 300, 600);
  noStroke();
  fill(0, 255, 255);
  rect(20, leftPaddleY, paddleWidth, paddleHeight, cornerRadius);
  fill(255, 100, 0);
  rect(570, rightPaddleY, paddleWidth, paddleHeight, cornerRadius);
  fill(245, 243, 152);
  circle(ballX, ballY, ballRadius * 2);
  strokeWeight(1);
  textSize(32);
  textAlign(CENTER);
  fill(255);
  text(leftScore, 150, 50);
  text(rightScore, 450, 50);
}

function movePaddles() {
  if (keyIsDown(87)) leftPaddleY -= 6;
  if (keyIsDown(83)) leftPaddleY += 6;
  if (keyIsDown(UP_ARROW)) rightPaddleY -= 6;
  if (keyIsDown(DOWN_ARROW)) rightPaddleY += 6;
  leftPaddleY = constrain(leftPaddleY, 0, height - paddleHeight);
  rightPaddleY = constrain(rightPaddleY, 0, height - paddleHeight);
}

function resetBall(direction) {
  ballX = 300;
  ballY = 300;
  ballSpeedX = 4 * direction;
  ballSpeedY = random(-3, 3);
}