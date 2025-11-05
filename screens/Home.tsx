import { Text, View } from "react-native";
import PotteryTile from "../components/PotteryTile";


export default function Home() {
  return (
    <View>
        <Text>Home</Text>
        <Text>Welcome to the Ceramic Catalogue</Text>
        <PotteryTile />
    </View>
  );
}