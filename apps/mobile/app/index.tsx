import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Mobile() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mobile</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Pressed!");
          Alert.alert("Alert", "Pressed!");
        }}
      >
        <Text style={styles.buttonText}>Boop</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 36,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});