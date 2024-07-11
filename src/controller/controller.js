import Ship from "../ship/ship";
import GameBoard from "../gameboard/gameboard";
import Player from "../player/player";

export default class Controller {
  createGameBoard() {
    const board = new GameBoard();
    board.createBoard();
    return board;
  }

  createShip(length) {
    const ship = new Ship(length);
    return ship;
  }
}
