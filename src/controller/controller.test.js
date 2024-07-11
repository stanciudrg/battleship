import GameBoard from "../gameboard/gameboard";
import Controller from "./controller";

test("The controller creates a valid gameBoard", () => {
  const controller = new Controller();
  expect(controller.createGameBoard()).toBeInstanceOf(GameBoard);
});
