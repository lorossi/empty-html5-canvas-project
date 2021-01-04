/*jshint esversion: 8 */
/*jshint strict: false */

$(document).ready(() => {
    canvas = $("#sketch")[0];
    if (canvas.getContext) {
      ctx = canvas.getContext("2d", {alpha: false});
      s = new Sketch(canvas, ctx);
      s.run();
    }
});
