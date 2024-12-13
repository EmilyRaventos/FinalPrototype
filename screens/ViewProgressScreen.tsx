import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useRoute } from '@react-navigation/native';
import { HabitLog, HabitLogWithDetails, getHabitLogsByDate } from '../dbHelper'; // Import your database helper function

const ViewProgressScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<HabitLogWithDetails[]>([]);
  const [habitData, setHabitData] = useState<Record<string, HabitLog[]>>({});
  
  const route = useRoute();
  const { userId } = route.params as { userId: number };

  // Fetch data for a specific date
  const fetchHabitsForDate = async (date: string) => {
    try {
      const logs: HabitLogWithDetails[] = getHabitLogsByDate(userId, date); // Call your database query function
      setSelectedHabits(logs);
    } catch (error) {
      console.error('Error fetching habit logs:', error);
      setSelectedHabits([]);
    }
  };
  
  // Handle day selection
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    fetchHabitsForDate(day.dateString);
  };

  // Calculate the completion percentage for each date
  const getCompletionPercentage = (date: string): number => {
    const habits = habitData[date] || [];
    const totalHabits = habits.length;

    const totalCompletion = habits.reduce((acc, habit) => {
      if (habit.status === 'Completed') return acc + 100;
      if (habit.status === 'Partial') return acc + 50;
      return acc;
    }, 0);

    return totalHabits > 0 ? (totalCompletion / (totalHabits * 100)) * 100 : 0;
  };

  const getStatusColor = (status: 'Completed' | 'Incomplete' | 'Partial' | undefined): string => {
    if (status === 'Completed') return '#4caf50'; // Green
    if (status === 'Incomplete') return '#f44336'; // Red
    if (status === 'Partial') return '#ff9800'; // Orange
    return '#000'; // Default color
  };

  // Get color for each day based on completion percentage
  const getDayColor = (date: string): string => {
    const percentage = getCompletionPercentage(date);
    if (percentage === 100) return '#4caf50';
    if (percentage >= 75) return '#81c784';
    if (percentage >= 50) return '#ffeb3b';
    if (percentage >= 25) return '#ff9800';
    return '#f44336';
  };

  const isValidStatus = (status: any): status is 'Completed' | 'Incomplete' | 'Partial' | undefined => {
    return ['Completed', 'Incomplete', 'Partial', undefined].includes(status);
  };
  

  // Mark dates for the calendar
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
        monthFormat={'MMMM yyyy'}
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
              {habit.title} - <Text style={{ color: isValidStatus(habit.status) ? getStatusColor(habit.status) : '#000' }}>
              {habit.status}
                </Text>
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
