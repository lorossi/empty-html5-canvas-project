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
   * @returns {Point} copy of the point
   */
  copy() {
    return new Point(this._x, this._y);
  }

  /**
   * Return the distance between two points
   * @param {Point} other other point
   * @returns {number} distance between the two points
   */
  distance(other) {
    return Math.sqrt((other.x - this._x) ** 2 + (other.y - this._y) ** 2);
  }

  /**
   * Returns true if the point is equal to another point
   * @param {Point} other other point
   * @returns {number} true if the points are equal
   */
  equals(other) {
    const epsilon = 0.0001;
    const float_eq = (a, b) => Math.abs(a - b) < epsilon;
    return float_eq(this._x, other.x) && float_eq(this._y, other.y);
  }

  /**
   * Add another point to this point
   * @param {Point} other other point
   * @returns {Point} this point after addition
   */
  add(other) {
    this._x += other.x;
    this._y += other.y;
    return this;
  }

  /**
   * Subtract another point from this point
   * @param {Point} other other point
   * @returns {Point} this point after subtraction
   */
  subtract(other) {
    this._x -= other.x;
    this._y -= other.y;
    return this;
  }

  /**
   * Multiply this point by a scalar
   * @param {number} scalar scalar value
   * @returns {Point} this point after multiplication
   */
  multiply(scalar) {
    this._x *= scalar;
    this._y *= scalar;
    return this;
  }

  /**
   * Returns the point as a string
   * @returns {string} string representation of the point
   */
  toString() {
    return `(${this._x}, ${this._y})`;
  }

  /**
   * Linearly interpolate between this point and another point
   * @param {Point} other other point
   * @param {number} t interpolation factor [0, 1]
   * @returns {Point} this point after interpolation
   */
  lerp(other, t) {
    this._x = this._x + (other.x - this._x) * t;
    this._y = this._y + (other.y - this._y) * t;
    return this;
  }

  /**
   * Returns the point x coordinate
   * @returns {number} x coordinate
   */
  get x() {
    return this._x;
  }

  /**
   * Sets the point x coordinate
   * @param {number} nx new x coordinate
   */
  set x(nx) {
    this._x = nx;
  }

  /**
   * Returns the point y coordinate
   * @returns {number} y coordinate
   */
  get y() {
    return this._y;
  }

  /**
   * Sets the point y coordinate
   * @param {number} ny new y coordinate
   */
  set y(ny) {
    this._y = ny;
  }
}

export { Point };
