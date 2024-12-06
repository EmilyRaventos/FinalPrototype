import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars'; // Ensure type import for DateData
import { format } from 'date-fns'; // Import date-fns for formatting

type HabitData = {
  [key: string]: {
    habit: string;
    status: 'Completed' | 'Incomplete' | 'Partial' | undefined;
  }[];
};

const ViewProgressScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<HabitData[string]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('2024-11'); // Track current month


  const habitData: HabitData = {
    '2024-11-01': [
      { habit: 'Habit 1', status: 'Completed' },
      { habit: 'Habit 2', status: 'Completed' },
    ],
    '2024-11-02': [
      { habit: 'Habit 1', status: 'Partial' },
      { habit: 'Habit 2', status: 'Partial' },
    ],
    '2024-11-03': [
      { habit: 'Habit 1', status: 'Incomplete' },
      { habit: 'Habit 2', status: 'Incomplete' },
    ],
    '2024-11-04': [
      { habit: 'Habit 1', status: 'Completed' },
      { habit: 'Habit 2', status: 'Partial' },
    ],
    '2024-11-05': [
      { habit: 'Habit 1', status: 'Completed' },
      { habit: 'Habit 2', status: 'Incomplete' },
    ],
  };

  // Calculate the completion percentage for each date, considering partials as 50%
  const getCompletionPercentage = (date: string): number => {
    const habits = habitData[date] || [];
    const totalHabits = habits.length;
    
    // Sum up the completion percentages for each habit
    const totalCompletion = habits.reduce((acc, habit) => {
      if (habit.status === 'Completed') {
        return acc + 100; // 100% for completed
      }
      if (habit.status === 'Partial') {
        return acc + 50; // 50% for partial
      }
      return acc; // 0% for incomplete
    }, 0);

    // Calculate the percentage
    return totalHabits > 0 ? (totalCompletion / (totalHabits * 100)) * 100 : 0;
  };

  // Get color based on the completion percentage
  const getDayColor = (date: string): string => {
    const percentage = getCompletionPercentage(date);

    if (percentage === 100) return '#4caf50'; // Green
    if (percentage >= 75) return '#81c784'; // Light Green
    if (percentage >= 50) return '#ffeb3b'; // Yellow
    if (percentage >= 25) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  // Handle the click event to display habit details
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const habitsForSelectedDate = habitData[day.dateString] || [];
    setSelectedHabits(habitsForSelectedDate);
  };

  // Color coding for habit status
  const getStatusColor = (status: 'Completed' | 'Incomplete' | 'Partial' | undefined): string => {
    if (status === 'Completed') return '#4caf50'; // Green
    if (status === 'Incomplete') return '#f44336'; // Red
    if (status === 'Partial') return '#ff9800'; // Orange
    return '#000'; // Default color if status is undefined
  };

  // Format the current month for display as 'Month Year'
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(Number(year), Number(monthNum) - 1);
    return format(date, 'MMMM yyyy'); // Format as 'November 2024'
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
        monthFormat={'MMMM yyyy'} // Use this format for the calendar's header
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
                {habit.habit} - <Text style={{ color: getStatusColor(habit.status) }}>
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
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
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
