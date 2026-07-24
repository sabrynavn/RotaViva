/**
 * App.js — Ponto de entrada do aplicativo RotaViva Logística.
 *
 * O app é construído com React Navigation (NativeStackNavigator)
 * e se conecta ao Supabase como backend.
 *
 * Estrutura de telas:
 *   1. ListaEntregas → listagem com abas Pendentes / Histórico
 *   2. DetalheEntrega → dados completos de uma entrega

 */

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/frontend/navigation/AppNavigator';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/frontend/screens/LoginScreen';
import ListaEntregasScreen from './src/frontend/screens/ListaEntregasScreen';
import FormularioEntregaScreen from './src/frontend/screens/FormularioEntregaScreen';
import DetalheEntregaScreen from './src/frontend/screens/DetalheEntregaScreen';
import ListaEntregadoresScreen from './src/frontend/screens/ListaEntregadoresScreen';
import FormularioEntregadorScreen from './src/frontend/screens/FormularioEntregadorScreen';

// Cria o "molde" de navegador em pilha
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      {/*
        SafeAreaProvider garante que o conteúdo não fique atrás
        da notch / barra de status em dispositivos modernos.
        Necessário para o react-navigation funcionar corretamente.
      */}
      <SafeAreaProvider>
    {/* NavigationContainer precisa envolver TUDO — é o que guarda o estado 
    de navegação (qual tela está no topo da pilha agora). */}
    <NavigationContainer>
      {/* initialRouteName define qual tela abre primeiro quando o app inicia */}
      <Stack.Navigator initialRouteName="ListaEntregas">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ListaEntregas" component={ListaEntregasScreen} />
        <Stack.Screen name="FormularioEntrega" component={FormularioEntregaScreen} />
        <Stack.Screen name="DetalheEntrega" component={DetalheEntregaScreen} />
        <Stack.Screen name="ListaEntregadores" component={ListaEntregadoresScreen} />
        <Stack.Screen name="FormularioEntregador" component={FormularioEntregadorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
   </SafeAreaProvider>

      {/*
        StatusBar do Expo: controla a aparência da bar de notificações do celular.
      */}
      <StatusBar style="light" />
    </>
  );
}