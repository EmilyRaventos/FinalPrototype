import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { 
  getUserIdAtLogin, 
  accountExistsForUsername, 
  createAccount 
} from '../dbHelper';

const AuthScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
  
    // Login/Authenticate user
    try {
      const userId = getUserIdAtLogin(username, password); // db helper method
      console.log("Starting log in for Auth Screen 1: ");
      
      // Ensure userId is not null or undefined before accessing its properties
      if (userId && userId.user_id) {
        navigation.replace('HomePage', { userId: userId.user_id }); // Pass userId to HomePage
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while logging in');
    }
  };

  // Create Account
  const handleCreateAccount = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
  
    try {
      // Check if the email already exists in the database
      console.log("Starting to create account for Auth screen: ")
      if (accountExistsForUsername(username)) {
        Alert.alert(
          'Account Exists',
          'This username is already registered. Please log in instead.',
          [{ text: 'OK' }]
        );
        return;
      }
  
      // Create new acount
      console.log("Starting to create account for Auth Screen: ")
      createAccount(username, password); // db helper method
  
      // Fetch the userId for the newly created account
      const userId = getUserIdAtLogin(username, password); // db helper method
      console.log("Created account for Auth Screen: ");
      console.log(userId);
  
      if (userId) {
        Alert.alert('Account Created', 'Account created successfully. Welcome!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('HomePage', {userId: userId.user_id}), // Pass userId to HomePage
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

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        keyboardType="default"
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
