-- 1. create DB
sqlite3 mySQLiteDB.db

-- 2. create tables
-- Table to store user information
CREATE TABLE User (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique ID for each user
    username TEXT NOT NULL,                    -- User's username
    email TEXT UNIQUE NOT NULL,                -- User's email
    password TEXT NOT NULL                     -- Hashed password
);

-- Table to store habit information
CREATE TABLE Habit (
    habit_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique ID for each habit
    user_id INTEGER NOT NULL,                   -- Foreign key to User table
    title TEXT NOT NULL,                        -- Title of the habit
    description TEXT,                           -- Description of the habit
    start_date TEXT NOT NULL,                   -- Start date in ISO format (e.g., YYYY-MM-DD)
    category TEXT,                              -- Category of the habit (e.g., health, work)
    status TEXT NOT NULL DEFAULT 'active',      -- Status of the habit (e.g., active, completed, archived)
    FOREIGN KEY (user_id) REFERENCES User (user_id) -- Link to the User table
);

-- Table to track habit logs (progress tracking)
CREATE TABLE HabitLog (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique ID for each log entry
    habit_id INTEGER NOT NULL,                -- Foreign key to Habit table
    date TEXT NOT NULL,                       -- Date of the log entry in ISO format
    status TEXT NOT NULL,                     -- Status for the day (e.g., completed, missed)
    FOREIGN KEY (habit_id) REFERENCES Habit (habit_id) -- Link to the Habit table
);

-- Table to store categories (optional, if you want predefined categories)
CREATE TABLE Category (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique ID for each category
    name TEXT NOT NULL UNIQUE                      -- Name of the category
);

-- 3. insert data
INSERT INTO User (user_id, username, email, password) VALUES (0, 'test_username', 'test0@test.com', 'test_password');
INSERT INTO Habit (habit_id, user_id, title, description, start_date, category, status) VALUES (0, 0, 'test_title', 'test_description', '12-02-2024', 'test_ca
tegory', 'test_status');
INSERT INTO HabitLog (log_id, habit_id, date, status) VALUES (0, 0, '12-02-2024', 'test_status');
INSERT INTO Category (category_id, name) VALUES (0, 'test-category');
