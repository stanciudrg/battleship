import GameBoard from "./gameboard";

test("GameBoard class is initialized", () => {
  expect(new GameBoard()).not.toBeUndefined();
});

test("GameBoard class creates a valid board", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();
  expect(gameBoard.board.length).toBe(10);

  gameBoard.board.forEach((x) => {
    expect(x.length).toBe(10);

    x.forEach((y) => {
      expect(y).toEqual({
        isHit: false,
      });
    });
  });
});
