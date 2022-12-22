const birdArray = [];

class Bird {
  #image;
  #position;
  #destinationY;
  #exist;
  #fallingSpeed
  static #count = 0;
	static #birdsKilled = 0;
  static #score = 0;
	
	constructor (_image, _position, _level) {
    if (new.target === Bird) {
      throw new TypeError("Cannot construct Bird instances directly");
    }
    this.#exist = true;
    Bird.#count++;
    this.#image = document.createElement("img");
    this.#image.src = _image;
    this.#position = _position;
    this.#image.style.position = 'absolute';
    this.#image.style.left = `${this.#position.x}px`;
    this.#image.style.top = `${this.#position.y}px`;
    this.#destinationY = 100 + (Math.round(Math.random() * (window.innerHeight - 200)));
    this.move(_level);
    this.#fallingSpeed = 1;
    this.#image.addEventListener('click', this.kill)
	}

  kill = () => {
    this.#fallingSpeed *= 1.1;
    if (parseInt(this.#image.style.top) < window.innerHeight) {
      this.#image.style.top = `${parseInt(this.#image.style.top) + this.#fallingSpeed}px`;
      window.requestAnimationFrame(this.kill);
    }
    else {
      this.#image.remove();
    }
    
    if (this.#exist) {
      // Extract bird type name, for example "bird_small" then add "_killed.png" to load the static image of the bird indicating that the bird is killed
      this.#image.src = `../img/${this.#image.src.split('/')[this.#image.src.split('/').length - 1].slice(0, -4)}_killed.png`;
      
      this.#exist = false;
      Bird.#birdsKilled++;
      
      if (this.#image.src.includes('bird_small'))
        Bird.#score += 10;
      else if (this.#image.src.includes('bird_medium'))
        Bird.#score += 5;
      else if (this.#image.src.includes('bird_large')) {
        if (Bird.#score >= 10)
          Bird.#score -= 10;
        else
          Bird.#score = 0;
      }
      
      birdsKilled.innerText = `Birds Killed: ${Bird.#birdsKilled}`;
      scoreObject.innerText = `Score: ${Bird.#score}`;
    }
  }

  get exist() {
    return this.#exist;
  }

  get image() {
    return this.#image;
  }

  move(level) {
    let speed;
    switch (level) {
      case 'easy':
        speed = 2;
        if (parseInt(this.#image.style.left) < window.innerWidth) {
          this.#image.style.left = `${parseInt(this.#image.style.left) + speed}px`;
          window.requestAnimationFrame(this.move.bind(this, 'easy'));
        }
        else {
          this.#exist = false;
          this.#image.remove();
        }
        break;
      case 'medium':
        speed = 3;
        let deltaY = (this.#destinationY - this.#position.y);
        if (parseInt(this.#image.style.left) < window.innerWidth) {
          this.#image.style.left = `${parseInt(this.#image.style.left) + speed}px`;
          this.#image.style.top = `${parseInt(this.#image.style.top) + (deltaY / window.innerHeight) * speed}px`
          window.requestAnimationFrame(this.move.bind(this, 'medium'));
        }
        else {
          this.#exist = false;
          this.#image.remove();
        }
        break;
      case 'hard':
        speed = 5;
        let _deltaY = (this.#destinationY - this.#position.y);
        if (parseInt(this.#image.style.left) < window.innerWidth) {
          this.#image.style.left = `${parseInt(this.#image.style.left) + speed}px`;
          this.#image.style.top = `${parseInt(this.#image.style.top) + (_deltaY / window.innerHeight) * speed}px`
          window.requestAnimationFrame(this.move.bind(this, 'hard'));
        }
        else {
          this.#exist = false;
          this.#image.remove();
        }
    }
  }

  static set birdsKilled(_b) {
    Bird.#birdsKilled = 0;
  }

  static get birdsKilled() {
    return Bird.#birdsKilled;
  }

  static set score(_score) {
    Bird.#score = 0;
  }

  static get score() {
    return Bird.#score;
  }
}

class SmallBird extends Bird {  
  constructor (position, level) {
    super('../img/bird_small.gif', position, level);
    this.image.classList.add('bird-small');
    document.body.append(this.image);
  }
}

class MediumBird extends Bird {  
  constructor (position, level) {
    super('../img/bird_medium.gif', position, level);
    this.image.classList.add('bird-medium');
    document.body.append(this.image);
  }
}

class LargeBird extends Bird {  
  constructor (position, level) {
    super('../img/bird_large.gif', position, level);
    this.image.classList.add('bird-large');
    document.body.append(this.image);
  }
}

class Bomb {
  #isExploded;
	#image;
  #speed;
	
	constructor () {
    this.#image = document.createElement("img");
    this.#image.src = '../img/bomb.png';
    this.#image.style.position = 'absolute';
    this.#image.style.left = `${Math.round(Math.random() * window.innerWidth)}px`;
    this.#image.style.top = `-100px`;
    this.#image.classList.add('bomb');
    this.#isExploded = false;
    document.body.append(this.#image);
    this.#speed = 1;
    this.fall(this.#speed);
    this.#image.addEventListener('click', () => {
      let explosion = new Audio('../audio/hq-explosion-6288.mp3');
      explosion.play();
      if (!this.#isExploded) {
        this.#speed = 0;

        // Update bomb image to explosion.gif and change top and left properties to make center of gravity of both bomb.png and explosion.gif identical (As each one has different width and height)
        let bombRefPoint = { x: this.#image.style.left, y: this.#image.style.top, width: this.#image.width, height: this.#image.height };
        this.#image.classList.remove('bomb');
        this.#image.classList.add('explosion');
        this.#image.src = '../img/explosion.gif';
        let explosionRefPoint = { x: this.#image.style.left, y: this.#image.style.top, width: this.#image.width, height: this.#image.height };
        this.#image.style.left = `${parseInt(this.#image.style.left) - 0.5 * (explosionRefPoint.width - bombRefPoint.width)}px`;
        this.#image.style.top = `${parseInt(this.#image.style.top) - 0.5 * (explosionRefPoint.height - bombRefPoint.height)}px`;
        this.#isExploded = true;
        setTimeout(() => {
          this.#image.remove();
        }, 1000);
      }

      // Calculate Bomb Center of Gravity
      let bombCG = {
        x: (parseInt(this.#image.style.left) + 0.5 * this.#image.width), 
        y: (parseInt(this.#image.style.top) + 0.5 * this.#image.height)
      }

      // Calculate each bird C.G. and determines whether it's in range of bomb influence
      for (let bird of birdArray) {
        let birdCG = {
          x: parseInt(bird.image.style.left) + 0.5 * bird.image.width,
          y: parseInt(bird.image.style.top) + 0.5 * bird.image.height
        }
        if (this.calculateDistance(bombCG, birdCG) < 250) {
          bird.kill();
        }
      }
    })
	}

  calculateDistance (cg1, cg2) {
    return Math.sqrt(Math.pow((cg2.x - cg1.x), 2) + Math.pow((cg2.y - cg1.y), 2));
  }
	
	fall() {
    // Simulate acceleraton movement not linear
    this.#speed *= 1.02;
		if (parseInt(this.#image.style.top) < window.innerHeight) {
      this.#image.style.top = `${Math.round(parseFloat(this.#image.style.top) + this.#speed)}px`;
      window.requestAnimationFrame(this.fall.bind(this));
    }
    else
      this.#image.remove();
	}
}