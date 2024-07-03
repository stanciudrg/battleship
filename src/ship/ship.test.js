import Ship from "./ship";

test("Ship class is correctly initialized if provided a correct length", () => {
  expect(new Ship(2)).not.toBeUndefined();
});

test("Ship class correctly sets the private length property when the correct length argument is provided", () => {
  const ship = new Ship(2);
  expect(ship.length).toBe(2);
});

describe("Ship class 'length' parameter type and range tests", () => {
  test("Ship class throws if no length is provided", () => {
    expect(() => {
      Ship();
    }).toThrow();
    expect(() => {
      Ship(undefined);
    }).toThrow();
    expect(() => {
      Ship(null);
    }).toThrow();
  });

  test("Ship class throws if length is not a number", () => {
    expect(() => {
      Ship({});
    }).toThrow();
    expect(() => {
      Ship("");
    }).toThrow();
    expect(() => {
      Ship([]);
    }).toThrow();
  });

  test("Ship class throws if length is not a positive number between 1 and 4", () => {
    expect(() => {
      Ship(-2);
    }).toThrow();
    expect(() => {
      Ship(0);
    }).toThrow();
    expect(() => {
      Ship(5);
    }).toThrow();
  });
});

test("The hit() method increments Ship's hits counter by exactly one digit", () => {
  const ship = new Ship(2);
  ship.hit();
  expect(ship.hits).toBe(1);
  ship.hit();
  expect(ship.hits).toBe(2);
});

test("The hit() method throws if trying to hit a ship that is sunk", () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();
  expect(() => {
    ship.hit();
  }).toThrow();
});

test("The isSunk() method correctly calculates whether a ship has been sunk", () => {
  const ship = new Ship(2);
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
