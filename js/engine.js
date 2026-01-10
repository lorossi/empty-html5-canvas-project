import { Color } from "./color.js";
import { Point } from "./point.js";
import "./jszip.js";

/** Class containing the main engine running a canvas */
class Engine {
  /**
   * Create the engine controlling a canvas
   * @param {object} canvas DOM element containing the canvas
   */
  constructor(canvas) {
    this._canvas = canvas;

    // init variables
    this._frame_count = 0;
    this._no_loop = false;
    this._is_recording = false;
    this._first_frame_recorded = 0;
    this._frames_recorded = 0;
    this._zip = null;
    this._raf_id = null;

    // delta time buffer
    this._dt_buffer = new MovingAverage(30);
    // last timed frame
    this._last_timestamp = 0;

    // mouse coordinates
    this._mouse_coords = new Point(0, 0);
    this._p_mouse_coords = new Point(0, 0);

    // extract the drawing context
    this._ctx = this._canvas.getContext("2d", { alpha: false });

    // start sketch
    this._run();
  }

  /**
   * Starts the sketch
   * @private
   */
  _run() {
    // anti alias
    this._ctx.imageSmoothingQuality = "high";
    this.preload();
    this.setup();
    this._timeDraw();
  }

  /**
   * Handles time update
   * @private
   */

  _timeDraw(timestamp) {
    // request next frame and store the id
    this._raf_id = window.requestAnimationFrame(this._timeDraw.bind(this));

    if (timestamp === undefined) return;
    if (this._no_loop) return;
    if (this._last_timestamp === 0) {
      this._last_timestamp = timestamp;
    }
    const dt = timestamp - this._last_timestamp;

    // draw the frame
    this._ctx.save();
    this.draw(dt);
    this._ctx.restore();

    // save current frame if recording
    if (this._is_recording) {
      // compute frame name
      const frame_count = this._frame_count - this._first_frame_recorded;
      const filename = frame_count.toString().padStart(7, 0) + ".png";
      // extract data from canvas
      const data = this._canvas.toDataURL("image/png").split(";base64,")[1];
      // add frame to zip
      this._zip.file(filename, data, { base64: true });
      // update the count of recorded frames
      this._frames_recorded++;
    }

    // update delta time buffer
    this._dt_buffer.push(dt);
    this._last_timestamp = timestamp;

    // update frame count and timing
    this._frame_count++;
  }

  /**
   * Starts looping the script
   */
  loop() {
    this._no_loop = false;
  }

  /**
   * Stops looping the script
   */
  noLoop() {
    this._no_loop = true;
  }

  /**
   * Completely stop the engine.
   * Note that this step is final and there's no way to programatically restart it after this call.
   */
  stop() {
    if (this._raf_id !== null) {
      window.cancelAnimationFrame(this._raf_id);
      this._raf_id = null;
    }
  }

  /**
   * Start recording frames
   */
  startRecording() {
    this._is_recording = true;
    this._first_frame_recorded = this._frame_count;
    this._frames_recorded = 0;
    this._zip = new JSZip();
  }

  /**
   * Stop recording frames
   */
  stopRecording() {
    this._is_recording = false;
  }

  /**
   * Save the recording as a series of frames in a zip file
   * @param {string} filename of the file to download
   */
  saveRecording(filename = "frames.zip") {
    // if the recording is not active, do nothing
    // also skipped if no frame has been recorded
    if (this._is_recording || this._zip == null || this._frames_recorded == 0)
      return;

    // download zip file
    this._zip.generateAsync({ type: "blob" }).then((blob) => {
      // convert blob to url
      const data = URL.createObjectURL(blob);
      //
      this._downloadFile(filename, data);
    });
  }

  /**
   * Save current frame
   * @param {string} [title] The image filename (optional).
   */
  saveFrame(title = null) {
    if (title == null)
      title = "frame-" + this._frame_count.toString().padStart(6, 0);

    this._downloadFile(title, this._canvas.toDataURL("image/png"));
  }

  /**
   * Returns the coordinates corresponding to a mouse/touch event
   * @param {object} e event
   * @returns {Point} x,y coordinates
   * @private
   */
  _calculatePressCoords(e) {
    // calculate size ratio
    const boundingBox = this._canvas.getBoundingClientRect();
    const ratio =
      Math.min(boundingBox.width, boundingBox.height) /
      this._canvas.getAttribute("width");
    // calculate real mouse/touch position
    if ("touches" in e) {
      // we're dealing with a touchscreen
      if (e.touches.length > 0) {
        // touch has been pressed
        const tx = (e.touches[0].pageX - boundingBox.left) / ratio;
        const ty = (e.touches[0].pageY - boundingBox.top) / ratio;
        return new Point(tx, ty);
      }
      // touch has been released
      return new Point(-1, -1);
    } else {
      // we're dealing with a mouse
      const mx = (e.pageX - boundingBox.left) / ratio;
      const my = (e.pageY - boundingBox.top) / ratio;
      return new Point(mx, my);
    }
  }

  /**
   * Create and download a file
   * @param {string} filename name of the file
   * @param {string} data data url or base64 data
   * @private
   */
  _downloadFile(filename, data) {
    // create file
    const container = document.createElement("a");

    container.href = data;
    container.setAttribute("download", filename);
    document.body.appendChild(container);
    // download file
    container.click();
    document.body.removeChild(container);
  }

  /**
   * Handler for mouse click/touchscreen tap
   * @param {MouseEvent} e event
   */
  clickHandler(e) {
    const p = this._calculatePressCoords(e);
    this.click(p.x, p.y);
  }

  /**
   * Handler for mouse down
   * @param {MouseEvent} e event
   */
  mouseDownHandler(e) {
    this._mouse_pressed = true;
    const p = this._calculatePressCoords(e);
    this.mouseDown(p.x, p.y);
  }

  /**
   * Handler for mouse up
   * @param {MouseEvent} e event
   */
  mouseUpHandler(e) {
    this._mouse_pressed = false;
    const p = this._calculatePressCoords(e);
    this.mouseUp(p.x, p.y);
  }

  /**
   * Handler for moved mouse
   * @param {MouseEvent} e event
   */
  mouseMoveHandler(e) {
    const p = this._calculatePressCoords(e);

    // update mouse position
    this._p_mouse_coords = this._mouse_coords.copy();
    this._mouse_coords = p.copy();

    if (!this._mouse_pressed) {
      this.mouseMoved(p.x, p.y);
    } else {
      this.mouseDragged(p.x, p.y);
    }
  }

  /**
   * Handler for key pressed event
   * @param {KeyboardEvent} e event
   */
  keyDownHandler(e) {
    this.keyDown(e.key, e.code);
  }

  /**
   * Handler for key up event
   * @param {KeyboardEvent} e event
   */
  keyUpHandler(e) {
    this.keyUp(e.key, e.code);
  }

  /**
   * Handler for key press event
   * @param {KeyboardEvent} e event
   */
  keyPressHandler(e) {
    this.keyPress(e.key, e.code);
  }

  /**
   * Public callback for mouse click and touchscreen tap
   * @param {number} x coordinate of the click/tap location
   * @param {number} y coordinate of the click/tap location
   */
  click(x, y) {}

  /**
   * Public callback for mouse and touchscreen pressed
   * @param {number} x coordinate of the click/tap location
   * @param {number} y coordinate of the click/tap location
   */
  mouseDown(x, y) {}

  /**
   * Public callback for mouse and touchscreen drag
   * @param {number} x coordinate of the click/tap location
   * @param {number} y coordinate of the click/tap location
   */
  mouseDragged(x, y) {}

  /**
   * Public callback for mouse and touchscreen up
   * @param {number} x coordinate of the click/tap location
   * @param {number} y coordinate of the click/tap location
   */
  mouseUp(x, y) {}

  /**
   * Public callback for mouse and touchscreen moved
   * @param {number} x coordinate of the click/tap location
   * @param {number} y coordinate of the click/tap location
   */
  mouseMoved(x, y) {}

  /**
   * Public callback for key press
   * @param {string} key pressed key
   * @param {string} code code of the pressed key
   */
  keyPress(key, code) {}

  /**
   * Public callback for key down
   * @param {string} key pressed key
   * @param {number} code code of the pressed key
   */
  keyDown(key, code) {}

  /**
   * Public callback for key up
   * @param {string} key pressed key
   * @param {number} code code of the pressed key
   */
  keyUp(key, code) {}

  /**
   * Set the background color for the canvas
   * @param {string | number} color Color can be a CSS< RGB, RGBA, HEX, HEAX, HSL, HSLA string, a Color object, or a monochrome value (number)
   */
  background(color) {
    // reset background
    this._ctx.save();
    // reset canvas
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    // set background
    if (typeof color === "number")
      this._ctx.fillStyle = Color.fromMonochrome(color).rgba;
    else if (color instanceof Color) this._ctx.fillStyle = color.rgba;
    else this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }

  /**
   * Scale the canvas by a factor from the center.
   * If only one parameter is passed, the canvas will be scaled uniformly.
   * @param {number} x scaling factor in the x direction
   * @param {number} y scaling factor in the y direction
   */
  scaleFromCenter(x, y = null) {
    if (y == null) y = x;

    this._ctx.translate(this._canvas.width / 2, this._canvas.height / 2);
    this._ctx.scale(x, y);
    this._ctx.translate(-this._canvas.width / 2, -this._canvas.height / 2);
  }

  /**
   * Function ran once, before the sketch is actually loaded
   */
  preload() {}

  /**
   * Function ran once
   */
  setup() {}

  /**
   * Main sketch function, will be run continuously unless noLoop() is called
   * @param {number} dt Delta time in milliseconds since last frame
   */
  draw(dt) {}

  /**
   * Get the current drawing context
   * @returns {object} The current drawing context
   */
  get ctx() {
    return this._ctx;
  }

  /**
   * Get the current drawing canvas
   * @returns {object} The current drawing canvas
   */
  get canvas() {
    return this._canvas;
  }

  /**
   * Get the count of frames since the start
   * @returns {number} The number of total frames
   */
  get frameCount() {
    return this._frame_count;
  }

  /**
   * Get the current framerate as frames per second (fps)
   * @returns {number} The current fps
   */
  get frameRate() {
    return 1000 / this._dt_buffer.latest;
  }

  /**
   * Get the average framerate as frames per second (fps)
   * @returns {number} The average fps
   */
  get frameRateAverage() {
    return 1000 / this._dt_buffer.average;
  }

  /**
   * Get the current framerate as milliseconds per frame (mspf)
   * @returns {number} The current mspf
   */
  get deltaTime() {
    return this._dt_buffer.latest;
  }

  /**
   * Get the average framerate as milliseconds per frame (mspf)
   * @returns {number} The average mspf
   */
  get deltaTimeAverage() {
    return this._dt_buffer.average;
  }

  /**
   * Get the drawing area width
   * @returns {number} The drawing area width
   */
  get width() {
    return this._canvas.width;
  }

  /**
   * Get the drawing area height
   * @returns {number} The drawing area height
   */
  get height() {
    return this._canvas.height;
  }

  /**
   * Get the current recording state
   * @returns {boolean} The current recording state
   */
  get is_recording() {
    return this._is_recording;
  }

  /**
   * Get the current mouse position
   * @returns {Point} The current mouse position
   * @readonly
   */
  get mousePosition() {
    return this._mouse_coords.copy();
  }

  /**
   * Get the previous mouse position
   * @returns {Point} The previous mouse position
   * @readonly
   */
  get prevMousePosition() {
    return this._p_mouse_coords.copy();
  }
}

/**
 * Class for a moving average buffer.
 * @private
 */
class MovingAverage {
  /**
   *
   * @param {number} size of the buffer
   */
  constructor(size) {
    this._size = size;

    this._sum = 0;
    this._count = 0;
    this._average = 0;

    this._buffer = new Array(size).fill(0);
  }

  /**
   * Add a value to the buffer
   * @param {number} value value to add
   */
  push(value) {
    const index = this._count % this._size;
    this._sum += value - this._buffer[index];
    this._buffer[index] = value;

    this._count++;
    const size = Math.min(this._count, this._size);
    this._average = this._sum / size;
  }

  /**
   * Get the current average
   * @returns {number} average
   */
  get average() {
    return this._average;
  }

  /**
   * Get the last stored value
   * @returns {number} last value
   */
  get latest() {
    if (this._count == 0) return 0;

    const index = (this._count - 1) % this._size;
    return this._buffer[index];
  }
}

export { Engine };
