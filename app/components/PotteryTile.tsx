import { View, Image, Text, StyleSheet } from "react-native";

import { Pottery } from "../store/types";

import PotteryTileStyles from "./styles/PotteryTileStyles";

interface PotteryTileProps {
  pottery: Pottery;
}

export default function PotteryTile({ pottery }: PotteryTileProps) {
  const { container, image, name, type, date, status } = PotteryTileStyles;

  if (pottery) {
  return (
    <View style={container}>
      <Image 
        source={require('../../assets/pot_icon.png')} 
        style={image} 
      />
      <Text style={name}>{pottery.potName || 'Unnamed'}</Text>
      <Text style={type}>{pottery.designType}</Text>
      <Text style={date}>{pottery.dateCreated}</Text>
      <Text style={status}>{pottery.potStatus}</Text>
    </View>
  );}
}