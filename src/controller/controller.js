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

  createPlayerAndComputer() {
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

    const ships = [
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];

    this.#players[2].placeShips(ships);
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

  playRoundVsComputer(playerAttackCoordinates) {
    if (this.isGameOver()) {
      throw new Error(
        "Trying to play a round when the game is already over. The game can only be played if both players have at least one ship that is not sunk",
      );
    }

    const playerAttack = playerAttackCoordinates;
    this.sendAttack(2, playerAttack);

    const playerGameBoard = this.#players[1].gameBoard.board;
    const computerAttack = this.generateComputerAttack(playerGameBoard);
    this.sendAttack(1, computerAttack);

    const isGameOver = this.isGameOver();
    const winner = this.getWinner();

    return {
      isGameOver: isGameOver,
      winner: winner,
    };
  }

  newGameVsComputer() {
    this.createPlayerAndComputer();
    this.placeComputerShips();
  }

  resetBoard(player) {
    this.players[player].gameBoard.resetBoard();
  }

  deleteShips(player) {
    this.players[player].gameBoard.deleteShips();
  }

  restartGame() {
    this.resetBoard(1);
    this.resetBoard(2);
    this.deleteShips(1);
    this.deleteShips(2);
  }

  restartGameVsComputer() {
    this.restartGame();

    const ships = [
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];

    this.players[2].placeShips(ships);
  }
}
