import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { API_URL } from "@env";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  // const API_URL = process.env.API_URL;
  const handleForgotPassword = async () => {
    console.log("Current API URL:", API_URL);

    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/user/forgotpassword?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password reset link sent to your email", [
          {
            text: "OK",
            onPress: async () => navigation.navigate("ResetPassword"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to send reset link");
        console.log("babab");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View className="flex-1 justify-center p-5">
      <Text className="text-2xl font-bold mb-6 text-center">
        Forgot Password
      </Text>

      <TextInput
        className="h-12 border border-gray-300 px-3 rounded-md mb-5"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-md"
        onPress={handleForgotPassword}
        style={{
          backgroundColor: "#AD40AF",
        }}
      >
        <Text className="text-white text-center font-bold">
          Send Reset Link
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-blue-600 text-center mt-6">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
