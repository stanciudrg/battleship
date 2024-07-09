export default class Player {
  #gameBoard;

  constructor(gameBoard) {
    if (!gameBoard) {
      throw new TypeError(
        "gameBoard was not provided. All players must have a gameBoard",
      );
    }

    if (typeof gameBoard !== "object" || Array.isArray(gameBoard)) {
      throw new TypeError("gameBoard must be a valid object");
    }

    this.#gameBoard = gameBoard;
  }
}
