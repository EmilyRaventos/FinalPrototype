import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useRoute } from '@react-navigation/native';
import { HabitLog, HabitLogWithDetails, getHabitLogsByDate } from '../dbHelper';

const ViewProgressScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<HabitLogWithDetails[]>([]);
  const [habitData, setHabitData] = useState<Record<string, HabitLog[]>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const route = useRoute();
  const { userId } = route.params as { userId: number };

  const fetchHabitsForDate = useCallback(async (date: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const logs: HabitLogWithDetails[] = await getHabitLogsByDate(userId, date);
      setSelectedHabits(logs);
    } catch (error) {
      console.error('Error fetching habit logs:', error);
      setErrorMessage('Failed to fetch habit logs. Please try again later.');
      setSelectedHabits([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    fetchHabitsForDate(day.dateString);
  };

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
    if (status === 'Completed') return '#4caf50';
    if (status === 'Incomplete') return '#f44336';
    if (status === 'Partial') return '#ff9800';
    return '#000';
  };

  const isValidStatus = (status: any): status is 'Completed' | 'Incomplete' | 'Partial' | undefined => {
    return ['Completed', 'Incomplete', 'Partial', undefined].includes(status);
  };

  const getDayColor = (date: string): string => {
    const percentage = getCompletionPercentage(date);
    if (percentage === 100) return '#4caf50';
    if (percentage >= 75) return '#81c784';
    if (percentage >= 50) return '#ffeb3b';
    if (percentage >= 25) return '#ff9800';
    return '#f44336';
  };

  const markedDates = Object.keys(habitData).reduce((acc, date) => {
    acc[date] = {
      selected: true,
      selectedColor: getDayColor(date),
    };
    return acc;
  }, {} as Record<string, { selected: boolean; selectedColor: string }>);

  useEffect(() => {
    const fetchAllHabitData = async () => {
      try {
        const allHabitLogs = getHabitLogsByDate(userId, "null");
        const groupedData = allHabitLogs.reduce((acc, log) => {
          const date = log.date;
          if (!acc[date]) acc[date] = [];
          acc[date].push(log);
          return acc;
        }, {} as Record<string, HabitLog[]>);
        setHabitData(groupedData);
      } catch (error) {
        console.error('Error fetching habit data:', error);
        setErrorMessage('Failed to fetch initial habit data.');
      }
    };
    fetchAllHabitData();
  }, [userId]);

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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <ScrollView style={styles.habitsList}>
          {selectedHabits.length > 0 ? (
            selectedHabits.map((habit, index) => (
              <View key={index} style={styles.habitItem}>
                <Text style={styles.habitText}>
                  {habit.title} -{' '}
                  <Text
                    style={{
                      color: isValidStatus(habit.status) ? getStatusColor(habit.status) : '#000',
                    }}
                  >
                    {habit.status}
                  </Text>
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noHabitsText}>No habits for this date.</Text>
          )}
        </ScrollView>
      )}
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
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});

export default ViewProgressScreen;
