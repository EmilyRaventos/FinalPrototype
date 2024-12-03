import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { initializeDatabase } from './database'; // Import the database setup function
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import HabitCreationScreen from './screens/HabitCreationScreen';
import TrackProgressScreen from './screens/TrackProgressScreen';
import ViewProgressScreen from './screens/ViewProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';
import CustomHeader from './components/CustomHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


import * as SQLite from 'expo-sqlite';

// const db = SQLite.openDatabaseSync('mySQLiteDB.db');
// db.execSync('SELECT * FROM category;');
// db.transaction(tx => {
//   tx.executeSql(
//     'SELECT * FROM Category;'
//   );
// });

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HabitStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomeScreen}
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen name="CreateHabit" component={HabitCreationScreen} options={{ title: 'Create Habit' }} />
      <Stack.Screen name="TrackProgress" component={TrackProgressScreen} options={{ title: 'Track Progress' }} />
      <Stack.Screen name="ViewProgress" component={ViewProgressScreen} options={{ title: 'View Progress' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ title: 'AuthScreen' }} />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
            }}
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
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
