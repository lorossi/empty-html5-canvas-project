# Empty HTML5 Canvas Project

I got bored of creating a new document every time.

Contains all the needed files to create a new HTML5 page with a JS canvas inside.

Just clone the repo or download the last release.

## Cool. Do you have some documentation?

Well, not really. But it's easy to use:

The canvas size is 1000px by 1000px.
This can be changed by tweaking the `canvas` item in the `index.html` file.

All you have to do is write your code inside the `sketch.js` file. Inside you will find 3 methods:

- `preload()` it's run only once. You should put there anything that you want to configure and never touch again
- `setup()` it's run once, but I do recommend putting in there every part of your code that you might need to re-initialize
- `draw()` it's run continuously, at a certain set frame rate.

You also have access to some class attributes:

- `this.width` and `this.height` containing the size (in pixels) of the canvas
- `this.frameCount` and `this.frameRate` containing, well, the number of rendered frames and the current framerate. You can also set the frame rate using this variable (by default the draw function runs ad 60fps).
- `this.ctx` and `this.canvas`, with the former needed in order to draw

and some internal functions:

- `this.noLoop()` and `this.loop()` that will stop and restart the draw function
- `this.background(color)` that will reset the background color of the canvas
- `this.saveFrame(filename)` that will save the currently rendered frame as a `.png` image, with an optional filename
- `this.calculatePressCoords(e)` that accepts the event from the mouse/touch screen interaction as a parameter and returns the coordinates relative to the canvas
- `this.getPressedKey(e)` that accepts the event from the keyboard interaction ad a parameter and returns the pressed key and some infos about the type of keystroke
- a lot of event handlers:
  - `this.click()`,  `this.mouseup()`, `this.mousedown()`, `this.mousemove()`, regarding the mouse and the touch screen interactions
  - `this.keydown()` regarding keyboard interactions
  - All these functions have an optional parameter `e` that will contain the touch event (and it's needed in order to know which key has been pressed or where the mouse event happened)

Furthermore, two additional classes are included:

- `Color` that supports RGBA-HSLA colors in a handy way
- `Point` that supports simple 2D points

In order to draw on the canvas, all the [built in javascript functions](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) have to be used.

## Credits

This project is distributed under MIT license.

Font [Roboto](https://fonts.google.com/specimen/Roboto), made by Google, is packaged in this repository.
