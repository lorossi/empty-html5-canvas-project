import { Point } from "../js/lib.js";
import * as chai from "chai";

describe("Point test", () => {
  it("Should correctly instantiate Point objects", () => {
    chai.expect(() => new Point(0, 0)).to.not.throw();
    chai.expect(() => new Point()).to.throw();
    chai.expect(() => new Point(0, 0, 0)).to.throw();
  });

  it("Should correctly provide toString method", () => {
    const p = new Point(1, 1);
    chai.expect(p.toString()).to.equal("(1, 1)");
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
