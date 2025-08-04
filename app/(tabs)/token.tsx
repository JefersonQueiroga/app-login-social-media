import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '../../contexts/NotificationContext';

export default function TokenScreen() {
  const { expoPushToken, isLoading, requestPermissions } = useNotification();
  const [copying, setCopying] = useState(false);

  const copyToken = async () => {
    if (!expoPushToken) return;
    
    try {
      setCopying(true);
      await Clipboard.setStringAsync(expoPushToken);
      Alert.alert('Sucesso!', 'Token copiado para a área de transferência');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o token');
    } finally {
      setCopying(false);
    }
  };

  const formatToken = (token: string) => {
    // Quebra o token em linhas menores para melhor visualização
    const chunks = token.match(/.{1,40}/g) || [];
    return chunks.join('\n');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Feather name="bell" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Push Token</Text>
          <Text style={styles.subtitle}>
            Token para receber notificações push
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <Feather 
              name={expoPushToken ? "check-circle" : "alert-circle"} 
              size={20} 
              color={expoPushToken ? "#00875F" : "#F75A68"} 
            />
            <Text style={styles.statusTitle}>
              Status da Notificação
            </Text>
          </View>
          
          <Text style={[
            styles.statusText,
            { color: expoPushToken ? "#00875F" : "#F75A68" }
          ]}>
            {isLoading 
              ? "Carregando..." 
              : expoPushToken 
                ? "✅ Configurado com sucesso" 
                : "❌ Token não disponível"
            }
          </Text>

          {!expoPushToken && !isLoading && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={requestPermissions}
            >
              <Feather name="refresh-cw" size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Token Card */}
        {expoPushToken && (
          <View style={styles.card}>
            <View style={styles.tokenHeader}>
              <Text style={styles.cardTitle}>Seu Token</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToken}
                disabled={copying}
              >
                <Feather 
                  name={copying ? "loader" : "copy"} 
                  size={16} 
                  color="#00875F" 
                />
                <Text style={styles.copyButtonText}>
                  {copying ? "Copiando..." : "Copiar"}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenText}>
                {formatToken(expoPushToken)}
              </Text>
            </View>
          </View>
        )}

        {/* Instruções */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como usar?</Text>
          
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Copie o token acima tocando no botão Copiar
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Envie o token para o professor via WhatsApp ou email
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Mantenha o app instalado para receber as notificações
              </Text>
            </View>
          </View>
        </View>

        {/* Informações técnicas */}
        <View style={styles.infoCard}>
          <Feather name="info" size={16} color="#8D8D99" />
          <Text style={styles.infoText}>
            Este token é único para seu dispositivo e será usado para enviar 
            notificações push específicas para você.
          </Text>
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
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121214',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#00875F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121214',
    marginBottom: 12,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00875F20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  copyButtonText: {
    color: '#00875F',
    fontSize: 12,
    fontWeight: '600',
  },
  tokenContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E6',
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#121214',
    lineHeight: 18,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00875F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#8D8D99',
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#8D8D99',
    lineHeight: 18,
  },
});