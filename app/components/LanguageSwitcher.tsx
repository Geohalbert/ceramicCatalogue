import { TouchableOpacity, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import LanguageSwitcherStyles from "../components/styles/LanguageSwitcherStyles";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const { container, button, buttonText, activeButton, activeButtonText } = LanguageSwitcherStyles;

  return (
    <View style={container}>
      <TouchableOpacity
        style={[button, currentLanguage === 'en' && activeButton]}
        onPress={() => i18n.changeLanguage('en')}
        activeOpacity={0.7}
      >
        <Text style={[buttonText, currentLanguage === 'en' && activeButtonText]}>EN</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[button, currentLanguage === 'es' && activeButton]}
        onPress={() => i18n.changeLanguage('es')}
        activeOpacity={0.7}
      >
        <Text style={[buttonText, currentLanguage === 'es' && activeButtonText]}>ES</Text>
      </TouchableOpacity>
    </View>
  );
}

