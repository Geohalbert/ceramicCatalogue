import { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signInThunk, signUpThunk, signOutThunk, setUser, clearError } from "../store/authSlice";
import { onAuthChange } from "../services/authService";

import HomeStyles from "../screens/styles/HomeStyles";

interface AuthenticationProps {
  onAuthenticated?: () => void;
}

export default function Authentication({ onAuthenticated }: AuthenticationProps) {
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

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

  // Clear error when switching between sign in/up
  useEffect(() => {
    dispatch(clearError());
  }, [isSignUp, dispatch]);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (isSignUp && !displayName.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      if (isSignUp) {
        await dispatch(signUpThunk({ email, password, displayName })).unwrap();
        Alert.alert("Success", "Account created successfully!");
      } else {
        await dispatch(signInThunk({ email, password })).unwrap();
        Alert.alert("Success", "Signed in successfully!");
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
      Alert.alert("Error", error.message || "Authentication failed");
    }
  };

  const handleSignOut = async () => {
    try {
      await dispatch(signOutThunk()).unwrap();
      Alert.alert("Success", "Signed out successfully!");
    } catch (error: any) {
      Alert.alert("Error", "Failed to sign out");
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
    errorText
  } = HomeStyles;

  // Authenticated view - User info and sign out
  if (isAuthenticated && user) {
    return (
      <View style={authContainer}>
        <Text style={welcomeText}>Welcome back, {user.displayName || user.email}!</Text>
        <TouchableOpacity style={signOutButton} onPress={handleSignOut}>
          <Text style={signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Unauthenticated view - Sign In/Sign Up form
  return (
    <View style={authContainer}>
      <Text style={authTitle}>{isSignUp ? "Create Account" : "Sign In"}</Text>
      
      {error && <Text style={errorText}>{error}</Text>}
      
      {isSignUp && (
        <TextInput
          style={input}
          placeholder="Name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      )}
      
      <TextInput
        style={input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        style={input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      
      <TouchableOpacity 
        style={button} 
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={buttonText}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={switchText}>
        <Text>{isSignUp ? "Already have an account?" : "Don't have an account?"}</Text>
        <TouchableOpacity 
          style={switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={switchButtonText}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

