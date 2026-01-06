import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  pretendToBeVisual: true,
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.Event = dom.window.Event;
global.EventTarget = dom.window.EventTarget;
global.CustomEvent = dom.window.CustomEvent;

// Minimal performance stub to avoid recursive jsdom impl calls
const perfStub = { now: () => 0 };
global.performance = perfStub;

// Stub raf and caf to prevent infinite animation loops during tests
const rafStub = () => 0; // do not schedule
const cafStub = () => {};
dom.window.requestAnimationFrame = rafStub;
dom.window.cancelAnimationFrame = cafStub;
global.requestAnimationFrame = rafStub;
global.cancelAnimationFrame = cafStub;

const noopCtx = {
  save() {},
  draw() {
    const start = performance.now();
    while (performance.now() - start < 1);
  },
  restore() {},
  clearRect() {},
  fillRect() {},
  translate() {},
  scale() {},
  getImageData() {
    return { data: [] };
  },
};
Object.defineProperty(dom.window.HTMLCanvasElement.prototype, "getContext", {
  value() {
    return noopCtx;
  },
});
Object.defineProperty(dom.window.HTMLCanvasElement.prototype, "toDataURL", {
  value() {
    return "data:image/png;base64,";
  },
});

// Some engine methods may call URL.createObjectURL; stub it to avoid errors
if (!global.URL) global.URL = {};
if (!global.URL.createObjectURL) global.URL.createObjectURL = () => "blob:mock";
