import { AntDesign, Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { user, signInWithGoogle, isLoading } = useAuth();
  const [loginLoading, setLoginLoading] = useState(false);

  if (user) {
    return <Redirect href="/" />;
  }

  async function handleGoogleLogin() {
    try {
      setLoginLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(
        'Erro no Login',
        error.message || 'Falha ao fazer login com Google'
      );
    } finally {
      setLoginLoading(false);
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
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>
            Faça login para continuar
          </Text>
        </View>

        {/* Botão do Google */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isLoading || loginLoading}
        >
          <View style={styles.buttonContent}>
            {loginLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AntDesign name="google" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.buttonText}>
              {loginLoading ? 'Entrando...' : 'Continuar com Google'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoCard}>
          <Feather name="shield" size={20} color="#00875F" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Login Seguro</Text>
            <Text style={styles.infoText}>
              Seus dados são protegidos. Usamos autenticação segura do Google.
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
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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