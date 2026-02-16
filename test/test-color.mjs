import { Color } from "../js/lib.js";
import { COLOR_NAMES, SANZO_WADA_COLORS } from "./color-names.mjs";
import {
  dec_to_hex,
  ease_in_out_poly,
  ease_in_poly,
  ease_out_poly,
  color_equal,
  color_lerp,
  SFC32,
} from "./utils.mjs";
import * as chai from "chai";

const SEEDS = [
  [8217206423, 3283374355, 5463589660, 1775311226],
  [4781946327, 7975156698, 1543476909, 1396527356],
  [8214926005, 1360663554, 8703674417, 2127426486],
  [3517471986, 6133983695, 5072613214, 5559153745],
  [5004458893, 7413797957, 4856534160, 7553785198],
];

const COLOR_PAIRS = [
  { rgb: [0, 191, 255], hex: "#00BFFF", hsl: [195, 100, 50] },
  { rgb: [106, 119, 164], hex: "#6A77A4", hsl: [227, 24, 53] },
  { rgb: [95, 121, 222], hex: "#5F79DE", hsl: [227, 66, 62] },
  { rgb: [197, 135, 145], hex: "#C58791", hsl: [350, 35, 65] },
  { rgb: [43, 238, 52], hex: "#2BEE34", hsl: [123, 85, 55] },
];

describe("Color test", () => {
  describe("Initialization tests", () => {
    it("Should create and validate Color instances", () => {
      chai.expect(new Color()).to.be.an.instanceof(Color);
      chai.expect(() => new Color()).to.not.throw();
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

      // default color
      const c1 = new Color();
      chai.expect(c1.hex).to.equal("#000000");
    });
  });

  describe("Property tests", () => {
    it("Should provide getters", () => {
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
      chai.expect(white.get_rgb()).to.equal("rgb(255, 255, 255)");
      chai.expect(white.get_rgba()).to.equal("rgba(255, 255, 255, 1)");
      chai.expect(white.get_hsl()).to.equal("hsl(0, 0%, 100%)");
      chai.expect(white.get_hsla()).to.equal("hsla(0, 0%, 100%, 1)");
      chai.expect(white.h).to.equal(0);
      chai.expect(white.s).to.equal(0);
      chai.expect(white.l).to.equal(100);
      chai.expect(white.c).to.equal(0);
      chai.expect(white.m).to.equal(0);
      chai.expect(white.y).to.equal(0);
      chai.expect(white.k).to.equal(0);
      chai.expect(white.hex).to.equal("#FFFFFF");
      chai.expect(white.hexa).to.equal("#FFFFFFFF");
      chai.expect(white.get_hex()).to.equal("#FFFFFF");
      chai.expect(white.get_hexa()).to.equal("#FFFFFFFF");
      chai.expect(white.is_monochrome).to.be.true;
      chai.expect(white.toString()).to.equal("#FFFFFF");
      chai.expect(white.luminance).to.equal(1);

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
      chai.expect(white.c).to.equal(0);
      chai.expect(white.m).to.equal(0);
      chai.expect(white.y).to.equal(0);
      chai.expect(white.k).to.equal(0);
      chai.expect(black.hex).to.equal("#000000");
      chai.expect(black.hexa).to.equal("#00000000");
      chai.expect(black.toString()).to.equal("#000000");
      chai.expect(black.is_monochrome).to.be.true;
      chai.expect(black.luminance).to.equal(0);
    });

    it("Should provide setters", () => {
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
      chai.expect(c1.c).to.equal(0);
      chai.expect(c1.m).to.equal(0);
      chai.expect(c1.y).to.equal(0);
      chai.expect(c1.k).to.equal(0);
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
      chai.expect(c2.c).to.equal(0);
      chai.expect(c2.m).to.equal(100);
      chai.expect(c2.y).to.equal(100);
      chai.expect(c2.k).to.equal(0);
      chai.expect(c2.hex).to.equal("#FF0000");
      chai.expect(c2.hexa).to.equal("#FF00007F");
      chai.expect(c2.toString()).to.equal("#FF0000");

      // Test setting hex
      const c3 = new Color();
      c3.hex = "#FFFFFF";
      chai.expect(c3.r).to.equal(255);
      chai.expect(c3.g).to.equal(255);
      chai.expect(c3.b).to.equal(255);
      chai.expect(c3.a).to.equal(1);
      chai.expect(c3.rgb).to.equal("rgb(255, 255, 255)");
      chai.expect(c3.rgba).to.equal("rgba(255, 255, 255, 1)");
      chai.expect(c3.hsl).to.equal("hsl(0, 0%, 100%)");
      chai.expect(c3.hsla).to.equal("hsla(0, 0%, 100%, 1)");
      chai.expect(c3.h).to.equal(0);
      chai.expect(c3.s).to.equal(0);
      chai.expect(c3.l).to.equal(100);
      chai.expect(c3.c).to.equal(0);
      chai.expect(c3.m).to.equal(0);
      chai.expect(c3.y).to.equal(0);
      chai.expect(c3.k).to.equal(0);
      chai.expect(c3.hex).to.equal("#FFFFFF");
      chai.expect(c3.hexa).to.equal("#FFFFFFFF");
      chai.expect(c3.toString()).to.equal("#FFFFFF");

      // Test setting hexa
      const c4 = new Color();
      c4.hex = "#FFFFFF80";
      chai.expect(c4.r).to.equal(255);
      chai.expect(c4.g).to.equal(255);
      chai.expect(c4.b).to.equal(255);
      chai.expect(c4.a).to.be.closeTo(0.5, 0.05);
      chai.expect(c4.rgb).to.equal("rgb(255, 255, 255)");
      chai.expect(c4.hsl).to.equal("hsl(0, 0%, 100%)");
      chai.expect(c4.h).to.equal(0);
      chai.expect(c4.s).to.equal(0);
      chai.expect(c4.l).to.equal(100);
      chai.expect(c4.c).to.equal(0);
      chai.expect(c4.m).to.equal(0);
      chai.expect(c4.y).to.equal(0);
      chai.expect(c4.hex).to.equal("#FFFFFF");
      chai.expect(c4.hexa).to.equal("#FFFFFF80");
      chai.expect(c4.toString()).to.equal("#FFFFFF");

      // Test setting CMYKA
      const c5 = new Color();
      c5.c = 35;
      c5.m = 0;
      c5.y = 72;
      c5.k = 0;
      c5.a = 0.75;
      chai.expect(c5.r).to.equal(165);
      chai.expect(c5.g).to.equal(255);
      chai.expect(c5.b).to.equal(71);
      chai.expect(c5.a).to.equal(0.75);
      chai.expect(c5.rgb).to.equal("rgb(165, 255, 71)");
      chai.expect(c5.rgba).to.equal("rgba(165, 255, 71, 0.75)");
      chai.expect(c5.hsl).to.equal("hsl(89, 100%, 63%)");
      chai.expect(c5.hsla).to.equal("hsla(89, 100%, 63%, 0.75)");
      chai.expect(c5.h).to.equal(89);
      chai.expect(c5.s).to.equal(100);
      chai.expect(c5.l).to.equal(63);
      chai.expect(c5.c).to.equal(35);
      chai.expect(c5.m).to.equal(0);
      chai.expect(c5.y).to.equal(72);
      chai.expect(c5.k).to.equal(0);
      chai.expect(c5.hex).to.equal("#A5FF47");
      chai.expect(c5.hexa).to.equal("#A5FF47BF");
      chai.expect(c5.toString()).to.equal("#A5FF47");
    });

    it("Should provide getter functions", () => {
      const c = new Color(255, 0, 0, 1);
      chai.expect(c.get_rgb()).to.equal("rgb(255, 0, 0)");
      chai.expect(c.get_rgba()).to.equal("rgba(255, 0, 0, 1)");
      chai.expect(c.get_hsl()).to.equal("hsl(0, 100%, 50%)");
      chai.expect(c.get_hsla()).to.equal("hsla(0, 100%, 50%, 1)");
      chai.expect(c.get_hex()).to.equal("#FF0000");
      chai.expect(c.get_hexa()).to.equal("#FF0000FF");
      chai.expect(c.rgb).to.equal("rgb(255, 0, 0)");
      chai.expect(c.rgba).to.equal("rgba(255, 0, 0, 1)");
      chai.expect(c.hsl).to.equal("hsl(0, 100%, 50%)");
      chai.expect(c.hsla).to.equal("hsla(0, 100%, 50%, 1)");
      chai.expect(c.hex).to.equal("#FF0000");
      chai.expect(c.hexa).to.equal("#FF0000FF");
      chai.expect(c.is_monochrome).to.be.false;
    });

    it("Should provide setter functions", () => {
      const c1 = new Color(0, 0, 0);
      c1.setR(64).setG(128).setB(255).setA(0.5);
      chai.expect(c1.r).to.equal(64);
      chai.expect(c1.g).to.equal(128);
      chai.expect(c1.b).to.equal(255);
      chai.expect(c1.a).to.equal(0.5);
      chai.expect(c1.rgb).to.equal("rgb(64, 128, 255)");
      chai.expect(c1.rgba).to.equal("rgba(64, 128, 255, 0.5)");
      chai.expect(c1.hex).to.equal("#4080FF");
      chai.expect(c1.hexa).to.equal("#4080FF7F");
      chai.expect(c1.is_monochrome).to.be.false;

      const c2 = new Color(0, 0, 0);
      c2.setH(216).setS(100).setL(63).setA(0.5);
      // rgb are slightly off, but it's expected due to rounding errors in hsl to rgb conversion
      chai.expect(c2.r).to.equal(66);
      chai.expect(c2.g).to.equal(141);
      chai.expect(c2.b).to.equal(254);
      chai.expect(c2.a).to.equal(0.5);
      chai.expect(c2.rgb).to.equal("rgb(66, 141, 254)");
      chai.expect(c2.rgba).to.equal("rgba(66, 141, 254, 0.5)");
      chai.expect(c2.hex).to.equal("#428DFE");
      chai.expect(c2.hexa).to.equal("#428DFE7F");
      chai.expect(c2.is_monochrome).to.be.false;

      const c3 = new Color(0, 0, 0);
      c3.setR(127).setG(127).setB(127).setA(1);
      chai.expect(c3.r).to.equal(127);
      chai.expect(c3.g).to.equal(127);
      chai.expect(c3.b).to.equal(127);
      chai.expect(c3.a).to.equal(1);
      chai.expect(c3.rgb).to.equal("rgb(127, 127, 127)");
      chai.expect(c3.rgba).to.equal("rgba(127, 127, 127, 1)");
      chai.expect(c3.hex).to.equal("#7F7F7F");
      chai.expect(c3.hexa).to.equal("#7F7F7FFF");
      chai.expect(c3.is_monochrome).to.be.true;

      const c4 = new Color(0, 0, 0);
      c4.setH(120).setS(80).setL(50).setA(0.25);
      // rgb are slightly off, but it's expected due to rounding errors in hsl to rgb conversion
      chai.expect(c4.r).to.equal(25);
      chai.expect(c4.g).to.equal(229);
      chai.expect(c4.b).to.equal(25);
      chai.expect(c4.a).to.equal(0.25);
      chai.expect(c4.h).to.equal(120);
      chai.expect(c4.s).to.equal(80);
      chai.expect(c4.l).to.equal(50);
      chai.expect(c4.rgb).to.equal("rgb(25, 229, 25)");
      chai.expect(c4.rgba).to.equal("rgba(25, 229, 25, 0.25)");
      chai.expect(c4.hex).to.equal("#19E519");
      chai.expect(c4.hexa).to.equal("#19E5193F");
      chai.expect(c4.hsl).to.equal("hsl(120, 80%, 50%)");
      chai.expect(c4.hsla).to.equal("hsla(120, 80%, 50%, 0.25)");
      chai.expect(c4.is_monochrome).to.be.false;
    });
  });

  describe("Method tests", () => {
    it("Should compare Color instances for equality", () => {
      const c1 = new Color(255, 255, 255, 1);
      const c2 = new Color(255, 255, 255, 1);
      const c3 = new Color(255, 255, 255, 0.5);

      chai.expect(c1.equals(c2)).to.be.true;
      chai.expect(c1.equals(c3)).to.be.false;
      chai.expect(c2.equals(c3, false)).to.be.true;
    });

    it("Should copy Color instances", () => {
      const c1 = new Color();
      const c2 = c1.copy();

      chai.expect(c1).to.be.an.instanceof(Color);
      chai.expect(c2).to.be.an.instanceof(Color);
      chai.expect(c1.equals(c2)).to.be.true;
      chai.expect(c1).to.not.equal(c2);
    });

    it("Should mix Color instances", () => {
      const from = new Color(255, 0, 0, 1);
      const to = new Color(0, 255, 0, 0);

      // simple mixing
      for (let t = 0; t <= 1; t += 0.01) {
        const expected = color_lerp(from, to, t);
        const calculated = from.mix(to, t);
        chai.expect(color_equal(calculated, expected)).to.be.true;
        chai.expect(expected.equals(calculated)).to.be.true;
        // test immutability      chai.expect(calculated).to.not.equal(from);
        chai.expect(from.r).to.equal(255);
        chai.expect(from.g).to.equal(0);
        chai.expect(from.b).to.equal(0);
        chai.expect(from.a).to.equal(1);
        chai.expect(to.r).to.equal(0);
        chai.expect(to.g).to.equal(255);
        chai.expect(to.b).to.equal(0);
        chai.expect(to.a).to.equal(0);
      }

      // test easing functions
      const easing_functions = [ease_in_poly, ease_out_poly, ease_in_out_poly];
      for (let t = 0; t <= 1; t += 0.01) {
        for (const easing of easing_functions) {
          const expected = color_lerp(from, to, easing(t, 2));
          const calculated = from.mix(to, t, easing);
          chai.expect(color_equal(calculated, expected)).to.be.true;
          chai.expect(expected.equals(calculated)).to.be.true;
          // test immutability
          chai.expect(calculated).to.not.equal(from);
          chai.expect(from.r).to.equal(255);
          chai.expect(from.g).to.equal(0);
          chai.expect(from.b).to.equal(0);
          chai.expect(from.a).to.equal(1);
          chai.expect(to.r).to.equal(0);
          chai.expect(to.g).to.equal(255);
          chai.expect(to.b).to.equal(0);
          chai.expect(to.a).to.equal(0);
        }
      }
    });

    it("Should lighten and darken colors", () => {
      // lighten and darken
      const white = new Color(255, 255, 255, 1);
      const black = new Color(0, 0, 0, 1);

      const lightened = black.lighten(1);
      chai.expect(lightened.equals(white)).to.be.true;
      // test immutability
      chai.expect(lightened).to.not.equal(black);
      chai.expect(black.r).to.equal(0);
      chai.expect(black.g).to.equal(0);
      chai.expect(black.b).to.equal(0);
      chai.expect(black.a).to.equal(1);

      const darkened = white.darken(1);
      chai.expect(darkened.equals(black)).to.be.true;
      // test immutability
      chai.expect(darkened).to.not.equal(white);
      chai.expect(white.r).to.equal(255);
      chai.expect(white.g).to.equal(255);
      chai.expect(white.b).to.equal(255);
      chai.expect(white.a).to.equal(1);

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

      // lighten and darken with easing
      const easing_functions = [ease_in_poly, ease_out_poly, ease_in_out_poly];
      for (let t = 0; t <= 1; t += 0.01) {
        for (const easing of easing_functions) {
          const l_expected = mid.mix(white, easing(t, 2));
          const l_calculated = mid.lighten(t, easing);
          chai.expect(l_expected.equals(l_calculated)).to.be.true;

          const d_expected = mid.mix(black, easing(t, 2));
          const d_calculated = mid.darken(t, easing);
          chai.expect(d_expected.equals(d_calculated)).to.be.true;
          // test immutability
          chai.expect(d_calculated).to.not.equal(mid);
          chai.expect(mid.r).to.equal(128);
          chai.expect(mid.g).to.equal(128);
          chai.expect(mid.b).to.equal(128);
          chai.expect(mid.a).to.equal(1);
        }
      }
    });
  });

  describe("Static method tests", () => {
    it("Should provide fromMonochrome method", () => {
      // test monochrome
      for (let i = 0; i < 256; i++) {
        const c = Color.fromMonochrome(i);
        chai.expect(c.r).to.equal(i);
        chai.expect(c.g).to.equal(i);
        chai.expect(c.b).to.equal(i);
        chai
          .expect(c.hex)
          .to.equal(`#${dec_to_hex(i)}${dec_to_hex(i)}${dec_to_hex(i)}`);
        chai.expect(c.is_monochrome).to.be.true;
      }
    });

    it("Should provide fromHSL method", () => {
      // test hsl
      const c1 = Color.fromHSL(0, 100, 50);
      chai.expect(c1.r).to.equal(255);
      chai.expect(c1.g).to.equal(0);
      chai.expect(c1.b).to.equal(0);
      chai.expect(c1.h).to.equal(0);
      chai.expect(c1.s).to.equal(100);
      chai.expect(c1.l).to.equal(50);
      chai.expect(c1.hex).to.equal("#FF0000");
    });

    it("Should provide fromHex method", () => {
      // test hex
      const c2 = Color.fromHex("#FF0000");
      chai.expect(c2.r).to.equal(255);
      chai.expect(c2.g).to.equal(0);
      chai.expect(c2.b).to.equal(0);
      chai.expect(c2.hex).to.equal("#FF0000");
      const c2_deprecated = Color.fromHEX("FF0000");
      chai.expect(c2_deprecated.r).to.equal(255);
      chai.expect(c2_deprecated.g).to.equal(0);
      chai.expect(c2_deprecated.b).to.equal(0);
      chai.expect(c2_deprecated.hex).to.equal("#FF0000");

      chai.expect(() => Color.fromHex("#FF000")).to.throw();
      chai.expect(() => Color.fromHex("##FF000F")).to.throw();
      chai.expect(() => Color.fromHex("")).to.throw;
    });

    it("Should provide fromRGB method", () => {
      // test rgb
      const c3 = Color.fromRGB(255, 0, 0);
      chai.expect(c3.r).to.equal(255);
      chai.expect(c3.g).to.equal(0);
      chai.expect(c3.b).to.equal(0);
      chai.expect(c3.hex).to.equal("#FF0000");
    });

    it("Should provide fromSanzoWada method", () => {
      // test Sanzo-Wada colors
      const c4 = Color.fromSanzoWada("peachred");
      chai.expect(c4.r).to.equal(255);
      chai.expect(c4.g).to.equal(51);
      chai.expect(c4.b).to.equal(25);
      chai.expect(c4.hex).to.equal("#FF3319");
    });

    it("Should provide fromCSS method", () => {
      for (const [name, hex, rgb] of COLOR_NAMES) {
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

    it("Should provide fromCMYK method", () => {
      const c5 = Color.fromCMYK(100, 19, 43, 0);
      chai.expect(c5.r).to.equal(0);
      chai.expect(c5.g).to.equal(206);
      chai.expect(c5.b).to.equal(145);
      chai.expect(c5.hex).to.equal("#00CE91");
    });

    it("Should provide Sanzo-Wada colors", () => {
      for (const [name, hex, rgb] of SANZO_WADA_COLORS) {
        const color = Color.fromSanzoWada(name);
        chai.expect(color.r).to.equal(rgb[0]);
        chai.expect(color.g).to.equal(rgb[1]);
        chai.expect(color.b).to.equal(rgb[2]);
        chai.expect(color.hex).to.equal(hex);
      }
    });

    it("Should throw on invalid Sanzo-Wada color names", () => {
      const invalid_names = ["thequickbrownfox", "jumps", "over", "thelazydog"];
      for (const name of invalid_names) {
        chai.expect(() => Color.fromSanzoWada(name)).to.throw();
      }
    });
  });

  describe("Should handle color conversion consistency", () => {
    it("Should handle Sanzo-Wada color conversion consistency", () => {
      for (const [name, hex, rgb] of SANZO_WADA_COLORS) {
        const color = Color.fromSanzoWada(name);
        chai.expect(color.r).to.equal(rgb[0]);
        chai.expect(color.g).to.equal(rgb[1]);
        chai.expect(color.b).to.equal(rgb[2]);
        chai.expect(color.hex).to.equal(hex);
      }
    });

    it("Should handle known color values", () => {
      for (const pair of COLOR_PAIRS) {
        const rgb = new Color(pair.rgb[0], pair.rgb[1], pair.rgb[2]);
        const hex = Color.fromHex(pair.hex);
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
  });

  describe("Randomized tests", () => {
    it("Should handle randomized conversion consistency", () => {
      for (const seeds of SEEDS) {
        const sfc = new SFC32(...seeds);

        for (let i = 0; i < 100; i++) {
          const r = Math.floor(sfc.random() * 256);
          const g = Math.floor(sfc.random() * 256);
          const b = Math.floor(sfc.random() * 256);
          const a = sfc.random();

          const color_rgb = new Color(r, g, b, a);
          const hex = color_rgb.hexa;

          const color_from_hex = Color.fromHex(hex);

          chai.expect(color_from_hex.r).to.equal(r);
          chai.expect(color_from_hex.g).to.equal(g);
          chai.expect(color_from_hex.b).to.equal(b);
          chai.expect(color_from_hex.a).to.closeTo(a, 0.01);

          const h = color_rgb.h;
          const s = color_rgb.s;
          const l = color_rgb.l;
          const a_hsl = color_rgb.a;

          const color_from_hsl = Color.fromHSL(h, s, l, a_hsl);

          chai.expect(color_from_hsl.r).to.closeTo(r, 8);
          chai.expect(color_from_hsl.g).to.closeTo(g, 8);
          chai.expect(color_from_hsl.b).to.closeTo(b, 8);
          chai.expect(color_from_hsl.a).to.closeTo(a, 0.01);
        }
      }
    });

    it("Should handle randomized tests", () => {
      for (const seeds of SEEDS) {
        const sfc = new SFC32(...seeds);

        for (let i = 0; i < 100; i++) {
          const r = Math.floor(sfc.random() * 256);
          const g = Math.floor(sfc.random() * 256);
          const b = Math.floor(sfc.random() * 256);
          const a = sfc.random();
          const color_rgb = new Color(r, g, b, a);

          chai.expect(color_rgb.r).to.equal(r);
          chai.expect(color_rgb.g).to.equal(g);
          chai.expect(color_rgb.b).to.equal(b);
          chai.expect(color_rgb.a).to.equal(a);
        }

        for (let i = 0; i < 100; i++) {
          const h = Math.floor(sfc.random() * 361);
          const s = Math.floor(sfc.random() * 101);
          const l = Math.floor(sfc.random() * 101);
          const a = sfc.random();
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
      }
    });
  });
});
