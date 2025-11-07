import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import app from '../config/firebase';

const auth = getAuth(app);

// Required for Expo WebBrowser
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (email: string, password: string, displayName?: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with Google using Expo AuthSession
 * Note: This uses expo-auth-session which works with Expo Go
 * 
 * IMPORTANT: You need to configure OAuth 2.0 Client IDs in Google Cloud Console
 * See GOOGLE_SIGNIN_SETUP.md for detailed instructions
 */
export const signInWithGoogle = async (request: any, promptAsync: any): Promise<User> => {
  try {
    const result = await promptAsync();
    
    if (result?.type === 'cancel') {
      throw new Error('Sign in cancelled');
    }
    
    if (result?.type === 'success' && result.params.id_token) {
      const { id_token } = result.params;
      
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(id_token);
      
      // Sign in with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      return userCredential.user;
    }
    
    throw new Error('Failed to sign in with Google');
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    
    if (error.message === 'Sign in cancelled') {
      throw error;
    }
    
    throw new Error('Failed to sign in with Google');
  }
};

/**
 * Create Google authentication request configuration
 * This should be called in the component using useAuthRequest hook
 */
export const createGoogleAuthConfig = () => {
  return {
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  };
};

/**
 * Get the current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Listen to authentication state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'An error occurred. Please try again';
  }
};

export { auth };

