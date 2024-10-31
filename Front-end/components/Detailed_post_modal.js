import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

const DetailedPostModal = ({ visible, event, onClose }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  if (!event) return null;

  const truncateDescription = (text = "", maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / (screenWidth - 40));
    setCurrentImageIndex(imageIndex);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalWrapper}>
          <ScrollView style={styles.modalContent}>
            {/* Image Carousel */}
            <View style={styles.carouselContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {event.image?.map((imageUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={[styles.eventImage, { width: screenWidth - 40 }]}
                  />
                ))}
              </ScrollView>
              {/* Carousel Indicators */}
              <View style={styles.indicatorContainer}>
                {event.image?.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentImageIndex && styles.activeIndicator,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Title */}
            <Text style={styles.eventTitle}>{event.title}</Text>

            {/* Description */}
            <TouchableOpacity onPress={toggleDescription}>
              <Text style={styles.eventDescription}>
                {isDescriptionExpanded
                  ? event.description
                  : truncateDescription(event.description, 100)}
              </Text>
            </TouchableOpacity>

            {/* Location */}
            <Text style={styles.eventLocation}>
              Location: {event.location?.address}
            </Text>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalWrapper: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    maxHeight: "70%",
    overflow: "hidden",
  },
  modalContent: {
    padding: 20,
    paddingBottom: 10,
  },
  carouselContainer: {
    position: "relative",
    marginBottom: 15,
  },
  eventImage: {
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "white",
  },
  eventTitle: {
    fontSize: 20, // Reduced from 24
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14, // Reduced from 16
    marginBottom: 12,
    lineHeight: 20,
  },
  eventLocation: {
    fontSize: 14,
    color: "grey",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "orange",
    padding: 12,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DetailedPostModal;
