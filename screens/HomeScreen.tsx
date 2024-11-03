import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import styles from '../styles/styles'; // Import styles
import CustomHeader from '../components/CustomHeader';

interface Habit {
  id: string;
  name: string;
  details: string; // Add a details property
}

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Drink water', details: 'Aim for 8 glasses a day.' },
    { id: '2', name: 'Exercise', details: '30 minutes of activity daily.' },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState); // Toggle menu open/close
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile'); // Navigate to the Profile screen
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleTrackProgress = () => {
    navigation.navigate('TrackProgress');
  };

  const handleMenuPress = () => {
    // Logic for handling menu press (e.g., open a side menu)
    console.log('Menu pressed');
  };

  const handleProfilePress = () => {
    // Logic for handling profile press (e.g., navigate to profile screen)
    console.log('Profile pressed');
  };

  const removeHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  // State to track which items are expanded
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id); 
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.removeButton}
      onPress={() => removeHabit(id)}
    >
      <Text style={styles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  );

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.habitContainer}>
        <TouchableOpacity style={styles.habitHeader} onPress={() => toggleExpand(item.id)}>
          <Text style={styles.habitTitle}>{item.name}</Text>
          <Text style={styles.arrow}>{expandedItem === item.id ? '▼' : '►'}</Text>
        </TouchableOpacity>
        {expandedItem === item.id && (
          <Text style={styles.habitDetails}>{item.details}</Text>
        )}
      </View>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Upper Half for Habits */}
      <View>
        <Text style={styles.header}>Habits</Text>
        {/* List of Habits */}
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={item => item.id}
          style={{ flexGrow: 0 }} // Prevents FlatList from expanding to fill the container
        />
        {/* Centered Button for Adding Habit */}
        <View style={styles.centeredButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
            <Text style={styles.buttonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
