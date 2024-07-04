export default class GameBoard {
  #board = [];

  get board() {
    return this.#board;
  }

  createBoard() {
    for (let i = 0; i < 10; i++) {
      const x = [];
      for (let j = 0; j < 10; j++) {
        x.push({
          isHit: false,
        });
      }
      this.#board.push(x);
    }
  }

  placeShip(ship, options) {
    if (this.#isOutOfBounds(options)) {
      throw new RangeError("Ship coordinates are out of bounds");
    }

    const { x, y, axis, length } = options;

    for (let i = 0; i < length; i++) {
      if (axis === "x") {
        this.#board[x][y + i].ship = ship;
      } else if (axis === "y") {
        this.#board[x + i][y].ship = ship;
      }
    }
  }

  #isOutOfBounds(options) {
    const { x, y, axis, length } = options;
    if (axis === "x" && x + length > 10) return true;
    if (axis === "y" && y + length > 10) return true;
  }
}
