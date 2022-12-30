import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";

const windowWidth = Dimensions.get("window").width;

export default function MainPage({ navigation }) {
  const buttons = ["Easy", "Medium", "Hard", "Very Hard", "Insane", "Inhuman"];

  return (
    <View style={styles.container}>
      <Text>Main Page</Text>
      {buttons.map((difficulty) => {
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
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
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  button_text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
