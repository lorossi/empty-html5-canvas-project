/*
  HTML canvas sketch. GitHub repo and some basic documentation: https://github.com/lorossi/empty-html5-canvas-project
  Made by Lorenzo Rossi. Website and contacts: https://lorenzoros.si/
*/

import { Engine, SimplexNoise, Point, Color, XOR128 } from "./lib.js";

class Sketch extends Engine {
  preload() {
    // ran once. Ideally, this has never to be called again
  }

  setup() {
    // ran once. This can be called multiple times
  }

  draw() {
    // looping continuously at a set framerate
  }
}

export { Sketch };
