import "../test/setup-dom.mjs"; // ensure globals are set before importing Engine
import { Engine } from "../js/engine.js";
import * as chai from "chai";

describe("Engine Canvas Tests", () => {
  it("should create an engine with a canvas", () => {
    const canvas = document.createElement("canvas");
    new Engine(canvas);
  });

  it("test Engine getters", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const engine = new Engine(canvas);

    chai.expect(engine.canvas).to.equal(canvas);
    chai.expect(engine.width).to.equal(canvas.width);
    chai.expect(engine.height).to.equal(canvas.height);
    chai.expect(engine.ctx).to.equal(ctx);
    chai.expect(engine.frameRate).to.equal(0);
    chai.expect(engine.is_recording).to.equal(false);
    chai.expect(engine.frameCount).to.equal(1);
  });
});
