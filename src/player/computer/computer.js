import Player from "../player";
import Ship from "../../ship/ship";

export default class Computer extends Player {
  constructor(gameBoard) {
    super(gameBoard);
  }

  placeShips() {
    const ships = [
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];

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

  static generateAttackCoordinates(gameBoard) {
    const generateRandomX = () => {
      const availableXs = [];

      gameBoard.forEach((x, index) => {
        if (
          x.find((y) => {
            if (!y.isHit) return y;
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
    };

    const randomX = generateRandomX();

    const generateRandomY = () => {
      const availableYs = [];

      gameBoard[randomX].forEach((y, index) => {
        if (!y.isHit) availableYs.push(index);
      });

      return availableYs[Math.floor(Math.random() * availableYs.length)];
    };

    const randomY = generateRandomY();

    return { x: randomX, y: randomY };
  }
}
