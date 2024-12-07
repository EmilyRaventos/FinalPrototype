import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { generalStyles } from '../styles/generalStyles';
import { 
  User, 
  getUserData, 
  updateUser 
} from '../dbHelper';

const ProfileScreen: React.FC<{navigation: any}> = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<User | null>(null);

  const route = useRoute();
  const { userId } = route.params as { userId: number }; // Get userId from route params
  console.log("Profile Screen 1: ");
  console.log(userId);

  useEffect(() => {
    const userData = getUserData(userId);
    console.log("Profile Screen 2: ");
    console.log(userData?.user_id);
    console.log(userData?.user_name);
    console.log(userData?.email);
    console.log(userData?.password);

    if (userData) {
      setUserName(userData.user_name);
      setEmail(userData.email);
      setPassword(userData.password);
      setOriginalData(userData);
      console.log("saved original data...");

    } else {
      Alert.alert('Error', 'User not found');
      navigation.goBack(); // Navigate back if user not found
    }
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const success = updateUser(userId, userName, email, password);
    console.log("Profile Screen 3: ")
    console.log(success);

    if (success) {
      setIsEditing(false);
      setOriginalData({ user_id: userId, user_name: userName, email, password });
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setUserName(originalData.user_name);
      setEmail(originalData.email);
      setPassword(originalData.password);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          navigation.reset({ index: 0, routes: [{ name: 'AuthScreen' }] });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={[styles.input, isEditing ? styles.editable : styles.readOnly]}
        value={userName}
        onChangeText={setUserName}
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

        {isEditing && (
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}

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
    backgroundColor: 'white', 
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
