import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const HabitCreationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [checkInFrequency, setCheckInFrequency] = useState('');

  const handleSaveHabit = () => {
    if (!title || !description || !startDate || !checkInFrequency) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    Alert.alert('Habit Saved', `Title: ${title}\nDescription: ${description}`);
    navigation.goBack(); // Navigate back after saving
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
      <TextInput
        style={styles.input}
        placeholder="Enter Start Date"
        value={startDate}
        onChangeText={setStartDate}
      />

      <Text style={styles.label}>Check-in Frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Check-in Frequency"
        value={checkInFrequency}
        onChangeText={setCheckInFrequency}
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
    backgroundColor: '#f44336', // Red cancel button
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HabitCreationScreen;
