import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: "#007AFF",
        borderRadius: 12,
        elevation: 5,
        justifyContent: "center",
        marginHorizontal: 8,
        marginVertical: 15,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: {
            height: 2,
            width: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: "40%"
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    }
});

  export default ButtonStyles;