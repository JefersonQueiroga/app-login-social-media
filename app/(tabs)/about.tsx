import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Feather name="info" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Sobre o Projeto</Text>
          <Text style={styles.subtitle}>
            Demonstração de Login Social
          </Text>
        </View>

        {/* Descrição do Projeto */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que é este app?</Text>
          <Text style={styles.cardText}>
            Este aplicativo demonstra a implementação completa de autenticação social 
            usando React Native, Expo e Firebase. É um exemplo prático de como integrar 
            diferentes provedores de login em uma aplicação móvel moderna.
          </Text>
        </View>

        {/* Funcionalidades */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Funcionalidades</Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <AntDesign name="google" size={20} color="#4285F4" />
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Login com Google</Text>
                <Text style={styles.featureDescription}>
                  Autenticação via Google usando Firebase Auth
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome name="apple" size={20} color="#000000" />
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Sign in with Apple</Text>
                <Text style={styles.featureDescription}>
                  Login nativo Apple (disponível apenas no iOS)
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome name="linkedin-square" size={20} color="#0A66C2" />
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Login com LinkedIn</Text>
                <Text style={styles.featureDescription}>
                  Autenticação OAuth 2.0 com LinkedIn
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Feather name="shield" size={20} color="#00875F" />
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Segurança</Text>
                <Text style={styles.featureDescription}>
                  Sessões persistentes e logout seguro
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tecnologias */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tecnologias Utilizadas</Text>
          
          <View style={styles.techList}>
            <View style={styles.techItem}>
              <Text style={styles.techName}>React Native</Text>
              <Text style={styles.techVersion}>0.79.5</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>Expo</Text>
              <Text style={styles.techVersion}>~53.0.17</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>Firebase</Text>
              <Text style={styles.techVersion}>^11.1.0</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>TypeScript</Text>
              <Text style={styles.techVersion}>~5.8.3</Text>
            </View>
          </View>
        </View>

        {/* Links Úteis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Links Úteis</Text>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://docs.expo.dev/')}
          >
            <Feather name="external-link" size={16} color="#00875F" />
            <Text style={styles.linkText}>Documentação do Expo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://firebase.google.com/docs/auth')}
          >
            <Feather name="external-link" size={16} color="#00875F" />
            <Text style={styles.linkText}>Firebase Authentication</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://reactnative.dev/')}
          >
            <Feather name="external-link" size={16} color="#00875F" />
            <Text style={styles.linkText}>React Native</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desenvolvido com ❤️ usando React Native
          </Text>
          <Text style={styles.version}>v1.0.0</Text>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#00875F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#121214',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8D8D99',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121214',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#8D8D99',
    lineHeight: 20,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#121214',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#8D8D99',
    lineHeight: 16,
  },
  techList: {
    gap: 12,
  },
  techItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  techName: {
    fontSize: 14,
    color: '#121214',
    fontWeight: '500',
  },
  techVersion: {
    fontSize: 12,
    color: '#8D8D99',
    fontFamily: 'monospace',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#00875F',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#8D8D99',
    textAlign: 'center',
  },
  version: {
    fontSize: 10,
    color: '#8D8D99',
    fontFamily: 'monospace',
  },
});