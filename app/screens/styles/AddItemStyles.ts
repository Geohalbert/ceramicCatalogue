import { StyleSheet } from "react-native";

const AddItemStyles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1
    },
    form: {
        padding: 20
    },
    input: {
        borderColor: "#ddd",
        borderRadius: 5,
        borderWidth: 1,
        fontSize: 16,
        padding: 10
    },
    multilineInput: {
        borderColor: "#ddd",
        borderRadius: 5,
        borderWidth: 1,
        fontSize: 16,
        padding: 10,
        height: 75,
        textAlignVertical: "top"
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        marginTop: 15
    },
    pickerContainer: {
        borderColor: "#ddd",
        borderRadius: 5,
        borderWidth: 1
    }
});

  export default AddItemStyles;