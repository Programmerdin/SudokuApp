// index_y === 2 || index_y === 5 ? styles.row_thick : styles.row

export function returnsCoordinatesOfGivenCells(initial_board) {
  let coordinate_list_of_given_cells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (initial_board[i][j] !== "") {
        coordinate_list_of_given_cells.push([i, j]);
      }
    }
  }
  return coordinate_list_of_given_cells;
}

export function isGivenCell(coordinate_list_of_given_cells, y_coordinate, x_coordinate) {
  for (let i = 0; i < coordinate_list_of_given_cells.length; i++) {
    if (
      coordinate_list_of_given_cells[i][0] === y_coordinate &&
      coordinate_list_of_given_cells[i][1] === x_coordinate
    ) {
      return true
    }
  }
  return false
}
