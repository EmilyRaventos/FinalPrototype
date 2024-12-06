import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, SafeAreaView } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import { generalStyles, colors } from '../styles/generalStyles'; // Import styles
import { useFocusEffect } from '@react-navigation/native';
import { 
  Habit, 
  getAllHabits, 
  removeHabitRecords,
  markComplete 
} from '../dbHelper';
// import { useRoute } from '@react-navigation/native';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // const route = useRoute();
  // const number = route.params?.number;
  const userId = 1; // Replace with dynamic user ID
  
  const onProfilePress = () => {
    navigation.navigate('Profile');
 }

  // set to track when an item is expanded
  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id); 
  };

  const fetchHabits = (category = '') => {
    try {  
      const results: Habit[] = getAllHabits(category, userId); // db helper method
      setHabits(results);
    } catch (error) {
      console.error('Error fetching habits:', error);
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
    navigation.navigate('CreateHabit');
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
       <Icon name="icon" size={30} color="#000" />
      </View>
      <Text style={generalStyles.header}>Home</Text>
      <TouchableOpacity style={{paddingRight: 10}} onPress={onProfilePress}>
        <Icon name="person" size={30} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>

    {/* Header with "Habits" and Add button */}
    <View style={{ backgroundColor: 'white', paddingTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
      <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
        <Text style={{ fontSize: 18 }}>Filter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAddHabit}>
        <Text style={{ fontSize: 18}}>Add Habit</Text>
      </TouchableOpacity>
    </View>

    {/* Habit List */}
    <FlatList
      data={habits}
      renderItem={renderHabitItem}
      keyExtractor={item => item.habit_id.toString()}
      initialNumToRender={10}
      windowSize={5}
      style={{ flex: 1 }} // Ensure it takes the full height available
    />

    {/* Filter Modal */}
    <Modal visible={filterModalVisible} animationType="slide" transparent>
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Filter Habits</Text>
          <TextInput
            placeholder="Category"
            style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 5 }}
            value={selectedCategory}
            onChangeText={setSelectedCategory}
          />
          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 5 }}
            value={selectedDate}
            onChangeText={setSelectedDate}
          />
          <Button title="Apply" onPress={handleApplyFilters} />
          <Button title="Cancel" onPress={() => setFilterModalVisible(false)} color="red" />
        </View>
      </View>
    </Modal>
  </View>
);
};

export default HomeScreen;
