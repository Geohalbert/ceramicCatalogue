import { StyleSheet } from "react-native";

const CollectionStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
    },
    listContainer: {
      paddingBottom: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#666',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: '#999',
    },
  });

  export default CollectionStyles;