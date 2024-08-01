const dependencies = {};
const current = {
  shipsOnCoordinate: [],
};

export function setDependencies(moduleDependencies) {
  Object.assign(dependencies, moduleDependencies);
}

export function open() {
  const DOMShips = createDOMShips([
    { id: "destroyer", length: 2 },
    { id: "submarine", length: 3 },
    { id: "cruiser", length: 3 },
    { id: "battleship", length: 4 },
    { id: "carrier", length: 5 },
  ]);

  dependencies.DOMCache.ships.replaceChildren(...DOMShips.children);

  dependencies.DOMCache.rotateAxisBtn.addEventListener("click", rotateAxis);

  dependencies.DOMCache.ships.addEventListener("pointerdown", pickDOMShip);

  dependencies.updateBoardDOM(
    dependencies.DOMCache.gameBoard,
    dependencies.createBoardDOM(1, dependencies.gameController.getGameBoard(1)),
  );

  window.addEventListener("resize", resetPlacement);

  dependencies.DOMCache.modal.style.display = "initial";
}

function close() {
  dependencies.DOMCache.ships.replaceChildren(
    document.createDocumentFragment(),
  );

  dependencies.DOMCache.resetPlacementBtn.removeEventListener(
    "click",
    resetPlacement,
  );

  dependencies.DOMCache.rotateAxisBtn.removeEventListener("click", rotateAxis);

  dependencies.DOMCache.ships.removeEventListener("pointerdown", pickDOMShip);

  disableStartGameBtn();
  disableResetPlacementBtn();

  if (dependencies.DOMCache.ships.dataset.axis === "y") {
    dependencies.DOMCache.rotateAxisBtn.firstElementChild.textContent = "x";
    dependencies.DOMCache.ships.dataset.axis = "x";
    dependencies.DOMCache.ships.classList.replace("rotate-y", "rotate-x");
  }

  dependencies.updateBoardDOM(
    dependencies.DOMCache.gameBoard,
    document.createDocumentFragment(),
  );

  window.removeEventListener("resize", resetPlacement);

  dependencies.DOMCache.modal.style.display = "none";
  dependencies.updateBoardsDOM();
}

function resetPlacement() {
  dependencies.gameController.resetBoard(1);
  dependencies.gameController.deleteShips(1);

  dependencies.updateBoardDOM(
    dependencies.DOMCache.gameBoard,
    dependencies.createBoardDOM(1, dependencies.gameController.getGameBoard(1)),
  );

  Array.from(dependencies.DOMCache.ships.children).forEach((ship) => {
    resetDOMShipPosition(ship.firstElementChild);
  });

  disableResetPlacementBtn();
  disableStartGameBtn();
}

function rotateAxis() {
  const shipsWrapper = dependencies.DOMCache.ships;
  const oldAxis = shipsWrapper.dataset.axis;

  if (shipsWrapper.dataset.axis === "x") {
    shipsWrapper.dataset.axis = "y";
    this.firstElementChild.textContent = "y";
  } else if (shipsWrapper.dataset.axis === "y") {
    shipsWrapper.dataset.axis = "x";
    this.firstElementChild.textContent = "x";
  }

  shipsWrapper.classList.replace(
    `rotate-${oldAxis}`,
    `rotate-${shipsWrapper.dataset.axis}`,
  );

  Array.from(shipsWrapper.children).forEach((shipWrapper) => {
    const ship = shipWrapper.firstElementChild;

    if (!ship.classList.contains("on-coordinate")) {
      changeDOMShipAxis(ship, shipsWrapper.dataset.axis);
    }

    shipWrapper.classList.replace(
      `rotate-${oldAxis}`,
      `rotate-${shipsWrapper.dataset.axis}`,
    );
  });
}

function createDOMShips(ships) {
  const DOMShips = document.createDocumentFragment();

  ships.forEach((ship) => {
    const DOMShipWrapper = document.createElement("div");
    DOMShipWrapper.classList.add("placement-ship_wrapper");
    DOMShipWrapper.classList.add(`holds-${ship.id}`);
    DOMShipWrapper.classList.add("rotate-x");

    const DOMShip = document.createElement("div");
    DOMShip.id = ship.id;
    DOMShip.classList.add("placement-ship");
    DOMShip.classList.add("rotate-x");
    DOMShip.dataset.length = ship.length;
    DOMShip.dataset.axis = "x";
    DOMShip.textContent = ship.id;

    DOMShipWrapper.appendChild(DOMShip);
    DOMShips.appendChild(DOMShipWrapper);
  });

  return DOMShips;
}

function pickDOMShip(e) {
  const ship = e.target.closest(".placement-ship");
  if (!ship) return;

  current.ship = ship;
  current.ship.setPointerCapture(e.pointerId);
  current.ship.addEventListener("pointermove", dragDOMShip);
  current.ship.addEventListener("pointerup", dropDOMShip);

  current.shipInfo = current.ship.getBoundingClientRect();

  if (dependencies.gameController.hasShip(1, current.ship.id)) {
    dependencies.gameController.removeShip(1, current.ship.id);

    dependencies.updateBoardDOM(
      dependencies.DOMCache.gameBoard,
      dependencies.createBoardDOM(
        1,
        dependencies.gameController.getGameBoard(1),
      ),
    );
  }

  disableStartGameBtn();
}

function dragDOMShip(e) {
  current.ship.setPointerCapture(e.pointerId);
  current.ship.classList.add("being-dragged");
  current.ship.style.position = "absolute";
  current.ship.style.left = `${e.clientX - current.shipInfo.width / 2}px`;
  current.ship.style.top = `${e.clientY - current.shipInfo.height / 3}px`;
  current.ship.style.zIndex = "101";

  dependencies.updateBoardDOM(
    dependencies.DOMCache.gameBoard,
    dependencies.createBoardDOM(1, dependencies.gameController.getGameBoard(1)),
  );

  current.placement = checkPlacement({
    x:
      current.ship.dataset.axis === "x"
        ? e.clientX - current.shipInfo.width / 2.5
        : e.clientX,
    y:
      current.ship.dataset.axis === "y"
        ? e.clientY - current.shipInfo.height / 4
        : e.clientY,
    axis: current.ship.dataset.axis,
    length: current.ship.dataset.length,
    id: current.ship.id,
  });

  if (current.placement.isValid) {
    const hoverableSquares = getHoverableSquares({
      x: current.placement.internalCoordinates.x,
      y: current.placement.internalCoordinates.y,
      length: current.placement.internalCoordinates.length,
      axis: current.placement.internalCoordinates.axis,
    });

    hoverableSquares.forEach((square) => {
      square.classList.add("hover");
    });
  }
}

function dropDOMShip(e) {
  current.ship.releasePointerCapture(e.pointerId);
  current.ship.removeEventListener("pointermove", dragDOMShip);
  current.ship.removeEventListener("pointerup", dropDOMShip);
  current.ship.classList.remove("being-dragged");

  if (!current.placement || !current.placement.isValid) {
    resetDOMShipPosition(current.ship);
    if (current.shipsOnCoordinate.length === 0) disableResetPlacementBtn();
    return;
  }

  const snapToGridCoords = getSquareUnderCoords({
    x:
      current.ship.dataset.axis === "x"
        ? e.clientX - current.shipInfo.width / 2.5
        : e.clientX,
    y:
      current.ship.dataset.axis === "y"
        ? e.clientY - current.shipInfo.height / 4
        : e.clientY,
  }).getBoundingClientRect();

  current.shipsOnCoordinate.push(current.ship);

  current.ship.style.left = `${snapToGridCoords.x}px`;
  current.ship.style.top = `${snapToGridCoords.y}px`;
  current.ship.classList.add("on-coordinate");
  current.ship.style.zIndex = "100";

  dependencies.gameController.placeShip(
    1,
    current.placement.internalCoordinates,
  );

  dependencies.updateBoardDOM(
    dependencies.DOMCache.gameBoard,
    dependencies.createBoardDOM(1, dependencies.gameController.getGameBoard(1)),
  );

  delete current.placement;
  if (dependencies.gameController.hasEnoughShips(1)) enableStartGameBtn();
  enableResetPlacementBtn();
}

function enableResetPlacementBtn() {
  dependencies.DOMCache.resetPlacementBtn.addEventListener(
    "click",
    resetPlacement,
  );

  dependencies.DOMCache.resetPlacementBtn.removeAttribute("disabled");
}

function disableResetPlacementBtn() {
  dependencies.DOMCache.resetPlacementBtn.removeEventListener(
    "click",
    resetPlacement,
  );

  dependencies.DOMCache.resetPlacementBtn.disabled = true;
}

function resetDOMShipPosition(ship) {
  const shipIndex = current.shipsOnCoordinate.findIndex(
    (_) => _.id === ship.id,
  );

  if (shipIndex >= 0) {
    current.shipsOnCoordinate.splice(shipIndex, 1);
  }

  ship.style.removeProperty("position");
  ship.style.removeProperty("left");
  ship.style.removeProperty("top");

  if (ship.classList.contains("on-coordinate")) {
    ship.classList.remove("on-coordinate");
  }

  if (ship.dataset.axis !== dependencies.DOMCache.ships.dataset.axis) {
    changeDOMShipAxis(ship, dependencies.DOMCache.ships.dataset.axis);
  }
}

function changeDOMShipAxis(ship, newAxis) {
  const oldShipAxis = ship.dataset.axis;
  ship.dataset.axis = newAxis;

  ship.classList.replace(
    `rotate-${oldShipAxis}`,
    `rotate-${ship.dataset.axis}`,
  );
}

function checkPlacement(DOMCoordinates) {
  const location = getSquareUnderCoords({
    x: DOMCoordinates.x,
    y: DOMCoordinates.y,
  });

  if (!location) {
    return {
      isValid: false,
    };
  }

  const internalCoordinates = {
    x: Number(location.parentElement.dataset.index),
    y: Number(location.dataset.index),
    axis: DOMCoordinates.axis,
    length: Number(DOMCoordinates.length),
    id: DOMCoordinates.id,
  };

  const isValidPlacement = dependencies.gameController.isValidPlacement(
    1,
    internalCoordinates,
  );

  if (isValidPlacement) {
    return {
      isValid: true,
      internalCoordinates,
    };
  }

  return {
    isValid: false,
  };
}

function getHoverableSquares(coordinates) {
  const { x, y, length, axis } = coordinates;

  const { gameBoard } = dependencies.DOMCache;
  const hoverableSquares = [];

  if (axis === "x") {
    const xAxis = gameBoard.querySelector(`.x-axis[data-index="${x}"]`);

    for (let i = 0; i < length; i += 1) {
      const DOMSquare = xAxis.querySelector(`[data-index="${y + i}"]`);
      if (DOMSquare) hoverableSquares.push(DOMSquare);
    }
  }

  if (axis === "y") {
    for (let i = 0; i < length; i += 1) {
      const xAxis = gameBoard.querySelector(`.x-axis[data-index="${x + i}"]`);
      const DOMSquare = xAxis.querySelector(`[data-index="${y}"]`);
      if (DOMSquare) hoverableSquares.push(DOMSquare);
    }
  }

  return hoverableSquares;
}

function getSquareUnderCoords(coordinates) {
  return document
    .elementsFromPoint(coordinates.x, coordinates.y)
    .find((element) => element.classList.contains("square"));
}

function disableStartGameBtn() {
  dependencies.DOMCache.startGameBtn.removeEventListener("click", close);

  dependencies.DOMCache.startGameBtn.setAttribute("disabled", "true");
}

function enableStartGameBtn() {
  dependencies.DOMCache.startGameBtn.addEventListener("click", close);
  dependencies.DOMCache.startGameBtn.removeAttribute("disabled");
}
