import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Pressable, Image, Modal } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import puzzles_easy from "../puzzles/Puzzles_Easy";
import puzzles_medium from "../puzzles/Puzzles_Medium";
import puzzles_hard from "../puzzles/Puzzles_Hard";
import puzzles_very_hard from "../puzzles/Puzzles_Very_Hard";
import puzzles_insane from "../puzzles/Puzzles_Insane";
import puzzles_inhuman from "../puzzles/Puzzles_Inhuman";
import { solveSudoku, checkEmptyCells, isBoardSolved } from "../puzzles/Sudoku_Solver";
import { returnsCoordinatesOfGivenCells, isGivenCell } from "./Conditional_Styles";
import Hint from "react-native-vector-icons/Feather";
import Edit from "react-native-vector-icons/Feather";
import Eraser from "react-native-vector-icons/Feather";
import ChevronsLeft from "react-native-vector-icons/Feather";

const windowWidth = Dimensions.get("window").width;

//3 notation systems for sudoku
//the standard grid notation
//pencil marks for noting that a number could only be in 2 positions of a box (box is 3x3), pencil marks go to top left of the cell
//center notes, where the numbers get written on the center of the box in a horizontal line
//pencil marks and center notes go together
//develop with standard grid notation first but allow for the optionality to change notation system later on patches

export default function GamePage({ route, navigation }) {
  //state for each cell
  const [is_cell_selected, Set_is_cell_selected] = useState(false);
  const [currently_selected_cell_coordinate, Set_Currently_selected_cell_coordinate] = useState();
  const [currently_selected_cell_number, Set_currently_selected_cell_number] = useState();

  const [is_note_mode, Set_is_note_mode] = useState(false);
  const [hint_usage_count, Set_hint_usage_count] = useState(0);

  //check if the puzzle is solved
  const [is_puzzle_solved, Set_is_puzzle_solved] = useState(false);

  //where coordinate of given cells will be saved
  const [coordinate_list_of_given_cells, Set_coordinate_list_of_given_cells] = useState([]);

  //which puzzle to use out of 1000, picks a random number 0 to 999
  let puzzle_index = Math.floor(Math.random() * 999);

  //count correct number of cells when submit button is pressed
  let correct_number_of_cells = 0;

  //main blue color
  const main_blue = "#3459b2";
  const main_gray = "#696969";

  //completion modal
  const [modalVisible_Incorrect, setModalVisible_Incorrect] = useState(false);
  const [modalVisible_Correct, setModalVisible_Correct] = useState(false);

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

  const [notes_grid, Set_notes_grid] = useState([
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

  function row_thick_border(row_index) {
    if (row_index === 2 || row_index === 5) {
      return styles.row_thick;
    } else {
      return styles.row;
    }
  }

  function column_thick_border(column_index) {
    if (column_index === 2 || column_index === 5) {
      return styles.cell_thick;
    } else {
      return styles.cell;
    }
  }

  function Comprehensive_styler(coordinate_list_of_given_cells, y, x, number, currently_selected_cell_coordinate, currently_selected_cell_number, is_cell_selected) {
    //check if a cell has been selected first
    if (is_cell_selected) {
      //currently selected cell
      if (currently_selected_cell_coordinate[0] === y && currently_selected_cell_coordinate[1] === x) {
        return styles.selected_cell;
      }
      //number in cell matches the number in currently selected cell and it is not an empty cell
      if (number === currently_selected_cell_number && currently_selected_cell_number != "") {
        return styles.same_number;
      }
      if (currently_selected_cell_coordinate[0] === y || currently_selected_cell_coordinate[1] === x) {
        return styles.same_row_or_column;
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tool_icon, styles.go_back_icon]}
        onPress={() => {
          navigation.navigate("Main");
        }}
      >
        <ChevronsLeft name="chevrons-left" color={main_blue} size={60} />
      </TouchableOpacity>
      <Text style={styles.difficulty_text}>{game_difficulty}</Text>

      <View>
        {/* how to make a 9x9 game area and different border styles for the lines */}
        {[...Array(9).keys()].map((index_y) => {
          return (
            <View style={row_thick_border(index_y)}>
              {[...Array(9).keys()].map((index_x) => {
                return (
                  <TouchableOpacity
                    style={[
                      column_thick_border(index_x),
                      Comprehensive_styler(
                        coordinate_list_of_given_cells,
                        index_y,
                        index_x,
                        sudoku_grid[index_y][index_x],
                        currently_selected_cell_coordinate,
                        currently_selected_cell_number,
                        is_cell_selected
                      ),
                    ]}
                    onPress={() => {
                      Set_Currently_selected_cell_coordinate([index_y, index_x]);
                      Set_is_cell_selected(true);
                      Set_currently_selected_cell_number(sudoku_grid[index_y][index_x]);
                    }}
                  >
                    {/* black font for initial cells, blue font for cells that user adds on */}
                    {sudoku_grid[index_y][index_x] != "" ? <Text style={font_color_styler(coordinate_list_of_given_cells, index_y, index_x)}>{sudoku_grid[index_y][index_x]}</Text> : null}
                    {notes_grid[index_y][index_x] != "" ? <Text style={styles.notes_text}>{notes_grid[index_y][index_x]}</Text> : null}
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
              let correct_number = solved_grid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]];
              //add cell to the sudoku_grid
              let temp_grid = sudoku_grid.slice(); //copying array can be iffy
              temp_grid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = correct_number;
              Set_sudoku_grid(temp_grid);
              //add coordinates to given cell list
              Set_coordinate_list_of_given_cells([...coordinate_list_of_given_cells, [currently_selected_cell_coordinate[0], currently_selected_cell_coordinate[1]]]);
              Set_hint_usage_count(hint_usage_count + 1);
            }
          }}
        >
          <Hint name="search" color={main_blue} size={36} />
          <Text style={styles.tool_text}>Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tool_icon}
          onPress={() => {
            if (is_cell_selected && !isGivenCell(coordinate_list_of_given_cells, currently_selected_cell_coordinate[0], currently_selected_cell_coordinate[1])) {
              //change the current selected cell to ""
              let temp_grid = sudoku_grid.slice(); //copying array can be iffy
              let temp_grid_2 = notes_grid.slice();
              temp_grid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = "";
              temp_grid_2[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = "";
              Set_sudoku_grid(temp_grid);
              Set_notes_grid(temp_grid_2);
            }
          }}
        >
          <Eraser name="delete" color={main_blue} size={36} />
          <Text style={styles.tool_text}>Erase</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tool_icon}
          onPress={() => {
            Set_is_note_mode(!is_note_mode);
          }}
        >
          <Edit name="edit-3" color={is_note_mode ? main_gray : main_blue} size={36} />
          <Text style={[styles.tool_text, is_note_mode ? { color: main_gray } : { color: main_blue }]}>Notes</Text>
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
                if (!is_note_mode && is_cell_selected && !isGivenCell(coordinate_list_of_given_cells, currently_selected_cell_coordinate[0], currently_selected_cell_coordinate[1])) {
                  let newGrid = sudoku_grid.slice(); //copying array can be iffy
                  newGrid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = (index + 1).toString();
                  Set_sudoku_grid(newGrid);
                  //delete the notes in the cell as the player number is inputted
                  let temp_grid_2 = notes_grid.slice();
                  temp_grid_2[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = "";
                  Set_notes_grid(temp_grid_2);
                }
                //when note mode is on
                if (
                  is_note_mode &&
                  sudoku_grid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] === "" &&
                  is_cell_selected &&
                  !isGivenCell(coordinate_list_of_given_cells, currently_selected_cell_coordinate[0], currently_selected_cell_coordinate[1])
                ) {
                  let newGrid = notes_grid.slice(); //copying array can be iffy
                  let new_number = (index + 1).toString();
                  const numberString = newGrid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]];
                  let temp = numberString.split("");
                  //expected output: "128"
                  //user clicks on 6
                  //"1286" => "1268"

                  //user clicks on 6 again
                  //"1268" => "128"

                  //add the number to the notes only if the same number doesn't exist in the notes
                  if (!temp.includes(new_number)) {
                    temp.push(new_number);
                    temp.sort();
                    const res = temp.join("");
                    newGrid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = res;
                    Set_notes_grid(newGrid);
                    //remove the number from the notes if the same number already exists in the notes
                  } else {
                    let filtered_temp = temp.filter((e) => e !== new_number);
                    filtered_temp.sort();
                    const res = filtered_temp.join("");
                    newGrid[currently_selected_cell_coordinate[0]][currently_selected_cell_coordinate[1]] = res;
                    Set_notes_grid(newGrid);
                  }
                }
              }}
            >
              <Text style={[is_note_mode ? { color: main_gray } : { color: main_blue }, styles.number_select_text]}>{index + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {checkEmptyCells(sudoku_grid) ? (
        <TouchableOpacity
          style={styles.submit_button}
          onPress={() => {
            //checkEmptyCells checks if the puzzle is complete, returns true if board is filled out, false if board has any empty cell
            if (checkEmptyCells(sudoku_grid)) {
              if (isBoardSolved(sudoku_grid, solved_grid)) {
                setModalVisible_Correct(true);
              } else {
                setModalVisible_Incorrect(true);
              }
            }
          }}
        >
          <Text style={styles.submit_text}>Submit</Text>
        </TouchableOpacity>
      ) : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible_Incorrect}
        onRequestClose={() => {
          setModalVisible_Incorrect(!modalVisible_Incorrect);
        }}
      >
        <View style={styles.modal_box}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Incorrect</Text>
            <Pressable style={styles.modalButton} onPress={() => setModalVisible_Incorrect(!modalVisible_Incorrect)}>
              <Text style={styles.textStyle}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible_Correct}
        onRequestClose={() => {
          setModalVisible_Correct(!modalVisible_Correct);
        }}
      >
        <View style={styles.modal_box}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Complete</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible_Correct(!modalVisible_Correct);
                navigation.navigate("Main");
              }}
            >
              <Text style={styles.textStyle}>Home</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
  },
  difficulty_text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#696969",
  },

  tool_select_area: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  tool_icon: {
    marginLeft: 35,
    marginRight: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  tool_text: {
    color: "#3459b2",
    fontWeight: "bold",
    fontSize: 12,
  },
  go_back_icon: {
    position: "absolute",
    marginTop: 5,
    marginLeft: 0,
    top: 1,
    left: 1,
  },
  number_select_area: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  number_select_box: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  number_select_text: {
    fontSize: 42,
  },
  cell: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderColor: "black",
    borderWidth: 0.5,
    backgroundColor: "white",
  },
  cell_thick: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    backgroundColor: "white",
    borderRightWidth: 2,
    borderRightColor: "black",
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftColor: "black",
    borderTopColor: "black",
    borderBottomColor: "black",
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
    fontSize: 26,
    color: "black",
  },
  cell_text2: {
    fontSize: 26,
    color: "#3459b2",
  },
  notes_text: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#696969",
  },
  submit_button: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 100,
    backgroundColor: "#3459b2",
    marginTop: 25,
    borderRadius: 10,
  },
  submit_text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  selected_cell: {
    backgroundColor: "#b1e0fe",
  },
  same_number: {
    backgroundColor: "#c2d7e8",
  },
  same_row_or_column: {
    backgroundColor: "#e3ecf5",
  },

  icon_imag: {
    flex: 1,
  },

  modal_box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    width: "50%",
    height: "20%",
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "#3459b2",
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 25,
    paddingBottom: 15,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: "#3459b2",
    padding: 15,
    borderRadius: 25,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
  },
});
