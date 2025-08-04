import { Feather } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 📱 PASSO 1: Configurar como as notificações aparecem na tela
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,    // Mostrar popup
    shouldPlaySound: true,    // Tocar som
    shouldSetBadge: false,    // Badge no ícone
    shouldShowBanner: true,   // Banner no topo
    shouldShowList: true,     // Lista de notificações
  }),
});

export default function NotificationsScreen() {
  // 🎯 ESTADOS: Variáveis que mudam na tela
  const [temPermissao, setTemPermissao] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // 🚀 PASSO 2: Quando a tela carrega, pedir permissão
  useEffect(() => {
    pedirPermissao();
  }, []);

  // 🔐 FUNÇÃO: Pedir permissão para notificações
  async function pedirPermissao() {
    try {
      // Verificar se já tem permissão
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        // Se não tem, pedir permissão
        const { status: novoStatus } = await Notifications.requestPermissionsAsync();
        setTemPermissao(novoStatus === 'granted');
      } else {
        setTemPermissao(true);
      }
    } catch (error) {
      console.log('Erro ao pedir permissão:', error);
      setTemPermissao(false);
    } finally {
      setCarregando(false);
    }
  }

  // 🔔 FUNÇÃO: Criar notificação em 5 segundos
  async function criarNotificacao() {
    if (!temPermissao) {
      Alert.alert('Ops!', 'Você precisa permitir as notificações primeiro.');
      return;
    }

    try {
      // Configurar quando a notificação vai aparecer
      const quando: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,      // 5 segundos
        repeats: false,  // Não repetir
      };

      // Criar a notificação
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Olá!',
          body: 'Sua primeira notificação funcionou!',
          sound: true,
        },
        trigger: quando,
      });

      Alert.alert('Sucesso!', 'Notificação criada! Aguarde 5 segundos.');
    } catch (error) {
      console.log('Erro ao criar notificação:', error);
      Alert.alert('Erro', 'Não conseguimos criar a notificação.');
    }
  }

  // ⚡ FUNÇÃO: Criar notificação instantânea
  async function criarNotificacaoInstantanea() {
    if (!temPermissao) {
      Alert.alert('Ops!', 'Você precisa permitir as notificações primeiro.');
      return;
    }

    try {
      // Configurar para aparecer em 1 segundo (quase instantâneo)
      const agora: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,      // 1 segundo
        repeats: false,  // Não repetir
      };

      // Criar a notificação
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notificação Instantânea!',
          body: 'Olá, essa foi uma notificação rápida!',
          sound: true,
        },
        trigger: agora,
      });
      
    } catch (error) {
      console.log('Erro ao criar notificação instantânea:', error);
      Alert.alert('Erro', 'Não conseguimos criar a notificação instantânea.');
    }
  }

  // 🎨 INTERFACE: O que aparece na tela
  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#00875F" />
          <Text style={styles.textoCarregando}>Verificando permissões...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        
        {/* 🎯 TÍTULO */}
        <View style={styles.cabecalho}>
          <View style={styles.icone}>
            <Feather name="bell" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.titulo}>Minha Primeira Notificação</Text>
          <Text style={styles.subtitulo}>Aprendendo notificações no React Native</Text>
        </View>

        {/* ✅ STATUS DAS PERMISSÕES */}
        <View style={styles.cartao}>
          <View style={styles.linha}>
            <Feather 
              name={temPermissao ? "check-circle" : "x-circle"} 
              size={24} 
              color={temPermissao ? "#00875F" : "#F75A68"} 
            />
            <Text style={[
              styles.textoPermissao,
              { color: temPermissao ? "#00875F" : "#F75A68" }
            ]}>
              {temPermissao ? 'Permissões OK!' : 'Sem permissão'}
            </Text>
          </View>

          {!temPermissao && (
            <TouchableOpacity style={styles.botaoPermissao} onPress={pedirPermissao}>
              <Text style={styles.textoBotaoPermissao}>Pedir Permissão</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.containerBotoes}>
          <TouchableOpacity
            style={[
              styles.botaoPrincipal,
              !temPermissao && styles.botaoDesabilitado
            ]}
            onPress={criarNotificacao}
            disabled={!temPermissao}
          >
            <Feather name="clock" size={24} color="#FFFFFF" />
            <Text style={styles.textoBotaoPrincipal}>
              Notificação em 5s
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoInstantaneo,!temPermissao && styles.botaoDesabilitado ]}
            onPress={criarNotificacaoInstantanea}
            disabled={!temPermissao}
          >
            <Feather name="zap" size={24} color="#FFFFFF" />
            <Text style={styles.textoBotaoPrincipal}>
              Notificação Agora!
            </Text>
          </TouchableOpacity>
        </View>
      
      </View>
    </SafeAreaView>
  );
}

// 🎨 ESTILOS: Como cada elemento vai aparecer
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  conteudo: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  textoCarregando: {
    fontSize: 16,
    color: '#8D8D99',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icone: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#00875F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#121214',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#8D8D99',
    textAlign: 'center',
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  textoPermissao: {
    fontSize: 18,
    fontWeight: '600',
  },
  botaoPermissao: {
    backgroundColor: '#00875F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoPermissao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  botaoPrincipal: {
    backgroundColor: '#00875F',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#00875F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
  },
  containerBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  botaoInstantaneo: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
  },
  botaoDesabilitado: {
    backgroundColor: '#8D8D99',
    shadowOpacity: 0,
    elevation: 0,
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  explicacao: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tituloExplicacao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121214',
    marginBottom: 12,
  },
  textoExplicacao: {
    fontSize: 14,
    color: '#8D8D99',
    lineHeight: 20,
  },
});