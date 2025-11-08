import { TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";

import ButtonStyles from "./styles/ButtonsStyles";

export default function AddItemButton() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { button, buttonText } = ButtonStyles;

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  }

  return (
    <TouchableOpacity 
      style={[button, { backgroundColor: colors.primary }]}
      onPress={handleAddItem}
      activeOpacity={0.7}
    >
      <Text style={buttonText}>{t('home.addItemButton')}</Text>
    </TouchableOpacity>
  );
}