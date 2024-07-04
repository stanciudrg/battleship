export default class GameBoard {
  #board = [];

  get board() {
    return this.#board;
  }

  createBoard() {
    for (let i = 0; i < 10; i++) {
      const x = [];
      for (let j = 0; j < 10; j++) {
        x.push({
          isHit: false,
        });
      }
      this.#board.push(x);
    }
  }
}
