import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import generalStyles from '../styles/generalStyles'; // Import styles
import { db } from '../db';

interface Habit {
  habit_id: number;
  user_id: number;
  title: string;
  description: string; 
  start_date: string;
  category: string;
  status: string;
}

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // State to track which items are expanded
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id); 
  };

  const fetchHabits = () => {
    let userId = 1; // come back and change it based on login.
    try {
      const results = db.getAllSync('SELECT * FROM Habit WHERE user_id= ?', [userId]) as Habit[];
      setHabits(results);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const removeHabit = (id: number) => {
    try {
      db.runSync('DELETE FROM Habit WHERE habit_id = ?', [id]);
      setHabits(habits.filter(habit => habit.habit_id !== id)); // Optimistically update the state
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  useEffect(() => {
    fetchHabits();
  }, []);

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
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={item => item.habit_id.toString()}
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
