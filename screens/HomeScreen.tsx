import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import generalStyles from '../styles/generalStyles'; // Import styles

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

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleTrackProgress = () => {
    navigation.navigate('TrackProgress');
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
      style={generalStyles.removeButton}
      onPress={() => removeHabit(id)}
    >
      <Text style={generalStyles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  );

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={generalStyles.habitContainer}>
        <TouchableOpacity style={generalStyles.habitHeader} onPress={() => toggleExpand(item.id)}>
          <Text style={generalStyles.habitTitle}>{item.name}</Text>
          <Text style={generalStyles.arrow}>{expandedItem === item.id ? '▼' : '►'}</Text>
        </TouchableOpacity>
        {expandedItem === item.id && (
          <Text style={generalStyles.habitDetails}>{item.details}</Text>
        )}
      </View>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Upper Half for Habits */}
      <View>
        <Text style={generalStyles.header}>Habits</Text>
        {/* List of Habits */}
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={item => item.id}
          style={{ flexGrow: 0 }} // Prevents FlatList from expanding to fill the container
        />
        {/* Centered Button for Adding Habit */}
        <View style={generalStyles.centeredButtonContainer}>
          <TouchableOpacity style={generalStyles.button} onPress={handleAddHabit}>
            <Text style={generalStyles.buttonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
