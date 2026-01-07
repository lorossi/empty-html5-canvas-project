import { SimplexNoise } from "../js/lib.js";
import * as chai from "chai";

describe("SimplexNoise test", () => {
  it("Should accept various seeds", () => {
    chai.expect(() => new SimplexNoise()).to.not.throw();
    chai.expect(() => new SimplexNoise(123)).to.not.throw();
    chai.expect(() => new SimplexNoise(-123)).to.not.throw();
    chai.expect(() => new SimplexNoise(2e36)).to.not.throw();
    chai.expect(() => new SimplexNoise("seed")).to.not.throw();
    chai.expect(() => new SimplexNoise("")).to.not.throw();
    chai.expect(() => new SimplexNoise([1, 2, 3, 4])).to.not.throw();
    chai.expect(() => new SimplexNoise(null)).to.not.throw();
  });

  it("Should reject invalid array seeds", () => {
    chai.expect(() => new SimplexNoise([1, 2, 3])).to.throw();
    chai.expect(() => new SimplexNoise([1])).to.throw();
    chai.expect(() => new SimplexNoise([])).to.throw();
  });

  it("Should reject invalid seed types", () => {
    chai.expect(() => new SimplexNoise(true)).to.throw();
    chai.expect(() => new SimplexNoise(false)).to.throw();
    chai.expect(() => new SimplexNoise({})).to.throw();
    chai.expect(() => new SimplexNoise(() => {})).to.throw();
  });

  it("Should produce deterministic output with same seed", () => {
    const seeds = [42, "test-seed", [1, 2, 3, 4]];

    for (const seed of seeds) {
      const noise1 = new SimplexNoise(seed);
      const noise2 = new SimplexNoise(seed);
      const bounds = 10;

      for (let x = 0; x <= bounds; x++) {
        for (let y = 0; y <= bounds; y++) {
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
    }
  });

  it("Should correctly set and get details", () => {
    const n1 = new SimplexNoise("test1");
    const falloff = 0.75;
    const octaves = 4;

    n1.falloff = falloff;
    n1.octaves = octaves;

    chai.expect(n1.falloff).to.equal(falloff);
    chai.expect(n1.octaves).to.equal(octaves);

    const n2 = new SimplexNoise("test2");
    n2.setDetail(octaves, falloff);

    chai.expect(n2.falloff).to.equal(falloff);
    chai.expect(n2.octaves).to.equal(octaves);
  });

  it("Should always return values in [-1, 1]", () => {
    const noise = new SimplexNoise("test");
    const bounds = 10;
    const octaves_list = [1, 2, 4, 8];
    const falloff_list = [0.3, 0.5, 0.7, 0.9];

    for (const octaves of octaves_list) {
      for (const falloff of falloff_list) {
        noise.setDetail(octaves, falloff);

        for (let x = 0; x <= bounds; x++) {
          for (let y = 0; y <= bounds; y++) {
            const n = noise.noise(x, y);
            chai.expect(n).to.be.at.least(-1).and.at.most(1);
            chai
              .expect(n)
              .to.be.at.least(noise.min_value)
              .and.at.most(noise.max_value);

            const n3d = noise.noise(x, y, 0);
            chai.expect(n3d).to.be.at.least(-1).and.at.most(1);
            chai
              .expect(n3d)
              .to.be.at.least(noise.min_value)
              .and.at.most(noise.max_value);

            const n4d = noise.noise(x, y, 0, 0);
            chai.expect(n4d).to.be.at.least(-1).and.at.most(1);
            chai
              .expect(n4d)
              .to.be.at.least(noise.min_value)
              .and.at.most(noise.max_value);
          }
        }
      }
    }
  });
});
