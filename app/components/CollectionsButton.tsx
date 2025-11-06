import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ButtonStyles from "./styles/ButtonsStyles";

export default function CollectionsButton() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { button, buttonText } = ButtonStyles;

    const handleCollections = () => {
        navigation.navigate('Collection');
    }
    
  return (
    <TouchableOpacity 
      style={button}
      onPress={handleCollections}
      activeOpacity={0.7}
    >
      <Text style={buttonText}>Collection</Text>
    </TouchableOpacity>
  );
}