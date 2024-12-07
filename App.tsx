import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import HabitCreationScreen from './screens/HabitCreationScreen';
import TrackProgressScreen from './screens/TrackProgressScreen';
import ViewProgressScreen from './screens/ViewProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';
import Icon from 'react-native-vector-icons/Ionicons';
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
      <Stack.Screen name="CreateHabit" component={HabitCreationScreen} />
      <Stack.Screen name="TrackProgress" component={TrackProgressScreen} />
      <Stack.Screen name="ViewProgress" component={ViewProgressScreen} />
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
          {/* <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
              tabBarStyle: {
                display: route.name === 'AuthScreen' || route.name === 'Profile' ? 'none' : 'flex', // Hide tab bar on AuthScreen and Profile
              },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HabitStack} // This uses the HabitStack as a component
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="home-outline" color={color} size={size} />
                ),
                headerShown: false, // Prevent the header from showing here as it's handled by the stack
              }}
            />
            <Tab.Screen
              name="Create Habit"
              component={HabitCreationScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="add-circle-outline" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Track Progress"
              component={TrackProgressScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="clipboard" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="View Progress"
              component={ViewProgressScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="calendar" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator> */}
          <HabitStack/>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
