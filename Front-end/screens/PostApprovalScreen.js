import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { Search, MapPin, Share2, Check, X } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PostAPI from "../api/post.service";
import DetailedPostModal from "../components/Detailed_post_modal";
import { useSelector } from "react-redux";
import { POST_STATUS } from "../utils/constant";

const PostApprovalScreen = () => {
  const user = useSelector((state) => state?.auth?.user);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [detailedPostModalVisible, setDetailedPostModalVisible] =
    useState(false);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const fetchPosts = async () => {
    try {
      //
      setIsLoading(true);
      const posts = await PostAPI.getPostsPending();
      setPendingPosts(posts);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCheckbox = (postId) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleUpdateStatus = async (newStatus) => {
    console.log("newStatus: ", newStatus);
    console.log("selectedPosts: ", selectedPosts);
    console.log("user: ", user.id);
    try {
      setIsLoading(true);
      const userId = user?.id;
      const res = await PostAPI.updateStatusOfPosts(
        selectedPosts,
        userId,
        newStatus
      );

      if (res?.success === true) {
        await fetchPosts();
        setSelectedPosts(new Set());
        Alert.alert(
          "Success",
          `Successfully updated ${selectedPosts.size} posts`
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => handleUpdateStatus(POST_STATUS.PUBLISHED);
  const handleReject = () => handleUpdateStatus(POST_STATUS.DENIED);

  const timeFilters = ["Tomorrow", "Next week", "Next Month", "All upcoming"];

  const EventCard = ({ post }) => {
    if (!post) {
      return null;
    }
    const isSelected = selectedPosts.has(post._id);

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => {
          setSelectedEvent(post);
          setDetailedPostModalVisible(true);
        }}
      >
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          onPress={(e) => {
            e.stopPropagation();
            handleCheckbox(post._id);
          }}
        >
          {isSelected && <Check color="#fff" size={16} />}
        </TouchableOpacity>
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
            <Text>Status: {post?.status}</Text>
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
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <TextInput style={styles.searchInput} placeholder="Search Sports" />
            <TouchableOpacity style={styles.iconButton}>
              <Search color="#000" size={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Pending Posts</Text>
          {pendingPosts.map((post) => (
            <EventCard key={post._id} post={post} />
          ))}
        </ScrollView>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={handleReject}
            disabled={selectedPosts.size === 0}
          >
            <X color="#fff" size={20} />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAccept}
            disabled={selectedPosts.size === 0}
          >
            <Check color="#fff" size={20} />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>

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
  scrollContainer: {
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
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
  bottomButtons: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  rejectButton: {
    backgroundColor: "#FF5252",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default PostApprovalScreen;
