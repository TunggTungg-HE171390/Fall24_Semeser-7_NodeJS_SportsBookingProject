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
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  touchableContainer: {
    alignItems: 'center',
    backgroundColor: '#ff6b01',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    width: '100%', // Đảm bảo navBar chiếm toàn bộ chiều ngang
    borderColor: '#ddd',

  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#000',
  },
  activeButton: {
    backgroundColor: '#ff6b01',
  },
});
