const EMPTY = "";
const possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function solveSudoku(board) {
  let emptySpaces = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === EMPTY) {
        emptySpaces.push({ row: i, col: j });
      }
    }
  }

  function recurse(emptySpaceIndex) {
    //base case - end
    if (emptySpaceIndex >= emptySpaces.length) {
      return true;
    }

    const { row, col } = emptySpaces[emptySpaceIndex];

    for (let i = 0; i < possibleNumbers.length; i++) {
      let num = possibleNumbers[i];
      //check if valid
      if (isValid(num, row, col, board)) {
        board[row][col] = num;
        //recurse
        if (recurse(emptySpaceIndex + 1)) {
          return true;
        }
        //backtrack
        board[row][col] = EMPTY;
      }
    }
    return false;
  }
  recurse(0);
  return board;
}

function isValid(number, row, col, board) {
  //check row, col, 3x3 matrix
  for (let i = 0; i < board.length; i++) {
    if (board[row][i] === number || board[i][col] === number) {
      return false;
    }

    //check 3x3 matrix
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === number) {
          return false;
        }
      }
    }
  }
  return true;
}

const test_puzzle = [
  ["1", ".", "2", ".", ".", "4", "8", "5", "3"],
  ["7", ".", ".", "2", ".", "8", ".", "4", "9"],
  ["4", ".", ".", ".", ".", "3", "7", ".", "6"],
  ["8", "4", "6", ".", "9", "2", "3", "7", "1"],
  ["5", "2", "7", ".", ".", "1", "4", "9", "8"],
  ["9", "3", "1", "8", "4", "7", "5", "6", "2"],
  ["2", "1", "5", "7", "8", "6", "9", "3", "4"],
  ["3", ".", ".", "4", "2", "5", "6", "1", "7"],
  ["6", "7", "4", ".", ".", "9", "2", "8", "5"],
];

//check if the puzzle is complete, returns true if board is filled out, false if board has any empty cell
export function checkEmptyCells(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] == "") {
        return false;
      }
    }
  }
  return true;
}

// compare 2 boards (board solved by player and solution board) and return false if they're not identical, return true if they are
export function isBoardSolved(player_solved_board, solution_board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (player_solved_board[i][j] !== solution_board[i][j]) {
        return false;
      }
    }
  }
  return true;
}
