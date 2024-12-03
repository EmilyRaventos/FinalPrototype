import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import generalStyles from '../styles/generalStyles'; // Import styles

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mySQLiteDB.db');
db.execSync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  -- Table to store user information
  CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT
  );

  -- Table to store habit information
  CREATE TABLE IF NOT EXISTS Habit (
    habit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES user (user_id)
  );

  -- Table to track habit logs
  CREATE TABLE IF NOT EXISTS HabitLog (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (habit_id) REFERENCES Habit (habit_id)
  );

  -- Table to store categories
  CREATE TABLE IF NOT EXISTS Category (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );`
);

// dummy data (Don't leave in the set up or a UNIQUE Constraint error will happen on reload)

// -- Insert sample categories
// INSERT INTO Category (name) 
// VALUES ('Fitness'), ('Personal Growth'), ('Wellness'), ('Hobbies');

// -- Insert sample habit logs
// INSERT INTO HabitLog (habit_id, date, status) 
// VALUES (1, '2024-02-01', 'completed'),
//        (1, '2024-02-02', 'skipped'),
//        (2, '2024-02-02', 'completed'),
//        (3, '2024-02-03', 'completed'),
//        (4, '2024-02-04', 'completed'),
//        (5, '2024-02-05', 'skipped');

       
// -- Insert multiple habits associated with the same user_id
// INSERT INTO Habit (user_id, title, description, start_date, category, status) 
// VALUES (1, 'Morning Run', 'Run 5km every morning', '2024-02-01', 'Fitness', 'active'),
//        (1, 'Read a Book', 'Read 30 pages daily', '2024-02-02', 'Personal Growth', 'active'),
//        (1, 'Meditation', '10 minutes of meditation', '2024-02-03', 'Wellness', 'active'),
//        (2, 'Evening Walk', 'Walk for 30 minutes', '2024-02-04', 'Fitness', 'active'),
//        (2, 'Journal Writing', 'Write a journal entry daily', '2024-02-05', 'Personal Growth', 'active'),
//        (3, 'Practice Guitar', 'Practice guitar for 1 hour', '2024-02-06', 'Hobbies', 'active');

// -- Insert sample data into user table
// INSERT INTO user (user_name, password, email) 
// VALUES ('username_1', 'password_123', 'email1@example.com'),
//        ('username_2', 'password_456', 'email2@example.com'),
//        ('username_3', 'password_789', 'email3@example.com');

// end sample data

interface Habit {
  habit_id: number;
  user_id: number;
  title: string;
  description: string; 
  start_date: string;
  category: string;
  status: string;
}

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // State to track which items are expanded
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id); 
  };

  const fetchHabits = () => {
    let userId = 1; // come back and change it based on login.
    try {
      const results = db.getAllSync('SELECT * FROM Habit WHERE user_id= ?', [userId]) as Habit[];
      setHabits(results);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  
  // get list of habits from db
  // const db = SQLite.openDatabaseSync('mySQLiteDB.db');
  // let habits: Habit[] = db.getAllSync('SELECT * FROM Habit;');

  // const [habits, setHabits] = useState<Habit[]>([
  //   {
  //     habit_id: 1, 
  //     user_id: 1, 
  //     title: 'test-title-',
  //      description: 'test-description-',
  //       start_date: '12-03-2024', 
  //       category: 'test-category',
  //       status: 'test-status-'
  //     },
  //   {
  //     habit_id: 1, 
  //     user_id: 1, 
  //     title: 'test-title-', 
  //     description: 'test-description-', 
  //     start_date: '12-03-2024', 
  //     status: 'test-status-', 
  //     category: 'test-category'
  //   }
  // ]);

  const removeHabit = (id: number) => {
    try {
      db.runSync('DELETE FROM Habit WHERE habit_id = ?', [id]);
      setHabits(habits.filter(habit => habit.habit_id !== id)); // Optimistically update the state
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
    // setHabits(prevHabits => prevHabits.filter(habit => habit.habit_id !== id));
    // TODO: save/update new list of habits.
  };

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const renderRightActions = (id: number) => (
    <TouchableOpacity
      style={generalStyles.removeButton}
      onPress={() => removeHabit(id)}
    >
      <Text style={generalStyles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  );

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <ReanimatedSwipeable renderRightActions={() => renderRightActions(item.habit_id)}>
      <View style={generalStyles.habitContainer}>
        <TouchableOpacity style={generalStyles.habitHeader} onPress={() => toggleExpand(item.habit_id)}>
          <Text style={generalStyles.habitTitle}>{item.title}</Text>
          <Text style={generalStyles.arrow}>{expandedItem === item.habit_id ? '▼' : '►'}</Text>
        </TouchableOpacity>
        {expandedItem === item.habit_id && (
          <Text style={generalStyles.habitDetails}>{item.description}</Text>
        )}
      </View>
    </ReanimatedSwipeable>
  );

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={generalStyles.header}>Habits</Text>
        {/* List of Habits */}
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={item => item.habit_id.toString()}
          style={{ flexGrow: 0 }} // Prevents FlatList from expanding to fill the container
        />
        {/* Centered Button for Adding Habit */}
        <View style={generalStyles.centeredButtonContainer}>
          <TouchableOpacity style={generalStyles.button} onPress={handleAddHabit}>
            <Text style={generalStyles.buttonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
