import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";


const windowWidth = Dimensions.get("window").width;

export default function MainPage({ navigation }) {
  const buttons = ["Easy", "Medium", "Hard", "Very Hard", "Insane", "Inhuman"];

  return (
    <View style={styles.container}>
      {buttons.map((difficulty) => {
        return (
          <TouchableOpacity
            style={styles.button}
            onPressIn={() => {
              navigation.navigate("Game", {
                game_difficulty: difficulty,
              });
            }}
          >
            <Text style={styles.button_text}>{difficulty}</Text>
          </TouchableOpacity>
        );
      })}
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

  button: {
    width: 180,
    height: 55,
    backgroundColor: "#3459b2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  button_text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
