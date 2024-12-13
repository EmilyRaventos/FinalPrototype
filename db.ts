
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mySQLiteDB.db');

// initialize tables    
const initDB = () => {
    db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS user (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      password TEXT NOT NULL
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
        FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE
    );

    -- Table to track habit logs
    CREATE TABLE IF NOT EXISTS HabitLog (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (habit_id) REFERENCES Habit (habit_id) ON DELETE CASCADE
    );

    -- Table to store categories
    CREATE TABLE IF NOT EXISTS Category (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );`
    );
};

const closeDB = () => {
  db.closeSync();
};

export { db, initDB, closeDB };

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