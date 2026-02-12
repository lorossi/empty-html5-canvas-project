# Empty HTML5 Canvas Project

I got bored by creating a new document every time.

Contains all the needed files to create a new HTML5 page with a JS canvas inside.

Just clone the repo or download the last release.

## Is this used anywhere?

Yes! I have a bunch of repositories that use this as a base, most notably my [random animations repo](https://github.com/lorossi/random-animations), where I create random animations using this engine.
[All the animations (and some experiments) are hosted here](https://lorossi.github.io/random-animations).

## Cool. Do you have some documentation?

[Yes, here](https://lorossi.github.io/empty-html5-canvas-project/).
Documentation for the XOR128 random number generator is [here](https://lorossi.github.io/js-XOR128).

Don't have time for that?
Keep reading for the short version.

The canvas size is 1000px by 1000px.
This can be changed by tweaking the `canvas` item in the `index.html` file.

All you have to do is write your code inside the `sketch.js` file. Inside you will find 3 methods:

- `preload()` it's run only once. You should put there anything that you want to configure and never touch again
- `setup()` it's run once, but I do recommend putting in there every part of your code that you might need to re-initialize
- `draw()` it's run continuously, at a certain set frame rate.

You also have access to some class attributes:

- `this.width` and `this.height` containing the size (in pixels) of the canvas
- `this.frameCount` and `this.frameRate` containing, well, the number of rendered frames and the current frame rate. You can also set the frame rate using this variable (by default the draw function runs ad 60fps).
- `this.ctx` and `this.canvas`, with the former needed in order to draw

and some internal functions:

- `this.noLoop()` and `this.loop()` that will stop and restart the draw function
- `this.background(color)` that will reset the background color of the canvas
- `this.saveFrame(filename)` that will save the currently rendered frame as a `.png` image, with an optional filename
- a lot of event handlers:
  - `this.click(x, y)`, `this.mouseDown(x, y)`, `this.mouseDragged(x, y)`, `this.mouseUp()`, `this.mouseMoved(x, y)`, regarding the mouse and the touch screen interactions
  - `this.keyPress(key, code)`, `this.keyDown(key, code)`, `this.keyUp(key, code)` regarding keyboard interactions

as well as recording capabilities:

- `this.startRecording()` will start saving frames as `.png` images at the end of the draw function
- `this.stopRecording()` will stop the recording process
- `this.saveRecording(filename)` will save the recorded frames inside a zip archive, with an optional filename

Furthermore, four additional classes are included:

- `Color` that supports RGBA-HSLA colors in a handy way
- `Point` that supports simple 2D points
- `SimplexNoise` that supports simplex-noise generation, up to 4 dimensions both with and without seed
- `XOR128` that supports a simple seeded random number generator
- `Palette`, `GradientPalette`, and `PaletteFactory` that support color palettes and random palette generation
- `Utils` that contains some utility functions, such as `lerp`, `remap`, `wrap`, some easing functions, and some functions to convert between 1D array indices and 2D coordinates.

I recommend you to read the documentation of the classes to understand how they work and their methods.

In order to draw on the canvas, all the [built-in JavaScript functions](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) have to be used.

## Credits

This project is distributed under MIT license.
I don't claim any rights over the external libraries and assets packaged inside the project.

Font [Roboto](https://fonts.google.com/specimen/Roboto), made by Google, is packaged in this repository.

Library [JSzip](https://stuk.github.io/jszip/) library, made by [Stuart Knightley](https://github.com/Stuk), is packaged in this repository.

Library [simplex-noise.js](https://github.com/jwagner/simplex-noise.js), made by [Jonathan Wagner](https://github.com/jwagner), is packaged in this repository.
I have made some small changes to the original version.

Some colors distributed with the engine are fetched from the [Sanzo Wada Dictionary of Color Combinations](https://sanzo-wada.dmbk.io/). Those colours have the prefix `SW` before their names.
