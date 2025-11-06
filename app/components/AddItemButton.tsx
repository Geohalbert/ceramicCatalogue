import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ButtonStyles from "./styles/ButtonsStyles";

export default function AddItemButton() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { button, buttonText } = ButtonStyles;

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  }

  return (
    <TouchableOpacity 
      style={button}
      onPress={handleAddItem}
      activeOpacity={0.7}
    >
      <Text style={buttonText}>Add Item</Text>
    </TouchableOpacity>
  );
}