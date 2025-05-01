import "../css/styles.css";
import { Ship, Gameboard, Player } from "./game";
import { DOM } from "./dom";

const dom = new DOM();
const button = document.querySelector("button");
button.addEventListener("click", () => {
  window.location.reload();
});
button.textContent = "Randomize";
const header = document.querySelector("h1");
header.textContent = "BATTLESHIP";

const players = [
  new Player("player", new Gameboard()),
  new Player("computer", new Gameboard()),
];
const coordsArray1 = generateShipPlacements();
const coordsArray2 = generateShipPlacements();

for (const coords of coordsArray1) {
  players[0].gameboard.placeShip(new Ship(coords.length), coords);
}
for (const coords of coordsArray2) {
  players[1].gameboard.placeShip(new Ship(coords.length), coords);
}

dom.addPlayers(players[0], players[1]);

function generateShipPlacements() {
  const boardSize = 10;
  const ships = [5, 4, 3, 3, 2];
  const occupied = new Set();
  const shipCoords = [];

  // Check if the coordinate is within bounds
  function isValid(x, y) {
    return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
  }

  // Convert coordinates to a unique key for the occupied set
  function coordsToKey(x, y) {
    return `${x},${y}`;
  }

  // Mark the surrounding cells as occupied (adjacent cells)
  function markSurroundingAsOccupied(coords) {
    const surrounding = [
      [-1, -1],
      [0, -1],
      [1, -1], // above row
      [-1, 0],
      [1, 0], // left and right
      [-1, 1],
      [0, 1],
      [1, 1], // below row
    ];

    coords.forEach(([x, y]) => {
      surrounding.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (isValid(nx, ny)) {
          occupied.add(coordsToKey(nx, ny)); // Mark the surrounding as occupied
        }
      });
    });
  }

  // Generate the coordinates for a ship of given length and direction
  function generateCoordinates(x, y, length, direction) {
    const coords = [];

    for (let i = 0; i < length; i++) {
      const nx = direction === "horizontal" ? x + i : x;
      const ny = direction === "vertical" ? y + i : y;
      if (!isValid(nx, ny) || occupied.has(coordsToKey(nx, ny))) {
        return null; // Invalid position, either out of bounds or occupied
      }
      coords.push([nx, ny]);
    }

    return coords;
  }

  for (const length of ships) {
    let placed = false;

    while (!placed) {
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);

      const coords = generateCoordinates(x, y, length, direction);
      if (coords) {
        // Mark the ship's coordinates and surrounding cells as occupied
        coords.forEach(([cx, cy]) => occupied.add(coordsToKey(cx, cy)));
        markSurroundingAsOccupied(coords); // Add the surrounding cells to the occupied set
        shipCoords.push(coords);
        placed = true;
      }
    }
  }

  return shipCoords;
}
