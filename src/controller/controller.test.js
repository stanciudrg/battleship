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

test("The controller sends the attack to the passed player at the passed coordinate", () => {
  const controller = new Controller();
  controller.createPlayers();
  controller.sendAttack(1, { x: 0, y: 0 });

  expect(controller.players[1].gameBoard.board[0][0].isHit).toBe(true);
});

test("The controller correctly manipulates the Computer instance into placing its ships", () => {
  const controller = new Controller();
  controller.createPlayers();
  controller.placeComputerShips();

  expect(controller.players[2].gameBoard.ships.length).toBe(5);

  controller.players[2].gameBoard.ships.forEach((ship) => {
    expect(ship).toBeInstanceOf(Ship);
  });
});

test("The controller correctly manipulates the Computer instance into generating a random valid attack", () => {
  const controller = new Controller();
  controller.createPlayers();

  const playerBoard = controller.players[1].gameBoard.board;

  const computerAttackCoordinates =
    controller.generateComputerAttack(playerBoard);

  expect(computerAttackCoordinates).toHaveProperty("x");
  expect(computerAttackCoordinates).toHaveProperty("y");
});

test("The controller correctly detects if the game is over", () => {
  const controller = new Controller();
  controller.createPlayers();
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
  controller.createPlayers();
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
  controller.createPlayers();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  const playerAttackCoordinates = {
    x: 2,
    y: 3,
  };

  controller.playRound(playerAttackCoordinates);

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

  controller.createPlayers();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  const round = controller.playRound({ x: 2, y: 3 });

  expect(round.isGameOver).toBe(false);
  expect(round.winner).toBe(null);

  controller.playRound({ x: 0, y: 0 });
  controller.playRound({ x: 0, y: 1 });
  controller.playRound({ x: 0, y: 2 });
  const newRound = controller.playRound({ x: 0, y: 3 });

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

  controller.createPlayers();
  controller.placeShip(1, { x: 0, y: 0, axis: "x", length: 4 });
  controller.placeShip(2, { x: 0, y: 0, axis: "x", length: 4 });

  controller.playRound({ x: 0, y: 0 });
  controller.playRound({ x: 0, y: 1 });
  controller.playRound({ x: 0, y: 2 });
  controller.playRound({ x: 0, y: 3 });

  expect(() => {
    controller.playRound({ x: 0, y: 4 });
  }).toThrow();
});
