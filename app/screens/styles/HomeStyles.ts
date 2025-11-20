import { StyleSheet } from "react-native";

const HomeStyles = StyleSheet.create({
    authContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
        maxWidth: 400,
        padding: 15,
        width: "100%"
    },
    authTitle: {
        color: "#333",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },
    button: {
        alignItems: "center",
        backgroundColor: "#007AFF",
        borderRadius: 8,
        marginTop: 5,
        padding: 12,
        width: "100%"
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    container: {
        alignItems: "center",
        flexGrow: 1,
        paddingBottom: 20,
        paddingHorizontal: 20,
        paddingTop: 40
    },
    dividerContainer: {
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 10
    },
    dividerLine: {
        backgroundColor: "#ddd",
        flex: 1,
        height: 1
    },
    dividerText: {
        color: "#666",
        fontSize: 14,
        fontWeight: "600",
        marginHorizontal: 10
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
    googleButton: {
        alignItems: "center",
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
        padding: 12,
        width: "100%"
    },
    googleButtonText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "600"
    },
    guestNotice: {
        backgroundColor: "#e7f3ff",
        borderColor: "#007AFF",
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: 10,
        maxWidth: 400,
        padding: 8,
        width: "100%"
    },
    guestNoticeText: {
        color: "#007AFF",
        fontSize: 12,
        fontWeight: "500",
        textAlign: "center"
    },
    image: {
        height: 150,
        marginBottom: 10,
        width: 115
    },
    input: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 14,
        marginBottom: 10,
        padding: 10,
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
        marginTop: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 100
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
    }
});

export default HomeStyles;