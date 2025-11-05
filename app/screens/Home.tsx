import { Image, Text, View } from "react-native";
import PotteryTile from "../components/PotteryTile"; 
import AddItemButton from "../components/AddItemButton"; 
import { StyleSheet } from "react-native";


export default function Home() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Ceramic Catalogue</Text>
        <Image source={require('../../assets/home_screen_vase_cropped_300w.png')} style={styles.image} />
        <AddItemButton />
        <PotteryTile />
    </View>
  );    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 261,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});