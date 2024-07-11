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
