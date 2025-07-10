import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, signInUser, createUser, signOutUser, getUserData, signInWithGoogle, getGoogleRedirectResult } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Google redirect result
    const checkRedirectResult = async () => {
      const result = await getGoogleRedirectResult();
      if (result.success) {
        // User signed in via redirect
        const userDataResult = await getUserData(result.user.uid);
        if (userDataResult.success) {
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            name: userDataResult.data.name,
            role: userDataResult.data.role || 'user',
            photoURL: result.user.photoURL
          });
        } else {
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName || 'User',
            role: 'user',
            photoURL: result.user.photoURL
          });
        }
      }
    };

    checkRedirectResult();

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDataResult = await getUserData(firebaseUser.uid);
        if (userDataResult.success) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userDataResult.data.name,
            role: userDataResult.data.role || 'user',
            photoURL: firebaseUser.photoURL
          });
        } else {
          // Fallback to basic user data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            role: 'user',
            photoURL: firebaseUser.photoURL
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInUser(email, password);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const result = await createUser(email, password, name);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 