import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import puzzles_easy from "../puzzles/Puzzles_Easy";
import puzzles_medium from "../puzzles/Puzzles_Medium";
import puzzles_hard from "../puzzles/Puzzles_Hard";
import puzzles_very_hard from "../puzzles/Puzzles_Very_Hard";
import puzzles_insane from "../puzzles/Puzzles_Insane";
import puzzles_inhuman from "../puzzles/Puzzles_Inhuman";
import { solveSudoku, checkEmptyCells, isBoardSolved } from "../puzzles/Sudoku_Solver";
import { returnsCoordinatesOfGivenCells, isGivenCell } from "./Conditional_Styles";

const windowWidth = Dimensions.get("window").width;

//3 notation systems for sudoku
//the standard grid notation
//pencil marks for noting that a number could only be in 2 positions of a box (box is 3x3), pencil marks go to top left of the cell
//center notes, where the numbers get written on the center of the box in a horizontal line
//pencil marks and center notes go together
//develop with standard grid notation first but allow for the optionality to change notation system later on patches

export default function GamePage({ route, navigation }) {
  //state for each cell
  const [currently_selected_cell_coordinate, Set_Currently_selected_cell_coordinate] = useState();
  const [is_cell_selected, Set_is_cell_selected] = useState(false);

  const [is_note_mode, Set_is_note_mode] = useState(false);
  const [hint_usage_count, Set_hint_usage_count] = useState(0)

  //check if the puzzle is solved
  const [is_puzzle_solved, Set_is_puzzle_solved] = useState(false);

  //where coordinate of given cells will be saved
  const [coordinate_list_of_given_cells, Set_coordinate_list_of_given_cells] = useState([]);

  //which puzzle to use out of 1000
  let puzzle_index = 0;

  //count correct number of cells when submit button is pressed
  let correct_number_of_cells = 0;

  //where initial set up of the board is saved
  const [game_retrieved_array, Set_game_retrieved_array] = useState([
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
  ]);

  //where solution for the board is saved
  const [solved_grid, Set_solved_grid] = useState([
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
  ]);

  //where game play board is saved
  const [sudoku_grid, Set_sudoku_grid] = useState([
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
  ]);

  //retreieve parameters from MainPage
  const { game_difficulty } = route.params;

  function initialization(puzzle_index) {
    //retrieve unsolved game
    let game_retrieved = "";

    //retrieve a puzzle based on the difficulty and covert it into array format
    if (game_difficulty == "Easy") {
      game_retrieved = puzzles_easy[puzzle_index];
    }
    if (game_difficulty == "Medium") {
      game_retrieved = puzzles_medium[puzzle_index];
    }
    if (game_difficulty == "Hard") {
      game_retrieved = puzzles_hard[puzzle_index];
    }
    if (game_difficulty == "Very Hard") {
      game_retrieved = puzzles_very_hard[puzzle_index];
    }
    if (game_difficulty == "Insane") {
      game_retrieved = puzzles_insane[puzzle_index];
    }
    if (game_difficulty == "Inhuman") {
      game_retrieved = puzzles_inhuman[puzzle_index];
    }

    let temp_sudoku_array = [
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ];

    //convert game_retrieved from single line to arrays
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (game_retrieved.charAt(i * 9 + j) !== ".") {
          temp_sudoku_array[i][j] = game_retrieved.charAt(i * 9 + j);
        }
      }
    }

    //save initial board
    Set_game_retrieved_array(temp_sudoku_array);
    Set_sudoku_grid(temp_sudoku_array);

    let temp = returnsCoordinatesOfGivenCells(temp_sudoku_array);
    Set_coordinate_list_of_given_cells(temp.map((inner) => inner.slice()));

    //coping 2d array instead of referencing, this method only works for 2d array
    let solved_board = temp_sudoku_array.map((inner) => inner.slice());
    //solve sudoku
    solveSudoku(solved_board);
    //save solved sudoku board to the state
    Set_solved_grid(solved_board);
  }

  useEffect(() => {
    initialization(puzzle_index);
  }, []);

  function doesCellCoordinateMatch(given_cell_coordinate, y_coordinate, x_coordinate) {
    if (given_cell_coordinate[0] === y_coordinate && given_cell_coordinate[1] === x_coordinate) {
      return true;
    } else {
      return false;
    }
  }

  function font_color_styler(coordinate_list_of_given_cells, y_coordinate, x_coordinate) {
    for (let i = 0; i < coordinate_list_of_given_cells.length; i++) {
      if (doesCellCoordinateMatch(coordinate_list_of_given_cells[i], y_coordinate, x_coordinate)) {
        return styles.cell_text;
      }
    }
    return styles.cell_text2;
  }

  return (
    <View style={styles.container}>
      <Text>GamePage.js</Text>
      <Text>difficulty: {game_difficulty}</Text>
      <TouchableOpacity
        style={styles.submit_button}
        onPress={() => {
          console.log(coordinate_list_of_given_cells);
        }}
      >
        <Text>Test Button</Text>
      </TouchableOpacity>

      <View style={styles.sudoku_game_container}>
        {/* how to make a 9x9 game area and different border styles for the lines */}
        {[...Array(9).keys()].map((index_y) => {
          return (
            <View style={index_y === 2 || index_y === 5 ? styles.row_thick : styles.row}>
              {[...Array(9).keys()].map((index_x) => {
                return (
                  <TouchableOpacity
                    style={index_x === 2 || index_x === 5 ? styles.cell_thick : styles.cell}
                    onPress={() => {
                      Set_Currently_selected_cell_coordinate([index_y, index_x]);
                      Set_is_cell_selected(true);
                    }}
                  >
                    {/* black font for initial cells, blue font for cells that user adds on */}
                    <Text style={font_color_styler(coordinate_list_of_given_cells, index_y, index_x)}>{sudoku_grid[index_y][index_x]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>

      <View style={styles.tool_select_area}>
        <TouchableOpacity
          style={styles.tool_icon}
          onPress={() => {
            //check if a cell has been selected and the selected cell is not a givenCell
            if (is_cell_selected && !isGivenCell(coordinate_list_of_given_cells, currently_selected_cell_coordinate[0], currently_selected_cell_coordinate[1])) {
              //find the correct number for the given cell position
              let correct_number = solved_grid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]]
              //add cell to the sudoku_grid
              let temp_grid = sudoku_grid.slice(); //copying array can be iffy
              temp_grid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = correct_number
              Set_sudoku_grid(temp_grid);
              //add coordinates to given cell list
              Set_coordinate_list_of_given_cells([...coordinate_list_of_given_cells, [currently_selected_cell_coordinate[0],currently_selected_cell_coordinate[1]]])
              Set_hint_usage_count(hint_usage_count+1)
            }
          }}
        >
          <Text>{'Hint '+hint_usage_count}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tool_icon}
          onPress={() => {
            if (is_cell_selected && !isGivenCell(coordinate_list_of_given_cells, currently_selected_cell_coordinate[0], currently_selected_cell_coordinate[1])) {
              //change the current selected cell to ""
              let temp_grid = sudoku_grid.slice(); //copying array can be iffy
              temp_grid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = "";
              Set_sudoku_grid(temp_grid);
            }
          }}
        >
          <Text>Erase</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tool_icon}
          onPress={() => {
            Set_is_note_mode(!is_note_mode);
          }}
        >
          <Text>{"Notes " + is_note_mode}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.number_select_area}>
        {[...Array(9).keys()].map((index) => {
          return (
            <TouchableOpacity
              style={styles.number_select_box}
              onPress={() => {
                //set the sodoku grid cell index to (index+1)
                //only change the cell value if the cell selected is not a given cell
                if (is_cell_selected && !isGivenCell(coordinate_list_of_given_cells, currently_selected_cell_coordinate[0], currently_selected_cell_coordinate[1])) {
                  let newGrid = sudoku_grid.slice(); //copying array can be iffy
                  newGrid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = (index + 1).toString();
                  Set_sudoku_grid(newGrid);
                }
              }}
            >
              <Text style={styles.number_select_text}>{index + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.submit_button}
        onPress={() => {
          //checkEmptyCells checks if the puzzle is complete, returns true if board is filled out, false if board has any empty cell
          if (checkEmptyCells(sudoku_grid)) {
            console.log("puzzle is filled");
            console.log(sudoku_grid);
            //returns true if the board is solved
            if (isBoardSolved(sudoku_grid, solved_grid)) {
              console.log("Puzzle completed and correct!");
            }
          }
        }}
      >
        <Text>Submit</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8ea18c",
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
  },
  tool_select_area: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "blue",
    marginTop: 15,
  },
  tool_icon: {
    height: 40,
    width: 40,
    backgroundColor: "pink",
    margin: 5,
  },
  number_select_area: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "blue",
    marginTop: 15,
  },
  number_select_box: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
    width: 40,
    height: 40,
  },
  number_select_text: {
    color: "black",
    fontSize: 24,
  },
  cell: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderColor: "green",
    borderWidth: 0.5,
    backgroundColor: "white",
  },
  cell_thick: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRightWidth: 2,
    borderRightColor: "black",
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftColor: "green",
    borderTopColor: "green",
    borderBottomColor: "green",
  },
  row: {
    flexDirection: "row",
  },
  row_thick: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "black",
  },
  cell_text: {
    fontSize: 20,
    color: "black",
  },
  cell_text2: {
    fontSize: 20,
    color: "blue",
  },
  submit_button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 150,
    backgroundColor: "pink",
    marginTop: 20,
    borderRadius: 5,
  },
});
