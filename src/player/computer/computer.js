import Player from "../player";

export default class Computer extends Player {
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

  static generateAttackCoordinates(gameBoard) {
    const generateRandomX = () => {
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
