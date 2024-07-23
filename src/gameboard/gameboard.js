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

  resetBoard() {
    this.#board = [];
    this.createBoard();
  }

  isValidPlacement(options) {
    if (this.#isOutOfBounds(options)) return false;
    if (this.#overlapsExistingShips(options)) return false;
    return true;
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

  removeShip(id) {
    const ship = this.#ships.find((ship) => ship.id === id);
    this.#ships.splice(this.#ships.indexOf(ship), 1);

    this.#board.forEach((x) => {
      x.forEach((y) => {
        if (y.ship && y.ship.id === id) delete y.ship;
      });
    });
  }

  deleteShips() {
    this.#ships = [];
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

    const findShip = (coordinates) => {
      const x = this.#board[coordinates.x];
      if (!x) return false;
      const y = x[coordinates.y];
      if (!y) return false;
      return y.ship;
    };

    const overlapsOnX = () => {
      const paddedY = y > 0 ? y - 1 : y;
      const paddedLength =
        y + length <= this.#board[x].length ? length + 1 : length;

      for (let i = 0; i <= paddedLength; i++) {
        if (findShip({ x: x - 1, y: paddedY + i })) return true;
        if (findShip({ x: x, y: paddedY + i })) return true;
        if (findShip({ x: x + 1, y: paddedY + i })) return true;
      }
    };

    const overlapsOnY = () => {
      const paddedX = x > 0 ? x - 1 : x;
      const paddedLength =
        x + length <= this.#board.length ? length + 1 : length;

      for (let i = 0; i <= paddedLength; i++) {
        if (findShip({ x: paddedX + i, y: y - 1 })) return true;
        if (findShip({ x: paddedX + i, y: y })) return true;
        if (findShip({ x: paddedX + i, y: y + 1 })) return true;
      }
    };

    if (axis === "x") {
      return overlapsOnX();
    } else if (axis === "y") {
      return overlapsOnY();
    }

    return false;
  }
}
