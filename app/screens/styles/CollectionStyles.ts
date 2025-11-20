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
    hamburgerButton: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderRadius: 8,
        borderWidth: 1,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    hamburgerIcon: {
        color: '#333',
        fontSize: 24,
    },
    listContainer: {
        paddingBottom: 16
    },
    storageIndicator: {
        alignSelf: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginBottom: 15,
        padding: 8,
    },
    storageIndicatorText: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
    },
    title: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    }
});

export default CollectionStyles;