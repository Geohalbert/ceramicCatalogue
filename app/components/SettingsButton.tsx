import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";

import SettingsButtonStyles from "./styles/SettingsButtonStyles";

export default function SettingsButton() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { button, icon } = SettingsButtonStyles;

  const handlePress = () => {
    navigation.navigate('Settings');
  }

  return (
    <TouchableOpacity 
      style={[button, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={icon}>⚙️</Text>
    </TouchableOpacity>
  );
}

