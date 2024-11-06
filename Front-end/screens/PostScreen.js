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
} from "react-native";
import { Search, MapPin, Share2, Plus } from "lucide-react-native";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import PostAPI from "../api/post.service";

import CreatePostModal from "../components/Create_post_modal";
import DetailedPostModal from "../components/Detailed_post_modal";
import EditPostModal from "../components/Edit_post_modal";
import { useSelector } from "react-redux";

import { POST_STATUS } from "../utils/constant";

const PostScreen = () => {
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [editPostModalVisible, setEditPostModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [detailedPostModalVisible, setDetailedPostModalVisible] =
    useState(false);

  const [myPosts, setMyPosts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [deniedPosts, setDeniedPosts] = useState([]);
  const user = useSelector((state) => state?.auth.user);
  async function fetchPosts() {
    console.log("Fetching posts for owner...");
    const res = await PostAPI.getPostsByOwner(user?.id);
    setMyPosts(res || []);
    setPublishedPosts(
      res.filter((post) => post.status === POST_STATUS.PUBLISHED) || []
    );
    setPendingPosts(
      res.filter((post) => post.status === POST_STATUS.PENDING) || []
    );
    setDeniedPosts(
      res.filter((post) => post.status === POST_STATUS.DENIED) || []
    );
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  //const timeFilters = ["Tomorrow", "Next week", "Next Month", "All upcoming"];
  const timeFilters = [];
  const handleAddEvent = async (formData) => {
    try {
      const res = await PostAPI.createPost(formData, user?.id, user?.role);
      await fetchPosts();
      setCreatePostModalVisible(false);
    } catch (error) {
      console.log("Error creating post:", error);
      Alert.alert(
        "Error",
        `Failed to create post: ${error || "Unknown error"}`
      );
    }
  };

  const handleDeleteEvent = async (postId) => {
    try {
      await PostAPI.deletePost(postId, user?.id, user?.role);
      Alert.alert("Success", "Post deleted successfully");
      await fetchPosts();
    } catch (error) {
      console.log("Error deleting post:", error);
      Alert.alert(
        "Error",
        `Failed to delete post: ${error || "Unknown error"}`
      );
    }
  };

  const handleEditEvent = async (formData, postId) => {
    console.log("Main screen");
    console.log("formData: ", formData);
    console.log("postId: ", postId);
    console.log("-------------------");
    try {
      await PostAPI.editPost(formData, postId);
      await fetchPosts();
      setEditPostModalVisible(false);
    } catch (error) {
      console.log("Error editing post:", error);
      Alert.alert("Error", `Failed to edit post: ${error || "Unknown error"}`);
    }
  };

  const EventCard = ({ post }) => {
    if (!post) {
      return null;
    }

    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEvent(post._id)}
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
          <Text style={styles.sectionTitle}>Your published posts</Text>
          {(publishedPosts.length > 0 && (
            <>
              {publishedPosts.map((post) => (
                <EventCard key={post._id} post={post} />
              ))}
            </>
          )) || <Text style={styles.noneText}>No published posts</Text>}

          <Text style={styles.sectionTitle}>Your pending posts</Text>
          {(pendingPosts.length > 0 && (
            <>
              {pendingPosts.map((post) => (
                <EventCard key={post._id} post={post} />
              ))}
            </>
          )) || <Text style={styles.noneText}>No pending posts</Text>}

          <Text style={styles.sectionTitle}>Your denied posts</Text>
          {(deniedPosts.length > 0 && (
            <>
              {deniedPosts.map((post) => (
                <EventCard key={post._id} post={post} />
              ))}
            </>
          )) || <Text style={styles.noneText}>No denied posts</Text>}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCreatePostModalVisible(true)}
        >
          <Plus color="#fff" size={24} />
        </TouchableOpacity>

        {/* Modal here */}
        <CreatePostModal
          visible={createPostModalVisible}
          onClose={() => setCreatePostModalVisible(false)}
          onAdd={handleAddEvent}
        />

        <DetailedPostModal
          visible={detailedPostModalVisible}
          event={selectedEvent || {}}
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
  noneText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginVertical: 5,
  },
});

export default PostScreen;
