import { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import * as Google from 'expo-auth-session/providers/google';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signInThunk, signUpThunk, signOutThunk, signInWithGoogleThunk, setUser, clearError } from "../store/authSlice";
import { onAuthChange, resetPassword, createGoogleAuthConfig } from "../services/authService";

import HomeStyles from "../screens/styles/HomeStyles";

interface AuthenticationProps {
  onAuthenticated?: () => void;
}

export default function Authentication({ onAuthenticated }: AuthenticationProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Configure Google authentication with Expo
  const googleConfig = createGoogleAuthConfig();
  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);

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

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('authentication.errors.fillAllFields'));
      return;
    }

    if (isSignUp && !displayName.trim()) {
      Alert.alert(t('common.error'), t('authentication.errors.enterName'));
      return;
    }

    try {
      if (isSignUp) {
        await dispatch(signUpThunk({ email, password, displayName })).unwrap();
        Alert.alert(t('common.success'), t('authentication.signUp.successMessage'));
      } else {
        await dispatch(signInThunk({ email, password })).unwrap();
        Alert.alert(t('common.success'), t('authentication.signIn.successMessage'));
      }
      
      // Clear form
      setEmail("");
      setPassword("");
      setDisplayName("");
      
      // Call optional callback
      if (onAuthenticated) {
        onAuthenticated();
      }
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
      
      // Call optional callback
      if (onAuthenticated) {
        onAuthenticated();
      }
    } catch (error: any) {
      // Don't show alert if user cancelled
      if (error.message !== 'Sign in cancelled') {
        Alert.alert(t('common.error'), error.message || t('authentication.errors.googleSignInFailed'));
      }
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
      <View style={authContainer}>
        <Text style={welcomeText}>{t('authentication.welcome', { name: user.displayName || user.email })}</Text>
        <TouchableOpacity style={signOutButton} onPress={handleSignOut}>
          <Text style={signOutButtonText}>{t('authentication.signOut.button')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Forgot Password view
  if (isForgotPassword) {
    return (
      <View style={authContainer}>
        <Text style={authTitle}>{t('authentication.forgotPassword.title')}</Text>
        
        <Text style={{ marginBottom: 15, color: '#666', textAlign: 'center' }}>
          {t('authentication.forgotPassword.description')}
        </Text>
        
        <TextInput
          style={input}
          placeholder={t('authentication.signIn.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        <TouchableOpacity 
          style={button} 
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
          <Text style={forgotPasswordText}>{t('authentication.forgotPassword.backLink')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Unauthenticated view - Sign In/Sign Up form
  return (
    <View style={authContainer}>
      <Text style={authTitle}>{t(isSignUp ? 'authentication.signUp.title' : 'authentication.signIn.title')}</Text>
      
      {error && <Text style={errorText}>{error}</Text>}
      
      {/* Google Sign-In Button */}
      <TouchableOpacity 
        style={googleButton} 
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#333" />
        ) : (
          <>
            <Text style={{ fontSize: 18, marginRight: 10 }}>G</Text>
            <Text style={googleButtonText}>{t('authentication.google.button')}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={dividerContainer}>
        <View style={dividerLine} />
        <Text style={dividerText}>{t('authentication.google.divider')}</Text>
        <View style={dividerLine} />
      </View>
      
      {isSignUp && (
        <TextInput
          style={input}
          placeholder={t('authentication.signUp.namePlaceholder')}
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      )}
      
      <TextInput
        style={input}
        placeholder={t('authentication.signIn.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        style={input}
        placeholder={t('authentication.signIn.passwordPlaceholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      
      {!isSignUp && (
        <TouchableOpacity 
          style={forgotPasswordLink}
          onPress={() => setIsForgotPassword(true)}
        >
          <Text style={forgotPasswordText}>{t('authentication.signIn.forgotPasswordLink')}</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={button} 
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
        <Text>{t(isSignUp ? 'authentication.signUp.hasAccount' : 'authentication.signIn.noAccount')}</Text>
        <TouchableOpacity 
          style={switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={switchButtonText}>
            {t(isSignUp ? 'authentication.signUp.signInLink' : 'authentication.signIn.signUpLink')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

