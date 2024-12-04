import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { generalStyles } from '../styles/generalStyles';

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Hook for navigation

  // Handle Login logic (for now, simulate it)
  const handleLogin = () => {
    // Normally you'd authenticate the user here (API call)
    if (email && password) {
      navigation.replace('HomePage'); // Navigate to Home Screen
    } else {
      Alert.alert('Error', 'Please enter both email and password');
    }
  };

  // Handle Create Account logic (for now, simulate success)
  const handleCreateAccount = () => {
    // Normally you'd create the account here (API call)
    Alert.alert('Account Created', 'Account created successfully. Welcome!', [
      {
        text: 'OK',
        onPress: () => navigation.replace('HomePage'), // Navigate to Home Screen
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
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
        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity style={[styles.button, styles.createAccountButton]} onPress={handleCreateAccount}>
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
    backgroundColor: generalStyles.button.backgroundColor,
    borderRadius: 4,
    width: 200,
  },
  createAccountButton: {
    backgroundColor: 'white', // Style for the Create Account button
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
