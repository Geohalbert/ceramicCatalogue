import { View } from "react-native";
import { Image,Text } from "react-native";

export default function PotteryTile() {
  return (
    <View>
      <Text>Pottery Tile</Text>
      <Image source={require('../../assets/pottery.svg')} />
      <Text>11/5/2025</Text>
    </View>
  );
}