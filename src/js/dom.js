class DOM {
  #game = document.querySelector(".game");
  #separator = document.querySelector(".separator");
  #nextCoord = this.#generateUniqueCoordinates();

  constructor() {}

  #updateCoordClass(coord, update, obj) {
    const classes = ["empty", "miss", "ship", "hit", "sunk"];

    classes.forEach((x) => coord.classList.remove(x));
    coord.classList.add(update);

    if (update === "sunk") {
      const array = Array.from(coord.parentNode.childNodes);

      for (const node of array) {
        const hitCoord = node.id.slice(0, 2).split("").map(Number);
        const contains = obj.containsHit(hitCoord);
        if (contains) {
          classes.forEach((x) => node.classList.remove(x));
          node.classList.add(update);
        }
      }
    }
  }

  #addplayer(playerObj, secondaryObj) {
    const player = document.createElement("div");
    const h2 = document.createElement("h2");
    const board = document.createElement("div");
    player.classList.add("player");
    h2.textContent = playerObj.role[0].toUpperCase() + playerObj.role.slice(1);
    board.classList.add("board");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const coord = document.createElement("div");
        coord.classList.add("coord");
        coord.id = `${i}${j}${playerObj.role}`;
        this.#updateCoordClass(
          coord,
          playerObj.role === "player"
            ? playerObj.gameboard.getCoordStatus([i, j])
            : "empty",
          {},
        );
        if (playerObj.role === "computer")
          coord.addEventListener("click", () =>
            this.#playerTurn(
              secondaryObj,
              playerObj,
              coord.id.slice(0, 2).split("").map(Number),
              coord,
            ),
          );
        board.append(coord);
      }
    }

    player.append(h2, board);

    return player;
  }

  addPlayers(player1Obj, player2Obj) {
    this.#game.insertBefore(
      this.#addplayer(player1Obj, player2Obj),
      this.#separator,
    );
    this.#game.append(this.#addplayer(player2Obj, player1Obj));
  }

  #playerTurn(player, computer, coord, self) {
    try {
      computer.gameboard.receiveAttack(coord);
      const coordStatus = computer.gameboard.getCoordStatus(coord);
      this.#updateCoordClass(
        self,
        coordStatus,
        computer.gameboard.board[coord[0]][coord[1]],
      );

      if (computer.gameboard.allShipsSunk()) {
        this.#newGame("You Win!");
        return;
      }
      this.#computerTurn(player);
    } catch (ex) {
      alert(ex.message);
    }
  }

  #computerTurn(player) {
    try {
      const coord = this.#nextCoord();
      const self = document.getElementById(coord.join("") + "player");
      player.gameboard.receiveAttack(coord);
      const coordStatus = player.gameboard.getCoordStatus(coord);
      this.#updateCoordClass(
        self,
        coordStatus,
        player.gameboard.board[coord[0]][coord[1]],
      );

      if (player.gameboard.allShipsSunk()) {
        this.#newGame("You Lose!");
        return;
      }
    } catch (ex) {
      alert(ex.message);
    }
  }

  #generateUniqueCoordinates() {
    const coordinates = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        coordinates.push([x, y]);
      }
    }

    for (let i = coordinates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordinates[i], coordinates[j]] = [coordinates[j], coordinates[i]]; // Swap
    }

    let index = 0;
    return function getNextCoordinate() {
      if (index < coordinates.length) {
        return coordinates[index++];
      } else {
        return null;
      }
    };
  }

  #newGame(message) {
    const dialog = document.querySelector("dialog");
    dialog.textContent = message;
    dialog.showModal();
  }
}

export { DOM };
