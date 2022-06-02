class Meteorite {
  constructor() {
    this.position = { x: randomPosition().x, y: -380 };
    this.size = cellSize;
    this.color = meteoriteColor;
    this.delay = 5;
  }
  draw() {
    let { x, y } = this.position;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255,255,255,.2 )";
    ctx.fillRect(x, y, this.size, this.size);
  }
  hitSnake() {
    for (const body of snake.bodies) {
      if (isCollision({ x: body.x, y: body.y }, this.position)) {
        snake.alive = false;
      }
    }
  }
  update() {
    this.draw();
    this.hitSnake();
    if (!this.delay--) {
      zoneTime--;
      this.position.y += this.size;
      if (this.position.y > canvas.height) {
        zoneTime = 18;
        this.position.y = -380;
        this.position.x = randomPosition().x;
      }
      this.delay = 5;
    }
  }
}
