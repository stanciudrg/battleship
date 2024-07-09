export default class Player {
  #gameBoard;

  constructor(gameBoard) {
    if (!gameBoard) {
      throw new TypeError(
        "gameBoard was not provided. All players must have a gameBoard",
      );
    }

    this.#gameBoard = gameBoard;
  }
}
