import GameBoard from "../gameboard/gameboard";
import Player from "./player";

test("Player class is initialized if provided the correct gameBoard", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();
  expect(new Player(gameBoard)).not.toBeUndefined();
});

test("Player class throws if it is initialized without a gameBoard", () => {
  expect(() => {
    new Player();
  }).toThrow();
  expect(() => {
    new Player(undefined);
  }).toThrow();
  expect(() => {
    new Player(null);
  }).toThrow();
});

test("Player class throws if gameBoard is not an object", () => {
  expect(() => {
    new Player("");
  }).toThrow();
  expect(() => {
    new Player([]);
  }).toThrow();
  expect(() => {
    new Player(function () {});
  }).toThrow();
});

test("Player class correctly increments the score", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();
  const player = new Player(gameBoard);

  expect(player.score).toBe(0);
  player.increaseScore();
  expect(player.score).toBe(1);
});
