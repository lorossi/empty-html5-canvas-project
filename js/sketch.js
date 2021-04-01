class Sketch {
  constructor(canvas, ctx, fps) {
    this._canvas = canvas;
    this._ctx = ctx;
    this.setFps(fps);

    // init variables
    this._frameCount = 0;
    this._width = this._canvas.width;
    this._height = this._canvas.height;
  }

  setFps(fps) {
    // set fps
    this._fps = fps || 60;
    // keep track of time to handle fps
    this.then = performance.now();
    // time between frames
    this._fps_interval = 1 / this._fps;
  }

  run() {
    // bootstrap the sketch
    this.setup();
    // anti alias
    this._ctx.imageSmoothingQuality = "high";
    this._timeDraw();
  }

  _timeDraw() {
    // request another frame
    window.requestAnimationFrame(this._timeDraw.bind(this));
    let diff;
    diff = performance.now() - this.then;
    if (diff < this._fps_interval) {
      // not enough time has passed, so we request next frame and give up on this render
      return;
    }
    // update frame count
    this._frameCount++;
    // updated last frame rendered time
    this.then = performance.now();
    // now draw
    this._ctx.save();
    this.draw();
    this._ctx.restore();
  }

  background(color) {
    // reset background
    // reset canvas
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
    // set background
    this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  setup() {
    // ran once
    this.background("white");
  }

  draw() {
    // ran continuosly
  }
}


$(document).ready(() => {
  canvas = $("#sketch")[0];
  if (canvas.getContext) {
    ctx = canvas.getContext("2d", { alpha: false });
    s = new Sketch(canvas, ctx);
    s.run();
  }
});
