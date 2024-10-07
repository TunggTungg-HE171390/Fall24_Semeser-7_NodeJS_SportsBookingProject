import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';

const SLIDER_HEIGHT = 250; // Chiều cao của carousel
const ITEM_WIDTH = Dimensions.get('window').width * 0.8; // Độ rộng của phần màu xám (chiếm 80% chiều rộng màn hình)

export default function FitnessAppScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.carouselWrapper}>
                <Swiper
                    style={styles.wrapper}
                    showsButtons={true}
                    loop={true}
                    autoplay={true}
                    autoplayTimeout={3}
                    dotStyle={styles.dot}
                    activeDotStyle={styles.activeDot}
                    buttonWrapperStyle={styles.buttonWrapper}
                    prevButton={<Icon name="chevron-left" size={30} color="#000" style={styles.navButton} />}
                    nextButton={<Icon name="chevron-right" size={30} color="#000" style={styles.navButton} />}
                >
                    <View style={styles.slide}>
                        <Icon name="futbol-o" size={100} color="#000" />
                    </View>
                    <View style={styles.slide}>
                        <Icon name="bicycle" size={100} color="#000" />
                    </View>
                    <View style={styles.slide}>
                        <Icon name="heartbeat" size={100} color="#000" />
                    </View>
                </Swiper>
            </View>

            {/* Title and Description */}
            <Text style={styles.title}>Fitness made easy</Text>
            <Text style={styles.description}>Filter and book with coaches in blink of an eye</Text>

            {/* CTA Button */}
            <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Get Started now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        padding: 20,
    },
    carouselWrapper: {
        height: SLIDER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    wrapper: {
        width: ITEM_WIDTH, // Độ rộng của phần màu xám
        height: SLIDER_HEIGHT,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Màu nền xám cho phần chứa hình ảnh
        borderRadius: 20,
    },
    dot: {
        backgroundColor: '#ddd',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    activeDot: {
        backgroundColor: '#ff6b01',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    buttonWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    navButton: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    ctaButton: {
        height: 50,
        backgroundColor: '#ff6b01',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    ctaButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
