import { Point } from "../js/lib.js";
import * as chai from "chai";

describe("Point test", () => {
  it("Should correctly instantiate Point objects", () => {
    chai.expect(() => new Point(0, 0)).to.not.throw();
    chai.expect(() => new Point()).to.throw();
    chai.expect(() => new Point(0, 0, 0)).to.throw();
  });

  it("Should correctly provide toString method", () => {
    const p1 = new Point(1, 1);
    chai.expect(p1.toString()).to.equal("(1, 1)");

    const p2 = new Point(-2.5, 3.14);
    chai.expect(p2.toString()).to.equal("(-2.5, 3.14)");
  });

  it("Should correctly compare Point instances for equality", () => {
    const p1 = new Point(1, 1);
    const p2 = new Point(1, 1);

    chai.expect(p1.equals(p2)).to.be.true;

    const p3 = new Point(1.0001, 1.0001);
    chai.expect(p1.equals(p3)).to.be.true;

    const p4 = new Point(1.1, 1.1);
    chai.expect(p1.equals(p4)).to.be.false;
  });

  it("Should correctly sum, subtract, and multiply Point instances", () => {
    const p1 = new Point(1, 1);
    const p2 = new Point(2, 2);

    const pa = p1.add(p2);
    chai.expect(p1.equals(new Point(3, 3))).to.be.true;
    chai.expect(p1.equals(new Point(-3, 3))).to.be.false;
    chai.expect(pa).to.equal(p1); // check for chaining
    chai.expect(p2.equals(new Point(2, 2))).to.be.true; // check that p2 is unchanged

    const p3 = new Point(3, 3);
    const p4 = new Point(1, 1);
    const ps = p3.subtract(p4);
    chai.expect(p3.equals(new Point(2, 2))).to.be.true;
    chai.expect(p3.equals(new Point(2, 3))).to.be.false;
    chai.expect(ps).to.equal(p3);

    const p5 = new Point(2, 3);
    const pm = p5.multiply(2);
    chai.expect(p5.equals(new Point(4, 6))).to.be.true;
    chai.expect(p5.equals(new Point(4, 5))).to.be.false;
    chai.expect(pm).to.equal(p5);
  });

  it("Should correctly linearly interpolate between Point instances", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(10, 10);

    const p_start = p1.copy().lerp(p2, 0);
    chai.expect(p_start.equals(new Point(0, 0))).to.be.true;

    const p_mid = p1.copy().lerp(p2, 0.5);
    chai.expect(p_mid.equals(new Point(5, 5))).to.be.true;

    const p_end = p1.copy().lerp(p2, 1);
    chai.expect(p_end.equals(new Point(10, 10))).to.be.true;
  });

  it("Should correctly copy Point instances", () => {
    const p1 = new Point(1, 1);
    const p2 = p1.copy();
    chai.expect(p1.equals(p2)).to.be.true;
    chai.expect(p1 === p2).to.be.false;
  });

  it("Should correctly calculate Point distance", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(3, 4);
    chai.expect(p1.distance(p2)).to.equal(5);
  });

  it("Should correctly provide getters and setters", () => {
    const p = new Point(0, 0);
    chai.expect(p.x).to.equal(0);
    chai.expect(p.y).to.equal(0);

    p.x = 1;
    p.y = 1;
    chai.expect(p.x).to.equal(1);
    chai.expect(p.y).to.equal(1);
  });

  it("Should correctly handle randomized tests", () => {
    // instantiation
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const p = new Point(x, y);
      chai.expect(p.x).to.equal(x);
      chai.expect(p.y).to.equal(y);
    }
    // distance
    for (let i = 0; i < 100; i++) {
      const x1 = Math.random() * 100;
      const y1 = Math.random() * 100;
      const x2 = Math.random() * 100;
      const y2 = Math.random() * 100;
      const p1 = new Point(x1, y1);
      const p2 = new Point(x2, y2);
      chai
        .expect(p1.distance(p2))
        .to.closeTo(Math.hypot(x2 - x1, y2 - y1), 0.0001);
    }

    // getters and setters
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const p = new Point(0, 0);
      p.x = x;
      p.y = y;
      chai.expect(p.x).to.equal(x);
      chai.expect(p.y).to.equal(y);
    }
  });
});
