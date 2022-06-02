class Port {
  constructor() {
    this.size = cellSize;
    this.x1 = Math.floor(Math.random() * cells) * cellSize;
    this.y1 = 0;
    this.x2 = Math.floor(Math.random() * cells) * cellSize;
    this.y2 = canvas.height - this.size;
    this.position = { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
    this.color = "#7c3e66";
    this.spawn();
  }
  spawn() {
    let randX1 = Math.floor(Math.random() * cells) * cellSize;
    let randX2 = Math.floor(Math.random() * cells) * cellSize;

    const rand = { x1: randX1, y1: this.y1, x2: randX2, y2: this.y2 };

    this.x1 = rand.x1;
    this.y1 = rand.y1;
    this.x2 = rand.x2;
    this.y2 = rand.y2;
  }
  clear() {
    ctx.clearRect(this.x, this.y, this.size, this.size);
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x1, this.y1, this.size, this.size);
    ctx.fillRect(this.x2, this.y2, this.size, this.size);
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
  }
}
