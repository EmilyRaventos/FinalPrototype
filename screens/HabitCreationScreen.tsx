// screens/HabitCreationScreen.tsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const HabitCreationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [checkInFrequency, setCheckInFrequency] = React.useState('');

  const handleSaveHabit = () => {
    // Logic to save habit will go here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Habit</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Start Date"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Check-in Frequency"
        value={checkInFrequency}
        onChangeText={setCheckInFrequency}
      />
      <Button title="Save Habit" onPress={handleSaveHabit} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default HabitCreationScreen;
