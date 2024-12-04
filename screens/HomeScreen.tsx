import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, SafeAreaView } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import { generalStyles, colors } from '../styles/generalStyles'; // Import styles
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
  const onProfilePress = () => {
    navigation.navigate('Profile');
 }

  const [habits, setHabits] = useState<Habit[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // set to track when an item is expanded
  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id); 
  };

  const fetchHabits = (category = '', date = '') => {
    let userId = 1; // Replace with dynamic user ID
    try {
      const query = `SELECT * FROM Habit WHERE user_id = ? AND status != "done" ${
        category ? `AND category = ?` : ''
      } ${date ? `AND start_date = ?` : ''}`;
      const params = [userId, ...(category ? [category] : []), ...(date ? [date] : [])];

      const results: Habit[] = db.getAllSync(query, params);
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

  const markHabitAsCompleted = (id: number) => {
    try {
      db.runSync('UPDATE Habit SET status = "done" WHERE habit_id = ?', [id]);
      setHabits(habits.filter(habit => habit.habit_id !== id)); // Optimistically update the state
    } catch (error) {
      console.error('Error marking habit as completed:', error);
    }
  };

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleApplyFilters = () => {
    fetchHabits(selectedCategory, selectedDate);
    setFilterModalVisible(false);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

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
          <Text style={generalStyles.habitDetails}>{item.description}</Text>
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
      initialNumToRender={10} // Optimize for large lists
      windowSize={5}
      style={{backgroundColor: 'white'}}
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
