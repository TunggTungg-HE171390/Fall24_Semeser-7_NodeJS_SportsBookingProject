import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Search, MapPin, Share2, Plus } from 'lucide-react-native';
import CreatePostModal from "../components/Create_post_modal";
const Explore_screen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Saturday Morning Tennis",
      genre: "Tennis",
      date: "7AM - 6PM",
      image: require("../assets/images/san-tennis.jpg"),
      location: "Hoa Lac",
    },
    {
      id: 2,
      title: "Saturday Morning Football",
      genre: "Football",
      date: "7AM - 6PM",
      image: require("../assets/images/san-nhan-tao.jpg"),
      location: "Hoa Lac",
    },
    {
      id: 3,
      title: "Saturday Morning Badminton",
      genre: "Badminton",
      date: "7AM - 6PM",
      image: require("../assets/images/san-cau-long.jpg"),
      location: "Hoa Lac",
    },
  ]);

  const genres = [
    {
      name: "Football",
      image: require("../assets/images/sports/football.jpg"),
    },
    {
      name: "Tennis",
      image: require("../assets/images/sports/tennis.jpg"),
    },
    {
      name: "Badminton",
      image: require("../assets/images/sports/badminton.jpg"),
    },
    {
      name: "Table tennis",
      image: require("../assets/images/sports/table-tennis.jpg"),
    },
  ];
  const timeFilters = ["Tomorrow", "Next week", "Next Month", "All upcoming"];

  const EventCard = ({ post }) => (
    <View style={styles.eventCard}>
      <Image source={post.image} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{post.title}</Text>
        <Text style={styles.eventDetails}>{post.date}</Text>
        <View style={styles.eventLocation}>
          <MapPin color="#888" size={16} />
          <Text style={styles.eventLocationText}>{post.location}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.shareButton}>
        <Share2 color="#888" size={24} />
      </TouchableOpacity>
    </View>
  );

  const handleAddEvent = (newEvent) => {
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.genre) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setPosts([...posts, { ...newEvent, id: posts.length + 1 }]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TextInput style={styles.searchInput} placeholder="Search Sports" />
          <TouchableOpacity style={styles.iconButton}>
            <Search color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Find events near</Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>Hoa Lac</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>CHANGE</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.timeFilter}>
          {timeFilters.map((item, index) => (
            <TouchableOpacity key={index} style={styles.timeFilterItem}>
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Your posts</Text>
        {posts.map((post) => (
          <EventCard key={post.id} post={post} />
        ))}

        <Text style={styles.sectionTitle}>Explore by genre</Text>
        <View style={styles.genreGrid}>
          {genres.map((genre, index) => (
            <TouchableOpacity key={index} style={styles.genreItem}>
              <Image style={styles.genreImage} source={genre.image} />
              <Text style={styles.genreText}>{genre.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Plus color="#fff" size={24} />
      </TouchableOpacity>

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
  },
  iconButton: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 10,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  locationText: {
    fontSize: 16,
  },
  changeText: {
    color: "orange",
    fontWeight: "bold",
  },
  timeFilter: {
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 5,
  },
  timeFilterItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDetails: {
    color: "#888",
    marginTop: 5,
  },
  eventLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  eventLocationText: {
    marginLeft: 5,
    color: "#888",
  },
  shareButton: {
    padding: 5,
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  genreItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  genreImage: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
  },
  genreText: {
    marginTop: 5,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "orange",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

export default Explore_screen;
