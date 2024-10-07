import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Image } from 'react-native';

export default function Report() {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([
    { rating: 5, feedback: 'Sân A rất đẹp, tôi rất hài lòng!', image: 'https://via.placeholder.com/150' },
    { rating: 4, feedback: 'Sân B khá ổn, sẽ quay lại.', image: 'https://via.placeholder.com/150' },
    { rating: 3, feedback: 'Sân C tạm được, cần cải thiện thêm.', image: 'https://via.placeholder.com/150' },
    { rating: 5, feedback: 'Sân D tuyệt vời, dịch vụ tốt.', image: 'https://via.placeholder.com/150' },
    { rating: 4, feedback: 'Sân E có vị trí thuận tiện.', image: 'https://via.placeholder.com/150' },
    { rating: 5, feedback: 'Sân F rất đẹp, tôi rất thích.', image: 'https://via.placeholder.com/150' },
    { rating: 4, feedback: 'Sân G tốt nhưng giá hơi cao.', image: 'https://via.placeholder.com/150' },
    { rating: 3, feedback: 'Sân H tạm ổn, cần cải thiện cơ sở vật chất.', image: 'https://via.placeholder.com/150' },
    { rating: 5, feedback: 'Sân I rộng rãi, thoáng mát.', image: 'https://via.placeholder.com/150' },
    { rating: 4, feedback: 'Sân J có chất lượng khá tốt.', image: 'https://via.placeholder.com/150' },
  ]);

  const handleSubmit = () => {
    if (feedback && rating) {
      // Logic xử lý gửi feedback, có thể gửi lên server hoặc lưu trữ lại
      const newReview = { rating, feedback, image: 'https://via.placeholder.com/150' };
      setReviews([newReview, ...reviews]);
      console.log('Feedback:', feedback);
      console.log('Rating:', rating);
      setSubmitted(true);
    } else {
      alert('Vui lòng điền đầy đủ thông tin phản hồi và đánh giá.');
    }
  };

  return (
    <View style={styles.container}>

      
      <ScrollView style={styles.reviewContainer} contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.label}>Đánh giá trước đó về các sân:</Text>
        {reviews.slice(0, 10).map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <Image source={{ uri: review.image }} style={styles.reviewImage} />
            <View style={styles.reviewTextContainer}>
              <Text style={styles.reviewRating}>Đánh giá: {review.rating} ⭐</Text>
              <Text style={styles.reviewFeedback}>{review.feedback}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 120,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  reviewContainer: {
    width: '100%',
    marginTop: 20,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewFeedback: {
    fontSize: 16,
  },
});