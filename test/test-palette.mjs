import { Color, Palette, GradientPalette } from "../js/lib.js";
import { SFC32, lerp, ease_in_out_poly } from "./utils.mjs";
import * as chai from "chai";

const SEEDS = [
  [5732819795, 9199237801, 2380840316, 7949107787],
  [2113253551, 2810214820, 6378534305, 9024366750],
  [4986732924, 6770962855, 8626822001, 5081519932],
  [9376232380, 7851940068, 5738321689, 8146242026],
  [9412032720, 9347457888, 2927085178, 1727360780],
];
const NUM = 100;

describe("Palette test", () => {
  describe("Constructor tests", () => {
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
  });

  describe("Color access tests", () => {
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
        chai.expect(color.r).to.equal(expected_color.r);
        chai.expect(color.g).to.equal(expected_color.g);
        chai.expect(color.b).to.equal(expected_color.b);
        chai.expect(color.a).to.equal(expected_color.a);
      }
    });
  });

  describe("Method tests", () => {
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

    it("Should invert the order of colors in the palette", () => {
      const colors = [
        new Color(255, 0, 0),
        new Color(0, 255, 0),
        new Color(0, 0, 255),
      ];
      const palette = new Palette(colors);
      const original_order = palette.colors.map((c) => c.hex);

      palette.reverse();

      const reversed_order = palette.colors.map((c) => c.hex);
      for (let i = 0; i < original_order.length; i++) {
        chai
          .expect(reversed_order[i])
          .to.equal(original_order[original_order.length - 1 - i]);
      }
    });

    it("Should rotate the colors in the palette", () => {
      const rotate = (array, n) => {
        while (n < 0) n += array.length;

        for (let i = 0; i < n; i++) {
          array.push(array.shift());
        }
        return array;
      };

      const colors = [
        new Color(255, 0, 0),
        new Color(0, 255, 0),
        new Color(0, 0, 255),
      ];

      const palette = new Palette(colors);
      const original_order = colors.map((c) => c.hex);

      for (let n = -10; n <= 10; n++) {
        const rotated_palette = palette.copy().rotate(n);
        const expected_order = rotate([...original_order], n);

        const rotated_order = rotated_palette.colors.map((c) => c.hex);
        for (let i = 0; i < original_order.length; i++) {
          chai.expect(rotated_order[i]).to.equal(expected_order[i]);
        }
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
        chai
          .expect(palette_copy.colors[i].hexa)
          .to.equal(palette.colors[i].hexa);
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
        const color = palette.getSmoothColor(t, ease_in_out_poly);

        const eased_t = ease_in_out_poly(t);
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

  describe("GradientPalette test", () => {
    it("Should create a GradientPalette instance", () => {
      const from = new Color(255, 0, 0);
      const to = new Color(0, 0, 255);

      for (let steps = 2; steps <= 10; steps++) {
        const gradient_palette = new GradientPalette(
          from,
          to,
          steps,
          ease_in_out_poly,
        );

        chai.expect(gradient_palette).to.be.instanceOf(GradientPalette);
        chai.expect(gradient_palette).to.be.instanceOf(Palette);
        chai.expect(gradient_palette.colors).to.have.lengthOf(steps);

        // check first and last colors
        const first_color = gradient_palette.getColor(0);
        const last_color = gradient_palette.getColor(steps - 1);

        chai.expect(first_color.equals(from)).to.be.true;
        chai.expect(last_color.equals(to)).to.be.true;

        // check intermediate colors
        for (let i = 1; i < steps - 1; i++) {
          const t = i / (steps - 1);
          const expected_color = from.mix(to, t, ease_in_out_poly);
          const actual_color = gradient_palette.getColor(i);

          chai.expect(actual_color.equals(expected_color)).to.be.true;
        }
      }
    });

    it("Should create a GradientPalette from HEX colors", () => {
      const from_hex = "#FF0000";
      const to_hex = "#0000FF";
      const steps = 5;

      const gradient_palette = GradientPalette.fromHEXColors(
        from_hex,
        to_hex,
        steps,
        ease_in_out_poly,
      );

      chai.expect(gradient_palette).to.be.instanceOf(GradientPalette);
      chai.expect(gradient_palette).to.be.instanceOf(Palette);
      chai.expect(gradient_palette.colors).to.have.lengthOf(steps);

      // check first and last colors
      const first_color = gradient_palette.getColor(0);
      const last_color = gradient_palette.getColor(steps - 1);

      chai.expect(first_color.equals(Color.fromHex(from_hex))).to.be.true;
      chai.expect(last_color.equals(Color.fromHex(to_hex))).to.be.true;
    });

    it("Should create a GradientPalette from RGB colors", () => {
      const from_rgb = [255, 0, 0];
      const to_rgb = [0, 0, 255];
      const steps = 5;

      const gradient_palette = GradientPalette.fromRGBColors(
        from_rgb,
        to_rgb,
        steps,
        ease_in_out_poly,
      );

      chai.expect(gradient_palette).to.be.instanceOf(GradientPalette);
      chai.expect(gradient_palette).to.be.instanceOf(Palette);
      chai.expect(gradient_palette.colors).to.have.lengthOf(steps);

      // check first and last colors
      const first_color = gradient_palette.getColor(0);
      const last_color = gradient_palette.getColor(steps - 1);

      chai.expect(first_color.equals(Color.fromRGB(...from_rgb))).to.be.true;
      chai.expect(last_color.equals(Color.fromRGB(...to_rgb))).to.be.true;
    });
  });
});
