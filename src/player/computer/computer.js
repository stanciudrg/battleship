import Player from "../player";

export default class Computer extends Player {
  #lastMove;

  #moves = [];

  #focusingShip;

  placeShips(ships) {
    const generateCoordinates = () => {
      return {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        axis: Math.floor(Math.random() * 10) < 4 ? "x" : "y",
      };
    };

    const randomlyPlaceShip = (ship) => {
      try {
        this.gameBoard.placeShip(ship, {
          ...generateCoordinates(),
          length: ship.length,
        });
      } catch {
        randomlyPlaceShip(ship);
      }
    };

    ships.forEach((ship) => {
      randomlyPlaceShip(ship);
    });
  }

  static #generateRandomX(gameBoard) {
    const availableXs = [];

    gameBoard.forEach((x, index) => {
      if (
        x.some((y) => {
          return !y.isHit;
        })
      )
        availableXs.push(index);
    });

    if (availableXs.length === 0) {
      throw new RangeError(
        "Attempting to generate an attack for a full gameBoard. gameBoard must have at least one free spot in order for a valid coordinate to be generated.",
      );
    }

    return availableXs[Math.floor(Math.random() * availableXs.length)];
  }

  static #generateRandomY(gameBoard, x) {
    const availableYs = [];

    gameBoard[x].forEach((y, index) => {
      if (!y.isHit) availableYs.push(index);
    });

    return availableYs[Math.floor(Math.random() * availableYs.length)];
  }

  static generateRandomAttack(gameBoard) {
    const randomX = Computer.#generateRandomX(gameBoard);
    const randomY = Computer.#generateRandomY(gameBoard, randomX);

    return { x: randomX, y: randomY };
  }

  static #generateRandomAdjacentX(gameBoard, x, y) {
    const availableXs = [];

    if (gameBoard[x - 1] && gameBoard[x - 1][y] && !gameBoard[x - 1][y].isHit) {
      availableXs.push(x - 1);
    }

    if (gameBoard[x + 1] && gameBoard[x + 1][y] && !gameBoard[x + 1][y].isHit) {
      availableXs.push(x + 1);
    }

    if (availableXs.length > 1) {
      return { x: availableXs[Math.random() < 0.5 ? 0 : 1], y };
    }

    if (availableXs.length === 1) {
      return { x: availableXs[0], y };
    }

    return false;
  }

  static #generateRandomAdjacentY(gameBoard, x, y) {
    const availableYs = [];

    if (gameBoard[x] && gameBoard[x][y - 1] && !gameBoard[x][y - 1].isHit) {
      availableYs.push(y - 1);
    }

    if (gameBoard[x] && gameBoard[x][y + 1] && !gameBoard[x][y + 1].isHit) {
      availableYs.push(y + 1);
    }

    if (availableYs.length > 1) {
      return { x, y: availableYs[Math.random() < 0.5 ? 0 : 1] };
    }

    if (availableYs.length === 1) {
      return { x, y: availableYs[0] };
    }

    return false;
  }

  #generatePreciseAttack(gameBoard) {
    const firstHit = this.#moves.find((move) => move.firstHit === true);
    const lastMove = this.#moves[this.#moves.length - 1];

    if (gameBoard[lastMove.x][lastMove.y].ship) {
      lastMove.hitShip = true;
    }

    const hits = this.#moves.filter((move) => move.hitShip === true);

    const adjacentCoordinateGenerators = [
      Computer.#generateRandomAdjacentX,
      Computer.#generateRandomAdjacentY,
    ];

    if (hits.length < 2) {
      let randomAdjacentCoords;

      while (!randomAdjacentCoords) {
        randomAdjacentCoords = adjacentCoordinateGenerators[
          Math.random() < 0.5 ? 0 : 1
        ](gameBoard, firstHit.x, firstHit.y);
      }

      this.#moves.push(randomAdjacentCoords);
      return randomAdjacentCoords;
    }

    const generatePreciseAdjacentMove = (callback) => {
      const initialDirection = callback(
        gameBoard,
        hits[hits.length - 1].x,
        hits[hits.length - 1].y,
      );

      if (initialDirection) {
        this.#moves.push(initialDirection);
        return initialDirection;
      }

      const reversedDirection = callback(gameBoard, hits[0].x, hits[0].y);
      this.#moves.push(reversedDirection);
      return reversedDirection;
    };

    if (hits[0].x === hits[1].x) {
      return generatePreciseAdjacentMove(Computer.#generateRandomAdjacentY);
    }

    return generatePreciseAdjacentMove(Computer.#generateRandomAdjacentX);
  }

  generateAttackCoordinates(gameBoard) {
    if (this.#focusingShip && this.#focusingShip.isSunk()) {
      this.#focusingShip = false;
      this.#moves = [];

      this.#lastMove = Computer.generateRandomAttack(gameBoard);
      return this.#lastMove;
    }

    if (this.#focusingShip) return this.#generatePreciseAttack(gameBoard);

    if (this.#lastMove && gameBoard[this.#lastMove.x][this.#lastMove.y].ship) {
      this.#focusingShip = gameBoard[this.#lastMove.x][this.#lastMove.y].ship;
      this.#moves.push({ ...this.#lastMove, firstHit: true });
      return this.#generatePreciseAttack(gameBoard);
    }

    this.#lastMove = Computer.generateRandomAttack(gameBoard);
    return this.#lastMove;
  }
}
