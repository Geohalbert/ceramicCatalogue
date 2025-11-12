import { StyleSheet } from "react-native";

const PotteryTileStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    flex: 1,
    margin: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  date: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4
  },
  image: {
    height: 80,
    marginBottom: 8,
    width: 80
  },
  name: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center"
  },
  status: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600"
  },
  type: {
    color: "#666",
    fontSize: 14,
    marginBottom: 2
  },
  timerBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  timerText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PotteryTileStyles;