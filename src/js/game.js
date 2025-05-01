class Ship {
  #hits = new Set();
  #length;

  constructor(length) {
    this.#length = length;
  }

  get length() {
    return this.#length;
  }

  containsHit(coord) {
    return this.#hits.has(coord.toString());
  }

  hit(coord) {
    this.#hits.add(coord.toString());
    return this.#hits.size;
  }

  isSunk() {
    return this.#hits.size >= this.#length;
  }
}

class Gameboard {
  #board;
  #ships = [];

  constructor() {
    this.#constructBoard();
  }

  get board() {
    return this.#board;
  }

  #constructBoard() {
    this.#board = [];

    for (let i = 0; i < 10; i++) {
      this.#board[i] = [];
    }
  }

  #inRange(coord) {
    return !(coord[0] < 0 || coord[1] < 0 || coord[0] >= 10 || coord[1] >= 10);
  }

  #validateCoords(coords) {
    let xSame = true;
    let ySame = true;
    let xPlus = true;
    let yPlus = true;
    let xMinus = true;
    let yMinus = true;
    let inRange = true;

    for (let i = 0; i < coords.length; i++) {
      if (i > 0) {
        if (coords[i][0] !== coords[i - 1][0]) xSame = false;
        if (coords[i][1] !== coords[i - 1][1]) ySame = false;
        if (coords[i][0] <= coords[i - 1][0]) xPlus = false;
        if (coords[i][1] <= coords[i - 1][1]) yPlus = false;
        if (coords[i][0] >= coords[i - 1][0]) xMinus = false;
        if (coords[i][1] >= coords[i - 1][1]) yMinus = false;
      }
      inRange = this.#inRange(coords[i]);
    }

    return (
      xSame !== ySame && (xPlus !== yPlus) !== (xMinus !== yMinus) && inRange
    );
  }

  placeShip(ship, coords) {
    if (this.#validateCoords(coords) && ship.length === coords.length) {
      for (const coord of coords) {
        if (this.#board[coord[0]][coord[1]] !== undefined)
          throw new Error("Coordinates are invalid!");
      }

      for (const coord of coords) {
        this.#board[coord[0]][coord[1]] = ship;
      }

      this.#ships.push(ship);
    } else {
      throw new Error("Coordinates are invalid!");
    }
  }

  getCoordStatus(coord) {
    const item = this.#board[coord[0]][coord[1]];
    if (item === undefined) return "empty";
    if (item === "miss") return item;
    if (item.isSunk()) return "sunk";
    if (item.containsHit(coord)) return "hit";
    return "ship";
  }

  getBoardCoord(coord) {
    if (this.#inRange(coord)) return this.#board[coord[0]][coord[1]];

    throw new Error(`Coordinate [${coord[0]}, ${coord[1]}] is out of range!`);
  }

  receiveAttack(coord) {
    const boardCoord = this.#board[coord[0]][coord[1]];
    if (boardCoord === undefined)
      return (this.#board[coord[0]][coord[1]] = "miss");
    if (boardCoord === "miss" || boardCoord.containsHit(coord))
      throw Error("Already attacked this coordinate!");
    boardCoord.hit(coord);
  }

  allShipsSunk() {
    for (const ship of this.#ships) {
      if (!ship.isSunk()) return false;
    }

    return true;
  }
}

class Player {
  #role;
  #gameboard;

  constructor(role, gameboard) {
    this.#role = role;
    this.#gameboard = gameboard;
  }

  get gameboard() {
    return this.#gameboard;
  }

  get role() {
    return this.#role;
  }
}

export { Ship, Gameboard, Player };
