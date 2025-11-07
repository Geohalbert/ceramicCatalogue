import { StyleSheet } from "react-native";

const LanguageSwitcherStyles = StyleSheet.create({
  activeButton: {
    backgroundColor: "#007AFF"
  },
  activeButtonText: {
    color: "#fff"
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  buttonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600"
  },
  container: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
    position: "absolute",
    right: 10,
    top: 10
  }
});

export default LanguageSwitcherStyles;

