import Ship from "../ship/ship";
import GameBoard from "../gameboard/gameboard";
import Player from "../player/player";

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
    this.#players[2] = new Player(this.createGameBoard());
  }

  get players() {
    return this.#players;
  }

  placeShip(player, options) {
    const { x, y, axis, length } = options;
    const ship = this.createShip(length);
    this.#players[player].gameBoard.placeShip(ship, options);
  }
}
