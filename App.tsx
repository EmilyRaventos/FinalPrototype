// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import HabitCreationScreen from './screens/HabitCreationScreen';
import TrackProgressScreen from './screens/TrackProgressScreen'; 
import ViewProgressScreen  from './screens/ViewProgressScreen'; 
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HabitStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Your Habits' }} />
      <Stack.Screen name="CreateHabit" component={HabitCreationScreen} options={{ title: 'Create Habit' }} />
      <Stack.Screen name="TrackProgress" component={TrackProgressScreen} options={{ title: 'Track Progress' }} />
      <Stack.Screen name="ViewProgress" component={ViewProgressScreen} options={{ title: 'View Progress' }} />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HabitStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" color={color} size={size} />
            ),
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
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
