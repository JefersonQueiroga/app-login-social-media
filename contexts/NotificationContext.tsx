import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface NotificationContextData {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  isLoading: boolean;
  requestPermissions: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

// Configurar como as notificações devem ser exibidas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      // Propriedades para versões mais recentes (opcionais)
      shouldShowBanner: true,
      shouldShowList: true,
    } as Notifications.NotificationBehavior;
  },
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token || null);
      setIsLoading(false);
    });

    // Listener para notificações recebidas quando o app está em primeiro plano
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener para quando o usuário toca em uma notificação
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notificação tocada:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Não foi possível obter permissão para notificações push!'
        );
        return null;
      }
      
      try {
        const projectId = '29e863f9-beb9-4ebd-b9b8-e7c7dd15b7db'; // Seu project ID do EAS
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Token de push:', token);
      } catch (error) {
        console.error('Erro ao obter token:', error);
        return null;
      }
    } else {
      Alert.alert('Erro', 'Deve usar um dispositivo físico para push notifications');
      return null;
    }

    return token;
  }

  async function requestPermissions() {
    try {
      setIsLoading(true);
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        isLoading,
        requestPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
}