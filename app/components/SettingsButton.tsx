import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import SettingsButtonStyles from "./styles/SettingsButtonStyles";

export default function SettingsButton() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { button, icon } = SettingsButtonStyles;

  const handlePress = () => {
    navigation.navigate('Settings');
  }

  return (
    <TouchableOpacity 
      style={button}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={icon}>⚙️</Text>
    </TouchableOpacity>
  );
}

