// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface HomeScreenProps {
  navigation: any; // You can refine this type using `StackNavigationProp` from '@react-navigation/stack'
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button title="Add Habit" onPress={handleAddHabit} />
      {/* Add more UI elements to list habits here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
