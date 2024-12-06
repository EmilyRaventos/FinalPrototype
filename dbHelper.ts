import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mySQLiteDB.db');

// Interfaces
interface User {
  user_id: number;
  user_name: string;
  email: string;
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

// Queries for AuthScreen
const getUserIdAtLogin = (email: string, password: string) => {
  return db.getFirstSync<number>(
    `SELECT user_id FROM user WHERE email = ? AND password = ?`,
    [email, password]
  );
}

const accountExistsForEmail = (email: string) => {
  return db.getFirstSync(
    `SELECT user_id FROM user WHERE email = ?`,
    [email]
  );
}

const createAccount = (email: string, password: string) => {
  db.runSync(`INSERT INTO user (user_name, email, password) VALUES ('username-test', ?, ?)`, 
        [email, password]);
}

// Queries for HomeScreen
const getAllHabits = (category: string, userId: number) => {
  const query = `SELECT * FROM Habit WHERE user_id = ? AND status != "done" ${
    category ? `AND category = ?` : ''
  }`;
  const params = [userId, ...(category ? [category] : [])];
  return db.getAllSync<Habit>(query, params);
}

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

const updateUser = (user_id: number, user_name: string, email: string, password: string): boolean => {
  try {
    db.runSync(`UPDATE User SET user_name = ?, email = ?, password = ? WHERE user_id = ?`, [user_name, email, password, user_id]);
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

export { 
  User, // Interfaces
  Habit, 
  HabitLog, 
  getUserIdAtLogin,  // Queries for AuthScreen
  accountExistsForEmail, 
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
  addNewHabitLogRecord  
};
