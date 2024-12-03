import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import generalStyles from '../styles/generalStyles'; // Import styles

import * as SQLite from 'expo-sqlite';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  
  // get list of habits from db
  // const db = SQLite.openDatabaseSync('mySQLiteDB.db');
  // let habits: Habit[] = db.getAllSync('SELECT * FROM Habit;');
  interface Habit {
    habit_id: number;
    user_id: number;
    title: string;
    description: string; 
    start_date: string;
    category: string;
    status: string;
  }

  const [habits, setHabits] = useState<Habit[]>([
    {
      habit_id: 1, 
      user_id: 1, 
      title: 'test-title-',
       description: 'test-description-',
        start_date: '12-03-2024', 
        category: 'test-category',
        status: 'test-status-'
      },
    {
      habit_id: 1, 
      user_id: 1, 
      title: 'test-title-', 
      description: 'test-description-', 
      start_date: '12-03-2024', 
      status: 'test-status-', 
      category: 'test-category'
    }
  ]);

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleTrackProgress = () => {
    navigation.navigate('TrackProgress');
  };

  const removeHabit = (id: number) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.habit_id !== id));
    // TODO: save/update new list of habits.
  };

  // State to track which items are expanded
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id); 
  };

  const renderRightActions = (id: number) => (
    <TouchableOpacity
      style={generalStyles.removeButton}
      onPress={() => removeHabit(id)}
    >
      <Text style={generalStyles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  );

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <ReanimatedSwipeable renderRightActions={() => renderRightActions(item.habit_id)}>
      <View style={generalStyles.habitContainer}>
        <TouchableOpacity style={generalStyles.habitHeader} onPress={() => toggleExpand(item.habit_id)}>
          <Text style={generalStyles.habitTitle}>{item.title}</Text>
          <Text style={generalStyles.arrow}>{expandedItem === item.habit_id ? '▼' : '►'}</Text>
        </TouchableOpacity>
        {expandedItem === item.habit_id && (
          <Text style={generalStyles.habitDetails}>{item.description}</Text>
        )}
      </View>
    </ReanimatedSwipeable>
  );

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={generalStyles.header}>Habits</Text>
        {/* List of Habits */}
        {/* <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={item => item.habit_id.toString()}
          style={{ flexGrow: 0 }} // Prevents FlatList from expanding to fill the container
        /> */}
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
