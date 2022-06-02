class Food {
  constructor() {
    this.position = { x: this.x, y: this.y };
    this.size = cellSize;
    this.isBigFood = false;
    this.isBonus = randomBonus();
    this.countDown = 200;
    this.color = currentHue = randomColor();
    this.spawn();
  }
  spawn() {
    let randX = ~~(Math.random() * cells) * this.size;
    let randY = ~~(Math.random() * cells) * this.size;

    const rand = { x: randX, y: randY };

    for (const body of snake.bodies) {
      if (body.x === rand.x && body.y === rand.y) {
        return this.spawn();
      }
    }
    for (const block of blocks) {
      if (block.x === rand.x && block.y === rand.y) {
        return this.spawn();
      }
    }
    for (const boom of booms) {
      if (boom.x === rand.x && boom.y === rand.y) {
        return this.spawn();
      }
    }
    this.color = currentHue = randomColor();
    this.countDown = 200;
    this.x = rand.x;
    this.y = rand.y;
    this.isBonus = randomBonus();
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
