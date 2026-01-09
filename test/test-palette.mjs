import { Color, Palette } from "../js/lib.js";
import { SFC32, lerp, easeInOutPoly } from "./utils.mjs";
import * as chai from "chai";

const SEEDS = [
  [10723762, 19483684, 16586020, 16617062],
  [16020709, 12535123, 16720405, 13743535],
  [17325401, 12772902, 18610606, 19818483],
  [18587529, 12669546, 18729013, 17106126],
  [13439016, 16891298, 18135782, 18092446],
];
const NUM = 100;

describe("Palette test", () => {
  it("Should create a Palette instance", () => {
    const colors = [
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255),
    ];
    const palette = new Palette(colors);

    chai.expect(palette).to.be.instanceOf(Palette);

    // test colors
    chai.expect(palette.colors).to.have.lengthOf(colors.length);
    chai.expect(palette.length).to.equal(colors.length);
    for (let i = 0; i < colors.length; i++) {
      chai.expect(palette.colors[i].r).to.equal(colors[i].r);
      chai.expect(palette.colors[i].g).to.equal(colors[i].g);
      chai.expect(palette.colors[i].b).to.equal(colors[i].b);
      chai.expect(palette.colors[i].a).to.equal(colors[i].a);
    }
  });

  it("Should create a Palette from an array of hex strings", () => {
    const hexColors = ["#FF0000", "#00FF00", "#0000FF"];
    const palette = Palette.fromHEXArray(hexColors);

    chai.expect(palette).to.be.instanceOf(Palette);
    chai.expect(palette.colors).to.have.lengthOf(hexColors.length);
    for (let i = 0; i < hexColors.length; i++) {
      chai.expect(palette.colors[i].hex).to.equal(hexColors[i]);
    }
  });

  it("Should create a Palette from an array of RGB arrays", () => {
    const rgbColors = [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ];
    const palette = Palette.fromRGBArray(rgbColors);

    chai.expect(palette).to.be.instanceOf(Palette);
    chai.expect(palette.colors).to.have.lengthOf(rgbColors.length);
    for (let i = 0; i < rgbColors.length; i++) {
      chai.expect(palette.colors[i].r).to.equal(rgbColors[i][0]);
      chai.expect(palette.colors[i].g).to.equal(rgbColors[i][1]);
      chai.expect(palette.colors[i].b).to.equal(rgbColors[i][2]);
      chai.expect(palette.colors[i].a).to.equal(1);
    }
  });

  it("Should shuffle the colors in the palette", () => {
    const colors = [
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255),
      new Color(255, 255, 0),
      new Color(0, 255, 255),
      new Color(255, 0, 255),
    ];
    const palette = new Palette(colors);
    const original_order = palette.colors.map((c) => c.hex);

    const rand = new SFC32(12345, 67890, 13579, 24680);
    palette.shuffle(rand);

    // check that every color is still present after shuffling
    const shuffled_order = palette.colors.map((c) => c.hex);
    for (const color of original_order) {
      chai.expect(shuffled_order).to.include(color);
    }

    // check that new palette does not include new colors
    chai.expect(shuffled_order).to.have.lengthOf(original_order.length);
    for (const color of shuffled_order) {
      chai.expect(original_order).to.include(color);
    }
  });

  it("Should return a copy of the palette", () => {
    const colors = [
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255),
    ];
    const palette = new Palette(colors);
    const palette_copy = palette.copy();

    chai.expect(palette_copy).to.be.instanceOf(Palette);
    chai.expect(palette_copy.colors).to.have.lengthOf(colors.length);
    chai.expect(palette_copy).to.not.equal(palette); // different instances

    for (let i = 0; i < colors.length; i++) {
      chai.expect(palette_copy.colors[i].hexa).to.equal(palette.colors[i].hexa);
      chai.expect(palette_copy.colors[i]).to.not.equal(palette.colors[i]); // different Color instances
    }
  });

  it("Should get color by index with wrapping", () => {
    const colors = [
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255),
    ];
    const palette = new Palette(colors);

    for (let i = 0; i < 10; i++) {
      const color = palette.getColor(i);
      const expected_color = colors[i % colors.length];
      chai.expect(color.hexa).to.equal(expected_color.hexa);
    }
  });

  it("Should get a random color from the palette", () => {
    const colors = [
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255),
    ];
    const palette = new Palette(colors);
    const rand = new SFC32(54321, 9876, 24680, 13579);

    for (let i = 0; i < 10; i++) {
      const color = palette.getRandomColor(rand);
      chai.expect(colors.some((c) => c.hexa === color.hexa)).to.be.true;
    }
  });

  it("Should get a smooth color from the palette", () => {
    const colors = [new Color(0, 0, 0), new Color(255, 255, 255)];
    const palette = new Palette(colors);
    const steps = 10;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const color = palette.getSmoothColor(t);

      const expected_r = Math.round(lerp(0, 255, t));
      const expected_g = Math.round(lerp(0, 255, t));
      const expected_b = Math.round(lerp(0, 255, t));

      chai.expect(color.r).to.be.closeTo(expected_r, 1);
      chai.expect(color.g).to.be.closeTo(expected_g, 1);
      chai.expect(color.b).to.be.closeTo(expected_b, 1);
    }
  });

  it("Should get a smooth color with easing from the palette", () => {
    const colors = [new Color(0, 0, 0), new Color(255, 255, 255)];
    const palette = new Palette(colors);
    const steps = 10;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const color = palette.getSmoothColor(t, easeInOutPoly);

      const eased_t = easeInOutPoly(t);
      const expected_r = Math.round(lerp(0, 255, eased_t));
      const expected_g = Math.round(lerp(0, 255, eased_t));
      const expected_b = Math.round(lerp(0, 255, eased_t));

      chai.expect(color.r).to.be.closeTo(expected_r, 1);
      chai.expect(color.g).to.be.closeTo(expected_g, 1);
      chai.expect(color.b).to.be.closeTo(expected_b, 1);
    }
  });
});

describe("Palette randomness test", () => {
  it("Should produce deterministic random colors with same seed", () => {
    const colors = [
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255),
      new Color(255, 255, 0),
      new Color(0, 255, 255),
      new Color(255, 0, 255),
    ];
    const palette = new Palette(colors);

    for (const seed of SEEDS) {
      const rand1 = new SFC32(...seed);
      const rand2 = new SFC32(...seed);

      for (let i = 0; i < NUM; i++) {
        const color1 = palette.getRandomColor(rand1);
        const color2 = palette.getRandomColor(rand2);

        chai.expect(color1.equals(color2)).to.be.true;
      }
    }
  });

  it("Should produce deterministic shuffles with same seed", () => {
    const colors = [
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255),
      new Color(255, 255, 0),
      new Color(0, 255, 255),
      new Color(255, 0, 255),
    ];
    const original_palette = new Palette(colors);

    for (const seed of SEEDS) {
      const rand1 = new SFC32(...seed);
      const rand2 = new SFC32(...seed);

      for (let i = 0; i < NUM; i++) {
        const palette1 = original_palette.copy().shuffle(rand1);
        const palette2 = original_palette.copy().shuffle(rand2);

        for (let i = 0; i < colors.length; i++) {
          const color1 = palette1.getColor(i);
          const color2 = palette2.getColor(i);

          chai.expect(color1.equals(color2)).to.be.true;
        }
      }
    }
  });
});
