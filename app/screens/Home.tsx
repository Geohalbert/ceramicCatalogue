import { Image, Text, View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";

import Authentication from "../components/Authentication";
import AddItemButton from "../components/AddItemButton"; 
import CollectionsButton from "../components/CollectionsButton";
import LanguageSwitcher from "../components/LanguageSwitcher";
import SettingsButton from "../components/SettingsButton";

import HomeStyles from "./styles/HomeStyles";

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { container, title, image, guestNotice, guestNoticeText } = HomeStyles;

  return (
    <ScrollView contentContainerStyle={container}>
      <LanguageSwitcher />
      <SettingsButton />
      <Text style={title}>{t('home.title')}</Text>
      <Image source={require('../../assets/home_screen_vase_cropped_300w.png')} style={image} />
      
      {/* Show guest notice if not authenticated */}
      {!isAuthenticated && (
        <View style={guestNotice}>
          <Text style={guestNoticeText}>{t('home.guestMode')}</Text>
        </View>
      )}
      
      <CollectionsButton />
      <Authentication />
    </ScrollView>
  );
}