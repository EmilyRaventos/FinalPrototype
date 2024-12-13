import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import HabitCreationScreen from './screens/HabitCreationScreen';
import TrackProgressScreen from './screens/TrackProgressScreen';
import ViewProgressScreen from './screens/ViewProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDB } from './db';
import React, { useEffect } from 'react';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HabitStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomePage" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateHabit" component={HabitCreationScreen} options={{ headerShown: true, headerTitle: '' }}/>
      <Stack.Screen name="TrackProgress" component={TrackProgressScreen} options={{ headerShown: true, headerTitle: '' }}/>
      <Stack.Screen name="ViewProgress" component={ViewProgressScreen} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <HabitStack/>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
