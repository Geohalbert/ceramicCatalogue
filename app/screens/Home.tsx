import { Text, View } from "react-native";
import PotteryTile from "../components/PotteryTile"; 
import AddItemButton from "../components/AddItemButton"; 


export default function Home() {
  return (
    <View>
        <Text>Home</Text>
        <Text>Welcome to the Ceramic Catalogue</Text>
        <AddItemButton />
        <PotteryTile />
    </View>
  );    
}