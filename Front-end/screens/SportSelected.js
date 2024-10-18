import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SLIDER_HEIGHT = 250;
const ITEM_WIDTH = Dimensions.get("window").width * 0.8;

const sportsData = [
  {
    sportName: "Football",
    icon: <Icon name="futbol-o" size={100} color="#000" />,
  },
  {
    sportName: "Basketball",
    icon: <MaterialCommunityIcons name="basketball" size={100} color="#000" />,
  },
  {
    sportName: "Badminton",
    icon: <MaterialCommunityIcons name="badminton" size={100} color="#000" />,
  },
  {
    sportName: "Billiards",
    icon: <MaterialCommunityIcons name="billiards" size={100} color="#000" />,
  },
  {
    sportName: "Tennis",
    icon: <MaterialCommunityIcons name="tennis" size={100} color="#000" />,
  },
];

export default function SportSelected({ navigation }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onPress = () => {
    navigation.replace("ExploreScreen");
  };

  const handleNext = () => {
    if (currentIndex < sportsData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.sportName}>{item.sportName}</Text>
      {item.icon}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.carouselWrapper}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={[styles.arrowButton, styles.arrowLeft]}
        >
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={sportsData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.sportName}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / ITEM_WIDTH
            );
            setCurrentIndex(newIndex);
          }}
          style={styles.flatList}
        />

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.arrowButton, styles.arrowRight]}
        >
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Fitness made easy</Text>
      <Text style={styles.description}>
        Filter and book with coaches in blink of an eye
      </Text>

      <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
        <Text style={styles.ctaButtonText}>Get Started now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 20,
  },
  carouselWrapper: {
    height: SLIDER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 20,
  },
  flatList: {
    flexGrow: 0,
  },
  sportName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  slide: {
    width: ITEM_WIDTH,
    height: SLIDER_HEIGHT, // Tăng chiều cao thêm 50 đơn vị
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 20, // Tạo khoảng cách giữa các slide
    flex: 1,
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -15 }],
    zIndex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  arrowLeft: {
    left: 10,
  },
  arrowRight: {
    right: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  ctaButton: {
    height: 50,
    backgroundColor: "#ff6b01",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
