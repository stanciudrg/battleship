export default class Ship {
  #length;

  constructor(length) {
    if (!length) throw new TypeError("Ship length must be provided");
    this.#length = length;
  }

  get length() {
    return this.#length;
  }
}
