class Snake {
  constructor(type) {
    this.position = { x: canvas.width / 2, y: canvas.height / 2 };
    this.direction = { x: 0, y: 0 };
    this.size = cellSize;
    this.alive = true;
    this.type = type;
    this.bodies = [];
    this.color = "#3282B8";
    this.total = 1;
    this.delay = 5;
  }

  draw() {
    let { x, y } = this.position;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255,255,255,.2 )";
    ctx.fillRect(x, y, this.size, this.size);

    if (this.total >= 2) {
      this.bodies.forEach((block) => {
        let { x, y } = block;
        ctx.lineWidth = 1;
        ctx.fillStyle = "#BBE1FA";
        ctx.fillRect(x, y, this.size, this.size);
      });
    }
  }
  move() {
    switch (currentDirection) {
      case "LEFT":
        this.direction = { x: -this.size, y: 0 };
        break;
      case "UP":
        this.direction = { x: 0, y: -this.size };
        break;
      case "RIGHT":
        this.direction = { x: +this.size, y: 0 };
        break;
      case "DOWN":
        this.direction = { x: 0, y: +this.size };
        break;
      default:
        break;
    }
  }
  eatFood() {
    if (isCollision({ x: food.x, y: food.y }, this.position)) {
      if (food.isBigFood) {
        score += 4;
        food.isBigFood = !food.isBigFood;
      }
      isSoundOn ? eatEffect.play() : undefined;
      score++;
      scoreValue.textContent = score < 10 ? `0${score}` : score;
      particleSplash();
      // food.isBigFood = false;
      food.spawn();
      this.total++;
    }
  }
  hitPort() {
    ports.forEach((port) => {
      if (isCollision({ x: port.x1, y: port.y1 }, this.position)) {
        this.position.x = port.x2;
        this.position.y = port.y2;
      } else if (isCollision({ x: port.x2, y: port.y2 }, this.position)) {
        this.position.x = port.x1;
        this.position.y = port.y1;
      }
    });
  }
  hitBoom() {
    booms.forEach((boom) => {
      if (isCollision({ x: boom.x, y: boom.y }, this.position)) {
        if (score > 0) {
          score--;
        } else {
          score = 0;
        }
        scoreValue.textContent = score < 10 ? `0${score}` : score;
        this.bodies.shift();
        this.total--;
        booms.delete(boom);
        boomList--;
      }
    });
  }
  hitBlock() {
    blocks.forEach((block) => {
      if (isCollision({ x: block.x, y: block.y }, this.position)) {
        isSoundOn ? hitWallEffect.play() : undefined;
        this.alive = false;
        this.total = 0;
      }
    });
  }
  hitSeparate() {
    separates.forEach((block) => {
      if (isCollision({ x: block.x, y: block.y }, this.position)) {
        isSoundOn ? hitWallEffect.play() : undefined;
        this.alive = false;
        this.total = 0;
      }
    });
  }
  settingWall() {
    if (!isWall) {
      canvas.classList.remove("expand");
      let { x, y } = this.position;
      if (x + cellSize > canvas.width) {
        this.position.x = 0;
      } else if (y + cellSize > canvas.height) {
        this.position.y = 0;
      } else if (x < 0) {
        this.position.x = canvas.width - cellSize;
      } else if (y < 0) {
        this.position.y = canvas.height - cellSize;
      }
    } else {
      canvas.classList.add("expand");
      let { x, y } = this.position;
      if (x < 0 || x === canvas.width || y < 0 || y === canvas.height) {
        this.alive = false;
        isSoundOn ? hitWallEffect.play() : undefined;
      }
    }
  }
  selfCollision() {
    this.bodies.some((body) => {
      if (isCollision(body, this.position)) {
        this.alive = false;
      }
    });
  }

  update() {
    this.settingWall();
    this.draw();
    this.move();
    if (this.total < 1) {
      this.alive = false;
    }
    if (!this.delay--) {
      this.eatFood();
      this.hitBoom();
      this.hitBlock();
      this.hitPort();
      this.hitSeparate();

      this.bodies[this.total - 1] = {
        x: this.position.x,
        y: this.position.y,
      };

      for (let i = 0; i < this.total - 1; i++) {
        this.bodies[i] = this.bodies[i + 1];
      }

      this.position.x += this.direction.x;
      this.position.y += this.direction.y;
      this.total > 3 ? this.selfCollision() : null;
      this.delay = 5;
    }
  }
}
