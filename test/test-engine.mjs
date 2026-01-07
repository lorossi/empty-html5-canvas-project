import "./setup-dom.mjs"; // ensure globals are set before importing Engine
import { Engine } from "../js/lib.js";
import * as chai from "chai";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Engine Canvas Tests", () => {
  it("Should create an engine with a canvas", () => {
    const canvas = document.createElement("canvas");
    const engine = new Engine(canvas);
    engine.stop();
  });

  it("Should provide functional getters", async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const engine = new Engine(canvas);

    const duration = 1000; // milliseconds
    const expected_frames = duration / (1000 / 60);

    await sleep(duration);
    engine.stop();

    chai.expect(engine.canvas).to.equal(canvas);
    chai.expect(engine.width).to.equal(canvas.width);
    chai.expect(engine.height).to.equal(canvas.height);
    chai.expect(engine.ctx).to.equal(ctx);
    chai.expect(engine.is_recording).to.equal(false);
    chai.expect(engine.frameCount).to.be.approximately(expected_frames, 1);
    chai.expect(engine.deltaTime).to.be.approximately(1000 / 60, 5);
    chai.expect(engine.frameRate).to.be.approximately(60, 5);
    // Average values may be slightly off due to smoothing
    chai.expect(engine.deltaTimeAverage).to.be.approximately(1000 / 60, 15);
    chai.expect(engine.frameRateAverage).to.be.approximately(60, 15);
  });

  it("Should provide a working loop and noLoop function", async () => {
    const canvas = document.createElement("canvas");
    const engine = new Engine(canvas);

    await sleep(100);
    engine.noLoop();
    const stopped_frame_count = engine.frameCount;

    await sleep(100);
    chai.expect(engine.frameCount).to.equal(stopped_frame_count);

    engine.loop();
    await sleep(100);
    chai.expect(engine.frameCount).to.be.greaterThan(stopped_frame_count);

    engine.stop();
  });
});
