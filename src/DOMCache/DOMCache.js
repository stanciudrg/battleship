const DOMCache = {
  gameManipulation: {
    restartGameBtn: document.querySelector(".restart-game_btn"),
    resetScoreBtn: document.querySelector(".reset-score_btn"),
  },
  winner: {
    modal: document.querySelector(".winner-modal"),
    message: document.querySelector(".winner-message"),
    playAgainBtn: document.querySelector(".play-again-btn"),
  },
  shipPlacement: {
    modal: document.querySelector(".ship-placement_modal"),
    resetPlacementBtn: document.querySelector(".reset-placements_btn"),
    rotateAxisBtn: document.querySelector(".rotate-axis_btn"),
    ships: document.querySelector(".ship-placement_ships"),
    gameBoard: document.querySelector(".ship-placement_gameboard"),
  },
  turnInfo: document.querySelector(".turn-info"),
  score: {
    player: document.querySelector(".player-score"),
    computer: document.querySelector(".computer-score"),
  },
  gameBoards: {
    player: document.querySelector(".player-gameboard"),
    computer: document.querySelector(".computer-gameboard"),
  },
};

export default DOMCache;
