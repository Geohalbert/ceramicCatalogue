import { TouchableOpacity, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import LanguageSwitcherStyles from "../components/styles/LanguageSwitcherStyles";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const { container, button, buttonText, activeButton, activeButtonText } = LanguageSwitcherStyles;

  return (
    <View style={[container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[button, { backgroundColor: colors.card }, currentLanguage === 'en' && { backgroundColor: colors.primary }]}
        onPress={() => i18n.changeLanguage('en')}
        activeOpacity={0.7}
      >
        <Text style={[buttonText, { color: colors.secondaryText }, currentLanguage === 'en' && activeButtonText]}>EN</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[button, { backgroundColor: colors.card }, currentLanguage === 'es' && { backgroundColor: colors.primary }]}
        onPress={() => i18n.changeLanguage('es')}
        activeOpacity={0.7}
      >
        <Text style={[buttonText, { color: colors.secondaryText }, currentLanguage === 'es' && activeButtonText]}>ES</Text>
      </TouchableOpacity>
    </View>
  );
}

