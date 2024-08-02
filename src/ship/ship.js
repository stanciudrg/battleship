export default class Ship {
  #id;
  #length;

  #hits = 0;

  constructor(length, id) {
    if (!length) throw new TypeError("Ship length must be provided");

    if (typeof length !== "number") {
      throw new TypeError("Ship length must be a number");
    }

    if (length < 2 || length > 5) {
      throw new RangeError(
        "Ship length must not be lower than 2 or higher than 5",
      );
    }

    this.#id = id;
    this.#length = length;
  }

  get id() {
    return this.#id;
  }

  get length() {
    return this.#length;
  }

  get hits() {
    return this.#hits;
  }

  hit() {
    if (this.isSunk()) {
      throw new RangeError(
        "Ship has already been sunk (no. of hits is equal to ship's length)",
      );
    }
    this.#hits += 1;
  }

  isSunk() {
    return this.#hits === this.#length;
  }
}
