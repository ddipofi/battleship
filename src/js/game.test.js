import { Ship, Gameboard } from "./game";

describe("Ship", () => {
  test("1 hit adds 1 hit", () => {
    const ship = new Ship(3);
    expect(ship.hit([1, 1])).toBe(1);
  });

  test("2 hits adds 2 hits", () => {
    const ship = new Ship(3);
    ship.hit([1, 1]);
    expect(ship.hit([1, 2])).toBe(2);
  });

  test("Hit is placed at the correct coordinate", () => {
    const ship = new Ship(1);
    ship.hit([1, 1]);
    expect(ship.containsHit([1, 1])).toBe(true);
  });

  test("2 hit ship sinks in 2 hits", () => {
    const ship = new Ship(2);
    ship.hit([1, 1]);
    ship.hit([1, 2]);
    expect(ship.isSunk()).toBe(true);
  });

  test("2 hit ship does not sink in 1 hit", () => {
    const ship = new Ship(2);
    ship.hit([1, 1]);
    expect(ship.isSunk()).toBe(false);
  });
});

describe("Gameboard", () => {
  let board;
  beforeEach(() => (board = new Gameboard()));

  test("Ship can be placed on board", () => {
    const coords = [
      [1, 2],
      [1, 3],
      [1, 4],
    ];
    const ship = new Ship(3);
    board.placeShip(ship, coords);
    expect(board.getBoardCoord(coords[0])).toBe(ship);
    expect(board.getBoardCoord(coords[1])).toBe(ship);
    expect(board.getBoardCoord(coords[2])).toBe(ship);
  });

  test("Ship must be placed in valid connecting coordinates", () => {
    const coords = [
      [1, 6],
      [1, 3],
      [8, 4],
    ];
    const ship = new Ship(3);
    board.placeShip(ship, coords);
    expect(board.getBoardCoord(coords[0])).toBe(undefined);
    expect(board.getBoardCoord(coords[1])).toBe(undefined);
    expect(board.getBoardCoord(coords[2])).toBe(undefined);
  });

  test("2 hit ship should not have more than 2 coordinates", () => {
    const coords = [
      [1, 2],
      [1, 3],
      [1, 4],
    ];
    const ship = new Ship(2);
    board.placeShip(ship, coords);
    expect(board.getBoardCoord(coords[0])).toBe(undefined);
    expect(board.getBoardCoord(coords[1])).toBe(undefined);
    expect(board.getBoardCoord(coords[2])).toBe(undefined);
  });

  test("3 hit ship should not have less than 3 coordinates", () => {
    const coords = [
      [1, 2],
      [1, 3],
    ];
    const ship = new Ship(3);
    board.placeShip(ship, coords);
    expect(board.getBoardCoord(coords[0])).toBe(undefined);
    expect(board.getBoardCoord(coords[1])).toBe(undefined);
  });

  test("Ship cannot be placed outside of board", () => {
    const coords = [
      [2, 10],
      [3, 10],
    ];
    const ship = new Ship(2);
    board.placeShip(ship, coords);
    expect(() => board.getBoardCoord(coords[0])).toThrow();
    expect(() => board.getBoardCoord(coords[1])).toThrow();
  });

  test("Board was updated with miss", () => {
    board.receiveAttack([1, 1]);
    expect(board.getBoardCoord([1, 1])).toBe("miss");
  });

  test("Ship was updated with hit", () => {
    const coords = [
      [2, 3],
      [3, 3],
    ];
    const ship = new Ship(2);
    board.placeShip(ship, coords);
    board.receiveAttack([2, 3]);
    expect(board.getBoardCoord(coords[0])).not.toBe("miss");
    expect(ship.containsHit(coords[0])).toBe(true);
  });

  test("Attack cannot be placed on coordinate already missed", () => {
    board.receiveAttack([2, 3]);
    expect(() => board.receiveAttack([2, 3])).toThrow();
  });

  test("Attack cannot be placed on coordinate already hit", () => {
    const coords = [
      [2, 3],
      [3, 3],
    ];
    const ship = new Ship(2);
    board.placeShip(ship, coords);
    board.receiveAttack([2, 3]);
    expect(() => board.receiveAttack([2, 3])).toThrow();
  });
});
