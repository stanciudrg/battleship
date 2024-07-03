import Ship from "./ship";

test("Ship class is correctly initialized if provided a correct length", () => {
  expect(new Ship(2)).not.toBeUndefined();
});

test("Ship class correctly sets the private length property when the correct length argument is provided", () => {
  const ship = new Ship(2);
  expect(ship.length).toBe(2);
});

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
