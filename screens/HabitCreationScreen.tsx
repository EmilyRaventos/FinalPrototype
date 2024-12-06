import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { habitExistsByTitle, createHabit } from '../dbHelper';
import { useRoute } from '@react-navigation/native';

const HabitCreationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const route = useRoute();
  const { userId } = route.params as { userId: number }; // Get userId from route params

  // Select start date for habit
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  // Save new habit info
  const handleSaveHabit = () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    // Format date as YYYY-MM-DD
    const formattedDate = startDate.toISOString().split('T')[0]; 

    // Verify the habit title isn't a duplicate before saving
    const existingHabit = habitExistsByTitle(userId, title); // db helper method
  
    if (existingHabit) {
      Alert.alert('A habit with this title already exists. Please choose a different title.')
    }
    else {
      createHabit(userId, title, description, formattedDate, category);
  
      // Clear input fields
      setTitle('');
      setDescription('');
      setStartDate(new Date());
      setCategory('');
    
      // Show success message
      Alert.alert('Success', 'Habit created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomePage', { userId: userId }),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Habit</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>
          {startDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveHabit}>
        <Text style={styles.buttonText}>Save Habit</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 12,
  },
  input: {
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  datePickerButton: {
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    backgroundColor: '#f0f0f0',
  },
  datePickerText: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f44336',
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HabitCreationScreen;
