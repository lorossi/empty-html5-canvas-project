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

  it("Should correctly sum, subtract, multiply, and divide Point instances", () => {
    const p1 = new Point(1, 1);
    const p2 = new Point(2, 2);
    const pa = p1.add(p2);
    // check immutability of p1 and p2
    chai.expect(p1.equals(new Point(1, 1))).to.be.true;
    chai.expect(p2.equals(new Point(2, 2))).to.be.true;
    chai.expect(pa).to.not.equal(p1);
    chai.expect(pa).to.not.equal(p2);
    // check results of addition
    chai.expect(pa.equals(new Point(3, 3))).to.be.true;

    const p3 = new Point(3, 3);
    const p4 = new Point(1, 1);
    const ps = p3.subtract(p4);
    // check immutability of p3 and p4
    chai.expect(p3.equals(new Point(3, 3))).to.be.true;
    chai.expect(p4.equals(new Point(1, 1))).to.be.true;
    chai.expect(ps).to.not.equal(p3);
    chai.expect(ps).to.not.equal(p4);
    // check results of subtraction
    chai.expect(ps.equals(new Point(2, 2))).to.be.true;

    const p5 = new Point(2, 3);
    const pm = p5.multiply(2);
    // check immutability of p5
    chai.expect(p5.equals(new Point(2, 3))).to.be.true;
    chai.expect(pm).to.not.equal(p5);
    // check results of multiplication
    chai.expect(pm.equals(new Point(4, 6))).to.be.true;

    const p6 = new Point(4, 6);
    const pd = p6.divide(2);
    // check immutability of p6
    chai.expect(p6.equals(new Point(4, 6))).to.be.true;
    chai.expect(pd).to.not.equal(p6);
    // check results of division
    chai.expect(pd.equals(new Point(2, 3))).to.be.true;

    // check division by zero throws error
    const p7 = new Point(1, 1);
    chai.expect(() => p7.divide(0)).to.throw();
  });

  it("Should correctly linearly interpolate between Point instances", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(10, 10);

    const p_start = p1.lerp(p2, 0);
    // check immutability of p1 and p2
    chai.expect(p1.equals(new Point(0, 0))).to.be.true;
    chai.expect(p2.equals(new Point(10, 10))).to.be.true;
    chai.expect(p_start).to.not.equal(p1);
    chai.expect(p_start).to.not.equal(p2);
    // check results of interpolation
    chai.expect(p_start.equals(new Point(0, 0))).to.be.true;

    const p_mid = p1.lerp(p2, 0.5);
    // check immutability of p1 and p2
    chai.expect(p1.equals(new Point(0, 0))).to.be.true;
    chai.expect(p2.equals(new Point(10, 10))).to.be.true;
    chai.expect(p_mid).to.not.equal(p1);
    chai.expect(p_mid).to.not.equal(p2);
    // check results of interpolation
    chai.expect(p_mid.equals(new Point(5, 5))).to.be.true;

    const p_end = p1.lerp(p2, 1);
    // check immutability of p1 and p2
    chai.expect(p1.equals(new Point(0, 0))).to.be.true;
    chai.expect(p2.equals(new Point(10, 10))).to.be.true;
    chai.expect(p_end).to.not.equal(p1);
    chai.expect(p_end).to.not.equal(p2);
    // check results of interpolation
    chai.expect(p_end.equals(new Point(10, 10))).to.be.true;
  });

  it("Should correctly copy Point instances", () => {
    const p1 = new Point(1, 1);
    const p2 = p1.copy();
    chai.expect(p1.equals(p2)).to.be.true;
    chai.expect(p1 === p2).to.be.false;
    // try mutating p2 and check immutability of p1
    p2.x = 2;
    p2.y = 2;
    chai.expect(p1.equals(new Point(1, 1))).to.be.true;
    chai.expect(p2.equals(new Point(2, 2))).to.be.true;
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
