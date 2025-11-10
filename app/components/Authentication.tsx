import { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signInThunk, signUpThunk, signOutThunk, signInWithGoogleThunk, setUser, clearError } from "../store/authSlice";
import { migrateLocalToFirebaseThunk } from "../store/potterySlice";
import { onAuthChange, resetPassword, createGoogleAuthConfig } from "../services/authService";
import { useTheme } from "../context/ThemeContext";

import HomeStyles from "../screens/styles/HomeStyles";

const REMEMBER_ME_KEY = '@ceramicCatalogue:rememberMe';
const SAVED_EMAIL_KEY = '@ceramicCatalogue:savedEmail';

interface AuthenticationProps {
  onAuthenticated?: () => void;
}

export default function Authentication({ onAuthenticated }: AuthenticationProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Configure Google authentication with Expo
  const googleConfig = createGoogleAuthConfig();
  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);

  // Load saved email on mount if "Remember Me" was previously checked
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedRememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        const savedEmail = await AsyncStorage.getItem(SAVED_EMAIL_KEY);
        
        if (savedRememberMe === 'true' && savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved email:', error);
      }
    };
    
    loadSavedEmail();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Clear error when switching between sign in/up/forgot password
  useEffect(() => {
    dispatch(clearError());
  }, [isSignUp, isForgotPassword, dispatch]);

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check length
    if (password.length < 8) {
      errors.push(t('authentication.errors.passwordLength'));
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push(t('authentication.errors.passwordUppercase'));
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push(t('authentication.errors.passwordLowercase'));
    }
    
    // Check for at least 2 numbers
    const numberCount = (password.match(/[0-9]/g) || []).length;
    if (numberCount < 2) {
      errors.push(t('authentication.errors.passwordNumbers'));
    }
    
    // Check for symbol
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push(t('authentication.errors.passwordSymbol'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('authentication.errors.fillAllFields'));
      return;
    }

    if (isSignUp && !displayName.trim()) {
      Alert.alert(t('common.error'), t('authentication.errors.enterName'));
      return;
    }

    // Validate password for sign up
    if (isSignUp) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        Alert.alert(
          t('authentication.errors.weakPassword'),
          passwordValidation.errors.join('\n')
        );
        return;
      }
    }

    try {
      if (isSignUp) {
        await dispatch(signUpThunk({ email, password, displayName })).unwrap();
        Alert.alert(t('common.success'), t('authentication.signUp.successMessage'));
      } else {
        await dispatch(signInThunk({ email, password })).unwrap();
        Alert.alert(t('common.success'), t('authentication.signIn.successMessage'));
        
        // Save email if "Remember Me" is checked
        if (rememberMe) {
          await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
          await AsyncStorage.setItem(SAVED_EMAIL_KEY, email);
        } else {
          await AsyncStorage.removeItem(REMEMBER_ME_KEY);
          await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
        }
      }
      
      // Migrate local data to Firebase after successful sign-in
      await migrateLocalData();
      
      // Clear form (but keep email if remember me is checked)
      if (!rememberMe) {
        setEmail("");
      }
      setPassword("");
      setDisplayName("");
      
      // Call optional callback
      if (onAuthenticated) {
        onAuthenticated();
      }
      
      // Navigate to Collection screen
      navigation.navigate('Collection');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('authentication.errors.authenticationFailed'));
    }
  };

  const handleSignOut = async () => {
    try {
      await dispatch(signOutThunk()).unwrap();
      Alert.alert(t('common.success'), t('authentication.signOut.successMessage'));
    } catch (error: any) {
      Alert.alert(t('common.error'), t('authentication.signOut.errorMessage'));
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('authentication.errors.enterEmail'));
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(email);
      Alert.alert(
        t('common.success'), 
        t('authentication.forgotPassword.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              setIsForgotPassword(false);
              setEmail("");
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('authentication.errors.resetEmailFailed'));
    } finally {
      setIsResetting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert(t('common.error'), 'Google Sign-In is not configured yet');
      return;
    }

    try {
      await dispatch(signInWithGoogleThunk({ request, promptAsync })).unwrap();
      Alert.alert(t('common.success'), t('authentication.google.successMessage'));
      
      // Migrate local data to Firebase after successful sign-in
      await migrateLocalData();
      
      // Call optional callback
      if (onAuthenticated) {
        onAuthenticated();
      }
      
      // Navigate to Collection screen
      navigation.navigate('Collection');
    } catch (error: any) {
      // Don't show alert if user cancelled
      if (error.message !== 'Sign in cancelled') {
        Alert.alert(t('common.error'), error.message || t('authentication.errors.googleSignInFailed'));
      }
    }
  };

  const migrateLocalData = async () => {
    try {
      const result = await dispatch(migrateLocalToFirebaseThunk()).unwrap();
      if (result.length > 0) {
        console.log(`Migrated ${result.length} items to Firebase`);
      }
    } catch (error) {
      console.error('Error migrating data:', error);
      // Don't show error to user - migration failure shouldn't block sign-in
    }
  };

  const { 
    authContainer,
    authTitle,
    input,
    button,
    buttonText,
    switchText,
    switchButton,
    switchButtonText,
    welcomeText,
    signOutButton,
    signOutButtonText,
    errorText,
    forgotPasswordLink,
    forgotPasswordText,
    googleButton,
    googleButtonText,
    dividerContainer,
    dividerLine,
    dividerText
  } = HomeStyles;

  // Authenticated view - User info and sign out
  if (isAuthenticated && user) {
    return (
      <View style={[authContainer, { backgroundColor: colors.secondaryBackground }]}>
        <Text style={[welcomeText, { color: colors.text }]}>{t('authentication.welcome', { name: user.displayName || user.email })}</Text>
        <TouchableOpacity style={[signOutButton, { backgroundColor: colors.danger }]} onPress={handleSignOut}>
          <Text style={signOutButtonText}>{t('authentication.signOut.button')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Forgot Password view
  if (isForgotPassword) {
    return (
      <View style={[authContainer, { backgroundColor: colors.secondaryBackground }]}>
        <Text style={[authTitle, { color: colors.text }]}>{t('authentication.forgotPassword.title')}</Text>
        
        <Text style={{ marginBottom: 15, color: colors.secondaryText, textAlign: 'center' }}>
          {t('authentication.forgotPassword.description')}
        </Text>
        
        <TextInput
          style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          placeholder={t('authentication.signIn.emailPlaceholder')}
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        <TouchableOpacity 
          style={[button, { backgroundColor: colors.primary }]} 
          onPress={handleForgotPassword}
          disabled={isResetting}
        >
          {isResetting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={buttonText}>{t('authentication.forgotPassword.button')}</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={forgotPasswordLink}
          onPress={() => {
            setIsForgotPassword(false);
            setEmail("");
          }}
        >
          <Text style={[forgotPasswordText, { color: colors.primary }]}>{t('authentication.forgotPassword.backLink')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Unauthenticated view - Sign In/Sign Up form
  return (
    <View style={[authContainer, { backgroundColor: colors.secondaryBackground }]}>
      <Text style={[authTitle, { color: colors.text }]}>{t(isSignUp ? 'authentication.signUp.title' : 'authentication.signIn.title')}</Text>
      
      {error && <Text style={errorText}>{error}</Text>}
      
      {/* Google Sign-In Button */}
      <TouchableOpacity 
        style={[googleButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <>
            <Text style={{ fontSize: 18, marginRight: 10, color: colors.text }}>G</Text>
            <Text style={[googleButtonText, { color: colors.text }]}>{t('authentication.google.button')}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={dividerContainer}>
        <View style={[dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[dividerText, { color: colors.secondaryText }]}>{t('authentication.google.divider')}</Text>
        <View style={[dividerLine, { backgroundColor: colors.border }]} />
      </View>
      
      {isSignUp && (
        <TextInput
          style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          placeholder={t('authentication.signUp.namePlaceholder')}
          placeholderTextColor={colors.placeholder}
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      )}
      
      <TextInput
        style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
        placeholder={t('authentication.signIn.emailPlaceholder')}
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
        placeholder={t('authentication.signIn.passwordPlaceholder')}
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      
      {!isSignUp && (
        <>
          {/* Remember Me Checkbox */}
          <TouchableOpacity 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 10,
              marginTop: 5
            }}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: colors.primary,
              backgroundColor: rememberMe ? colors.primary : 'transparent',
              marginRight: 8,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {rememberMe && <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
            </View>
            <Text style={{ color: colors.text, fontSize: 14 }}>
              {t('authentication.signIn.rememberMe')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={forgotPasswordLink}
            onPress={() => setIsForgotPassword(true)}
          >
            <Text style={[forgotPasswordText, { color: colors.primary }]}>{t('authentication.signIn.forgotPasswordLink')}</Text>
          </TouchableOpacity>
        </>
      )}
      
      <TouchableOpacity 
        style={[button, { backgroundColor: colors.primary }]} 
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={buttonText}>
            {t(isSignUp ? 'authentication.signUp.button' : 'authentication.signIn.button')}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={switchText}>
        <Text style={{ color: colors.text }}>{t(isSignUp ? 'authentication.signUp.hasAccount' : 'authentication.signIn.noAccount')}</Text>
        <TouchableOpacity 
          style={switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={[switchButtonText, { color: colors.primary }]}>
            {t(isSignUp ? 'authentication.signUp.signInLink' : 'authentication.signIn.signUpLink')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

