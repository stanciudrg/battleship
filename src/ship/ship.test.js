import Ship from "./ship";

test("Ship class is correctly initialized if provided a correct length", () => {
  expect(new Ship(2)).not.toBeUndefined();
});
