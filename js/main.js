const param = new URLSearchParams(document.location.search); // Get user player-name and game-level
const h1 = document.querySelector('h1');
const username = document.querySelector('#username');
const scoreObject = document.querySelector('#score');
const timeLimit = document.querySelector('#time-limit');
const birdsKilled = document.querySelector('#birds-killed');

username.innerText = `${param.get('player-name')}`;
scoreObject.innerText = `Score: 0`;
timeLimit.innerText = `Time Limit: 0:0`;
birdsKilled.innerText = `Birds Killed: 0`;
h1.innerText = `Welcome ${param.get('player-name')}`;

// prevent all images on document from being dragged
document.addEventListener('dragstart', function(e) {
  if (e.target.matches('img')) {
    e.preventDefault();
  }
})

// Start Game
document.addEventListener('click', function(e) {
  if (e.target.matches('button')) {
    e.target.parentElement.remove();
    startGame();
  }
})

function gunSound() {
  let gun = new Audio('../audio/9mm-pistol-shot-6349.mp3');
  gun.play();
}

function startGame() {
  Bird.score = 0;
  Bird.birdsKilled = 0;
  scoreObject.innerText = `Score: 0`;
  birdsKilled.innerText = `Birds Killed: 0`;
  document.body.style.cursor = "url('../img/pointer.png'), auto"; // Change cursor shape to gun
  let bird;
  document.addEventListener('click', gunSound);
  let birdsSound = new Audio('../audio/bird-voices-7716.mp3');
  birdsSound.play();
  
  // Create a new random bird in a random position at left of the screen every (250 - 500) milliseconds
  let birdsCreationInterval = setInterval(() => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        birdArray.push(new SmallBird({x: -60, y: 50 + (Math.round(Math.random() * (window.innerHeight-100)))}, param.get('game-level')));
        break;
      case 1:
        birdArray.push(new MediumBird({x: -80, y: 50 + (Math.round(Math.random() * (window.innerHeight-125)))}, param.get('game-level')));
        break;
      case 2:
        birdArray.push(new LargeBird({x: -100, y: 50 + (Math.round(Math.random() * (window.innerHeight-150)))}, param.get('game-level')));
    }
  }, 250 + (Math.random() * 250));
 
  // Create a new bomb in a random position from the top of the screen every (5 - 10) seconds
  let bombInterval = setInterval( () => {
    let bomb = new Bomb();
  }, 5000 + (Math.random() * 5000))

  let currentTime = 59; // 1 minute

  let timeInterval = setInterval( () => {
    // Sort birdArray based on whether it's exist or not
    birdArray.sort(function(a, b) {
      let A = a.exist, B = b.exist;
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });

    // Remove from birdArray any object with exist = false
    while (birdArray[0].exist == false)
      birdArray.shift();
    timeLimit.innerText = `Time Limit: 0:${currentTime--}`; // Update Timer

    // Game Over
    if (currentTime < 0) {
      clearInterval(birdsCreationInterval);
      clearInterval(bombInterval);
      clearInterval(timeInterval);
      
      while (document.images.length > 0) {
        document.images[0].remove();
      } // Remove remaining birdes
      
      while (birdArray.length > 0) {
        birdArray.shift(); 
      } // Empty birdArray to prepare for a new game 
      
      let menu = document.createElement('div'),
          h1Object = document.createElement('h1'),
          img = document.createElement('img'),
          btn = document.createElement('button');
      menu.classList.add('menu');
      btn.innerText = 'Play Again';
      
      if (Bird.score >= 50) {
        h1Object.innerText = 'You Win';
        img.src = '../img/win.png.png';
      } // Win
      else {
        h1Object.innerText = 'You Lose';
        img.src = '../img/lose.png';
      } // Lose

      menu.append(h1Object, img, btn);
      document.querySelector('.container').insertAdjacentElement("beforeend", menu);
      document.body.style.cursor = "auto";
      document.removeEventListener('click', gunSound);
      birdsSound.pause();
    }
  }, 1000)
}