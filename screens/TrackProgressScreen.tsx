import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { 
  getAllActiveHabits, 
  getHabitIdByTitle, 
  habitLogExistsByDate, 
  updateHabitLogRecord, 
  addNewHabitLogRecord 
} from '../dbHelper';

const TrackProgressScreen: React.FC = () => {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [completionStatus, setCompletionStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showHabitDropdown, setShowHabitDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const route = useRoute();
  const { userId } = route.params as { userId: number }; // Get userId from route params
  console.log("Open Track Progress Screen 1: ");
  console.log(userId);

  // Get all active habits for the user
  const habitResults: { title: string }[] = getAllActiveHabits(userId); // db helper method
  const habits = habitResults.map((habit) => habit.title);

  // Initialize selectedDate to today's date when the component mounts
  useEffect(() => {
    setSelectedDate(new Date()); // Set initial date to today's date
  }, []);

  const handleSaveProgress = () => {
    if (!selectedHabit || !selectedDate || !completionStatus) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    // Get corresponding habit_id
    const habitIdResult = getHabitIdByTitle(userId, selectedHabit); // db helper method
  
    if (!habitIdResult) {
      Alert.alert('Error', 'Habit not found');
      return;
    }
  
    const habitId = habitIdResult.habit_id;
  
    // Check if a record already exists for the selected date  
    if (habitLogExistsByDate(habitId, selectedDate)) {
      // Prompt the user for confirmation to replace existing record
      Alert.alert(
        'Record Exists',
        'A record for this habit already exists on the selected date. Do you want to update the status?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Update',
            onPress: () => {
              // Update the existing record
              updateHabitLogRecord(completionStatus, habitId, selectedDate); // db helper method
              Alert.alert('Success', 'Habit status updated successfully.');
              resetFields();
            },
          },
        ]
      );
    } 
    else {
      // Insert a new record
      addNewHabitLogRecord(habitId, selectedDate, completionStatus); // db helper method
      Alert.alert(
        'Progress Saved',
        `Habit: ${selectedHabit}\nDate: ${selectedDate.toDateString()}\nStatus: ${completionStatus}`
      );
      resetFields();
    }
  };
  
  // Function to reset fields after saving
  const resetFields = () => {
    setSelectedHabit(null);
    setCompletionStatus(null);
    setSelectedDate(null);
  };
  
  const handleDateChange = (event: any, date?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false); // Close the picker when dismissed
    } else if (date) {
      setSelectedDate(date); // Set the selected date
      setShowDatePicker(false); // Close the picker after selecting a date
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Progress</Text>

      {/* Select Habit */}
      <Text style={styles.label}>Select Habit</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowHabitDropdown(true)}
      >
        <Text style={styles.dropdownText}>
          {selectedHabit || 'Select Habit'}
        </Text>
      </TouchableOpacity>

      {/* Habit Dropdown */}
      <Modal
        visible={showHabitDropdown}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={habits}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedHabit(item);
                    setShowHabitDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Select Date */}
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

      {/* Completion Status */}
      <Text style={styles.label}>Completion Status</Text>
      <View style={styles.buttonContainer}>
        {['Completed', 'Incomplete', 'Partial'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.button,
              completionStatus === status && styles.activeButton,
            ]}
            onPress={() => setCompletionStatus(status)}
          >
            <Text style={styles.buttonText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProgress}>
        <Text style={styles.buttonText}>Save Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  label: {
    fontSize: 18,
    marginTop: 12,
  },
  dropdown: {
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 12,
    backgroundColor: '#ccc',
    borderRadius: 4,
    width: 100,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  saveButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    alignItems: 'center',
  },
});

export default TrackProgressScreen;
