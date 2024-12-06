import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const FilterModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onApply: (category: string, date: string) => void;
}> = ({ visible, onClose, onApply }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
      setSelectedDate(formattedDate);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Filter Habits</Text>

          {/* Category Filter */}
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Category</Text>
          <TextInput
            placeholder="Enter category"
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 10,
              padding: 5,
              borderRadius: 5,
            }}
            value={selectedCategory}
            onChangeText={setSelectedCategory}
          />

          {/* Date Filter */}
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Start Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 10,
              padding: 10,
              borderRadius: 5,
              justifyContent: 'center',
            }}
          >
            <Text>
              {selectedDate || 'Select a date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          {/* Action Buttons */}
          <Button
            title="Apply Filters"
            onPress={() => {
              onApply(selectedCategory, selectedDate);
              onClose();
            }}
          />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
