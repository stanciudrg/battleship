import Controller from "./controller";
import GameBoard from "../gameboard/gameboard";
import Ship from "../ship/ship";
import Player from "../player/player";
import Computer from "../player/computer/computer";

test("The controller creates a valid gameBoard", () => {
  expect(Controller.createGameBoard()).toBeInstanceOf(GameBoard);
});

test("The controller creates a valid ship", () => {
  expect(Controller.createShip(4)).toBeInstanceOf(Ship);
});

test("The controller creates the necessary players for the game", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();

  expect(controller.players[1]).toBeInstanceOf(Player);
  expect(controller.players[2]).toBeInstanceOf(Player);
});

test("The controller places the ship for the passed player at the passed coordinate", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });

  expect(controller.players[1].gameBoard.board[0][0].ship).toBeInstanceOf(Ship);
});

test("The controller correctly specifies if the given player's gameBoard contains the ship with the given id", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();

  controller.placeShip(1, {
    x: 0,
    y: 0,
    axis: "x",
    length: 4,
    id: "destroyer",
  });

  expect(controller.hasShip(1, "destroyer")).toBe(true);
  expect(controller.hasShip(1, "battleship")).toBe(false);
});

test("The controller removes the ship with the given id for the given player", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();

  controller.placeShip(1, {
    x: 0,
    y: 0,
    axis: "x",
    length: 4,
    id: "destroyer",
  });

  controller.removeShip(1, "destroyer");

  expect(controller.players[1].gameBoard.board[0][0]["ship"]).toBeUndefined();
  expect(controller.players[1].gameBoard.board[1][0]["ship"]).toBeUndefined();
  expect(controller.players[1].gameBoard.board[2][0].ship).toBeUndefined();
  expect(controller.players[1].gameBoard.board[3][0].ship).toBeUndefined();
});

test("The controller correctly determines if the passed player's gameBoard has enough ships", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();

  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });

  expect(controller.hasEnoughShips(1)).toBe(false);

  controller.placeShip(1, { x: 2, y: 0, axis: "x", length: 4 });

  controller.placeShip(1, { x: 4, y: 0, axis: "x", length: 4 });

  controller.placeShip(1, { x: 6, y: 0, axis: "x", length: 4 });

  controller.placeShip(1, { x: 8, y: 0, axis: "x", length: 4 });

  expect(controller.hasEnoughShips(1)).toBe(true);
});

test("The controller correctly determines if the ship placement coordinates are valid", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });

  expect(
    controller.isValidPlacement(1, { x: 0, y: 0, axis: "x", length: 4 }),
  ).toBe(false);

  expect(
    controller.isValidPlacement(1, { x: 0, y: 3, axis: "x", length: 4 }),
  ).toBe(false);

  expect(
    controller.isValidPlacement(1, { x: 0, y: 8, axis: "x", length: 4 }),
  ).toBe(false);

  expect(
    controller.isValidPlacement(1, { x: 8, y: 0, axis: "y", length: 4 }),
  ).toBe(false);

  expect(
    controller.isValidPlacement(1, { x: 2, y: 0, axis: "x", length: 4 }),
  ).toBe(true);
});

test("The controller sends the attack to the passed player at the passed coordinate", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.sendAttack(1, { x: 0, y: 0 });

  expect(controller.players[1].gameBoard.board[0][0].isHit).toBe(true);
});

test("The controller correctly manipulates the Computer instance into placing its ships", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeComputerShips();

  expect(controller.players[2].gameBoard.ships.length).toBe(5);

  controller.players[2].gameBoard.ships.forEach((ship) => {
    expect(ship.shipInstance).toBeInstanceOf(Ship);
  });
});

test("The controller correctly manipulates the Computer instance into generating a valid attack", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();

  const playerBoard = controller.players[1].gameBoard.board;

  const computerAttackCoordinates =
    controller.generateComputerAttack(playerBoard);

  expect(computerAttackCoordinates).toHaveProperty("x");
  expect(computerAttackCoordinates).toHaveProperty("y");
});

test("The controller correctly detects if the game is over", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  controller.sendAttack(1, { x: 0, y: 0 });
  controller.sendAttack(1, { x: 0, y: 1 });
  controller.sendAttack(1, { x: 0, y: 2 });

  controller.sendAttack(2, { x: 0, y: 2 });
  controller.sendAttack(2, { x: 0, y: 3 });

  expect(controller.isGameOver()).toBe(false);

  controller.sendAttack(1, { x: 0, y: 3 });

  expect(controller.isGameOver()).toBe(true);
});

test("The controller plays a round for the player correctly", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  const playerAttackCoordinates = {
    x: 2,
    y: 3,
  };

  controller.playPlayerRound(playerAttackCoordinates);

  expect(
    controller.players[2].gameBoard.board[playerAttackCoordinates.x][
      playerAttackCoordinates.y
    ].isHit,
  ).toBe(true);
});

test("The controller plays a round for the computer correctly", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  controller.playComputerRound();

  let computerHitPlayer;

  controller.players[1].gameBoard.board.forEach((x) => {
    x.forEach((y) => {
      if (y.isHit) computerHitPlayer = true;
    });
  });

  expect(computerHitPlayer).toBe(true);
});

test("The controller returns the correct game status and attack results", () => {
  const controller = new Controller();

  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  const round = controller.playPlayerRound({ x: 2, y: 3 });

  expect(round.isGameOver).toBe(false);
  expect(round.hitShip).toBe(false);

  controller.playPlayerRound({ x: 0, y: 0 });
  controller.playPlayerRound({ x: 0, y: 1 });
  controller.playPlayerRound({ x: 0, y: 2 });
  const newRound = controller.playPlayerRound({ x: 0, y: 3 });

  expect(newRound.isGameOver).toBe(true);
  expect(newRound.hitShip).toBe(true);
});

test("The controller correctly increments the score of the specified player", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.increaseScore(1);

  expect(controller.players[1].score).toBe(1);
});

test("The controller correctly resets players score", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.increaseScore(1);
  controller.increaseScore(1);
  controller.increaseScore(2);
  controller.resetScore();

  expect(controller.players[1].score).toBe(0);
  expect(controller.players[2].score).toBe(0);
});

test("The controller throws if trying to play a round and the game is over", () => {
  const controller = new Controller();

  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  controller.playPlayerRound({ x: 0, y: 0 });
  controller.playPlayerRound({ x: 0, y: 1 });
  controller.playPlayerRound({ x: 0, y: 2 });
  controller.playPlayerRound({ x: 0, y: 3 });

  expect(() => {
    controller.playPlayerRound({ x: 0, y: 4 });
  }).toThrow();
});

test("The controller correctly starts a new game of player vs computer", () => {
  const controller = new Controller();
  controller.newGameVsComputer();
  expect(controller.players[1]).toBeDefined();
  expect(controller.players[2]).toBeDefined();
  expect(controller.players[1]).toBeInstanceOf(Player);
  expect(controller.players[2]).toBeInstanceOf(Computer);
  expect(controller.players[1].gameBoard).toBeDefined();
  expect(controller.players[2].gameBoard).toBeDefined();
  expect(controller.players[1].gameBoard).toBeInstanceOf(GameBoard);
  expect(controller.players[2].gameBoard).toBeInstanceOf(GameBoard);
  expect(controller.players[2].gameBoard.ships.length).toBe(5);
  controller.players[2].gameBoard.ships.forEach((ship) => {
    expect(ship.shipInstance).toBeInstanceOf(Ship);
  });
});

test("The controller correctly resets the board of the passed player", () => {
  const controller = new Controller();
  controller.newGameVsComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });

  const oldPlayerGameBoard = controller.players[1].gameBoard.board;
  const oldComputerGameBoard = controller.players[2].gameBoard.board;

  controller.resetBoard(1);
  controller.resetBoard(2);

  const newPlayerGameBoard = controller.players[1].gameBoard.board;
  const newComputerGameBoard = controller.players[2].gameBoard.board;

  expect(oldPlayerGameBoard).not.toEqual(newPlayerGameBoard);
  expect(oldComputerGameBoard).not.toEqual(newComputerGameBoard);
});

test("The controller correctly resets the 'ships' array of the passed player's GameBoard", () => {
  const controller = new Controller();
  controller.newGameVsComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });

  controller.deleteShips(1);
  controller.deleteShips(2);

  expect(controller.players[1].gameBoard.ships).toStrictEqual([]);
  expect(controller.players[2].gameBoard.ships).toStrictEqual([]);
});

test("The controller correctly restarts a game", () => {
  const controller = new Controller();

  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  const oldPlayerGameBoard = controller.players[1].gameBoard.board;
  const oldPlayerTwoGameBoard = controller.players[2].gameBoard.board;

  controller.restartGame();

  const newPlayerGameBoard = controller.players[1].gameBoard.board;
  const newPlayerTwoGameBoard = controller.players[2].gameBoard.board;

  expect(oldPlayerGameBoard).not.toEqual(newPlayerGameBoard);
  expect(oldPlayerTwoGameBoard).not.toEqual(newPlayerTwoGameBoard);

  expect(controller.players[1].gameBoard.ships).toStrictEqual([]);
  expect(controller.players[2].gameBoard.ships).toStrictEqual([]);
});

test("The controller correctly restarts a game of player vs computer", () => {
  const controller = new Controller();
  controller.newGameVsComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });

  const oldPlayerGameBoard = controller.players[1].gameBoard.board;
  const oldComputerGameBoard = controller.players[2].gameBoard.board;

  controller.restartGameVsComputer();

  const newPlayerGameBoard = controller.players[1].gameBoard.board;
  const newComputerGameBoard = controller.players[2].gameBoard.board;

  expect(oldPlayerGameBoard).not.toEqual(newPlayerGameBoard);
  expect(oldComputerGameBoard).not.toEqual(newComputerGameBoard);

  expect(controller.players[1].gameBoard.ships).toStrictEqual([]);
  expect(controller.players[2].gameBoard.ships.length).toBe(5);
});
