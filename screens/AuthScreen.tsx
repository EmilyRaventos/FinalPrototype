import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../db'; // Import your SQLite database

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // db.execSync(`INSERT INTO users (email, password) VALUES ('email1', 'password1')`);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Query to check if user exists
    try {
      const result = db.getFirstSync(
        `SELECT id FROM users WHERE email = ? AND password = ?`, 
        [email, password]
      );
  
      // Check if a user was found
      if (result) {
        navigation.replace('HomePage', { result }); // Pass userId to HomePage
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while logging in');
    }
  };

  const handleCreateAccount = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Insert the new user into the database
    try {
      const sqlStatement = `INSERT INTO users (email, password) VALUES (${email}, ${password})`;
      db.execSync(sqlStatement);

      // Fetch the userId for the newly created account
      const result = db.getFirstSync(
        `SELECT id FROM users WHERE email = ?`,
        [email]
      );

      if (result) {
        Alert.alert('Account Created', 'Account created successfully. Welcome!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('HomePage', { result }),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to create account');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating the account');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BOUNDLESS</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.createAccountButton]}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    marginTop: 12,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    width: 200,
  },
  createAccountButton: {
    backgroundColor: 'white',
  },
  createAccountButtonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AuthScreen;
