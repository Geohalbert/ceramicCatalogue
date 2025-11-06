import { Image, Text, View } from "react-native";

import AddItemButton from "../components/AddItemButton"; 
import CollectionsButton from "../components/CollectionsButton";

import HomeStyles from "./styles/HomeStyles";

export default function Home() {
  const { container, title, image } = HomeStyles;
    
  return (
    <View style={container}>
        <Text style={title}>Welcome to the Ceramic Catalogue</Text>
        <Image source={require('../../assets/home_screen_vase_cropped_300w.png')} style={image} />
        <AddItemButton />
        <CollectionsButton />
    </View>
  );    
}