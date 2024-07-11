export default class GameBoard {
  #board = [];
  #ships = [];

  get board() {
    return this.#board;
  }

  get ships() {
    return this.#ships;
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
    if (this.#ships.length >= 5) {
      throw new RangeError(
        "Attempting to place more than 5 ships on the gameBoard. GameBoard must have exactly 5 ships",
      );
    }

    if (this.#isOutOfBounds(options)) {
      throw new RangeError("Ship coordinates are out of bounds");
    }

    if (this.#overlapsExistingShips(options)) {
      throw new RangeError("Ship coordinates overlap existing ships");
    }

    const { x, y, axis, length } = options;

    this.#ships.push(ship);

    for (let i = 0; i < length; i++) {
      if (axis === "x") {
        this.#board[x][y + i].ship = ship;
      } else if (axis === "y") {
        this.#board[x + i][y].ship = ship;
      }
    }
  }

  receiveAttack(coordinates) {
    const { x, y } = coordinates;

    if (x > 10 || x < 0 || y > 10 || y < 0) {
      throw new RangeError(
        "Attempting to hit a coordinate that is out of bounds",
      );
    }

    if (this.#board[x][y].isHit) {
      return console.warn(
        "Attempting to hit a coordinate multiple times. The coordinate has already been hit. No actions were taken",
      );
    }

    this.#board[x][y].isHit = true;
    if (this.#board[x][y].ship) this.#board[x][y].ship.hit();
  }

  isGameOver() {
    const livingShip = this.#ships.find((ship) => {
      if (ship.isSunk() === false) return ship;
    });

    if (livingShip) return false;
    return true;
  }

  #isOutOfBounds(options) {
    const { x, y, axis, length } = options;
    if (axis === "x" && y + length > 9) return true;
    if (axis === "y" && x + length > 9) return true;
  }

  #overlapsExistingShips(options) {
    const { x, y, axis, length } = options;

    if (axis === "x") {
      for (let i = 0; i < length; i++) {
        if (this.#board[x][y + i].ship) return true;
      }
    } else if (axis === "y") {
      for (let i = 0; i < length; i++) {
        if (this.#board[x + i][y].ship) return true;
      }
    }

    return false;
  }
}
