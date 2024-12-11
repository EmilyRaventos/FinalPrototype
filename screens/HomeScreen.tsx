import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, SafeAreaView } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import { generalStyles } from '../styles/generalStyles'; 
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { 
  Habit, 
  getAllHabits, 
  removeHabitRecords,
  markComplete 
} from '../dbHelper';
import { Directions } from 'react-native-gesture-handler';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const route = useRoute();
  const { userId } = route.params as { userId: number }; // Get userId from route params
  console.log("Opening Home Screen 1: ");
  console.log(userId);
  
  const onProfilePress = () => {
    navigation.navigate('Profile', { userId: userId });
 }

 const onTrackProgressPress = () => {
  navigation.navigate('TrackProgress', { userId: userId });
 }

 const onViewProgressPress = () => {
  navigation.navigate('ViewProgress', { userId: userId });
 }

  // set to track when an item is expanded
  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id); 
  };

  const fetchHabits = (category = '') => {
    try {  
      const results: Habit[] = getAllHabits(category, userId); // db helper method
      console.log("Showing results for Home Screen 2 (habits): ")
      console.log(userId);
      console.log(results);
      setHabits(results || []); // Ensure habits is never null, default to an empty array
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]); // Set to an empty array on error to prevent rendering issues
    }
  };
  
  const removeHabit = (id: number) => {
    try {
      removeHabitRecords(id); // db helper method
      setHabits(habits.filter(habit => habit.habit_id !== id)); // Optimistically update the state
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const markHabitAsCompleted = (id: number) => {
    try {
      markComplete(id); // db helper method
      setHabits(habits.filter(habit => habit.habit_id !== id)); // Optimistically update the state
    } catch (error) {
      console.error('Error marking habit as completed:', error);
    }
  };

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit', { userId: userId });
  };

  const handleApplyFilters = () => {
    fetchHabits(selectedCategory);
    setFilterModalVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHabits();  // Fetch habits when the screen is focused
    }, [])
  );

  const renderRightActions = (id: number) => (
    <View style={{ flexDirection: 'row' }}>
      {/* Completed Button */}
      <TouchableOpacity
        style={generalStyles.completedButton}
        onPress={() => markHabitAsCompleted(id)}
      >
        <Text style={generalStyles.completedButtonText}>Completed</Text>
      </TouchableOpacity>
      {/* Remove Button */}
      <TouchableOpacity
        style={generalStyles.removeButton}
        onPress={() => removeHabit(id)}
      >
        <Text style={generalStyles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderHabitItem = ({ item }: { item: Habit }) => (
    <ReanimatedSwipeable renderRightActions={() => renderRightActions(item.habit_id)}>
      <View style={generalStyles.habitContainer}>
        <TouchableOpacity style={generalStyles.habitHeader} onPress={() => toggleExpand(item.habit_id)}>
          <Text style={generalStyles.habitTitle}>{item.title}</Text>
          <Text style={generalStyles.arrow}>{expandedItem === item.habit_id ? '▼' : '►'}</Text>
        </TouchableOpacity>
        {expandedItem === item.habit_id && (
          <View style={generalStyles.habitDetails}>
            <Text style={generalStyles.habitDetailText}>Description: {item.description}</Text>
            <Text style={generalStyles.habitDetailText}>Start Date: {item.start_date}</Text>
            <Text style={generalStyles.habitDetailText}>Category: {item.category}</Text>
          </View>
        )}
      </View>
    </ReanimatedSwipeable>
  );
  

return (
  <View style={{ paddingTop: 20, backgroundColor: 'white', flex: 1 }}>
    <SafeAreaView style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{paddingLeft: 10}}>
       <Text>Logo</Text>
      </View>
      <Text style={generalStyles.header}>Home</Text>
      <TouchableOpacity style={{paddingRight: 10}} onPress={onProfilePress}>
        <Icon name="person" size={30} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>

    {/* Header with Add button */}
    <View style={{ backgroundColor: 'white', paddingTop: 30, flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
      <TouchableOpacity onPress={handleAddHabit} style={{flexDirection: 'row'}}>
        <Icon name="add-circle-outline" size={24} color="gray" style={{ paddingRight: 5}}/>  
        <Text style={{ fontSize: 18}}>Add Habit</Text>
      </TouchableOpacity>
    </View>

    {/* Habit List */}
    {habits.length === 0 ? (
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: 'gray', fontSize: 16, textAlign: 'center' }}>
          No active habits. {"\n"} Click "Add Habit" to create new ones.
        </Text>
      </View>
    ) : (
      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={item => item.habit_id.toString()}
        initialNumToRender={10}
        windowSize={5}
        style={{ flex: 1 }}
      />
    )}
    <View style={{
      position: 'absolute',
      bottom: 0,
      width: '100%',
      flexDirection: 'column', // Stack bar and buttons vertically
      alignItems: 'center', // Center buttons horizontally
    }}>
      {/* Bar above the buttons */}
      <View style={{
        width: '100%',
        height: 0.75, 
        backgroundColor: 'black', 
        marginBottom: 10, 
      }} />
      {/* Buttons */}
      <SafeAreaView style={{ flexDirection: 'row', width: '100%' }}>
        <TouchableOpacity 
          style={{
            flex: 1, 
            alignItems: 'center', 
            padding: 20,
            justifyContent: 'center',
          }} 
          onPress={onTrackProgressPress}>
          <Icon name="clipboard" size={24} color="gray" />
          <Text style={{ fontSize: 18, color: 'black' }}>Track Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            flex: 1, 
            alignItems: 'center', 
            padding: 20,
            justifyContent: 'center',
          }} 
          onPress={onViewProgressPress}>
          <Icon name="calendar" size={24} color="gray" />
          <Text style={{ fontSize: 18, color: 'black' }}>View Progress</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>

  </View>
);
};

export default HomeScreen;
