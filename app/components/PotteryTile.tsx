import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Pottery } from "../store/types";

import PotteryTileStyles from "./styles/PotteryTileStyles";

interface PotteryTileProps {
  pottery: Pottery;
}

export default function PotteryTile({ pottery }: PotteryTileProps) {
  const { container, image, name, type, date, status } = PotteryTileStyles;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handlePress = () => {
    navigation.navigate('AddItem', { pottery });
  };

  if (pottery) {
  return (
    <TouchableOpacity style={container} onPress={handlePress}>
      <Image 
        source={require('../../assets/pot_icon.png')} 
        style={image} 
      />
      <Text style={name}>{pottery.potName || 'Unnamed'}</Text>
      <Text style={type}>{pottery.designType}</Text>
      <Text style={date}>{pottery.dateCreated}</Text>
      <Text style={status}>{pottery.potStatus}</Text>
    </TouchableOpacity>
  );}
}