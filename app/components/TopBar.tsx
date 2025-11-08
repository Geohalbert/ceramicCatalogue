import { View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import SettingsButton from "./SettingsButton";
import LanguageSwitcher from "./LanguageSwitcher";
import TopBarStyles from "./styles/TopBarStyles";

export default function TopBar() {
  const { colors } = useTheme();
  const { container } = TopBarStyles;

  return (
    <View style={container}>
      <SettingsButton />
      <LanguageSwitcher />
    </View>
  );
}

