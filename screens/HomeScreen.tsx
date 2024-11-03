// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../styles/styles'; // Import styles

interface HomeScreenProps {
  navigation: any; // You can refine this type using `StackNavigationProp` from '@react-navigation/stack'
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleMenuPress = () => {
    // Logic for handling menu press (e.g., open a side menu)
    console.log('Menu pressed');
  };

  const handleTrackProgress = () => {
    navigation.navigate('TrackProgress');
  }

  const handleProfilePress = () => {
    // Logic for handling profile press (e.g., navigate to profile screen)
    console.log('Profile pressed');
  };

  return (
    <View style={{flex: 1 }}>
      <View style={styles.halfContainer}>
        <Text style={styles.header}>Habits</Text>
        <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
          <Text style={styles.buttonText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.halfContainer}>
        <Text style={styles.header}>Progress</Text>
        <TouchableOpacity style={styles.button} onPress={handleTrackProgress}>
          <Text style={styles.buttonText}>Track Progress</Text>
        </TouchableOpacity>
        {/* Add more UI elements to list habits here */}
      </View>
    </View>
  );
};

export default HomeScreen;
