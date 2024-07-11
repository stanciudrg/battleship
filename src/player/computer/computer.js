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

    const generateCoordinates = (length) => {
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
}
