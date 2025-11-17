import { Image, Text, View, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

import Authentication from "../components/Authentication";
import CollectionsButton from "../components/CollectionsButton";
import TopBar from "../components/TopBar";

import HomeStyles from "./styles/HomeStyles";

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { colors } = useTheme();
  const { container, title, image, guestNotice, guestNoticeText } = HomeStyles;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView 
        contentContainerStyle={[
          container,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 35 : 20 }
        ]} 
        style={{ backgroundColor: colors.background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
    </KeyboardAvoidingView>
  );
}