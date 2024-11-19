import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars'; // Ensure type import for DateData

type HabitData = {
  [key: string]: {
    habit: string;
    status: 'Completed' | 'Incomplete' | 'Partial' | undefined;
  }[];
};

const ViewProgressScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<HabitData[string]>([]);

  const habitData: HabitData = {
    '2024-11-01': [
      { habit: 'Habit 1', status: 'Completed' },
      { habit: 'Habit 2', status: 'Partial' },
    ],
    '2024-11-02': [
      { habit: 'Habit 1', status: 'Incomplete' },
      { habit: 'Habit 2', status: 'Completed' },
    ],
    '2024-11-03': [
      { habit: 'Habit 1', status: 'Partial' },
      { habit: 'Habit 2', status: 'Incomplete' },
    ],
  };

  const getDayColor = (date: string): string => {
    const status = habitData[date]?.[0]?.status; // Check the first habit for color
    if (status === 'Completed') return 'green';
    if (status === 'Incomplete') return 'red';
    if (status === 'Partial') return 'yellow';
    return 'transparent';
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const habitsForSelectedDate = habitData[day.dateString] || [];
    setSelectedHabits(habitsForSelectedDate);
  };

  const markedDates = Object.keys(habitData).reduce((acc, date) => {
    acc[date] = {
      selected: true,
      selectedColor: getDayColor(date),
    };
    return acc;
  }, {} as Record<string, { selected: boolean; selectedColor: string }>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Progress</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        monthFormat={'yyyy MM'}
        style={styles.calendar}
      />
      <Text style={styles.selectedDate}>
        {selectedDate ? `Selected Date: ${selectedDate}` : 'Select a date to view details'}
      </Text>

      <ScrollView style={styles.habitsList}>
        {selectedHabits.length > 0 ? (
          selectedHabits.map((habit, index) => (
            <View key={index} style={styles.habitItem}>
              <Text style={styles.habitText}>
                {habit.habit} - <Text style={{ color: getDayColor(selectedDate || '') }}>{habit.status}</Text>
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noHabitsText}>No habits for this date.</Text>
        )}
      </ScrollView>
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
  calendar: {
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  habitsList: {
    marginTop: 20,
    flex: 1,
  },
  habitItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  habitText: {
    fontSize: 16,
  },
  noHabitsText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});

export default ViewProgressScreen;
