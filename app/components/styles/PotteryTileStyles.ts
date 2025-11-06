import { StyleSheet } from "react-native";

const PotteryTileStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      margin: 8,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: 80,
      height: 80,
      marginBottom: 8,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 4,
    },
    type: {
      fontSize: 14,
      color: '#666',
      marginBottom: 2,
    },
    date: {
      fontSize: 12,
      color: '#999',
      marginBottom: 4,
    },
    status: {
      fontSize: 12,
      color: '#4CAF50',
      fontWeight: '600',
    },
  });

  export default PotteryTileStyles;