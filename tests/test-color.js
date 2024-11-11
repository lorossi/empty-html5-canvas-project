import { Color } from "../js/engine.js";
import { COLOR_NAMES } from "./color-names.js";

const lerp = (x, y, t) => x * (1 - t) + y * t;
const color_lerp = (c1, c2, t) => {
  const r = lerp(c1.r, c2.r, t);
  const g = lerp(c1.g, c2.g, t);
  const b = lerp(c1.b, c2.b, t);
  const a = lerp(c1.a, c2.a, t);
  return new Color(r, g, b, a);
};
const color_equal = (c1, c2, epsilon = 0.0001) => {
  return (
    Math.abs(c1.r - c2.r) < epsilon &&
    Math.abs(c1.g - c2.g) < epsilon &&
    Math.abs(c1.b - c2.b) < epsilon &&
    Math.abs(c1.a - c2.a) < epsilon
  );
};
const easeInPoly = (t, n = 2) => Math.pow(t, n);
const easeOutPoly = (t, n = 2) => 1 - Math.pow(1 - t, n);
const easeInOutPoly = (t, n = 2) => {
  if (t < 0.5) return 0.5 * Math.pow(2 * t, n);
  return 1 - 0.5 * Math.pow(2 * (1 - t), n);
};
const dec_to_hex = (dec) => {
  const hex = dec.toString(16).toUpperCase();
  return hex.length === 1 ? `0${hex}` : hex;
};
const random_int = (a, b) => Math.floor(Math.random() * (b - a + 1) + a);

const COLOR_PAIRS = [
  { rgb: [0, 191, 255], hex: "#00BFFF", hsl: [195, 100, 50] },
  { rgb: [106, 119, 164], hex: "#6A77A4", hsl: [227, 24, 53] },
  { rgb: [95, 121, 222], hex: "#5F79DE", hsl: [227, 66, 62] },
  { rgb: [197, 135, 145], hex: "#C58791", hsl: [350, 35, 65] },
  { rgb: [43, 238, 52], hex: "#2BEE34", hsl: [123, 85, 55] },
];

describe("Color test", () => {
  it("instance of Color", () => {
    chai.expect(new Color()).to.be.an.instanceof(Color);
    chai.expect(() => new Color(0, 0, 0, 0)).to.not.throw();
    chai.expect(() => new Color(255, 255, 255, 1)).to.not.throw();
    chai.expect(() => new Color(0, 0, 0, 2)).to.throw();
    chai.expect(() => new Color(0, 0, 0, -1)).to.throw();
    chai.expect(() => new Color(-1, 0, 0, 1)).to.throw();
    chai.expect(() => new Color(0, -1, 0, 1)).to.throw();
    chai.expect(() => new Color(0, 0, -1, 1)).to.throw();
    chai.expect(() => new Color(256, 0, 0, 1)).to.throw();
    chai.expect(() => new Color(0, 256, 0, 1)).to.throw();
    chai.expect(() => new Color(0, 0, 256, 1)).to.throw();
  });

  it("Color properties", () => {
    const white = new Color(255, 255, 255, 1);
    chai.expect(white).to.be.an.instanceof(Color);
    chai.expect(white.r).to.equal(255);
    chai.expect(white.g).to.equal(255);
    chai.expect(white.b).to.equal(255);
    chai.expect(white.a).to.equal(1);
    chai.expect(white.rgb).to.equal("rgb(255, 255, 255)");
    chai.expect(white.rgba).to.equal("rgba(255, 255, 255, 1)");
    chai.expect(white.hsl).to.equal("hsl(0, 0%, 100%)");
    chai.expect(white.hsla).to.equal("hsla(0, 0%, 100%, 1)");
    chai.expect(white.h).to.equal(0);
    chai.expect(white.s).to.equal(0);
    chai.expect(white.l).to.equal(100);
    chai.expect(white.hex).to.equal("#FFFFFF");
    chai.expect(white.hexa).to.equal("#FFFFFFFF");
    chai.expect(white.toString()).to.equal("#FFFFFF");

    const black = new Color(0, 0, 0, 0);
    chai.expect(black).to.be.an.instanceof(Color);
    chai.expect(black.r).to.equal(0);
    chai.expect(black.g).to.equal(0);
    chai.expect(black.b).to.equal(0);
    chai.expect(black.a).to.equal(0);
    chai.expect(black.rgb).to.equal("rgb(0, 0, 0)");
    chai.expect(black.rgba).to.equal("rgba(0, 0, 0, 0)");
    chai.expect(black.hsl).to.equal("hsl(0, 0%, 0%)");
    chai.expect(black.hsla).to.equal("hsla(0, 0%, 0%, 0)");
    chai.expect(black.h).to.equal(0);
    chai.expect(black.s).to.equal(0);
    chai.expect(black.l).to.equal(0);
    chai.expect(black.hex).to.equal("#000000");
    chai.expect(black.hexa).to.equal("#00000000");
    chai.expect(black.toString()).to.equal("#000000");
  });

  it("Color Equality", () => {
    const c1 = new Color(255, 255, 255, 1);
    const c2 = new Color(255, 255, 255, 1);
    const c3 = new Color(255, 255, 255, 0.5);

    chai.expect(c1.equals(c2)).to.be.true;
    chai.expect(c1.equals(c3)).to.be.false;
    chai.expect(c2.equals(c3, false)).to.be.true;
  });

  it("Color Copy", () => {
    const c1 = new Color();
    const c2 = c1.copy();
    chai.expect(c1).to.be.an.instanceof(Color);
    chai.expect(c2).to.be.an.instanceof(Color);
    chai.expect(c1.equals(c2)).to.be.true;
    chai.expect(c1).to.not.equal(c2);
  });

  it("Color Setters", () => {
    // Test setting r, g, b, a
    const c1 = new Color();
    c1.r = 255;
    c1.g = 255;
    c1.b = 255;
    c1.a = 1;

    chai.expect(c1.r).to.equal(255);
    chai.expect(c1.g).to.equal(255);
    chai.expect(c1.b).to.equal(255);
    chai.expect(c1.a).to.equal(1);
    chai.expect(c1.rgb).to.equal("rgb(255, 255, 255)");
    chai.expect(c1.rgba).to.equal("rgba(255, 255, 255, 1)");
    chai.expect(c1.hsl).to.equal("hsl(0, 0%, 100%)");
    chai.expect(c1.hsla).to.equal("hsla(0, 0%, 100%, 1)");
    chai.expect(c1.h).to.equal(0);
    chai.expect(c1.s).to.equal(0);
    chai.expect(c1.l).to.equal(100);
    chai.expect(c1.hex).to.equal("#FFFFFF");
    chai.expect(c1.hexa).to.equal("#FFFFFFFF");
    chai.expect(c1.toString()).to.equal("#FFFFFF");

    // Test setting h, s, l, a
    const c2 = new Color();
    c2.h = 0;
    c2.s = 100;
    c2.l = 50;
    c2.a = 0.5;

    chai.expect(c2.r).to.equal(255);
    chai.expect(c2.g).to.equal(0);
    chai.expect(c2.b).to.equal(0);
    chai.expect(c2.a).to.equal(0.5);
    chai.expect(c2.rgb).to.equal("rgb(255, 0, 0)");
    chai.expect(c2.rgba).to.equal("rgba(255, 0, 0, 0.5)");
    chai.expect(c2.hsl).to.equal("hsl(0, 100%, 50%)");
    chai.expect(c2.hsla).to.equal("hsla(0, 100%, 50%, 0.5)");
    chai.expect(c2.h).to.equal(0);
    chai.expect(c2.s).to.equal(100);
    chai.expect(c2.l).to.equal(50);
    chai.expect(c2.hex).to.equal("#FF0000");
    chai.expect(c2.hexa).to.equal("#FF00007F");
    chai.expect(c2.toString()).to.equal("#FF0000");
  });

  it("Color Mixing", () => {
    const from = new Color(255, 0, 0, 1);
    const to = new Color(0, 255, 0, 0);

    // simple mixing
    for (let t = 0; t <= 1; t += 0.01) {
      const expected = color_lerp(from, to, t);
      const calculated = from.mix(to, t);
      chai.expect(color_equal(calculated, expected)).to.be.true;
      chai.expect(expected.equals(calculated)).to.be.true;
    }

    // test easing functions
    const easing_functions = [easeInPoly, easeOutPoly, easeInOutPoly];
    for (let t = 0; t <= 1; t += 0.01) {
      for (const easing of easing_functions) {
        const expected = color_lerp(from, to, easing(t, 2));
        const calculated = from.mix(to, t, easing);
        chai.expect(color_equal(calculated, expected)).to.be.true;
        chai.expect(expected.equals(calculated)).to.be.true;
      }
    }

    // lighten and darken
    const white = new Color(255, 255, 255, 1);
    const black = new Color(0, 0, 0, 1);

    const lightened = black.lighten(1);
    chai.expect(lightened.equals(white)).to.be.true;

    const darkened = white.darken(1);
    chai.expect(darkened.equals(black)).to.be.true;

    // test lightening and darkening
    const mid = new Color(128, 128, 128, 1);
    for (let t = 1; t <= 128; t++) {
      const l_expected = mid.lighten(t);
      const l_calculated = mid.mix(white, t);
      chai.expect(l_expected.equals(l_calculated)).to.be.true;

      const d_expected = mid.darken(t);
      const d_calculated = mid.mix(black, t);
      chai.expect(d_expected.equals(d_calculated)).to.be.true;
    }
  });

  it("Static Color Methods", () => {
    // test monochrome
    for (let i = 0; i < 256; i++) {
      const c = Color.fromMonochrome(i);
      chai.expect(c.r).to.equal(i);
      chai.expect(c.g).to.equal(i);
      chai.expect(c.b).to.equal(i);
      chai
        .expect(c.hex)
        .to.equal(`#${dec_to_hex(i)}${dec_to_hex(i)}${dec_to_hex(i)}`);
      chai.expect(c.monochrome).to.be.true;
    }

    // test hsl
    const c1 = Color.fromHSL(0, 100, 50);
    chai.expect(c1.r).to.equal(255);
    chai.expect(c1.g).to.equal(0);
    chai.expect(c1.b).to.equal(0);
    chai.expect(c1.h).to.equal(0);
    chai.expect(c1.s).to.equal(100);
    chai.expect(c1.l).to.equal(50);
    chai.expect(c1.hex).to.equal("#FF0000");

    // test hex
    const c2 = Color.fromHEX("#FF0000");
    chai.expect(c2.r).to.equal(255);
    chai.expect(c2.g).to.equal(0);
    chai.expect(c2.b).to.equal(0);
    chai.expect(c2.hex).to.equal("#FF0000");

    chai.expect(() => Color.fromHEX("#FF000")).to.throw();
    chai.expect(() => Color.fromHEX("##FF000F")).to.throw();
    chai.expect(() => Color.fromHEX("")).to.throw;
  });

  it("Color names", () => {
    for (let i = 0; i < COLOR_NAMES.length; i++) {
      const [name, hex, rgb] = COLOR_NAMES[i];
      const color = Color.fromCSS(name);
      chai.expect(color.r).to.equal(rgb[0]);
      chai.expect(color.g).to.equal(rgb[1]);
      chai.expect(color.b).to.equal(rgb[2]);
      chai.expect(color.hex).to.equal(hex);
    }

    const invalid_names = ["thequickbrownfox", "jumps", "over", "thelazydog"];
    for (const name of invalid_names) {
      chai.expect(() => Color.fromCSS(name)).to.throw();
    }
  });

  it("Known values", () => {
    for (const pair of COLOR_PAIRS) {
      const rgb = new Color(pair.rgb[0], pair.rgb[1], pair.rgb[2]);
      const hex = Color.fromHEX(pair.hex);
      const hsl = Color.fromHSL(pair.hsl[0], pair.hsl[1], pair.hsl[2]);

      chai.expect(rgb.r).to.equal(pair.rgb[0]);
      chai.expect(rgb.g).to.equal(pair.rgb[1]);
      chai.expect(rgb.b).to.equal(pair.rgb[2]);

      chai.expect(hex.r).to.equal(pair.rgb[0]);
      chai.expect(hex.g).to.equal(pair.rgb[1]);
      chai.expect(hex.b).to.equal(pair.rgb[2]);

      chai.expect(hsl.r).to.closeTo(pair.rgb[0], 1);
      chai.expect(hsl.g).to.closeTo(pair.rgb[1], 1);
      chai.expect(hsl.b).to.closeTo(pair.rgb[2], 1);
    }
  });

  it("Random tests", () => {
    for (let i = 0; i < 100; i++) {
      const r = random_int(0, 255);
      const g = random_int(0, 255);
      const b = random_int(0, 255);
      const a = Math.random();
      const color_rgb = new Color(r, g, b, a);
      chai.expect(color_rgb.r).to.equal(r);
      chai.expect(color_rgb.g).to.equal(g);
      chai.expect(color_rgb.b).to.equal(b);
      chai.expect(color_rgb.a).to.equal(a);
    }

    for (let i = 0; i < 100; i++) {
      const h = random_int(0, 360);
      const s = random_int(0, 100);
      const l = random_int(0, 100);
      const a = Math.random();
      const color_hsl = new Color();
      color_hsl.h = h;
      color_hsl.s = s;
      color_hsl.l = l;
      color_hsl.a = a;
      chai.expect(color_hsl.h).to.equal(h);
      chai.expect(color_hsl.s).to.equal(s);
      chai.expect(color_hsl.l).to.equal(l);
      chai.expect(color_hsl.a).to.equal(a);
    }
  });
});
