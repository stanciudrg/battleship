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

    this.#ships.push({ shipInstance: ship, shipCoordinates: options });

    for (let i = 0; i < length; i++) {
      if (axis === "x") {
        this.#board[x][y + i].ship = ship;
      } else if (axis === "y") {
        this.#board[x + i][y].ship = ship;
      }
    }
  }

  hasShip(id) {
    const ship = this.#ships.find((ship) => ship.shipInstance.id === id);
    if (ship) return true;
    return false;
  }

  removeShip(id) {
    const ship = this.#ships.find((ship) => ship.shipInstance.id === id);

    if (!ship) {
      throw new RangeError(
        "Attempting to remove a ship that does not exist. The passed id must match the id of an existing ship",
      );
    }

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

    if (this.#board[x][y].ship) {
      this.#board[x][y].ship.hit();

      this.hitAdjacentDiagonalSquares(x, y);

      if (this.#board[x][y].ship.isSunk()) {
        const shipCoordinates = this.#ships.find((ship) => {
          return ship.shipInstance.id === this.#board[x][y].ship.id;
        }).shipCoordinates;

        this.hitAdjacentSquares(shipCoordinates);
      }
    }
    this.updateLastHit({ x, y });
  }

  hitAdjacentDiagonalSquares(x, y) {
    const directions = [
      { x: x - 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y + 1 },
    ];

    directions.forEach((direction) => {
      if (this.#board[direction.x] && this.#board[direction.x][direction.y]) {
        this.#board[direction.x][direction.y].isHit = true;
        this.#board[direction.x][direction.y].isCollateralDamage = true;
      }
    });
  }

  hitAdjacentSquares(coordinates) {
    const { x, y, axis, length } = coordinates;

    const findSquare = (coordinates) => {
      const x = this.#board[coordinates.x];
      if (!x) return false;
      const y = x[coordinates.y];
      if (!y) return false;
      return y;
    };

    const hit = (location) => {
      if (location.isHit) return;
      location.isHit = true;
      location.isCollateralDamage = true;
    };

    const hitOnX = () => {
      const paddedY = y - 1;
      const paddedLength =
        y + length <= this.#board[x].length ? length + 1 : length;

      for (let i = 0; i <= paddedLength; i += 1) {
        const previousX = findSquare({ x: x - 1, y: paddedY + i });
        const currentX = findSquare({ x: x, y: paddedY + i });
        const nextX = findSquare({ x: x + 1, y: paddedY + i });

        if (previousX) hit(previousX);
        if (currentX) hit(currentX);
        if (nextX) hit(nextX);
      }
    };

    const hitOnY = () => {
      const paddedX = x - 1;
      const paddedLength =
        x + length <= this.#board.length ? length + 1 : length;

      for (let i = 0; i <= paddedLength; i += 1) {
        const previousY = findSquare({ x: paddedX + i, y: y - 1 });
        const currentY = findSquare({ x: paddedX + i, y: y });
        const nextY = findSquare({ x: paddedX + i, y: y + 1 });

        if (previousY) hit(previousY);
        if (currentY) hit(currentY);
        if (nextY) hit(nextY);
      }
    };

    if (axis === "x") {
      return hitOnX();
    }

    return hitOnY();
  }

  updateLastHit(coordinates) {
    this.#board.forEach((x) => {
      x.forEach((y) => {
        if (y.lastHit) delete y.lastHit;
      });
    });

    this.#board[coordinates.x][coordinates.y].lastHit = true;
  }

  isGameOver() {
    const livingShip = this.#ships.find((ship) => {
      if (ship.shipInstance.isSunk() === false) return ship;
    });

    if (livingShip) return false;
    return true;
  }

  #isOutOfBounds(options) {
    const { x, y, axis, length } = options;
    if (axis === "x" && y + length > 10) return true;
    if (axis === "y" && x + length > 10) return true;
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
      const paddedY = y - 1;
      const paddedLength =
        y + length <= this.#board[x].length ? length + 1 : length;

      for (let i = 0; i <= paddedLength; i++) {
        if (findShip({ x: x - 1, y: paddedY + i })) return true;
        if (findShip({ x: x, y: paddedY + i })) return true;
        if (findShip({ x: x + 1, y: paddedY + i })) return true;
      }
    };

    const overlapsOnY = () => {
      const paddedX = x - 1;
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
