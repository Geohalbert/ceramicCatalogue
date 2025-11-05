import { Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function AddItemButton() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  }

  return (
    <View>
        <Button title="Add Item" onPress={handleAddItem} /> 
    </View>
  );
}