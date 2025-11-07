import { StyleSheet } from "react-native";

const HomeStyles = StyleSheet.create({
    authContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginBottom: 20,
        maxWidth: 400,
        padding: 20,
        width: "100%"
    },
    authTitle: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    button: {
        alignItems: "center",
        backgroundColor: "#007AFF",
        borderRadius: 8,
        marginTop: 10,
        padding: 15,
        width: "100%"
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    container: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    errorText: {
        backgroundColor: "#f8d7da",
        borderRadius: 5,
        color: "#dc3545",
        fontSize: 14,
        marginBottom: 10,
        padding: 10,
        textAlign: "center"
    },
    forgotPasswordLink: {
        alignSelf: "flex-end",
        marginBottom: 10,
        marginTop: 5
    },
    forgotPasswordText: {
        color: "#007AFF",
        fontSize: 14
    },
    image: {
        height: 261,
        width: 200
    },
    input: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        marginBottom: 15,
        padding: 12,
        width: "100%"
    },
    secondaryButton: {
        alignItems: "center",
        backgroundColor: "#6c757d",
        borderRadius: 8,
        marginTop: 10,
        padding: 15,
        width: "100%"
    },
    secondaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    signOutButton: {
        alignItems: "center",
        backgroundColor: "#dc3545",
        borderRadius: 8,
        padding: 12,
        width: "100%"
    },
    signOutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    switchButton: {
        marginLeft: 5
    },
    switchButtonText: {
        color: "#007AFF",
        fontWeight: "600"
    },
    switchText: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    userInfo: {
        color: "#666",
        fontSize: 14,
        marginBottom: 15,
        textAlign: "center"
    },
    welcomeText: {
        color: "#333",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center"
    },
    googleButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    googleButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default HomeStyles;