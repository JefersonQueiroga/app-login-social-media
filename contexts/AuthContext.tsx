import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  provider: 'google';
}

interface AuthContextData {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    configureGoogleSignIn();
    loadStoredUser();
  }, []);

  function configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: '331594167804-4qgvncnrmc78aude5auvn9s01iacm5bd.apps.googleusercontent.com', // Substitua pelo seu
      iosClientId: '331594167804-5ffcphusqkjj545l8o067e4m4ev0apmu.apps.googleusercontent.com', // Substitua pelo seu
      offlineAccess: true,
    });
  }

  async function loadStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem('@social_login:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      setIsLoading(true);
      
      // Verifica se o Google Play Services está disponível
      await GoogleSignin.hasPlayServices();
      
      // Faz o login
      const userInfo = await GoogleSignin.signIn();
      
      if (userInfo.data?.user) {
        const googleUser: User = {
          id: userInfo.data.user.id,
          name: userInfo.data.user.name || '',
          email: userInfo.data.user.email,
          photo: userInfo.data.user.photo || undefined,
          provider: 'google',
        };

        setUser(googleUser);
        await AsyncStorage.setItem('@social_login:user', JSON.stringify(googleUser));
      }
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Login cancelado pelo usuário');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Login já em progresso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services não disponível');
      } else {
        throw new Error('Falha ao fazer login com Google');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
      
      // Sign out do Google
      await GoogleSignin.signOut();
      
      setUser(null);
      await AsyncStorage.removeItem('@social_login:user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}