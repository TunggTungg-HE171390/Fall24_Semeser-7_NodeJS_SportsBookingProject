import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Search, MapPin, Share2, Plus } from "lucide-react-native";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import CreatePostModal from "../components/Create_post_modal";
import DetailedPostModal from "../components/Detailed_post_modal";
import EditPostModal from "../components/Edit_post_modal";
const Explore_screen = () => {
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [editPostModalVisible, setEditPostModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [detailedPostModalVisible, setDetailedPostModalVisible] =
    useState(false);

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      await axios.get("http://192.168.1.13:3000/post/").then((res) => {
        console.log(res.data);
        setPosts(res.data.result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // const posts = [
  //   {
  //     id: 1,
  //     title: "Saturday Morning Tennis",
  //     genre: "Tennis",
  //     date: "7AM - 6PM",
  //     image: require("../assets/images/san-tennis.jpg"),
  //     location: "Hoa Lac",
  //   },
  //   {
  //     id: 2,
  //     title: "Saturday Morning Football",
  //     genre: "Football",
  //     date: "7AM - 6PM",
  //     image: require("../assets/images/san-nhan-tao.jpg"),
  //     location: "Hoa Lac",
  //   },
  //   {
  //     id: 3,
  //     title: "Saturday Morning Badminton",
  //     genre: "Badminton",
  //     date: "7AM - 6PM",
  //     image: require("../assets/images/san-cau-long.jpg"),
  //     location: "Hoa Lac",
  //   },
  // ];

  // const [posts, setPosts] = useState([]);

  // Fetch notes from the backend
  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  // const fetchPosts = async () => {
  //   try {
  //     const response = await axios.get('http://192.168.1.13:3000/posts/list');
  //     setPosts(response.data);
  //   } catch (error) {
  //     console.error('Error fetching posts:', error);
  //   }
  // };

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

  const handleAddEvent = (newEvent) => {
    if (
      !newEvent.title ||
      !newEvent.date ||
      !newEvent.location ||
      !newEvent.genre
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setPosts([...posts, { ...newEvent, id: posts.length + 1 }]);
    setCreatePostModalVisible(false);
  };

  const handleDeleteEvent = (eventId) => {
    setPosts(posts.filter((post) => post.id !== eventId));
  };

  const handleEditEvent = (updatedEvent) => {
    setPosts(
      posts.map((post) => (post.id === updatedEvent.id ? updatedEvent : post))
    );
    setEditPostModalVisible(false);
  };

  const EventCard = ({ post }) => {
    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEvent(post.id)}
      >
        <FontAwesome name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    );

    const renderLeftActions = () => (
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedEvent(post);
          setEditPostModalVisible(true);
        }}
      >
        <FontAwesome name="edit" size={24} color="#fff" />
      </TouchableOpacity>
    );
    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <TouchableOpacity
          style={styles.eventCard}
          onPress={() => {
            setSelectedEvent(post);
            setDetailedPostModalVisible(true);
          }}
        >
          {/* sửa chỗ này */}
          <Image source={{ uri: post.image[0] }} style={styles.eventImage} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{post.title}</Text>
            <Text style={styles.eventDetails}>
              {new Date(post.date).toLocaleDateString()}
            </Text>
            <View style={styles.eventLocation}>
              <MapPin color="#888" size={16} />
              <Text style={styles.eventLocationText}>{post.location}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 color="#888" size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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

          {/* Post here */}
          <Text style={styles.sectionTitle}>Your posts</Text>
          {posts.map((post) => (
            <EventCard key={post._id} post={post} />
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
          onPress={() => setCreatePostModalVisible(true)}
        >
          <Plus color="#fff" size={24} />
        </TouchableOpacity>

        <CreatePostModal
          visible={createPostModalVisible}
          onClose={() => setCreatePostModalVisible(false)}
          onAdd={handleAddEvent}
        />

        <DetailedPostModal
          visible={detailedPostModalVisible}
          event={selectedEvent}
          onClose={() => setDetailedPostModalVisible(false)}
        />

        <EditPostModal
          visible={editPostModalVisible}
          onClose={() => setEditPostModalVisible(false)}
          post={selectedEvent || {}}
          onUpdate={handleEditEvent}
        />
      </View>
    </GestureHandlerRootView>
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
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
    marginRight: 10,
  },
});

export default Explore_screen;
