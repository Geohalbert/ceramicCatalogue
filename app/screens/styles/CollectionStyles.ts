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
    },
    storageIndicator: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 6,
        marginBottom: 15,
        alignSelf: 'center',
    },
    storageIndicatorText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    hamburgerButton: {
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    hamburgerIcon: {
        fontSize: 24,
        color: '#333',
    }
});

export default CollectionStyles;