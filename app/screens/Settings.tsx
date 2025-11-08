import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { signOutThunk } from '../store/authSlice';

import SettingsStyles from './styles/SettingsStyles';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const { container, title, section, sectionTitle, option, optionText, button, buttonText, divider } = SettingsStyles;

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
    <View style={container}>
      <Text style={title}>{t('settings.title')}</Text>

      {/* Account Section */}
      {isAuthenticated && (
        <>
          <View style={section}>
            <Text style={sectionTitle}>{t('settings.account.title')}</Text>
            <View style={option}>
              <Text style={optionText}>{t('settings.account.email')}: {user?.email}</Text>
            </View>
            {user?.displayName && (
              <View style={option}>
                <Text style={optionText}>{t('settings.account.name')}: {user.displayName}</Text>
              </View>
            )}
          </View>
          <View style={divider} />
        </>
      )}

      {/* Language Section */}
      <View style={section}>
        <Text style={sectionTitle}>{t('settings.language.title')}</Text>
        <TouchableOpacity 
          style={option}
          onPress={() => changeLanguage('en')}
        >
          <Text style={optionText}>English {i18n.language === 'en' && '✓'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={option}
          onPress={() => changeLanguage('es')}
        >
          <Text style={optionText}>Español {i18n.language === 'es' && '✓'}</Text>
        </TouchableOpacity>
      </View>
      <View style={divider} />

      {/* Storage Info Section */}
      <View style={section}>
        <Text style={sectionTitle}>{t('settings.storage.title')}</Text>
        <View style={option}>
          <Text style={optionText}>
            {isAuthenticated ? t('settings.storage.cloud') : t('settings.storage.local')}
          </Text>
        </View>
      </View>

      {/* Sign Out Button */}
      {isAuthenticated && (
        <>
          <View style={divider} />
          <TouchableOpacity style={button} onPress={handleSignOut}>
            <Text style={buttonText}>{t('authentication.signOut.button')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

