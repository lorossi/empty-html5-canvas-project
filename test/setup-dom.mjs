import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  pretendToBeVisual: true,
});

// set globals
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.Event = dom.window.Event;
global.EventTarget = dom.window.EventTarget;
global.CustomEvent = dom.window.CustomEvent;

// Use jsdom's native rAF/cAF; expose to globals for code that accesses window
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
  dom.window
);
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
