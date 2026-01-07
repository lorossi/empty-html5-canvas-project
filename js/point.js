/** Class containing a simple 2D point */
class Point {
  /**
   * Create a point by its coordinates
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   */
  constructor(x, y) {
    if (arguments.length != 2)
      throw new Error("Point must have only two coordinates");
    this._x = x;
    this._y = y;
  }

  /**
   * Return a copy of the point
   * @returns {Point}
   */
  copy() {
    return new Point(this._x, this._y);
  }

  /**
   * Return the distance between two points
   * @param {Point} p1
   * @returns {number}
   */
  distance(p) {
    return Math.sqrt((p.x - this._x) ** 2 + (p.y - this._y) ** 2);
  }

  /**
   * Returns true if the point is equal to another point
   * @param {Point} p
   * @returns {number}
   */
  equals(p) {
    const epsilon = 0.0001;
    const float_eq = (a, b) => Math.abs(a - b) < epsilon;
    return float_eq(this._x, p.x) && float_eq(this._y, p.y);
  }

  /**
   * Returns the point as a string
   * @returns {string}
   */
  toString() {
    return `(${this._x}, ${this._y})`;
  }

  /**
   * Returns the point x coordinate
   * @returns {number}
   */
  get x() {
    return this._x;
  }

  /**
   * Sets the point x coordinate
   * @param {number} nx
   */
  set x(nx) {
    this._x = nx;
  }

  /**
   * Returns the point y coordinate
   * @returns {number}
   */
  get y() {
    return this._y;
  }

  /**
   * Sets the point y coordinate
   * @param {number} ny
   */
  set y(ny) {
    this._y = ny;
  }
}

export { Point };
