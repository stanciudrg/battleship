import GameBoard from "./gameboard";

test("GameBoard class is initialized", () => {
  expect(new GameBoard()).not.toBeUndefined();
});
