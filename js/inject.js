/**
 * @file inject.js
 * @description This file is the entry point of the project. It is responsible for creating the canvas and the sketch object.
 */
import { Sketch } from "./sketch.js";

document.addEventListener("DOMContentLoaded", () => {
  // page loaded
  const canvas = document.querySelector("#sketch");
  // create sketch
  const s = new Sketch(canvas);

  // mouse event listeners
  canvas.addEventListener("click", (e) => s.clickHandler(e));
  canvas.addEventListener("mousedown", (e) => s.mouseDownHandler(e));
  canvas.addEventListener("mouseup", (e) => s.mouseUpHandler(e));
  canvas.addEventListener("mousemove", (e) => s.mouseMoveHandler(e));
  // touchscreen event listeners
  canvas.addEventListener("touchstart", (e) => s.mouseDownHandler(e), {
    passive: true,
  });
  canvas.addEventListener("touchend", (e) => s.mouseUpHandler(e), {
    passive: true,
  });
  canvas.addEventListener("touchmove", (e) => s.mouseMoveHandler(e), {
    passive: true,
  });
  // keyboard event listeners
  document.addEventListener("keypress", (e) => s.keyPressHandler(e));
  document.addEventListener("keydown", (e) => s.keyDownHandler(e));
  document.addEventListener("keyup", (e) => s.keyUpHandler(e));
});
