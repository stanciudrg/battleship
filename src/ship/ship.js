export default class Ship {
  #length;
  #hits = 0;

  constructor(length) {
    if (!length) throw new TypeError("Ship length must be provided");

    if (typeof length !== "number") {
      throw new TypeError("Ship length must be a number");
    }

    if (length < 1 || length > 4) {
      throw new TypeError(
        "Ship length must not be lower than 1 or higher than 4",
      );
    }

    this.#length = length;
  }

  get length() {
    return this.#length;
  }

  hit() {
    this.#hits += 1;
  }

  get hits() {
    return this.#hits;
  }

  isSunk() {
    return this.#hits === this.#length;
  }
}
