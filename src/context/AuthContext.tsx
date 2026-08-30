  import React, { createContext, useContext, useEffect, useState } from 'react';
  import { 
    User, 
    onAuthStateChanged, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as fbSignOut
  } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../lib/firebase';

  export interface UserProfile {
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    photoURL?: string;
  }

  interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    isAdmin: boolean;
    loading: boolean;
    loginAdmin: (email: string, pass: string) => Promise<void>;
    loginStudent: (email: string, pass: string) => Promise<void>;
    signupStudent: (name: string, email: string, pass: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          let adminStatus = false;
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            adminStatus = adminDoc.exists();
          } catch (err) {
            console.error('Error checking admin status:', err);
          }
          setIsAdmin(adminStatus);
          setUserProfile({
            displayName: user.displayName || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            photoURL: user.photoURL || '',
            role: adminStatus ? 'admin' : 'student'
          });
        } else {
          setUserProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return unsubscribe;
    }, []);

    const loginAdmin = async (email: string, pass: string) => {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      
      // Verify admin status directly
      let adminStatus = false;
      try {
        const adminDoc = await getDoc(doc(db, 'admins', userCred.user.uid));
        adminStatus = adminDoc.exists();
      } catch (err) {
        console.error('Error checking admin status during login:', err);
      }

      if (!adminStatus) {
        await fbSignOut(auth);
        throw new Error('Access denied. You do not have administrator privileges.');
      }

      setIsAdmin(true);
      setCurrentUser(userCred.user);
    };

    const loginStudent = async (email: string, pass: string) => {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      setCurrentUser(userCred.user);
    };

    const signupStudent = async (name: string, email: string, pass: string) => {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim() && userCred.user) {
        await updateProfile(userCred.user, { displayName: name.trim() });
      }
      setCurrentUser(userCred.user);
    };

    const loginWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
    };

    const logout = async () => {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.error('Sign out error', err);
      }
      setCurrentUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    };

    return (
      <AuthContext.Provider value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        loginAdmin,
        loginStudent,
        signupStudent,
        loginWithGoogle,
        logout
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }
