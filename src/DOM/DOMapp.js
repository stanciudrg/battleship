import "./DOMapp.css";
import Controller from "../controller/controller";
import DOMCache from "./DOMCache";
import { setDependencies, open } from "./shipPlacementModal/shipPlacementModal";

const gameController = new Controller();
const shipPlacementModal = { setDependencies, open };

export default function DOMinit() {
  gameController.newGameVsComputer();

  shipPlacementModal.setDependencies({
    DOMCache: DOMCache.shipPlacement,
    updateBoardsDOM,
    updateBoardDOM,
    createBoardDOM,
    gameController,
  });

  shipPlacementModal.open();

  DOMCache.gameManipulation.restartGameBtn.addEventListener(
    "click",
    restartGame,
  );

  enablePlayerActions();

  if (isMobileMode()) changeButtonsBehavior();
}

function restartGame() {
  gameController.restartGameVsComputer();

  updateBoardDOM(DOMCache.gameBoards[1], document.createDocumentFragment());
  updateBoardDOM(DOMCache.gameBoards[2], document.createDocumentFragment());

  shipPlacementModal.open();

  enablePlayerActions();
}

async function handleRound(e) {
  if (!e.target.classList.contains("y-axis")) return;
  if (e.target.classList.contains("is-hit")) return;

  disablePlayerActions();

  const playerMove = makePlayerMove(
    Number(e.target.parentElement.dataset.index),
    Number(e.target.dataset.index),
  );

  if (playerMove.isGameOver) {
    increaseScore(1);
    announceWinner(1);
    return;
  }

  if (playerMove.hitShip) {
    enablePlayerActions();
    return;
  }

  const computerMove = await makeComputerMove();

  if (computerMove.isGameOver) {
    increaseScore(2);
    announceWinner(2);
    return;
  }

  enablePlayerActions();
}

function makePlayerMove(x, y) {
  const playerMove = gameController.playPlayerRound({ x, y });

  updateBoardDOM(
    DOMCache.gameBoards[2],
    createBoardDOM(2, gameController.getGameBoard(2)),
  );

  return playerMove;
}

function makeComputerMove() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.floor(Math.random() * (1500 - 1000 + 1)) + 1000);
  }).then(() => {
    const computerMove = gameController.playComputerRound();

    updateBoardDOM(
      DOMCache.gameBoards[1],
      createBoardDOM(1, gameController.getGameBoard(1)),
    );

    if (computerMove.isGameOver) {
      return computerMove;
    }

    if (computerMove.hitShip) return makeComputerMove();

    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }).then(() => computerMove);
  });
}

function updateBoardsDOM() {
  updateBoardDOM(
    DOMCache.gameBoards[1],
    createBoardDOM(1, gameController.getGameBoard(1)),
  );

  updateBoardDOM(
    DOMCache.gameBoards[2],
    createBoardDOM(2, gameController.getGameBoard(2)),
  );
}

function updateBoardDOM(oldBoardDOM, newBoardDOM) {
  oldBoardDOM.replaceChildren(...newBoardDOM.children);
}

function createBoardDOM(player, board) {
  const gameBoard = document.createDocumentFragment();

  board.forEach((x, xIndex) => {
    const xDOM = document.createElement("div");
    xDOM.classList.add("x-axis");
    xDOM.dataset.index = xIndex;

    x.forEach((y, yIndex) => {
      const yDOM = document.createElement("div");
      yDOM.classList.add("y-axis");
      yDOM.classList.add("square");
      yDOM.dataset.index = yIndex;

      if (y.isHit) yDOM.classList.add("is-hit");
      if (y.isCollateralDamage) yDOM.classList.add("is-collateral-damage");
      if (player === 1 && y.ship) yDOM.classList.add("own-ship");
      if (y.ship && y.isHit) yDOM.classList.add("damaged-ship");
      if (y.ship && y.ship.isSunk()) yDOM.classList.add("sunk-ship");
      if (y.lastHit) yDOM.classList.add("last-hit");

      xDOM.appendChild(yDOM);
    });

    gameBoard.appendChild(xDOM);
  });

  return gameBoard;
}

function announceWinner(winner) {
  DOMCache.winner.message.textContent =
    winner === 1 ? "You won" : "Computer won";
  DOMCache.winner.modal.style.display = "flex";

  DOMCache.winner.playAgainBtn.addEventListener("click", playAgain, {
    once: true,
  });
}

function playAgain() {
  restartGame();
  DOMCache.winner.message.textContent = "";
  DOMCache.winner.modal.style.display = "none";
}

function resetScore() {
  DOMCache.gameManipulation.resetScoreBtn.disabled = true;
  DOMCache.gameManipulation.resetScoreBtn.removeEventListener(
    "click",
    resetScore,
  );

  gameController.resetScore();
  updateScoreDOM(1, gameController.getPlayerScore(1));
  updateScoreDOM(2, gameController.getPlayerScore(2));
}

function increaseScore(player) {
  if (DOMCache.gameManipulation.resetScoreBtn.disabled) {
    DOMCache.gameManipulation.resetScoreBtn.removeAttribute("disabled");
    DOMCache.gameManipulation.resetScoreBtn.addEventListener(
      "click",
      resetScore,
    );
  }

  gameController.increaseScore(player);
  updateScoreDOM(player, gameController.getPlayerScore(player));
}

function updateScoreDOM(player, newScore) {
  const newScoreWrapper = document.createDocumentFragment();
  for (let i = 0; i < newScore; i += 1) {
    const scorePoint = document.createElement("div");
    scorePoint.classList.add("score-point");
    newScoreWrapper.appendChild(scorePoint);
  }

  DOMCache.score[player].replaceChildren(...newScoreWrapper.children);
}

function enablePlayerActions() {
  const playerSide = DOMCache.gameBoards[2].parentElement;
  const computerSide = DOMCache.gameBoards[1].parentElement;
  computerSide.classList.replace("disabled", "enabled");
  playerSide.classList.replace("enabled", "disabled");
  computerSide.classList.replace("enabled", "disabled");
  playerSide.classList.replace("disabled", "enabled");

  DOMCache.gameBoards[2].addEventListener("click", handleRound);
  DOMCache.gameBoards[2].style.pointerEvents = "auto";
  DOMCache.gameManipulation.resetScoreBtn.addEventListener("click", resetScore);

  DOMCache.gameManipulation.restartGameBtn.addEventListener(
    "click",
    restartGame,
  );
}

function disablePlayerActions() {
  const playerSide = DOMCache.gameBoards[2].parentElement;
  const computerSide = DOMCache.gameBoards[1].parentElement;
  computerSide.classList.replace("disabled", "enabled");
  playerSide.classList.replace("enabled", "disabled");

  DOMCache.gameBoards[2].removeEventListener("click", handleRound);
  DOMCache.gameBoards[2].style.pointerEvents = "none";
  DOMCache.gameManipulation.resetScoreBtn.removeEventListener(
    "click",
    resetScore,
  );

  DOMCache.gameManipulation.restartGameBtn.removeEventListener(
    "click",
    restartGame,
  );
}

function isMobileMode() {
  return (
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

function changeButtonsBehavior() {
  const appButtons = document.querySelectorAll("button");

  Array.from(appButtons).forEach((button) => {
    button.classList.add("mobile");
    button.addEventListener("click", (e) => {
      e.target.classList.add("clicked");
      setTimeout(() => {
        e.target.classList.remove("clicked");
      }, 300);
    });
  });
}
