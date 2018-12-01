const readline = require("readline");

function TicTacToe(readline) {
  let rl = null,
    size = 3,
    boardRecord = {},
    playersRecord = [],
    playerMarks = ["x", "o"],
    players = ["You", "PC"],
    currentMark = "";

  const _init = readline => {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  };

  _init(readline);

  /* helper functions */

  const getRandomNumber = n => {
    return Math.floor(Math.random() * boardRecord.empty.length - 0);
  };

  const stringToInt = stringInput => {
    let inputElements = stringInput.split(" ");
    return inputElements.map((el, i, arr) => (arr[i] = parseInt(el)));
  };

  const buildRecord = () => {
    let data = {
      board: [],
      empty: []
    };
    for (let i = 0; i < size; i += 1) {
      let row = [];
      for (let k = 0; k < size; k += 1) {
        row.push(null);
        data.empty.push(i + " " + k);
      }
      data.board.push(row);
    }
    boardRecord = data;
  };

  /* game functions */

  const choosePlayer = () => {
    return new Promise((resolve, reject) => {
      rl.question("Choose your player \n", input => {
        if ((input === "x") | (input === "o")) {
          resolve(input);
        } else {
          reject();
        }
      });
    });
  };

  const savePlayers = input => {
    playersRecord = [
      {
        player: "You",
        mark: input
      },
      {
        player: "PC",
        mark: playerMarks.indexOf(input) ? playerMarks[0] : playerMarks[1]
      }
    ];
    currentMark = input;
    console.log(`Your mark is : ${input}`);
  };

  const rotatePlayer = mark => {
    currentMark = playerMarks.indexOf(mark) ? playerMarks[0] : playerMarks[1];
  };

  const drawInterface = () => {
    const space = "     ";
    const greeting = `${space}TicTacToe.ʕ•ᴥ•ʔ`;

    console.log(`\n\ ${greeting}  \n\ `);

    const lineSeparator = `${space} +-----------+`;
    for (let i = 0; i < 3; i += 1) {
      console.log(lineSeparator);
      let row = `${space} |`;
      for (let k = 0; k < 3; k += 1) {
        boardRecord.board[i][k]
          ? (row += " " + boardRecord.board[i][k] + " |")
          : (row += "   |");
      }
      console.log(row);
    }
    console.log(`${lineSeparator} \n\  \n\ `);
  };

  const addMarkToRecord = (currentMark, position) => {
    let indexToRemove;
    boardRecord.board[position[0]][position[1]] = currentMark;
    indexToRemove = boardRecord.empty.indexOf(`${position[0]} ${position[1]}`);
    boardRecord.empty.splice(indexToRemove, 1);
  };

  const addMarkToBoard = position => {
    addMarkToRecord(currentMark, position);
    drawInterface();
    checkTheStatus(currentMark);
  };

  const playMove = () => {
    currentMark === playersRecord[0].mark
      ? getClientInput().then(addMarkToBoard, playMove)
      : pcMove().then(addMarkToBoard);
  };

  const getClientInput = () => {
    return new Promise((resolve, reject) => {
      rl.question(
        "Where do you want to move? i.e. 1 0 (row column) ",
        input => {
          if (boardRecord.empty.indexOf(input.trim()) != -1) {
            resolve(stringToInt(input.trim()));
          } else {
            console.log(
              "\nInvalid position. Please choose different position \n"
            );
            reject();
          }
        }
      );
    });
  };

  const pcMove = () => {
    console.log("PC is playing . . .");
    let index = getRandomNumber();
    let emptyPosition = stringToInt(boardRecord.empty[index]);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(emptyPosition);
      }, 1000);
    });
  };

  const playGame = () => {
    choosePlayer().then(input => {
      savePlayers(input);
      drawInterface();
      playMove();
    }, playGame);
  };

  /* verify winner */

  const isThereWinner = player => {
    let playerString = player + player + player;
    let winner = null;
    let row;
    let board = boardRecord.board;
    let column = ["", "", ""];
    let diag = ["", ""];
    for (let i = 0; i < 3; i += 1) {
      row = board[i].join("");
      if (row == playerString) {
        winner = player;
        break;
      }
      for (let k = 0; k < 3; k += 1) {
        column[k] += board[i][k];
      }
      if (i == 0) {
        diag[0] += board[i][0];
        diag[1] += board[i][2];
      } else if (i == 1) {
        diag[0] += board[i][1];
        diag[1] += board[i][1];
      } else if (i == 2) {
        diag[0] += board[i][2];
        diag[1] += board[i][0];
      }
    }
    if (column.indexOf(playerString) > -1) {
      winner = player;
    } else if (diag.indexOf(playerString) > -1) {
      winner = player;
    }

    if (winner) {
      return true;
    } else {
      rotatePlayer(currentMark);
      playMove();
      return false;
    }
  };

  const checkTheStatus = currentMark => {
    if (boardRecord.empty.length === 0) {
      console.log("Replay the game");
      rl.close();
      return;
    } else if (isThereWinner(currentMark)) {
      console.log(currentMark + " wins!");
      rl.close();
      return;
    }
  };

  return {
    start: function() {
      buildRecord();
      playGame();
    }
  };
}

let ticTacToe = new TicTacToe(readline);
ticTacToe.start();
