import * as chai from "chai";

import { Utils } from "../js/utils.js";
import { Point } from "../js/point.js";

describe("Utils test", () => {
  describe("Easing functions", () => {
    it("Should return 0 for input 0 and 1 for input 1", () => {
      const EPS = 0.0001;

      chai.expect(Utils.ease_in_out_sin(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_in_out_sin(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_in_sin(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_in_sin(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_out_sin(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_out_sin(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_in_out_exp(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_in_out_exp(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_in_exp(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_in_exp(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_out_exp(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_out_exp(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_in_out_poly(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_in_out_poly(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_in_poly(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_in_poly(1)).to.be.approximately(1, EPS);
      chai.expect(Utils.ease_out_poly(0)).to.be.approximately(0, EPS);
      chai.expect(Utils.ease_out_poly(1)).to.be.approximately(1, EPS);
    });

    it("Should return values in range [0, 1]", () => {
      for (let t = 0; t <= 1; t += 0.01) {
        chai.expect(Utils.ease_in_out_sin(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_in_sin(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_out_sin(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_in_out_exp(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_in_exp(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_out_exp(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_in_out_poly(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_in_poly(t)).to.be.within(0, 1);
        chai.expect(Utils.ease_out_poly(t)).to.be.within(0, 1);
      }
    });

    it("Should throw error for input out of range", () => {
      chai.expect(() => Utils.ease_in_out_sin(-0.1)).to.throw();
      chai.expect(() => Utils.ease_in_out_sin(1.1)).to.throw();
      chai.expect(() => Utils.ease_in_sin(-0.1)).to.throw();
      chai.expect(() => Utils.ease_in_sin(1.1)).to.throw();
      chai.expect(() => Utils.ease_out_sin(-0.1)).to.throw();
      chai.expect(() => Utils.ease_out_sin(1.1)).to.throw();
      chai.expect(() => Utils.ease_in_out_exp(-0.1)).to.throw();
      chai.expect(() => Utils.ease_in_out_exp(1.1)).to.throw();
      chai.expect(() => Utils.ease_in_exp(-0.1)).to.throw();
      chai.expect(() => Utils.ease_in_exp(1.1)).to.throw();
      chai.expect(() => Utils.ease_out_exp(-0.1)).to.throw();
      chai.expect(() => Utils.ease_out_exp(1.1)).to.throw();
      chai.expect(() => Utils.ease_in_out_poly(-0.1)).to.throw();
      chai.expect(() => Utils.ease_in_out_poly(1.1)).to.throw();
      chai.expect(() => Utils.ease_in_poly(-0.1)).to.throw();
      chai.expect(() => Utils.ease_in_poly(1.1)).to.throw();
      chai.expect(() => Utils.ease_out_poly(-0.1)).to.throw();
      chai.expect(() => Utils.ease_out_poly(1.1)).to.throw();
    });
  });

  describe("Math functions", () => {
    it("Remap should correctly remap values", () => {
      chai.expect(Utils.remap(0, 0, 1, 0, 10)).to.equal(0);
      chai.expect(Utils.remap(0.5, 0, 1, 0, 10)).to.equal(5);
      chai.expect(Utils.remap(1, 0, 1, 0, 10)).to.equal(10);
      chai.expect(Utils.remap(0.25, 0, 1, 0, 10)).to.equal(2.5);
      chai.expect(Utils.remap(0.75, 0, 1, 0, 10)).to.equal(7.5);
    });

    it("Clamp should correctly clamp values", () => {
      chai.expect(Utils.clamp(-1, 0, 1)).to.equal(0);
      chai.expect(Utils.clamp(0, 0, 1)).to.equal(0);
      chai.expect(Utils.clamp(0.5, 0, 1)).to.equal(0.5);
      chai.expect(Utils.clamp(1, 0, 1)).to.equal(1);
      chai.expect(Utils.clamp(2, 0, 1)).to.equal(1);
    });

    it("Lerp should correctly interpolate values", () => {
      chai.expect(Utils.lerp(0, 10, 0)).to.equal(0);
      chai.expect(Utils.lerp(0, 10, 0.5)).to.equal(5);
      chai.expect(Utils.lerp(0, 10, 1)).to.equal(10);
      chai.expect(Utils.lerp(0, 10, 0.25)).to.equal(2.5);
      chai.expect(Utils.lerp(0, 10, 0.75)).to.equal(7.5);
    });

    it("Lerp should throw error for t out of range", () => {
      chai.expect(() => Utils.lerp(0, 10, -0.1)).to.throw();
      chai.expect(() => Utils.lerp(0, 10, 1.1)).to.throw();
    });

    it("Wrap should correctly wrap values", () => {
      chai.expect(Utils.wrap(0, 0, 10)).to.equal(0);
      chai.expect(Utils.wrap(5, 0, 10)).to.equal(5);
      chai.expect(Utils.wrap(10, 0, 10)).to.equal(0);
      chai.expect(Utils.wrap(-1, 0, 10)).to.equal(9);
      chai.expect(Utils.wrap(11, 0, 10)).to.equal(1);
    });

    it("Wrap should throw error for min >= max", () => {
      chai.expect(() => Utils.wrap(0, 1, 1)).to.throw();
      chai.expect(() => Utils.wrap(0, 2, 1)).to.throw();
    });
  });

  describe("Grid functions", () => {
    it("Should correctly convert between 1D index and 2D coordinates", () => {
      const width = 5;
      const height = 5;

      let count = 0;
      for (let y1 = 0; y1 < height; y1++) {
        for (let x1 = 0; x1 < width; x1++) {
          const index = Utils.xy_to_i(x1, y1, width);
          const [x2, y2] = Utils.i_to_xy(index, width);

          chai.expect(x2).to.equal(x1);
          chai.expect(y2).to.equal(y1);
          chai.expect(index).to.equal(count);
          count++;
        }
      }
    });

    it("Should correctly convert between 1D index and 2D point", () => {
      const width = 5;
      const height = 5;

      let count = 0;
      for (let y1 = 0; y1 < height; y1++) {
        for (let x1 = 0; x1 < width; x1++) {
          const p1 = Utils.i_to_point(count, width);
          const index = Utils.point_to_i(p1, width);

          chai.expect(p1.x).to.equal(x1);
          chai.expect(p1.y).to.equal(y1);
          chai.expect(index).to.equal(count);
          count++;
        }
      }
    });
  });
});
