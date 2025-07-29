import { AntDesign, Feather } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOut, isLoading } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const getProviderIcon = () => {
    switch (user?.provider) {
      case 'google':
        return <AntDesign name="google" size={24} color="#4285F4" />;
      case 'github':
        return <AntDesign name="github" size={24} color="#24292e" />;
      default:
        return null;
    }
  };

  const getProviderName = () => {
    switch (user?.provider) {
      case 'google': return 'Google';
      case 'github': return 'GitHub';
      default: return 'Desconhecido';
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Feather name="lock" size={64} color="#8D8D99" />
          <Text style={styles.notLoggedInText}>
            Você precisa fazer login para acessar esta tela
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header de Boas-vindas */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bem-vindo!</Text>
          <Text style={styles.userName}>{user?.name} 👋</Text>
        </View>

        {/* Card do Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </Text>
                </View>
              )}
              <View style={styles.providerBadge}>
                {getProviderIcon()}
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.providerText}>
                Conectado via {getProviderName()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Provedor:</Text>
              <View style={styles.providerRow}>
                {getProviderIcon()}
                <Text style={styles.infoValue}>{getProviderName()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          disabled={isLoading}
        >
          <Feather name="log-out" size={20} color="#F75A68" />
          <Text style={styles.logoutButtonText}>
            {isLoading ? 'Saindo...' : 'Sair da Conta'}
          </Text>
        </TouchableOpacity>
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
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#8D8D99',
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#8D8D99',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#121214',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00875F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  providerBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121214',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8D8D99',
    marginBottom: 8,
  },
  providerText: {
    fontSize: 12,
    color: '#8D8D99',
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E6',
    marginVertical: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8D8D99',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121214',
    marginLeft: 8,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00875F20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00875F',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00875F',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F75A68',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F75A68',
  },
});
