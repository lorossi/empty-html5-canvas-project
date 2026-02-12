/*
  HTML canvas sketch. GitHub repo and some basic documentation: https://github.com/lorossi/empty-html5-canvas-project
  Made by Lorenzo Rossi. Website and contacts: https://lorenzoros.si/
*/
import { Engine } from "./lib.js"; // This import is required for the Sketch class to work.

import {
  Color,
  GradientPalette,
  Palette,
  PaletteFactory,
  Point,
  SimplexNoise,
  XOR128,
} from "./lib.js"; // These imports are not required for the Sketch class to work, but they are exported here for convenience.

class Sketch extends Engine {
  preload() {
    // ran once. Ideally, this has never to be called again
  }

  setup() {
    // ran once. This can be called multiple times
  }

  draw(dt) {
    // looping continuously at a set framerate
  }
}

export { Sketch };
