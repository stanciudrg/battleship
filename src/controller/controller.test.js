import Controller from "./controller";
import GameBoard from "../gameboard/gameboard";
import Ship from "../ship/ship";

test("The controller creates a valid gameBoard", () => {
  const controller = new Controller();
  expect(controller.createGameBoard()).toBeInstanceOf(GameBoard);
});

test("The controller creates a valid ship", () => {
  const controller = new Controller();
  expect(controller.createShip(4)).toBeInstanceOf(Ship);
});
