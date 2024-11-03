// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import HabitCreationScreen from './screens/HabitCreationScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Your Habits' }} />
        <Stack.Screen name="CreateHabit" component={HabitCreationScreen} options={{ title: 'Create Habit' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
