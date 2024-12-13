import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { habitExistsByTitle, createHabit } from '../dbHelper';
import { useRoute } from '@react-navigation/native';

const habitTemplates = [
  { title: 'Daily Meditation', description: 'Meditate for 10 minutes', category: 'Wellness' },
  { title: 'Morning Run', description: 'Run 5km every morning', category: 'Fitness' },
  { title: 'Read a Book', description: 'Read 20 pages of a book', category: 'Education' },
  { title: 'Drink Water', description: 'Drink 8 glasses of water', category: 'Health' },
  { title: 'Write Journal', description: 'Write in your journal', category: 'Wellness' },
  { title: 'Plan Day', description: 'Plan your tasks for the day', category: 'Productivity' },
  { title: 'Stretching', description: 'Do 15 minutes of stretching', category: 'Fitness' },
  { title: 'Practice Gratitude', description: 'List 3 things you are grateful for', category: 'Mindfulness' },
  { title: 'Learn a Language', description: 'Practice a language for 30 minutes', category: 'Education' },
  { title: 'Clean Room', description: 'Organize and clean your room', category: 'Home' },
  { title: 'Cook a Meal', description: 'Prepare a healthy meal', category: 'Health' },
  { title: 'Volunteer', description: 'Volunteer for a community service', category: 'Social' },
  { title: 'Digital Detox', description: 'Avoid screens for 1 hour', category: 'Wellness' },
  { title: 'Financial Review', description: 'Review your budget', category: 'Finance' },
  { title: 'Call a Friend', description: 'Catch up with a friend', category: 'Social' },
];

const HabitCreationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const route = useRoute();
  const { userId } = route.params as { userId: number };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleSaveHabit = () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const formattedDate = startDate.toISOString().split('T')[0];
    const existingHabit = habitExistsByTitle(userId, title);

    if (existingHabit) {
      Alert.alert('Error', 'A habit with this title already exists.');
    } else {
      createHabit(userId, title, description, formattedDate, category);

      setTitle('');
      setDescription('');
      setStartDate(new Date());
      setCategory('');

      Alert.alert('Success', 'Habit created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomePage', { userId: userId }),
        },
      ]);
    }
  };

  const applyTemplate = (template: { title: string; description: string; category: string }) => {
    setTitle(template.title);
    setDescription(template.description);
    setCategory(template.category);
    setShowTemplateModal(false);
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
        <Text style={styles.datePickerText}>{startDate.toDateString()}</Text>
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

      <TouchableOpacity
        style={styles.templateButton}
        onPress={() => setShowTemplateModal(true)}
      >
        <Text style={styles.buttonText}>Choose from Template</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveHabit}>
        <Text style={styles.buttonText}>Save Habit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>

      <Modal
        visible={showTemplateModal}
        animationType="slide"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Template</Text>
          <FlatList
            data={habitTemplates.sort((a, b) => a.title.localeCompare(b.title))}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.templateItem}
                onPress={() => applyTemplate(item)}
              >
                <Text style={styles.templateText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowTemplateModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    bordeborderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f44336',
    borderRadius: 4,
    alignItems: 'center',
  },
  templateButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  templateItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  templateText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FF5722',
    borderRadius: 4,
    alignItems: 'center',
  },
});


export default HabitCreationScreen;
