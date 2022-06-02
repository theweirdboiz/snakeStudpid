class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.position = { x: this.x, y: this.y };
    this.size = cellSize;
    this.color = "#BBBFCA";
    this.spawn();
  }
  spawn() {
    const rand = { x: this.x, y: this.y };
    rand.x === food.x && rand.y === food.y ? this.spawn() : undefined;
    for (const body of snake.bodies) {
      rand.x === body.x && rand.y === body.y ? this.spawn() : undefined;
    }
    this.x = rand.x;
    this.y = rand.y;
  }
  draw() {
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.size, this.y + this.size);
    ctx.moveTo(this.x + this.size, this.y);
    ctx.lineTo(this.x, this.y + this.size);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;
  }
}
