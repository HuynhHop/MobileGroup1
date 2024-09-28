import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../src/hook/authContext";

export default function OTPScreen({ route, navigation }) {
  const { otp_code, action, username, password, email, fullname, phone } =
    route.params;
  const { user, setUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.API_URL;
  const handleActionWithOTP = async () => {
    if (otp !== otp_code) {
      Alert.alert("Error", "OTP do not match");
      return;
    }
    console.log("otp : ", otp);
    console.log("otp_code : ", otp_code);
    console.log("action: ", action);

    if (action === "CreateAccount") {
      console.log(123);
      try {
        const response = await fetch(`${API_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            fullname,
            email,
            phone,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Nếu đăng ký thành công
          Alert.alert("Success", data.message, [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
        } else {
          // Nếu đăng ký không thành công
          const errorMessage =
            typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message);
          Alert.alert("Error", errorMessage || "Registration failed");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Something went wrong");
      }
    } else if (action === "EditAccount") {
      const accessToken = await AsyncStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_URL}/user/`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            fullname,
            email,
            phone,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Nếu đăng ký thành công
          setUser(data.updatedUser);
          Alert.alert("Success", data.message, [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("EditProfile", { user: data.user }),
            },
          ]);
        } else {
          // Nếu đăng ký không thành công
          const errorMessage =
            typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message);
          Alert.alert("Error", errorMessage || "Edit account failed");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Something went wrong");
      }
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "OTP must be 6 digits");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/user/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        Alert.alert("Success", "OTP verified successfully", [
          {
            text: "OK",
            onPress: () => navigation.navigate("HomeScreen"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to verify OTP");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View className="flex-1 justify-center p-5">
      <Text className="text-2xl font-bold mb-6 text-center">Enter OTP</Text>

      <TextInput
        className="h-12 border border-gray-300 px-3 rounded-md mb-5 text-lg text-center"
        placeholder="Enter 6-digit OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#AD40AF",
        }}
        className="bg-blue-600 py-4 rounded-md"
        onPress={handleActionWithOTP}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isLoading ? "Verifying..." : "Submit OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-blue-600 text-center mt-6 text-lg">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
