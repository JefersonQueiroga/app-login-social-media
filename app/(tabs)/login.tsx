import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocialButton } from '../../components/SocialButton';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { user, signInWithGoogle, signInWithGitHub, isLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  if (user) {
    return <Redirect href="/" />;
  }

  async function handleSocialLogin(
    provider: 'google' | 'github',
    loginFunction: () => Promise<void>
  ) {
    try {
      setLoadingProvider(provider);
      await loginFunction();
    } catch (error: any) {
      Alert.alert(
        'Erro no Login',
        error.message || `Falha ao fazer login com ${provider}`
      );
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Feather name="users" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>
            Escolha uma opção para fazer login
          </Text>
        </View>

        {/* Botões de Login Social */}
        <View style={styles.socialContainer}>
          <SocialButton
            provider="google"
            isLoading={loadingProvider === 'google'}
            disabled={isLoading}
            onPress={() => handleSocialLogin('google', signInWithGoogle)}
          />

          <SocialButton
            provider="github"
            isLoading={loadingProvider === 'github'}
            disabled={isLoading}
            onPress={() => handleSocialLogin('github', signInWithGitHub)}
          />
        </View>

        {/* Informações de Segurança */}
        <View style={styles.infoCard}>
          <Feather name="shield" size={20} color="#00875F" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Login Seguro</Text>
            <Text style={styles.infoText}>
              Seus dados são protegidos. Usamos Google e GitHub para autenticação segura.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#00875F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#121214',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8D8D99',
    textAlign: 'center',
    lineHeight: 24,
  },
  socialContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#121214',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#8D8D99',
    lineHeight: 18,
  },
});