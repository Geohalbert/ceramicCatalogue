import { Image, Text, View, ScrollView } from "react-native";
import { useAppSelector } from "../store/hooks";

import Authentication from "../components/Authentication";
import AddItemButton from "../components/AddItemButton"; 
import CollectionsButton from "../components/CollectionsButton";

import HomeStyles from "./styles/HomeStyles";

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { container, title, image } = HomeStyles;

  // Authenticated view
  if (isAuthenticated) {
    return (
      <View style={container}>
        <Text style={title}>Welcome to the Ceramic Catalogue</Text>
        <Image source={require('../../assets/home_screen_vase_cropped_300w.png')} style={image} />
        
        <AddItemButton />
        <CollectionsButton />
        
        <Authentication />
      </View>
    );
  }

  // Unauthenticated view - Sign In/Sign Up
  return (
    <ScrollView contentContainerStyle={container}>
      <Text style={title}>Welcome to the Ceramic Catalogue</Text>
      <Image source={require('../../assets/home_screen_vase_cropped_300w.png')} style={image} />
      
      <Authentication />
    </ScrollView>
  );
}