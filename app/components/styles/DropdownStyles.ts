import { StyleSheet } from "react-native";

const DropdownStyles = StyleSheet.create({
  closeButton: {
    padding: 5
  },
  closeButtonText: {
    color: "#666",
    fontSize: 24,
    fontWeight: "300"
  },
  container: {
    width: "100%"
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20
  },
  modalTitle: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold"
  },
  optionItem: {
    alignItems: "center",
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16
  },
  optionItemSelected: {
    backgroundColor: "#f0f8ff"
  },
  optionText: {
    color: "#333",
    fontSize: 16
  },
  optionTextSelected: {
    color: "#007AFF",
    fontWeight: "600"
  },
  trigger: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12
  },
  triggerText: {
    color: "#333",
    fontSize: 16
  }
});

export default DropdownStyles;

