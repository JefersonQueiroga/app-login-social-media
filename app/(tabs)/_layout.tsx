import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00875F',
        tabBarInactiveTintColor: '#8D8D99',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E1E1E6',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#121214',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Feather name="log-in" size={size} color={color} />
          ),
          href: user ? null : '/login',
        }}
      />

      <Tabs.Screen
        name="token"
        options={{
          title: 'Token',
          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, size }) => (
            <Feather name="info" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}