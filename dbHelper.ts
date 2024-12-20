import * as SQLite from 'expo-sqlite';
import { DateData } from 'react-native-calendars';

const db = SQLite.openDatabaseSync('mySQLiteDB.db');

// Interfaces
interface User {
  user_id: number;
  user_name: string;
  password: string;
}

interface Habit {
  habit_id: number;
  user_id: number;
  title: string;
  description: string; 
  start_date: string;
  category: string;
  status: string;
}

interface HabitLog {
  log_id: number;
  habit_id: number;
  date: string;
  status: string;
}

interface HabitLogWithDetails extends HabitLog {
  title: string;
}

// Queries for AuthScreen
const getUserIdAtLogin = (username: string, password: string) => {
  return db.getFirstSync<number>(
    `SELECT user_id FROM user WHERE user_name = ? AND password = ?`,
    [username, password]
  );
}

const accountExistsForUsername = (username: string) => {
  return db.getFirstSync(
    `SELECT user_id FROM user WHERE user_name = ?`,
    [username]
  );
}

const createAccount = (username: string, password: string) => {
  db.runSync(`INSERT INTO user (user_name, password) VALUES (?, ?)`, 
        [username, password]);
}

// Queries for HomeScreen
const getAllHabits = (category: string, userId: number) => {
  return db.getAllSync<Habit>(`SELECT * FROM Habit WHERE user_id=? AND status!="done"`, [userId]);
};

const removeHabitRecords = (id: number) => {
  db.runSync('DELETE FROM HabitLog WHERE habit_id= ?', [id]);
  db.runSync('DELETE FROM Habit WHERE habit_id = ?', [id]);
}

const markComplete = (id: number) => {
  db.runSync('UPDATE Habit SET status = "done" WHERE habit_id = ?', [id]);
}

// Queries for ProfileScreen
const getUserData = (userId: number) => {
  return db.getFirstSync<User>('SELECT * FROM User WHERE user_id=?', [userId]);
}

const updateUser = (user_id: number, user_name: string, password: string): boolean => {
  try {
    db.runSync(`UPDATE User SET user_name = ?, password = ? WHERE user_id = ?`, [user_name, password, user_id]);
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}

// Queries for HabitCreationScreen
const habitExistsByTitle = (userId: number, title: string) => {
  return db.getFirstSync(
    `SELECT habit_id FROM Habit WHERE user_id = ? AND title = ? AND status!="done"`,
    [userId, title]
  );
}

const createHabit = (userId: number, title: string, description: string, formattedDate: string, category: string) => {
  db.runSync(
    `INSERT INTO Habit (user_id, title, description, start_date, category) VALUES (?, ?, ?, ?, ?)`,
    [userId, title, description, formattedDate, category]
  );
}

// Queries for TrackProgressScreen
const getAllActiveHabits = (userId: number) => {
  return db.getAllSync<{title: string}>(
    `SELECT title FROM Habit WHERE user_id= ? AND status != "done"`, [userId]);
}

const getHabitIdByTitle = (userId: number, selectedHabit: string) => {
  return db.getFirstSync<Habit>(
    `SELECT habit_id FROM Habit WHERE title = ? AND user_id = ?`,
    [selectedHabit, userId]
  );
}

const habitLogExistsByDate = (habitId: number, selectedDate: Date) => {
  return db.getFirstSync<HabitLog>(
    `SELECT * FROM HabitLog WHERE habit_id = ? AND date = ?`,
    [habitId, selectedDate.toISOString().split('T')[0]]
  );
}

const updateHabitLogRecord = (completionStatus: string, habitId: number, selectedDate: Date) => {
  db.runSync(
    `UPDATE HabitLog SET status = ? WHERE habit_id = ? AND date = ?`,
    [completionStatus, habitId, selectedDate.toISOString().split('T')[0]]
  );
}

const addNewHabitLogRecord = (habitId: number, selectedDate: Date, completionStatus: string) => {
  db.runSync(
    `INSERT INTO HabitLog (habit_id, date, status) VALUES (?, ?, ?)`,
    [habitId, selectedDate.toISOString().split('T')[0], completionStatus]
  );
}

//  ViewProgress Screen
const fetchHabitLogsForUser = (userId: number) => {
  return db.getAllSync<HabitLog[]>("SELECT * FROM HabitLog WHERE user_id = ?", [userId]);
}

const getHabitLogsByDate = (userId: number, date: string) => {
  return db.getAllSync<HabitLogWithDetails>(
    "SELECT hl.*, h.title " +
    "FROM HabitLog hl " +
    "JOIN Habit h ON hl.habit_id = h.habit_id " +
    "WHERE h.user_id = ? AND hl.date = ?", 
    [userId, date]
  )
}

const getAllLogsByUserAndDate = (userId: string, date: DateData) => {
    return db.getAllSync("SELECT * FROM HabitLog WHERE date=?", [date.dateString])
}

export { 
  User, // Interfaces
  Habit, 
  HabitLog, 
  HabitLogWithDetails,
  getUserIdAtLogin,  // Queries for AuthScreen
  accountExistsForUsername, 
  createAccount, 
  getAllHabits, // Queries for HomeScreen
  removeHabitRecords, 
  markComplete, 
  getUserData, // Queries for ProfileScreen
  updateUser, 
  habitExistsByTitle, // Queries for HabitCreationScreen
  createHabit,
  getAllActiveHabits, // Queries for TrackProgressScreen
  getHabitIdByTitle, 
  habitLogExistsByDate, 
  updateHabitLogRecord,
  addNewHabitLogRecord,
  fetchHabitLogsForUser, // Queries for ViewProgressPage  
  getHabitLogsByDate, 
  getAllLogsByUserAndDate,
};
