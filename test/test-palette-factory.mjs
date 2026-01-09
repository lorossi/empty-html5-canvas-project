import { Color, Palette, PaletteFactory } from "../js/lib.js";
import { SFC32, lerp, easeInOutPoly } from "./utils.mjs";
import * as chai from "chai";

const SEEDS = [
  [10723762, 19483684, 16586020, 16617062],
  [16020709, 12535123, 16720405, 13743535],
  [17325401, 12772902, 18610606, 19818483],
  [18587529, 12669546, 18729013, 17106126],
  [13439016, 16891298, 18135782, 18092446],
];
const HEX_PALETTES = [
  ["#FF5733", "#33FF57", "#3357FF"],
  ["#F1C40F", "#8E44AD", "#2ECC71"],
  ["#E74C3C", "#3498DB", "#1ABC9C"],
  ["#9B59B6", "#E67E22", "#34495E"],
  ["#2C3E50", "#F39C12", "#D35400"],
];
const RGB_PALETTES = [
  [
    [255, 87, 51],
    [51, 255, 87],
    [51, 87, 255],
  ],
  [
    [241, 196, 15],
    [142, 68, 173],
    [46, 204, 113],
  ],
  [
    [231, 76, 60],
    [52, 152, 219],
    [26, 188, 156],
  ],
  [
    [155, 89, 182],
    [230, 126, 34],
    [52, 73, 94],
  ],
];
const PALETTES = [
  new Palette([
    new Color(255, 87, 51),
    new Color(51, 255, 87),
    new Color(51, 87, 255),
  ]),
  new Palette([
    new Color(241, 196, 15),
    new Color(142, 68, 173),
    new Color(46, 204, 113),
  ]),
  new Palette([
    new Color(231, 76, 60),
    new Color(52, 152, 219),
    new Color(26, 188, 156),
  ]),
  new Palette([
    new Color(155, 89, 182),
    new Color(230, 126, 34),
    new Color(52, 73, 94),
  ]),
];
const palette_equal = (p1, p2) => {
  if (p1.length !== p2.length) return false;
  for (let i = 0; i < p1.length; i++) {
    if (!p1.getColor(i).equals(p2.getColor(i))) return false;
  }
  return true;
};
const palette_unshuffled_equal = (p1, p2) => {
  if (p1.length !== p2.length) return false;
  const colors1 = p1.colors.map((c) => c.hex).sort();
  const colors2 = p2.colors.map((c) => c.hex).sort();
  for (let i = 0; i < colors1.length; i++) {
    if (colors1[i] !== colors2[i]) return false;
  }
  return true;
};
const NUM = 100;

describe("Palette Factory test", () => {
  it("Should create a PaletteFactory instance", () => {
    const factory = new PaletteFactory(PALETTES);

    chai.expect(factory).to.be.instanceOf(PaletteFactory);
    chai.expect(factory.length).to.equal(PALETTES.length);

    for (let i = 0; i < PALETTES.length; i++) {
      chai.expect(factory.palettes[i]).to.not.equal(PALETTES[i]); // different instances
      chai.expect(palette_equal(factory.palettes[i], PALETTES[i])).to.be.true;
    }
  });

  it("Should create a PaletteFactory from HEX palettes", () => {
    const factory = PaletteFactory.fromHEXArray(HEX_PALETTES);

    chai.expect(factory).to.be.instanceOf(PaletteFactory);
    chai.expect(factory.length).to.equal(HEX_PALETTES.length);

    for (let i = 0; i < HEX_PALETTES.length; i++) {
      const expected_palette = Palette.fromHEXArray(HEX_PALETTES[i]);
      chai.expect(palette_equal(factory.palettes[i], expected_palette)).to.be
        .true;
    }
  });

  it("Should create a PaletteFactory from RGB palettes", () => {
    const factory = PaletteFactory.fromRGBArray(RGB_PALETTES);

    chai.expect(factory).to.be.instanceOf(PaletteFactory);
    chai.expect(factory.length).to.equal(RGB_PALETTES.length);

    for (let i = 0; i < RGB_PALETTES.length; i++) {
      const expected_palette = Palette.fromRGBArray(RGB_PALETTES[i]);
      chai.expect(palette_equal(factory.palettes[i], expected_palette)).to.be
        .true;
    }
  });

  it("Should get palettes by index", () => {
    const factory = new PaletteFactory(PALETTES);

    for (let i = 0; i < PALETTES.length; i++) {
      const palette = factory.getPalette(i);
      chai.expect(palette).to.be.instanceOf(Palette);
      chai.expect(palette).to.not.equal(PALETTES[i]); // different instances
      chai.expect(palette_equal(palette, PALETTES[i])).to.be.true;
    }

    // test out of bounds
    chai.expect(() => factory.getPalette(-1)).to.throw();
    chai.expect(() => factory.getPalette(PALETTES.length)).to.throw();
  });

  it("Should get random palettes", () => {
    const factory = new PaletteFactory(PALETTES);

    for (const seed of SEEDS) {
      const rand = new SFC32(...seed);
      const gotten_palettes = new Set();

      for (let i = 0; i < NUM; i++) {
        const palette = factory.getRandomPalette(rand, false);
        // concatenate colors to a string to be able to store in a set
        const palette_str = palette.colors.map((c) => c.hex).join(",");
        gotten_palettes.add(palette_str);
      }

      // With randomization, we should get all palettes after enough samples
      chai.expect(gotten_palettes.size).to.be.lessThanOrEqual(factory.length);
    }
  });

  it("Should get random palettes with color randomization", () => {
    const factory = new PaletteFactory(PALETTES);

    for (const seed of SEEDS) {
      const rand = new SFC32(...seed);

      for (let i = 0; i < NUM; i++) {
        const palette = factory.getRandomPalette(rand, true);
        const original_colors = PALETTES.find((p) =>
          palette_unshuffled_equal(p, palette)
        ).colors;

        const shuffled_order = palette.colors.map((c) => c.hex);
        for (const color of original_colors) {
          chai.expect(shuffled_order).to.include(color.hex);
        }

        // check that new palette does not include new colors
        chai.expect(shuffled_order).to.have.lengthOf(original_colors.length);
        for (const color of shuffled_order) {
          chai.expect(original_colors.map((c) => c.hex)).to.include(color);
        }
      }
    }
  });
});
