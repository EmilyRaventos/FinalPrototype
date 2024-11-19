import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars'; // Ensure type import for DateData

type HabitData = {
  [key: string]: 'Completed' | 'Incomplete' | 'Partial' | undefined;
};

const ViewProgressScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [habitData] = useState<HabitData>({
    '2024-11-01': 'Completed',
    '2024-11-02': 'Incomplete',
    '2024-11-03': 'Partial',
  });

  const getDayColor = (date: string): string => {
    const status = habitData[date];
    if (status === 'Completed') return 'green';
    if (status === 'Incomplete') return 'red';
    if (status === 'Partial') return 'yellow';
    return 'transparent';
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const status = habitData[day.dateString] || 'No data';
    Alert.alert(`Habit status on ${day.dateString}`, `Status: ${status}`);
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
});

export default ViewProgressScreen;
