import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSendOTP = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `http://192.168.56.1:3000/user/sendOTP?email=${encodeURIComponent(
          email
        )}&action=CreateAccount`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const { otp_code, action } = await response.json();
        // Nếu sendOTP thành công
        Alert.alert("Success", "Send OTP to your email", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("OTP", {
                otp_code,
                action,
                username,
                password,
                email,
                fullname,
                phone,
                address,
              }),
          },
        ]);
      } else {
        Alert.alert("Error", "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View className="flex-1 justify-center p-5">
      <Text className="text-2xl font-bold mb-6 text-center">Register</Text>

      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-5 px-3"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-5 px-3"
        placeholder="Full Name"
        value={fullname}
        onChangeText={setFullname}
        autoCapitalize="words"
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-5 px-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-5 px-3"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-5 px-3"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="words"
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-5 px-3"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-5 px-3"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-green-600 py-4 rounded-md"
        onPress={handleSendOTP}
      >
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-blue-600 text-center mt-6">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
