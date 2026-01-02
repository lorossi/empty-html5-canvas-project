import { SimplexNoise } from "../js/engine.js";
import * as chai from "chai";

describe("SimplexNoise test", () => {
  it("Instance of SimplexNoise", () => {
    chai.expect(() => new SimplexNoise()).to.not.throw();
    chai.expect(() => new SimplexNoise(123)).to.not.throw();
    chai.expect(() => new SimplexNoise(2e36)).to.not.throw();
    chai.expect(() => new SimplexNoise("seed")).to.not.throw();
    chai.expect(() => new SimplexNoise("")).to.not.throw();
    chai.expect(() => new SimplexNoise([1, 2, 3, 4])).to.not.throw();

    chai.expect(() => new SimplexNoise(null)).to.not.throw();
    chai.expect(() => new SimplexNoise(undefined)).to.not.throw();
    chai.expect(() => new SimplexNoise(true)).to.not.throw();
  });

  it("Deterministic output with same seed", () => {
    const noise1 = new SimplexNoise(42);
    const noise2 = new SimplexNoise(42);
    const bounds = 5;

    for (let x = 0; x <= bounds; x += 1) {
      for (let y = 0; y <= bounds; y += 1) {
        const n1 = noise1.noise(x, y);
        const n2 = noise2.noise(x, y);
        chai.expect(n1).to.equal(n2);
        chai.expect(n1).to.be.at.least(-1).and.at.most(1);

        const n3 = noise1.noise(x, y, 0);
        const n4 = noise2.noise(x, y, 0);
        chai.expect(n3).to.equal(n4);
        chai.expect(n3).to.be.at.least(-1).and.at.most(1);

        const n5 = noise1.noise(x, y, 0, 0);
        const n6 = noise2.noise(x, y, 0, 0);
        chai.expect(n5).to.equal(n6);
        chai.expect(n5).to.be.at.least(-1).and.at.most(1);
      }
    }
  });
});
