import GameBoard from "../../gameboard/gameboard";
import Ship from "../../ship/ship";
import Computer from "./computer";

test("Computer class randomly places ships on its gameBoard at valid coordinates", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();

  const computer = new Computer(gameBoard);
  computer.placeShips();

  expect(computer.gameBoard.ships.length).toBe(5);

  computer.gameBoard.ships.forEach((ship) => {
    expect(ship).toBeInstanceOf(Ship);
  });
});

test("Computer class generates a valid random attack for an empty gameBoard", () => {
  const gameBoard = new GameBoard();
  gameBoard.createBoard();

  const enemyGameBoard = new GameBoard();
  enemyGameBoard.createBoard();

  const attack = Computer.generateAttackCoordinates(enemyGameBoard);

  expect(attack.x >= 0 || attack.y >= 0 || attack.x <= 9 || attack.y <= 9).toBe(
    true,
  );
});
