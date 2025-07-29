import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { oauthConfig } from '../services/oauthConfig';

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: 'google' | 'github';
}

interface AuthContextData {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

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

      // Configurar requisição OAuth Google
      const request = new AuthSession.AuthRequest({
        clientId: oauthConfig.google.clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({ scheme: 'socialloginapp' }),
        responseType: AuthSession.ResponseType.Code,
        state: Crypto.randomUUID(),
        codeChallenge: await AuthSession.AuthRequest.makeCodeChallengeAsync(),
        usePKCE: true,
      });

      // Fazer login
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success' && result.params.code) {
        // Trocar código por token de acesso
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: oauthConfig.google.clientId,
            code: result.params.code,
            grant_type: 'authorization_code',
            redirect_uri: request.redirectUri,
            code_verifier: request.codeVerifier || '',
          }).toString(),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          // Buscar dados do usuário
          const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });

          const userData = await userResponse.json();

          // Criar objeto de usuário
          const googleUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            provider: 'google',
          };

          setUser(googleUser);
          await AsyncStorage.setItem('@social_login:user', JSON.stringify(googleUser));
        }
      }
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      throw new Error('Falha ao fazer login com Google');
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGitHub() {
    try {
      setIsLoading(true);

      // Configurar requisição OAuth GitHub
      const request = new AuthSession.AuthRequest({
        clientId: oauthConfig.github.clientId,
        scopes: ['user:email', 'read:user'],
        redirectUri: AuthSession.makeRedirectUri({ scheme: 'socialloginapp' }),
        responseType: AuthSession.ResponseType.Code,
        state: Crypto.randomUUID(),
      });

      // Fazer login
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      });

      if (result.type === 'success' && result.params.code) {
        // Trocar código por token de acesso
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: oauthConfig.github.clientId,
            client_secret: oauthConfig.github.clientSecret,
            code: result.params.code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          // Buscar dados do usuário
          const userResponse = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });

          const userData = await userResponse.json();

          // Buscar email (pode ser privado)
          const emailResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });

          const emailData = await emailResponse.json();
          const primaryEmail = emailData.find((email: any) => email.primary)?.email || userData.email;

          // Criar objeto de usuário
          const githubUser: User = {
            id: userData.id.toString(),
            name: userData.name || userData.login,
            email: primaryEmail || '',
            picture: userData.avatar_url,
            provider: 'github',
          };

          setUser(githubUser);
          await AsyncStorage.setItem('@social_login:user', JSON.stringify(githubUser));
        }
      }
    } catch (error: any) {
      console.error('Erro no login com GitHub:', error);
      throw new Error('Falha ao fazer login com GitHub');
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
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
        signInWithGitHub,
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