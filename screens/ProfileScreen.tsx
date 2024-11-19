import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import generalStyles from '../styles/generalStyles';

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('********');
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation(); // Hook for navigation

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save changes logic goes here
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          // Navigate to the login screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthScreen' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={[styles.input, isEditing ? styles.editable : styles.readOnly]}
        value={name}
        onChangeText={setName}
        editable={isEditing}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, isEditing ? styles.editable : styles.readOnly]}
        value={email}
        onChangeText={setEmail}
        editable={isEditing}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, isEditing ? styles.editable : styles.readOnly]}
        value={password}
        onChangeText={setPassword}
        editable={isEditing}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={isEditing ? handleSave : handleEdit}>
          <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  editable: {
    backgroundColor: '#f9f9f9',
  },
  readOnly: {
    backgroundColor: '#e9e9e9',
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
  logoutButton: {
    marginTop: -1,
    backgroundColor: 'white', // Logout button style
  },
  logoutButtonText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
