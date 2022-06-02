class Particle {
  constructor(pos, color, size, vel) {
    this.pos = pos;
    this.color = color;
    this.size = Math.abs(size / 2);
    this.ttl = 0;
    this.gravity = -0.2;
    this.vel = vel;
  }
  draw() {
    let { x, y } = this.pos;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.size, this.size);
    ctx.globalCompositeOperation = "source-over";
  }
  update() {
    this.draw();
    this.size -= 0.3;
    this.ttl += 1;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.vel.y -= this.gravity;
  }
}
