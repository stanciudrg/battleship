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

  getGameBoard(player) {
    return this.#players[player].gameBoard.board;
  }

  createShip(length, id = null) {
    const ship = new Ship(length, id);
    return ship;
  }

  createPlayerAndComputer() {
    this.#players[1] = new Player(this.createGameBoard());
    this.#players[2] = new Computer(this.createGameBoard());
  }

  get players() {
    return this.#players;
  }

  getPlayerScore(player) {
    return this.#players[player].score;
  }

  placeShip(player, options) {
    const ship = this.createShip(options.length, options.id);
    this.#players[player].gameBoard.placeShip(ship, options);
  }

  removeShip(player, id) {
    this.#players[player].gameBoard.removeShip(id);
  }

  isValidPlacement(player, coordinates) {
    return this.#players[player].gameBoard.isValidPlacement(coordinates);
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

  increaseScore(player) {
    this.#players[player].increaseScore();
  }

  playPlayerRound(coordinates) {
    if (this.isGameOver()) {
      throw new Error(
        "Trying to play a round when the game is already over. The game can only be played if both players have at least one ship that is not sunk",
      );
    }

    this.sendAttack(2, coordinates);
    return {
      hitShip: this.getGameBoard(2)[coordinates.x][coordinates.y].ship
        ? true
        : false,
      isGameOver: this.isGameOver(),
    };
  }

  playComputerRound() {
    if (this.isGameOver()) {
      throw new Error(
        "Trying to play a round when the game is already over. The game can only be played if both players have at least one ship that is not sunk",
      );
    }

    const computerAttack = this.generateComputerAttack(this.getGameBoard(1));
    this.sendAttack(1, computerAttack);

    return {
      hitShip: this.getGameBoard(1)[computerAttack.x][computerAttack.y].ship
        ? true
        : false,
      isGameOver: this.isGameOver(),
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
    this.placeComputerShips();
  }

  resetScore() {
    this.players[1].resetScore();
    this.players[2].resetScore();
  }
}
