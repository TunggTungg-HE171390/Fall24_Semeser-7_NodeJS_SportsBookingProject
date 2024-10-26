import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from "react-redux";
import { login } from "./redux/authSlice";
import axios from 'axios';

export default function Login({ navigation }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const handleLogin = () => {
        axios.post("http://192.168.1.7:3000/auth/sign-in", {
            identifier: identifier,
            password: password,
        })
            .then(res => {
                console.log(res.data.userInfo);
                console.log("Login successful");
                dispatch(login(res.data.userInfo));
                // navigation.navigate("./Explore");
            })
            .catch(error => {
                // const errorMessage = error.response?.data?.message || "Đăng nhập thất bại";
                // console.error("Lỗi:", errorMessage);
                // setErrorMessage(errorMessage); 
                console.log("Login failed");
                console.log(error.response);
            });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Get Started with Sports Booking</Text>

            <TextInput
                style={styles.input}
                placeholder="EMAIL"
                keyboardType="email-address"
                onChangeText={(text) => setIdentifier(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="PASSWORD"
                onChangeText={(text) => setPassword(text)} secureTextEntry={true}
            />

            <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>----------------OR----------------</Text>

            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Continue with Google">
                <Icon name="google" size={24} color="#DB4437" style={styles.icon} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Continue with Apple">
                <Icon name="apple" size={24} color="#000" style={styles.icon} />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Continue with Facebook">
                <Icon name="facebook" size={24} color="#4267B2" style={styles.icon} />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
                By continuing, you agree to our Terms and Conditions
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
    },

    backButton: {
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    continueButton: {
        height: 50,
        backgroundColor: '#ff6b01',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    continueButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: '#666',
    },
    socialButton: {
        flexDirection: 'row',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    socialButtonText: {
        fontSize: 16,
        color: '#000',
    },
    termsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#666',
    },
});
