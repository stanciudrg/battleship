import GameBoard from "../gameboard/gameboard";
import Player from "./player";

test("Player class is initialized if provided the correct gameBoard", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();
  expect(new Player(gameBoard)).not.toBeUndefined();
});
