import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function CollectionsButton() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleCollections = () => {
        navigation.navigate('Collection');
    }
    
  return (
    <View>
      <Button title="Collections" onPress={handleCollections} />
    </View>
  );
}