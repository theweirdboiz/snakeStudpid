class Boom {
  constructor(x, y) {
    this.position = { x: this.x, y: this.y };
    this.size = cellSize;
    this.color = "#222738";
    this.spawn();
  }
  spawn() {
    let randX = ~~(Math.random() * cells) * this.size;
    let randY = ~~(Math.random() * cells) * this.size;
    const rand = { x: randX, y: randY };
    for (const body of snake.bodies) {
      if (isCollision({ x: body.x, y: body.y }, rand)) {
        return this.spawn();
      }
    }
    this.x = rand.x;
    this.y = rand.y;
  }
  clear() {
    ctx.clearRect(this.x, this.y, this.size, this.size);
  }

  draw() {
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = this.size;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
  }
}
