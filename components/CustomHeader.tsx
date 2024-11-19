// components/CustomHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { RootStackParamList } from '../types'; // Make sure to import your RootStackParamList

const CustomHeader: React.FC = () => {
    // Type the navigation hook with RootStackParamList
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const onProfilePress = () => {
       navigation.navigate('Profile');
    }

    const onMenuPress = () => {
        console.log('Menu pressed');
    }

    return (
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={onMenuPress}>
            <Icon name="menu" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>BOUNDLESS</Text>
          <TouchableOpacity onPress={onProfilePress}>
            <Icon name="person" size={30} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8', // Adjust as needed
    elevation: 2, // Add shadow effect on Android
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
