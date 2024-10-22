import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function Profile() {
  const [viewType, setViewType] = useState('monthly');

  return (
    <View style={styles.container}>
    
      {/* Khu vực để lựa chọn Monthly/Weekly View */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.button, viewType === 'monthly' && styles.activeButton]}
          onPress={() => setViewType('monthly')}>
          <Text style={styles.buttonText}>Monthly view</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, viewType === 'weekly' && styles.activeButton]}
          onPress={() => setViewType('weekly')}>
          <Text style={styles.buttonText}>Weekly view</Text>
        </TouchableOpacity>
      </View>

      {/* Khu vực hiển thị Calendar */}
      <View style={styles.calendar}>
        <Calendar
          markingType={'simple'}
          markedDates={{
            '2022-09-21': { selected: true, marked: true },
            '2022-09-22': { marked: true },
            '2022-09-23': { marked: true },
            '2022-09-24': { marked: true },
            '2022-09-28': { marked: true },
            '2022-09-29': { marked: true },
            '2022-09-30': { marked: true },
            '2022-09-01': { marked: true },
            '2022-09-02': { marked: true },
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
     marginTop: 20,
    width: '100%', // Đảm bảo header chiếm toàn bộ chiều ngang
  },
  calendar: {
    width: '100%', // Đảm bảo calendar chiếm toàn bộ chiều ngang
  },
  button: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '48%', // Đặt chiều rộng cho nút để chúng không chồng lên nhau
  },
  activeButton: {
    backgroundColor: '#ff6b01',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    textAlign:'center'
  },
});
