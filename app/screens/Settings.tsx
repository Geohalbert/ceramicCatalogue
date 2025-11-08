import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { signOutThunk } from '../store/authSlice';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme, colors } = useTheme();
  
  const styles = StyleSheet.create({
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      textTransform: 'uppercase',
    },
    option: {
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 8,
    },
    optionText: {
      fontSize: 16,
    },
    button: {
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      marginVertical: 20,
    },
  });

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
      <Text style={[{ fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: colors.text }]}>
        {t('settings.title')}
      </Text>

      {/* Account Section */}
      {isAuthenticated && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>{t('settings.account.title')}</Text>
            <View style={[styles.option, { backgroundColor: colors.secondaryBackground }]}>
              <Text style={[styles.optionText, { color: colors.text }]}>{t('settings.account.email')}: {user?.email}</Text>
            </View>
            {user?.displayName && (
              <View style={[styles.option, { backgroundColor: colors.secondaryBackground }]}>
                <Text style={[styles.optionText, { color: colors.text }]}>{t('settings.account.name')}: {user.displayName}</Text>
              </View>
            )}
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        </>
      )}

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>{t('settings.appearance.title')}</Text>
        <TouchableOpacity 
          style={[styles.option, { backgroundColor: colors.secondaryBackground }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>
            {theme === 'light' ? t('settings.appearance.light') : t('settings.appearance.dark')} {theme === 'light' ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>{t('settings.language.title')}</Text>
        <TouchableOpacity 
          style={[styles.option, { backgroundColor: colors.secondaryBackground }]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>English {i18n.language === 'en' && '✓'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.option, { backgroundColor: colors.secondaryBackground }]}
          onPress={() => changeLanguage('es')}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>Español {i18n.language === 'es' && '✓'}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Storage Info Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>{t('settings.storage.title')}</Text>
        <View style={[styles.option, { backgroundColor: colors.secondaryBackground }]}>
          <Text style={[styles.optionText, { color: colors.text }]}>
            {isAuthenticated ? t('settings.storage.cloud') : t('settings.storage.local')}
          </Text>
        </View>
      </View>

      {/* Sign Out Button */}
      {isAuthenticated && (
        <>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.danger }]} onPress={handleSignOut}>
            <Text style={styles.buttonText}>{t('authentication.signOut.button')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

