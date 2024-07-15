import Controller from "./controller";
import GameBoard from "../gameboard/gameboard";
import Ship from "../ship/ship";
import Player from "../player/player";
import Computer from "../player/computer/computer";

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
    expect(ship).toBeInstanceOf(Ship);
  });
});

test("The controller correctly manipulates the Computer instance into generating a random valid attack", () => {
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

test("The controller correctly determines the winner", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  controller.sendAttack(1, { x: 0, y: 0 });
  controller.sendAttack(1, { x: 0, y: 1 });
  controller.sendAttack(1, { x: 0, y: 2 });

  controller.sendAttack(2, { x: 0, y: 2 });
  controller.sendAttack(2, { x: 0, y: 3 });

  expect(controller.getWinner()).toBe(null);

  controller.sendAttack(1, { x: 0, y: 3 });

  expect(controller.getWinner()).toEqual(controller.players[2]);
});

test("The controller plays a round between the player and computer correctly", () => {
  const controller = new Controller();
  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  const playerAttackCoordinates = {
    x: 2,
    y: 3,
  };

  controller.playRoundVsComputer(playerAttackCoordinates);

  expect(
    controller.players[2].gameBoard.board[playerAttackCoordinates.x][
      playerAttackCoordinates.y
    ].isHit,
  ).toBe(true);

  let computerHitPlayer;

  controller.players[1].gameBoard.board.forEach((x) => {
    x.forEach((y) => {
      if (y.isHit) computerHitPlayer = true;
    });
  });

  expect(computerHitPlayer).toBe(true);
});

test("The controller returns the correct game status and winner after each round", () => {
  // Mock the method on the prototype
  Controller.prototype.generateComputerAttack = jest
    .fn()
    .mockReturnValueOnce({ x: 1, y: 2 })
    .mockReturnValueOnce({ x: 1, y: 5 })
    .mockReturnValueOnce({ x: 1, y: 7 })
    .mockReturnValueOnce({ x: 1, y: 6 })
    .mockReturnValueOnce({ x: 1, y: 8 });

  const controller = new Controller();

  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  const round = controller.playRoundVsComputer({ x: 2, y: 3 });

  expect(round.isGameOver).toBe(false);
  expect(round.winner).toBe(null);

  controller.playRoundVsComputer({ x: 0, y: 0 });
  controller.playRoundVsComputer({ x: 0, y: 1 });
  controller.playRoundVsComputer({ x: 0, y: 2 });
  const newRound = controller.playRoundVsComputer({ x: 0, y: 3 });

  expect(newRound.isGameOver).toBe(true);
  expect(newRound.winner).toBe(controller.players[1]);
});

test("The controller throws if trying to play a round and the game is over", () => {
  // Mock the method on the prototype
  Controller.prototype.generateComputerAttack = jest
    .fn()
    .mockReturnValueOnce({ x: 1, y: 5 })
    .mockReturnValueOnce({ x: 1, y: 7 })
    .mockReturnValueOnce({ x: 1, y: 6 })
    .mockReturnValueOnce({ x: 1, y: 8 });

  const controller = new Controller();

  controller.createPlayerAndComputer();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  controller.playRoundVsComputer({ x: 0, y: 0 });
  controller.playRoundVsComputer({ x: 0, y: 1 });
  controller.playRoundVsComputer({ x: 0, y: 2 });
  controller.playRoundVsComputer({ x: 0, y: 3 });

  expect(() => {
    controller.playRoundVsComputer({ x: 0, y: 4 });
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
    expect(ship).toBeInstanceOf(Ship);
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
