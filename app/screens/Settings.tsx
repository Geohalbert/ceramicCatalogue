import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { signOutThunk } from '../store/authSlice';
import { useTheme } from '../context/ThemeContext';

import SettingsStyles from './styles/SettingsStyles';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme, colors } = useTheme();
  
  const { section, sectionTitle, option, optionText, button, buttonText, divider } = SettingsStyles;

  const handleSignOut = async () => {
    try {
      await dispatch(signOutThunk()).unwrap();
      Alert.alert(t('common.success'), t('authentication.signOut.successMessage'));
    } catch (error: any) {
      Alert.alert(t('common.error'), t('authentication.signOut.errorMessage'));
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background, padding: 20 }]}>
      {/* Close Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: colors.secondaryBackground,
          borderRadius: 20,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          borderWidth: 1,
          borderColor: colors.border,
        }}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>×</Text>
      </TouchableOpacity>

      <Text style={[{ fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: colors.text }]}>
        {t('settings.title')}
      </Text>

      {/* Account Section */}
      {isAuthenticated && (
        <>
          <View style={section}>
            <Text style={[sectionTitle, { color: colors.secondaryText }]}>{t('settings.account.title')}</Text>
            <View style={[option, { backgroundColor: colors.secondaryBackground }]}>
              <Text style={[optionText, { color: colors.text }]}>{t('settings.account.email')}: {user?.email}</Text>
            </View>
            {user?.displayName && (
              <View style={[option, { backgroundColor: colors.secondaryBackground }]}>
                <Text style={[optionText, { color: colors.text }]}>{t('settings.account.name')}: {user.displayName}</Text>
              </View>
            )}
          </View>
          <View style={[divider, { backgroundColor: colors.divider }]} />
        </>
      )}

      {/* Appearance Section */}
      <View style={section}>
        <Text style={[sectionTitle, { color: colors.secondaryText }]}>{t('settings.appearance.title')}</Text>
        <TouchableOpacity 
          style={[option, { backgroundColor: colors.secondaryBackground }]}
          onPress={toggleTheme}
        >
          <Text style={[optionText, { color: colors.text }]}>
            {theme === 'light' ? t('settings.appearance.light') : t('settings.appearance.dark')} {theme === 'light' ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[divider, { backgroundColor: colors.divider }]} />

      {/* Language Section */}
      <View style={section}>
        <Text style={[sectionTitle, { color: colors.secondaryText }]}>{t('settings.language.title')}</Text>
        <TouchableOpacity 
          style={[option, { backgroundColor: colors.secondaryBackground }]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[optionText, { color: colors.text }]}>English {i18n.language === 'en' && '✓'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[option, { backgroundColor: colors.secondaryBackground }]}
          onPress={() => changeLanguage('es')}
        >
          <Text style={[optionText, { color: colors.text }]}>Español {i18n.language === 'es' && '✓'}</Text>
        </TouchableOpacity>
      </View>
      <View style={[divider, { backgroundColor: colors.divider }]} />

      {/* Storage Info Section */}
      <View style={section}>
        <Text style={[sectionTitle, { color: colors.secondaryText }]}>{t('settings.storage.title')}</Text>
        <View style={[option, { backgroundColor: colors.secondaryBackground }]}>
          <Text style={[optionText, { color: colors.text }]}>
            {isAuthenticated ? t('settings.storage.cloud') : t('settings.storage.local')}
          </Text>
        </View>
      </View>

      {/* Sign Out Button */}
      {isAuthenticated && (
        <>
          <View style={[divider, { backgroundColor: colors.divider }]} />
          <TouchableOpacity style={[button, { backgroundColor: colors.danger }]} onPress={handleSignOut}>
            <Text style={buttonText}>{t('authentication.signOut.button')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

