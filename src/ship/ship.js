export default class Ship {
  #length;

  constructor(length) {
    if (!length) throw new TypeError("Ship length must be provided");

    if (typeof length !== "number") {
      throw new TypeError("Ship length must be a number");
    }

    this.#length = length;
  }

  get length() {
    return this.#length;
  }
}
