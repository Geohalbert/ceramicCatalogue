import { View, Image, Text, StyleSheet } from "react-native";
import { Pottery } from "../store/types";

interface PotteryTileProps {
  pottery: Pottery;
}

export default function PotteryTile({ pottery }: PotteryTileProps) {

  if (pottery) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/pot_icon.png')} 
        style={styles.image} 
      />
      <Text style={styles.name}>{pottery.potName || 'Unnamed'}</Text>
      <Text style={styles.type}>{pottery.designType}</Text>
      <Text style={styles.date}>{pottery.dateCreated}</Text>
      <Text style={styles.status}>{pottery.potStatus}</Text>
    </View>
  );}
}

const styles = StyleSheet.create({
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