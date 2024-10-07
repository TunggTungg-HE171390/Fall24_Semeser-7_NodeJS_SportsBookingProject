import React, { useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const features = [
  { name: 'Schedule', icon: 'calendar' },
  { name: 'History', icon: 'history' },
  { name: 'Review', icon: 'star' },
  { name: 'Report', icon: 'flag' },
  { name: 'Setting', icon: 'cog' },
];

export default function HeaderMenu() {
  const [viewFeature, setFeature] = useState('Schedule');
  const navigation = useNavigation(); 
 useEffect(() => {
    if (viewFeature === 'Schedule') {
      navigation.navigate('Profile');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQYbPC_y5E_pg3CiD_uFQi2BKqQJJJx04BaHsF1Xlse_W5q_VdL',
        }}
        style={styles.profileImage}
      />
      <TouchableOpacity style={styles.touchableContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.profileName}>Ronaldo</Text>
          <Icon name="wrench" size={20} color="#000" />
        </View>
      </TouchableOpacity>

      <View style={styles.navBar}>
        {features.map((feature, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.navItem, viewFeature === feature.name && styles.activeButton]}
            onPress={() => {
              setFeature(feature.name);
              if (feature.name === 'Schedule' ) {
                navigation.navigate('Profile');
              }else if (feature.name === 'History') {
                navigation.navigate('History');
              }else if (feature.name === 'Setting') {
                navigation.navigate('Setting');
              }
            }}
          >
            <Icon name={feature.icon} size={24} color="#000" />
            <Text style={styles.navText}>{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff6b01',
    marginBottom: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
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
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  navText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  activeButton: {
    backgroundColor: '#ff6b01',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
