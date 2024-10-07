import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Profile from './Manage_History_Booking/Profile';
import History from './Manage_History_Booking/History';
import Report from './Manage_History_Booking/Report';
import Setting from './Manage_History_Booking/Setting';

export default function CustomTabScreen() {
  const [selectedTab, setSelectedTab] = useState('Profile');

  const renderContent = () => {
    switch (selectedTab) {
      case 'Profile':
        return <Profile />;
      case 'History':
        return <History />;
      case 'Report':
        return <Report />;
      case 'Setting':
        return <Setting />;
      default:
        return <Profile />;
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.profileContainer}>
    <Image
      source={{
        uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQYbPC_y5E_pg3CiD_uFQi2BKqQJJJx04BaHsF1Xlse_W5q_VdL',
      }}
      style={styles.profileImage}
    />
  </View>
      <TouchableOpacity style={styles.touchableContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.profileName}>Ronaldo</Text>
          <Icon name="wrench" size={20} color="#000" />
        </View>
      </TouchableOpacity>

      <View style={styles.tabBarContainer}>
        {['Profile', 'History', 'Report', 'Setting'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setSelectedTab(tab)}>
            <Text
              style={
                selectedTab === tab ? styles.activeTabText : styles.tabText
              }>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: '1',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    padding: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2F95DC',
  },
  tabText: {
    fontSize: 14,
    color: 'gray',
  },
  activeTabText: {
    fontSize: 14,
    color: '#2F95DC',
    fontWeight: '600',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff6b01',
    marginBottom: 15,
    justifyContent: 'center',
  },
  profileContainer: {
  alignItems: 'center',
},
  touchableContainer: {
    alignItems: 'center',
    backgroundColor: '#ff6b01',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});
