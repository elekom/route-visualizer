import React, { useState, useEffect, useContext, createContext } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';

const AuthContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const auth = getAuth();
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setUser(user);
        setIsLoggedIn(true);
        sessionStorage.setItem('token', user.accessToken);
      })
      .catch((error) => {
        console.log(error)
        return error;
      });

  }

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        setUser(response.user);
        setIsLoggedIn(true);
        return response.user;
      });
  };

  const signout = () => {
    return signOut(auth)
      .then(() => {
        setUser(false);
        setIsLoggedIn(false);
        sessionStorage.setItem('token', null);
      });
  };

  const sendPasswordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code, password) => {
    return confirmPasswordReset(auth, code, password)
      .then(() => {
        return true;
      });
  };
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(false);
        setIsLoggedIn(false);
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  });

  // Return the user object and auth methods
  return {
    user,
    isLoggedIn,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}