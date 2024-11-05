import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import { Search, MapPin, Share2, Plus } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PostAPI from "../api/post.service";
import DetailedPostModal from "../components/Detailed_post_modal";
import { useSelector } from "react-redux";

const Explore_screen = () => {
  const [selectedEvent, setSelectedEvent] = useState({});
  const [detailedPostModalVisible, setDetailedPostModalVisible] =
    useState(false);

  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state?.auth.user);
  console.log("userId:  ", user?.id);
  console.log("userRole:  ", user?.role);
  async function fetchPosts() {
    const res = await PostAPI.getAllPosts();
    setPosts(res);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const timeFilters = ["Tomorrow", "Next week", "Next Month", "All upcoming"];

  const EventCard = ({ post }) => {
    if (!post) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => {
          setSelectedEvent(post);
          setDetailedPostModalVisible(true);
        }}
      >
        {/* sửa chỗ này */}
        <Image source={{ uri: post?.image?.[0] }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{post?.title}</Text>
          <Text style={styles.eventDetails}>
            {new Date(post?.date).toLocaleDateString()}
          </Text>
          <View style={styles.eventLocation}>
            <MapPin color="#888" size={16} />
            <Text style={styles.eventLocationText}>
              {post?.location?.address}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 color="#888" size={24} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
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
          <Text style={styles.sectionTitle}>List posts</Text>
          {posts.map((post) => (
            <EventCard key={post._id} post={post} />
          ))}
        </ScrollView>

        {/* Modal here */}

        <DetailedPostModal
          visible={detailedPostModalVisible}
          event={selectedEvent || {}}
          onClose={() => setDetailedPostModalVisible(false)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 30,
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
