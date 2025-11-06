import { StyleSheet } from "react-native";

const CollectionStyles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f5f5",
        flex: 1,
        padding: 16
    },
    emptyContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    emptySubtext: {
        color: "#999",
        fontSize: 14
    },
    emptyText: {
        color: "#666",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8
    },
    listContainer: {
        paddingBottom: 16
    },
    title: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    }
});

  export default CollectionStyles;