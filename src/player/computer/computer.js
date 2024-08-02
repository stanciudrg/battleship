import Player from "../player";

export default class Computer extends Player {
  #lastMove;

  constructor(gameBoard) {
    super(gameBoard);
  }

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

  static generateRandomAttack(gameBoard) {
    const randomX = Computer.#generateRandomX(gameBoard);
    const randomY = Computer.#generateRandomY(gameBoard, randomX);

    return { x: randomX, y: randomY };
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
    const adjacentCoordinateGenerators = [
      Computer.#generateRandomAdjacentX,
      Computer.#generateRandomAdjacentY,
    ];

    let randomAdjacentCoords;

    while (!randomAdjacentCoords) {
      randomAdjacentCoords = adjacentCoordinateGenerators[
        Math.random() < 0.5 ? 0 : 1
      ](gameBoard, this.#lastMove.x, this.#lastMove.y);
    }

    if (randomAdjacentCoords) {
      return randomAdjacentCoords;
    }

    return Computer.generateRandomAttack(gameBoard);
  }

  generateAttackCoordinates(gameBoard) {
    if (this.#lastMove && gameBoard[this.#lastMove.x][this.#lastMove.y].ship) {
      this.#lastMove = this.#generatePreciseAttack(gameBoard);
      return this.#lastMove;
    }

    this.#lastMove = Computer.generateRandomAttack(gameBoard);
    return this.#lastMove;
  }
}
