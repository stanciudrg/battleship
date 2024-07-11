import Controller from "./controller";
import GameBoard from "../gameboard/gameboard";
import Ship from "../ship/ship";
import Player from "../player/player";

test("The controller creates a valid gameBoard", () => {
  const controller = new Controller();
  expect(controller.createGameBoard()).toBeInstanceOf(GameBoard);
});

test("The controller creates a valid ship", () => {
  const controller = new Controller();
  expect(controller.createShip(4)).toBeInstanceOf(Ship);
});

test("The controller creates the necessary players for the game", () => {
  const controller = new Controller();
  controller.createPlayers();
  expect(controller.players[1]).toBeInstanceOf(Player);
  expect(controller.players[2]).toBeInstanceOf(Player);
});

test("The controller places the ship for the passed player at the passed coordinate", () => {
  const controller = new Controller();
  controller.createPlayers();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  expect(controller.players[1].gameBoard.board[0][0].ship).toBeInstanceOf(Ship);
});
