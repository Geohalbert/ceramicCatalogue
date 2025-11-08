import { Image, Text, View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";
import { useTheme } from "../context/ThemeContext";

import Authentication from "../components/Authentication";
import CollectionsButton from "../components/CollectionsButton";
import TopBar from "../components/TopBar";

import HomeStyles from "./styles/HomeStyles";

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { colors } = useTheme();
  const { container, title, image, guestNotice, guestNoticeText } = HomeStyles;

  return (
    <ScrollView contentContainerStyle={container} style={{ backgroundColor: colors.background }}>
      <TopBar />
      <Text style={[title, { color: colors.text }]}>{t('home.title')}</Text>
      <Image source={require('../../assets/home_screen_vase_cropped_300w.png')} style={image} />
      
      {/* Show guest notice if not authenticated */}
      {!isAuthenticated && (
        <View style={[guestNotice, { backgroundColor: colors.info, borderColor: colors.primary }]}>
          <Text style={[guestNoticeText, { color: colors.primary }]}>{t('home.guestMode')}</Text>
        </View>
      )}
      
      <CollectionsButton />
      <Authentication />
    </ScrollView>
  );
}