const Snow = {
  interval: null,
  canvas: null,
  ctx: null,
  flakes: [],

  init: function () {
    this.cleanup(); // Ensure clean state

    this.canvas = document.getElementById("snow");
    if (!this.canvas) return; // Guard clause if canvas is missing

    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.flakes = [];
    for (let i = 0; i < 150; i++) {
      this.flakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 4 + 1,
        d: Math.random() * 1,
      });
    }

    // Start animation loop
    this.interval = setInterval(() => this.drawSnow(), 25);

    // Handle resize
    window.addEventListener("resize", this.handleResize);
  },

  handleResize: function () {
    if (Snow.canvas) {
      Snow.canvas.width = window.innerWidth;
      Snow.canvas.height = window.innerHeight;
    }
  },

  drawSnow: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();

    for (let i = 0; i < this.flakes.length; i++) {
      let f = this.flakes[i];
      this.ctx.moveTo(f.x, f.y);
      this.ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }

    this.ctx.fill();
    this.moveSnow();
  },

  moveSnow: function () {
    this.angle += 0.01;
    for (let i = 0; i < this.flakes.length; i++) {
      let f = this.flakes[i];
      f.y += Math.pow(f.d, 2) + 1;
      f.x += Math.sin(this.angle) * 0.5;

      if (f.y > this.canvas.height) {
        this.flakes[i] = {
          x: Math.random() * this.canvas.width,
          y: 0,
          r: f.r,
          d: f.d,
        };
      }
    }
  },

  angle: 0,

  cleanup: function () {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    window.removeEventListener("resize", this.handleResize);
  },
};

window.Snow = Snow;

// Auto-init if not in a router environment yet (backward compatibility)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Snow.init());
} else {
  Snow.init();
}
