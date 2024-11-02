import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Profile from '../Manage_History_Booking/Profile';
import History from '../Manage_History_Booking/History';
import Report from '../Manage_History_Booking/Report';
import Setting from '../Manage_History_Booking/Setting';
import { useSelector } from 'react-redux';
import axios from "axios";

export default function CustomTabScreen() {
  const [selectedTab, setSelectedTab] = useState('Profile');
  const [count, setCount] = useState(0);
  const userName = useSelector(state => state.auth.user?.name);
  const userId = useSelector(state => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      getCountFieldOrderByCustomerId();
    }
  }, [userId]);

  const getCountFieldOrderByCustomerId = async () => {
    try {
      console.log("Fetching count for user:", userId);
      const res = await axios.get(`http://192.168.1.38:3000/field-order/count-by-customer/${userId}`);
      const count = res.data.data;
      setCount(count);
      console.log("Count fetched successfully:", count);
    } catch (error) {
      console.error("Error fetching field orders:", error.response || error.message || error);
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Profile":
        return <Profile />;
      case "History":
        return <History />;
      case "Report":
        return <Report />;
      case "Setting":
        return <Setting />;
      default:
        return <Profile />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileContainerInfo}>
          <Image
            source={{
              uri: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQYbPC_y5E_pg3CiD_uFQi2BKqQJJJx04BaHsF1Xlse_W5q_VdL",
            }}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.threadButton}>
          <TouchableOpacity style={{ flexDirection: 'row' }}>
            <Icon name="fire" size={18} color="red" style={styles.icon} />
            <Text style={{ color: "white" }}>Số lửa đã đạt: {count} </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileName}>
        <Text style={styles.profileNameText}>Tài khoản: {userName}</Text>
      </View>

      <View style={styles.profileContainerButton}>
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={18} color="#ccc" style={styles.icon} />
            <Text style={styles.buttonText}>Chỉnh sửa trang cá nhân</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.buttonText}>...</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.componentUnder}>
        <View style={styles.tabBarContainer}>
          {["Profile", "History", "Report", "Setting"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={styles.tabText}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* Tab Content */}
      <View style={styles.component}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
  },
  component: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "gray",
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderRadius: 25,
    backgroundColor: "#000000",
    width: "98%",
    alignSelf: "center",
    marginTop: 7,
  },
  tabButton: {
    padding: 10,
  },
  activeTabButton: {
    backgroundColor: "#ff6b01",
    borderRadius: 15,
    paddingVertical: 11,
  },
  tabText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  activeTabText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ff6b01",
    marginBottom: 15,
    justifyContent: "flex-start",
  },
  profileContainer: {
    marginTop: 40,
    width: "98%",
    marginLeft: "10%",
    alignSelf: "center",
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchableContainer: {
    // alignItems: "center",
    backgroundColor: "#ff6b01",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
  },
  profileNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileName: {
    marginBottom: 10,
    marginLeft: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  icon: {
    marginRight: 5,
  },
  buttonText: {
    color: '#ccc',
    fontSize: 16,
  },
  moreButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#555',
    borderRadius: 6,
    backgroundColor: '#555',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    width: '76%',
    marginLeft: 5,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    width: '18%',
  },
  profileContainerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    marginBottom: 10,
  },
  profileContainerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '98%',
  },
  componentUnder: {
    backgroundColor: "gray",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  threadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b01',
    paddingHorizontal: 12,
    paddingVertical: 22,
    borderRadius: 10,
    marginRight: 22,
    marginBottom: 18,
  },
});