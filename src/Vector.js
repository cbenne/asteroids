export function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

export function normalize(a) {
  var mag = magnitude(a);
  return {
    x: a.x / mag,
    y: a.y / mag
  }
}

export function scalar_mult(a, b) {
  return {
    x: a.x * b,
    y: a.y * b
  }
}

/** @method rotate
 * @param a - the vector being rotated
 * @param angle - the angle in radians.
 */
export function rotate(a,angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

export function perpendicular(a) {
  return {
    x: -a.y,
    y: a.x
  }
}

export function distance2(a,b) {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2); 
}