import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';

export default function TrainerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="students"
        options={{ title: 'Alunos', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="attendance"
        options={{ title: 'Presença', tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="ranking"
        options={{ title: 'Ranking', tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
      />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}
