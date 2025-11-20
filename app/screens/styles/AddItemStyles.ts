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
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        marginTop: 15
    },
    multilineInput: {
        borderColor: "#ddd",
        borderRadius: 5,
        borderWidth: 1,
        fontSize: 16,
        height: 75,
        padding: 10,
        textAlignVertical: "top"
    },
    pickerContainer: {
        borderColor: "#ddd",
        borderRadius: 5,
        borderWidth: 1
    }
});

  export default AddItemStyles;