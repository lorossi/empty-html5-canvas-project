/**
 * HTML canvas simple engine.
 * GitHub repo and documentation: https://github.com/lorossi/empty-html5-canvas-project
 * @author Lorenzo Rossi <mail@lorenzoros.si>
 * @license MIT - 2022
 */

import { XOR128 } from "./xor128.js";
import {
  createNoise2D,
  createNoise3D,
  createNoise4D,
} from "./simplex-noise.js";

// colors string to rgb
const CSS_COLOR_NAMES = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  whitesmoke: [245, 245, 245],
  yellowgreen: [154, 205, 50],
};
Object.freeze(CSS_COLOR_NAMES);

const SANZO_WADA_COLORS = {
  aconiteviolet: [156, 82, 242],
  andovergreen: [92, 138, 115],
  antwarpblue: [0, 138, 161],
  apricotorange: [255, 115, 64],
  apricotyellow: [255, 230, 0],
  artemesiagreen: [101, 169, 143],
  benzolgreen: [0, 217, 115],
  black: [0, 0, 0],
  blackisholive: [50, 78, 42],
  blue: [13, 117, 255],
  blueviolet: [71, 51, 255],
  brickred: [163, 33, 0],
  brown: [108, 43, 17],
  buffycitrine: [136, 141, 42],
  burntsienna: [169, 52, 0],
  calamineblue: [128, 255, 204],
  cameopink: [230, 173, 207],
  carmine: [214, 0, 54],
  carminered: [161, 11, 43],
  cerulianblue: [41, 189, 173],
  cinnamonbuff: [255, 191, 110],
  cinnamonrufous: [194, 97, 44],
  citronyellow: [166, 212, 13],
  cobaltgreen: [148, 255, 148],
  coralred: [255, 115, 153],
  corinthianpink: [255, 166, 217],
  cossackgreen: [50, 142, 19],
  cotingapurple: [52, 0, 89],
  creamyellow: [255, 184, 82],
  darkcitrine: [126, 135, 67],
  darkgreenishglaucous: [179, 217, 163],
  darkmediciblue: [65, 119, 119],
  darkslatepurple: [83, 34, 92],
  darksoftviolet: [77, 82, 222],
  darktyrianblue: [13, 43, 82],
  deepgrayisholive: [80, 84, 35],
  deepindigo: [0, 8, 49],
  deeplyonsblue: [0, 36, 204],
  deepslategreen: [15, 38, 31],
  deepslateolive: [23, 39, 19],
  deepvioletplumbeous: [92, 114, 135],
  diaminegreen: [27, 142, 19],
  dullblueviolet: [110, 102, 212],
  dullvioletblack: [6, 0, 79],
  dullviridiangreen: [25, 204, 51],
  duskygreen: [0, 89, 46],
  duskymadderviolet: [45, 0, 96],
  ecru: [192, 180, 144],
  englishred: [222, 69, 0],
  eosinepink: [255, 94, 196],
  etruscanred: [201, 48, 62],
  eugeniareda: [237, 61, 102],
  eugeniaredb: [230, 46, 115],
  eupatoriumpurple: [191, 54, 224],
  fawn: [209, 176, 179],
  freshcolor: [255, 120, 140],
  glaucousgreen: [179, 232, 194],
  goldenyellow: [250, 148, 66],
  grayishlavendera: [184, 184, 255],
  grayishlavenderb: [191, 171, 204],
  green: [64, 201, 69],
  greenblue: [45, 188, 148],
  grenadinepink: [255, 97, 107],
  haysrusset: [104, 25, 22],
  helvetiablue: [0, 87, 186],
  hermosapink: [255, 179, 240],
  hydrangeared: [158, 25, 77],
  indianlake: [204, 26, 151],
  isabellacolor: [195, 165, 92],
  ivorybuff: [235, 217, 153],
  jasperred: [250, 43, 0],
  khaki: [182, 132, 0],
  krongbergsgreen: [117, 146, 67],
  laeliapink: [204, 133, 209],
  lemonyellow: [242, 255, 38],
  lightbrowndrab: [176, 134, 153],
  lightbrownisholive: [112, 105, 52],
  lightglaucousblue: [166, 230, 219],
  lightgrayisholive: [118, 132, 78],
  lightgreenyellow: [189, 242, 38],
  lightmauve: [145, 97, 242],
  lightpinkishcinnamon: [255, 191, 153],
  lightporcelaingreen: [35, 193, 124],
  lilac: [184, 117, 235],
  lincolngreen: [64, 84, 22],
  madderbrown: [101, 19, 0],
  maple: [194, 151, 90],
  marsbrowntobacco: [82, 32, 0],
  mineralgray: [159, 194, 178],
  naplesyellow: [250, 237, 143],
  neutralgray: [181, 209, 204],
  nightgreen: [122, 255, 0],
  nileblue: [191, 255, 230],
  ochraceoussalmon: [217, 158, 115],
  ochrered: [167, 55, 75],
  oilgreen: [110, 169, 0],
  oldrose: [217, 77, 153],
  olive: [113, 134, 0],
  olivebuff: [188, 211, 130],
  olivegreen: [88, 119, 30],
  oliveocher: [209, 189, 25],
  oliveyellow: [153, 179, 51],
  olympicblue: [79, 143, 230],
  orange: [255, 82, 0],
  orangecitrine: [140, 101, 16],
  orangerufous: [192, 82, 0],
  orangeyellow: [255, 171, 0],
  paleburntlake: [115, 15, 31],
  palekingsblue: [171, 245, 237],
  palelemonyellow: [255, 245, 158],
  palerawumber: [94, 64, 23],
  pansypurple: [111, 0, 67],
  peachred: [255, 51, 25],
  peacockblue: [0, 207, 145],
  pinkishcinnamon: [242, 173, 120],
  pistachiogreen: [86, 170, 105],
  pomegranitepurple: [185, 0, 120],
  pompeianred: [169, 6, 54],
  purpledrab: [117, 66, 96],
  pyriteyellow: [196, 191, 51],
  rainettegreen: [133, 184, 87],
  rawsienna: [184, 94, 0],
  red: [161, 0, 69],
  redorange: [232, 25, 0],
  redviolet: [52, 0, 163],
  rosolancpurple: [179, 25, 171],
  salviablue: [150, 191, 230],
  scarlet: [213, 12, 66],
  seagreen: [51, 255, 125],
  seashellpink: [255, 207, 196],
  sepia: [80, 61, 0],
  slatecolor: [27, 54, 68],
  spectrumred: [242, 0, 0],
  spinelred: [255, 77, 201],
  sudanbrown: [155, 83, 72],
  sulpheryellow: [245, 245, 184],
  sulphineyellow: [186, 166, 0],
  taupebrown: [107, 46, 99],
  turquoisegreen: [181, 255, 194],
  vandarpoelsblue: [0, 62, 131],
  vandykebrown: [54, 35, 4],
  vandykered: [116, 9, 9],
  venicegreen: [107, 255, 179],
  veroniapurple: [126, 48, 117],
  vinaceouscinnamon: [245, 153, 148],
  vinaceoustawny: [199, 67, 0],
  violet: [38, 25, 209],
  violetblue: [32, 45, 133],
  violetcarmine: [83, 23, 69],
  violetred: [61, 0, 121],
  vistorislake: [92, 44, 69],
  warmgray: [156, 178, 158],
  white: [255, 255, 255],
  yellow: [255, 255, 0],
  yellowgreen: [166, 255, 71],
  yellowocher: [224, 184, 31],
  yelloworange: [255, 140, 0],
};
Object.freeze(SANZO_WADA_COLORS);

/** Class containing the main engine running a canvas */
class Engine {
  /**
   * Create the engine controlling a canvas
   * @param {Object} canvas DOM element containing the canvas
   * @param {Object} ctx Drawing context of the canvas
   * @param {number} [fps=60] Frames per second
   */
  constructor(canvas, ctx, fps = 60) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._fps = fps;

    // init variables
    this._frame_count = 0;
    this._no_loop = false;
    this._is_recording = false;
    this._first_frame_recorded = 0;
    this._frames_recorded = 0;
    this._zip = null;
    this._dt = Infinity;
    this._started = 0;

    // actual framerate buffer
    this._fps_buffer = new CircularBuffer(60);

    // mouse coordinates
    this._mouseCoords = new Point(0, 0);
    this._prevMouseCoords = new Point(0, 0);

    // start sketch
    this._setFps(this._fps);
    this._run();
  }

  /**
   * Sets the fps for the current sketch
   * @private
   */
  _setFps(fps) {
    // save fps value
    this._fps = fps;
    // time between frames
    this._fps_interval = 1000 / this._fps;
  }

  /**
   * Starts the sketch
   * @private
   */
  _run() {
    this.preload();
    this.setup();
    // anti alias
    this._ctx.imageSmoothingQuality = "high";
    this._timeDraw();
  }

  /**
   * Handles time update
   * @private
   */

  _timeDraw() {
    // request next frame
    window.requestAnimationFrame(this._timeDraw.bind(this));

    // if the sketch is not looping, do nothing
    if (this._no_loop) return;

    // now draw
    this._ctx.save();
    this.draw();
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
    // update frame count
    this._frame_count++;
    const ended = performance.now();
    // update framerate buffer
    if (this._started != 0) {
      const dt = ended - this._started;
      this._fps_buffer.push(1000 / dt);
      this._dt = dt;
    }
    // update current time
    this._started = ended;
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
   *
   * @param {str} filename of the file to download
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
   * @param {Object} e event
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
   * @param {str} filename
   * @param {str} data
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
   * Private callback for mouse click/touchscreen tap
   * @param {Object} e event
   * @private
   */
  _clickCallback(e) {
    const p = this._calculatePressCoords(e);
    this.click(p.x, p.y);
  }

  /**
   * Callback for mouse down
   * @param {Object} event
   * @private
   */
  _mouseDownCallback(e) {
    this._mouse_pressed = true;
    const p = this._calculatePressCoords(e);
    this.mouseDown(p.x, p.y);
  }

  /**
   * Callback for mouse up
   * @param {Object} event
   * @private
   */
  _mouseUpCallback(e) {
    this._mouse_pressed = false;
    const p = this._calculatePressCoords(e);
    this.mouseUp(p.x, p.y);
  }

  /**
   * Callback for moved mouse
   * @param {Object} e event
   * @private
   */
  _mouseMoveCallback(e) {
    const p = this._calculatePressCoords(e);

    // update mouse position
    this._prevMouseCoords = this._mouseCoords.copy();
    this._mouseCoords = p.copy();

    if (!this._mouse_pressed) {
      this.mouseMoved(p.x, p.y);
    } else {
      this.mouseDragged(p.x, p.y);
    }
  }

  /**
   * Callback for key pressed event
   * @param {Object} e event
   * @private
   */
  _keyDownCallback(e) {
    this.keyDown(e.key, e.keyCode);
  }

  _keyUpCallback(e) {
    this.keyUp(e.key, e.keyCode);
  }

  _keyPressCallback(e) {
    this.keyPress(e.key, e.keyCode);
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
   * @param {string} key
   * @param {number} code
   */
  keyPress(key, code) {}

  /**
   * Public callback for key down
   * @param {string} key
   * @param {number} code
   */
  keyDown(key, code) {}

  /**
   * Public callback for key up
   * @param {string} key
   * @param {number} code
   */
  keyUp(key, code) {}

  /**
   * Set the background color for the canvas
   * @param {string | number} color
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
   *
   * @param {number} x
   * @param {number} [y=null]
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
   * Main sketch function, will be run continuously
   */
  draw() {}

  /**
   * Get the current drawing context
   * @returns {Object} The current drawing context
   */
  get ctx() {
    return this._ctx;
  }

  /**
   * Get the the current recording state
   * @returns {Boolean} The current recording state
   */
  get recording() {
    return this._is_recording;
  }

  /**
   * Get the current drawing canvas
   * @returns {Object} The current drawing canvas
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
    return this._fps_buffer.average;
  }

  /**
   * Get the current framerate as milliseconds per frame (mspf)
   * @returns {number} The current mspf
   */
  get deltaTime() {
    return this._dt;
  }

  /**
   * Set the framerate as milliseconds per frame (mspf)
   * @param {number} dt The desired mspf
   */
  set deltaTime(dt) {
    this._setFps(1000 / dt);
  }

  /**
   * Set a framerate
   * @param {number} f The desired framerate - optional
   */
  set frameRate(f) {
    this._setFps(f);
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
   * @returns {Boolean} The current recording state
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
    return this._mouseCoords.copy();
  }

  /**
   * Get the previous mouse position
   *
   * @returns {Point} The previous mouse position
   * @readonly
   */
  get prevMousePosition() {
    return this._prevMouseCoords.copy();
  }
}

/** Class containing colors, either RGB or HSL */
class Color {
  /**
   * Create a color by setting the value of its RGB channels.
   * @param {number} [r=0] The value of the Red channel in range [0, 255]
   * @param {number} [g=0] The value of the Green channel in range [0, 255]
   * @param {number} [b=0] The value of the Blue channel in range [0, 255]
   * @param {number} [a=1] The value of the Alpha channel in range [0, 1]
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    if (r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0)
      throw new Error("Color values must be in range [0, 255]");
    if (a > 1 || a < 0) throw new Error("Alpha value must be in range [0, 1]");

    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;

    this._calculateHsl();
  }

  /**
   * Checks if two colors are equal
   * @param {Color} other
   * @param {Boolean} [compare_alpha=true] If true, the alpha channel will be compared too
   * @returns {Boolean}
   */
  equals(other, compare_alpha = true) {
    const epsilon = 0.0001;
    const float_eq = (a, b) => Math.abs(a - b) < epsilon;
    return (
      float_eq(this._r, other._r) &&
      float_eq(this._g, other._g) &&
      float_eq(this._b, other._b) &&
      (float_eq(this._a, other._a) || !compare_alpha)
    );
  }

  /**
   * Returns the color as a string
   * @returns {string}
   */
  toString() {
    return this.hex;
  }

  /**
   * Mix two colors, returning a new color.
   * Optionally, an easing function can be passed to control the mix.
   *
   * @param {Color} other
   * @param {number} amount
   * @param {function} [easing=null]
   */
  mix(other, amount, easing = null) {
    const t = easing ? easing(amount) : amount;
    const r = this._clamp(this._r + t * (other.r - this._r), 0, 255);
    const g = this._clamp(this._g + t * (other.g - this._g), 0, 255);
    const b = this._clamp(this._b + t * (other.b - this._b), 0, 255);
    const a = this._clamp(this._a + t * (other.a - this._a), 0, 1);
    return new Color(r, g, b, a);
  }

  /**
   * Darken the color by a certain amount, returning a new color.
   * Optionally, an easing function can be passed to control the mix.
   *
   * @param {number} amount
   * @param {function} easing
   * @returns {Color}
   */
  darken(amount, easing = null) {
    const t = easing ? easing(amount) : amount;
    return this.mix(Color.fromMonochrome(0), t);
  }

  /**
   * Lighten the color by a certain amount, returning a new color.
   * Optionally, an easing function can be passed to control the mix.
   *
   * @param {number} amount
   * @param {function} easing
   * @returns {Color}
   */
  lighten(amount, easing = null) {
    const t = easing ? easing(amount) : amount;
    return this.mix(Color.fromMonochrome(255), t);
  }

  /**
   * Return a copy of the color
   * @returns {Color}
   */
  copy() {
    return new Color(this._r, this._g, this._b, this._a);
  }

  /**
   * Create a color from HSL values
   * @param {number} h Color hue in range [0, 360]
   * @param {number} s Color saturation in range [0, 100]
   * @param {number} l Color lighting in range [0, 100]
   * @param {number} a Color alpha in range [0, 1]
   * @static
   * @returns {Color}
   */
  static fromHSL(h, s, l, a) {
    const dummy = new Color();
    dummy.h = h;
    dummy.s = s;
    dummy.l = l;
    dummy._calculateRgb();
    return new Color(dummy._r, dummy._g, dummy._b, a);
  }

  /**
   * Create a color from RGB values
   * @param {number} r Red channel value in range [0, 360]
   * @param {number} g Green channel value in range [0, 360]
   * @param {number} b Blue channel value in range [0, 360]
   * @param {number} a Alpha channel value in range [0, 1]
   * @static
   * @returns {Color}
   */
  static fromRGB(r, g, b, a) {
    return new Color(r, g, b, a);
  }

  /**
   * Create a color from a hexadecimal string
   * @param {string} hex
   * @static
   * @returns {Color}
   */
  static fromHex(hex) {
    // regex to extract r, g, b, a values from hex string
    const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
    // extract values from hex string
    const [, r, g, b, a] = regex.exec(hex);

    // convert values to decimal
    const dr = parseInt(r, 16);
    const dg = parseInt(g, 16);
    const db = parseInt(b, 16);
    const da = a ? parseInt(a, 16) : 1;

    // return color
    return new Color(dr, dg, db, da);
  }

  /**
   * Create a color from a hexadecimal string
   * @deprecated Use Color.fromHex instead
   * @param {string} hex
   * @static
   * @returns {Color}
   */
  static fromHEX(hex) {
    return Color.fromHex(hex);
  }

  /**
   * Create a monochrome color from a decimal value
   *
   * @param {number} ch Red, green and blue value in range [0, 255]
   * @param {number} [a=1] Alpha value in range [0, 1], defaults to 1
   * @static
   * @returns {Color}
   */
  static fromMonochrome(ch, a = 1) {
    return new Color(ch, ch, ch, a);
  }

  /**
   * Create a color from CSS name. List of name provided by the W3C (https://www.w3.org/wiki/CSS/Properties/color/keywords)
   * @param {string} name
   * @static
   * @returns {Color}
   */
  static fromCSS(name) {
    if (CSS_COLOR_NAMES[name] == undefined) {
      throw new Error("Color name not found");
    }
    return new Color(...CSS_COLOR_NAMES[name]);
  }

  /**
   * Create a color from Sanzo Wada's Dictionary of Color Combinations (https://sanzo-wada.dmbk.io/)
   * @param {string} name
   * @static
   * @returns {Color}
   */
  static fromSanzoWada(name) {
    if (SANZO_WADA_COLORS[name] == undefined) {
      throw new Error("Color name not found");
    }
    return new Color(...SANZO_WADA_COLORS[name]);
  }

  /**
   * Converts a color from RGB to HSL
   * @private
   */
  _calculateHsl() {
    const r = this._r / 255;
    const g = this._g / 255;
    const b = this._b / 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    this._h = Math.floor(h * 360);
    this._s = Math.floor(s * 100);
    this._l = Math.floor(l * 100);
  }

  /**
   * Converts a color from HSL to RGB
   * @private
   */
  _calculateRgb() {
    if (this._s == 0) {
      this._r = this._l;
      this._g = this._l;
      this._b = this._l;
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const l = this._l / 100;
      const h = this._h / 360;
      const s = this._s / 100;

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      this._r = Math.floor(hueToRgb(p, q, h + 1 / 3) * 255);
      this._g = Math.floor(hueToRgb(p, q, h) * 255);
      this._b = Math.floor(hueToRgb(p, q, h - 1 / 3) * 255);
    }
  }

  /**
   * Get the hexadecimal representation of a decimal number
   * @param {number} dec The decimal number
   * @private
   */
  _decToHex(dec) {
    return Math.floor(dec).toString(16).padStart(2, 0).toUpperCase();
  }

  /**
   * Get the decimal representation of a hexadecimal number
   * @param {number} hex The hexadecimal number
   * @private
   */
  _hexToDec(hex) {
    return parseInt(hex, 16);
  }

  /**
   * Clamps a value between an interval
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   * @private
   */
  _clamp(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  /**
   * Wraps a value into an interval
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   * @private
   */
  _wrap(value, min, max) {
    while (value > max) value -= max - min;
    while (value < min) value += max - min;
    return value;
  }

  set hex(hex) {
    this._r = this._hexToDec(hex.slice(1, 3));
    this._g = this._hexToDec(hex.slice(3, 5));
    this._b = this._hexToDec(hex.slice(5, 7));

    const a = parseInt(hex.slice(7, 9), 16);
    if (isNaN(a)) this._a = 1;
    else this._a = a;

    this._calculateHsl();
  }

  get_hex() {
    return `#${this._decToHex(this._r)}${this._decToHex(
      this._g
    )}${this._decToHex(this._b)}`;
  }

  get hex() {
    return this.get_hex();
  }

  get_hexa() {
    return `#${this._decToHex(this._r)}${this._decToHex(
      this._g
    )}${this._decToHex(this._b)}${this._decToHex(this._a * 255)}`;
  }

  get hexa() {
    return this.get_hexa();
  }

  get_rgb() {
    const [r, g, b] = [this._r, this._g, this._b].map(Math.floor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  get rgb() {
    return this.get_rgb();
  }

  get_rgba() {
    const [r, g, b] = [this._r, this._g, this._b].map(Math.floor);
    const a = this._a;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  get rgba() {
    return this.get_rgba();
  }

  get_hsl() {
    const [h, s, l] = [this._h, this._s, this._l].map(Math.floor);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  get hsl() {
    return this.get_hsl();
  }

  get_hsla() {
    const [h, s, l] = [this._h, this._s, this._l].map(Math.floor);
    const a = this._a;
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  get hsla() {
    return this.get_hsla();
  }

  get r() {
    return this._r;
  }

  set r(x) {
    this._r = Math.floor(this._clamp(x, 0, 255));
    this._calculateHsl();
  }

  get g() {
    return this._g;
  }

  set g(x) {
    this._g = Math.floor(this._clamp(x, 0, 255));
    this._calculateHsl();
  }

  get b() {
    return this._b;
  }

  set b(x) {
    this._b = Math.floor(this._clamp(x, 0, 255));
    this._calculateHsl();
  }

  get a() {
    return this._a;
  }

  set a(x) {
    this._a = this._clamp(x, 0, 1);
  }

  get h() {
    return this._h;
  }

  set h(x) {
    this._h = Math.floor(this._wrap(x, 0, 360));
    this._calculateRgb();
  }

  get s() {
    return this._s;
  }

  set s(x) {
    this._s = Math.floor(this._clamp(x, 0, 100));
    this._calculateRgb();
  }

  get l() {
    return this._l;
  }

  set l(x) {
    this._l = Math.floor(this._clamp(x, 0, 255));
    this._calculateRgb();
  }

  get is_monochrome() {
    if (this._r == this._g && this._g == this._b) return true;
    else return false;
  }
}

/** Class containing a simple 2D point */
class Point {
  /**
   * Create a point by its coordinates
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   */
  constructor(x, y) {
    if (arguments.length != 2)
      throw new Error("Point must have only two coordinates");
    this._x = x;
    this._y = y;
  }

  /**
   * Return a copy of the point
   * @returns {Point}
   */
  copy() {
    return new Point(this._x, this._y);
  }

  /**
   * Return the distance between two points
   * @param {Point} p1
   * @returns {number}
   */
  distance(p) {
    return Math.sqrt((p.x - this._x) ** 2 + (p.y - this._y) ** 2);
  }

  /**
   * Returns true if the point is equal to another point
   * @param {Point} p
   * @returns {number}
   */
  equals(p) {
    const epsilon = 0.0001;
    const float_eq = (a, b) => Math.abs(a - b) < epsilon;
    return float_eq(this._x, p.x) && float_eq(this._y, p.y);
  }

  /**
   * Returns the point as a string
   * @returns {string}
   */
  toString() {
    return `(${this._x}, ${this._y})`;
  }

  /**
   * Returns the point x coordinate
   * @returns {number}
   */
  get x() {
    return this._x;
  }

  /**
   * Sets the point x coordinate
   * @param {number} nx
   */
  set x(nx) {
    this._x = nx;
  }

  /**
   * Returns the point y coordinate
   * @returns {number}
   */
  get y() {
    return this._y;
  }

  /**
   * Sets the point y coordinate
   * @param {number} ny
   */
  set y(ny) {
    this._y = ny;
  }
}

/** Class handling simplex noise.
 * This class interfaces with the SimplexNoise library by Jonas Wagner.
 * The number generation is taken care of by my xor128 library.
 */
class SimplexNoise {
  /**
   * Create a noise object
   * @param {Number|String|Array} seed The seed for the noise (optional)
   */
  constructor(seed = null) {
    // initialize the random function with the seed
    // it needs to be passed to the noise function
    // If no seed is passed, a random seed is generated

    let rand_f;

    if (seed) {
      let x, y, z, w;

      // initialize the four seed values
      if (typeof seed === "number") {
        // if the seed is a number, use it as the seed
        // i'm not sure that this is the best way to do this
        if (seed >= 2 ** 32) seed %= 2 ** 32; // make sure the seed is a 32-bit number
        x = seed;
        y = seed + 1;
        z = seed + 2;
        w = seed + 3;
      } else if (typeof seed === "string") {
        // if the seed is a string, use its hash as the seed
        const h = this._hash(seed);
        // i'm not sure that this is the best way to do this
        x = h;
        y = h + 1;
        z = h + 2;
        w = h + 3;
      } else if (Array.isArray(seed)) {
        // pass the seeds to the random function
        x = seed[0];
        y = seed[1];
        z = seed[2];
        w = seed[3];
      }
      rand_f = new XOR128(x, y, z, w);
    } else {
      // no seed is passed, generate a random seed
      rand_f = new XOR128();
    }

    // initialize the noise function with the random function
    this._noise = {
      2: createNoise2D(rand_f),
      3: createNoise3D(rand_f),
      4: createNoise4D(rand_f),
    };

    // set the octaves and falloff
    this._octaves = 1;
    this._falloff = 0.5;
    this._max_value = this._calculateMaxValue();
  }

  /**
   * Simple hash function
   *
   * @param {string} string to be hashed
   * @returns {number} hash
   * @private
   */
  _hash(string) {
    let hash = 0;
    if (string.length == 0) return hash;

    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Get the noise value at a given point
   * @param {number} x x-coordinate
   * @param {number} [y] y-coordinate
   * @param {number} [z] z-coordinate
   * @param {number} [w] w-coordinate
   * @returns {number} Noise value at the given point in range [-1, 1]
   */
  noise(x, y = null, z = null, w = null) {
    let n = 0;
    let amp = 1;
    let freq = 1;

    // calculate the number of parameters and the noise function to use
    const dim = Math.min(Math.max(arguments.length, 1), 4);
    // iterate over the octaves to five a more detailed noise value
    for (let i = 0; i < this._octaves; i++) {
      n += this._noise[dim](x * freq, y * freq, z * freq, w * freq) * amp;
      amp *= this._falloff;
      freq *= 1 / this._falloff;
    }

    return n / this._max_value;
  }

  /**
   *
   * @param {number} octaves Number of octaves to use
   * @param {number} falloff Falloff of the noise
   */
  setDetail(octaves = 1, falloff = 0.5) {
    this._octaves = octaves;
    this._falloff = falloff;

    this._max_value = this._calculateMaxValue();
  }

  _calculateMaxValue() {
    let max_value = 0;
    for (let i = 0; i < this._octaves; i++) max_value += this._falloff ** i;

    return max_value;
  }

  /**
   * Set the number of octaves to use
   */
  set octaves(o) {
    this._octaves = o;
    this._max_value = this._calculateMaxValue();
  }

  /**
   * Get the number of octaves to use
   * @returns {number} Number of octaves
   */
  get octaves() {
    return this._octaves;
  }

  /**
   * Set the falloff of the noise
   */
  set falloff(f) {
    this._falloff = f;
    this._max_value = this._calculateMaxValue();
  }

  /**
   * Get the falloff of the noise
   * @returns {number} Falloff
   */
  get falloff() {
    return this._falloff;
  }

  /**
   * Get the maximum value of the noise
   * @returns {number} Maximum value
   */
  get max_value() {
    return this._max_value;
  }

  /**
   * Get the minimum value of the noise
   * @returns {number} Minimum value
   */
  get min_value() {
    return -this.max_value;
  }
}

/** Class for a circular buffer
 * @private
 */
class CircularBuffer {
  /**
   *
   * @param {number} size of the buffer
   */
  constructor(size) {
    this._buffer = new Array(size).fill(null);
    this._size = size;
    this._index = 0;
  }

  /**
   * Add a value to the buffer
   * @param {number} value
   */
  push(value) {
    this._buffer[this._index] = value;
    this._index = (this._index + 1) % this._size;
  }

  /**
   * Get the average of the buffer
   */
  get average() {
    const items = this._buffer.filter((x) => x != null);
    if (items.length == 0) return 0;

    return items.reduce((a, b) => a + b, 0) / items.length;
  }
}

export { Point, Color, Engine, SimplexNoise };
