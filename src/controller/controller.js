import Ship from "../ship/ship";
import GameBoard from "../gameboard/gameboard";
import Player from "../player/player";
import Computer from "../player/computer/computer";

export default class Controller {
  #players = {};

  createGameBoard() {
    const board = new GameBoard();
    board.createBoard();
    return board;
  }

  createShip(length) {
    const ship = new Ship(length);
    return ship;
  }

  createPlayers() {
    this.#players[1] = new Player(this.createGameBoard());
    this.#players[2] = new Computer(this.createGameBoard());
  }

  get players() {
    return this.#players;
  }

  placeShip(player, options) {
    const { x, y, axis, length } = options;
    const ship = this.createShip(length);
    this.#players[player].gameBoard.placeShip(ship, options);
  }

  placeComputerShips() {
    if (Object.getPrototypeOf(this.#players[2]) !== Computer.prototype) {
      throw new TypeError(
        "The second player is not a Computer. Only Computer players can randomly place their ships",
      );
    }

    this.#players[2].placeShips();
  }

  sendAttack(player, coordinates) {
    this.#players[player].gameBoard.receiveAttack(coordinates);
  }

  generateComputerAttack(enemyBoard) {
    return Computer.generateAttackCoordinates(enemyBoard);
  }

  isGameOver() {
    if (
      this.#players[1].gameBoard.isGameOver() ||
      this.#players[2].gameBoard.isGameOver()
    ) {
      return true;
    }

    return false;
  }

  getWinner() {
    if (this.#players[1].gameBoard.isGameOver()) return this.#players[2];
    if (this.#players[2].gameBoard.isGameOver()) return this.#players[1];
    return null;
  }
}
