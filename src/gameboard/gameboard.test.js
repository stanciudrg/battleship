import GameBoard from "./gameboard";
import Ship from "../ship/ship";

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

test("GameBoard class can place ships at a specified coordinate", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();

  const ship = new Ship(4);
  gameBoard.placeShip(ship, { x: 0, y: 0, axis: "x", length: 4 });

  expect(gameBoard.board[0][0]["ship"]).toEqual(ship);
  expect(gameBoard.board[0][1]["ship"]).toEqual(ship);
  expect(gameBoard.board[0][2].ship).toEqual(ship);
  expect(gameBoard.board[0][3].ship).toEqual(ship);
});

test("GameBoard class can place ships on both axes", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();

  const ship = new Ship(4);
  gameBoard.placeShip(ship, { x: 0, y: 0, axis: "y", length: 4 });

  expect(gameBoard.board[0][0]["ship"]).toEqual(ship);
  expect(gameBoard.board[1][0]["ship"]).toEqual(ship);
  expect(gameBoard.board[2][0].ship).toEqual(ship);
  expect(gameBoard.board[3][0].ship).toEqual(ship);
});

test("GameBoard correctly detects if coordinates are out of bounds", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();

  const ship = new Ship(4);

  expect(() => {
    gameBoard.placeShip(ship, { x: 6, y: 0, axis: "x", length: 4 });
  }).not.toThrow();

  expect(() => {
    gameBoard.placeShip(ship, { x: 0, y: 4, axis: "y", length: 4 });
  }).not.toThrow();

  expect(() => {
    gameBoard.placeShip(ship, { x: 7, y: 0, axis: "x", length: 4 });
  }).toThrow();

  expect(() => {
    gameBoard.placeShip(ship, { x: 0, y: 8, axis: "y", length: 4 });
  }).toThrow();
});
