//http://htmlpreview.github.io/?https://github.com/robatron/sudoku.js/blob/master/demo/index.html
//sudoku.solve(".17..69..356194.2..89..71.6.65...273872563419.43...685521......798..53..634...59.")

function get_puzzle() {
  // let easy_puzzles = [];
  // let medium_puzzles = [];
  // let hard_puzzles = [];
  // let very_hard_puzzles = [];
  // let insane_puzzles = [];
  let inhuman_puzzles = [];

  for (i = 0; i < 100; i++) {
    // let temp1 = sudoku.generate("easy");
    // let temp2 = sudoku.generate("medium");
    // let temp3 = sudoku.generate("hard");
    // let temp4 = sudoku.generate("very-hard");
    // let temp5 = sudoku.generate("insane");
    let temp6 = sudoku.generate("inhuman");

    // easy_puzzles.push(temp1);
    // medium_puzzles.push(temp2);
    // hard_puzzles.push(temp3);
    // very_hard_puzzles.push(temp4);
    // insane_puzzles.push(temp5);
    inhuman_puzzles.push(temp6);
  }

  // console.log(easy_puzzles);
  // console.log(medium_puzzles);
  // console.log(hard_puzzles);
  // console.log(very_hard_puzzles);
  // console.log(insane_puzzles);
  console.log(inhuman_puzzles);
}

function solve_puzzle() {
  //copy and paste puzzles into unsolved_puzzle array
  let unsolved_puzzle = [
    "1.2..48537..2.8.494....37.6846.92371527..14989318475622157869343..425617674..9285",
  ];

  let solved_puzzles = [];
  for (i = 0; i < unsolved_puzzle.length; i++) {
    let temp_puzzle = sudoku.solve(unsolved_puzzle[i]);
    solved_puzzles.push(temp_puzzle);
  }
  console.log(solved_puzzles);
}
