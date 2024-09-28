import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { API_URL } from "@env";

const RequiredInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}) => (
  <View className="mb-5">
    <Text className="font-semibold">
      {label} <Text style={{ color: "red" }}>*</Text>
    </Text>
    <TextInput
      className="h-12 border border-gray-300 rounded-md px-3"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

const OptionalInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}) => (
  <View className="mb-5">
    <Text className="font-semibold">{label}</Text>
    <TextInput
      className="h-12 border border-gray-300 rounded-md px-3"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);
export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  // const API_URL = process.env.API_URL;

  const handleSendOTP = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/user/sendOTP?email=${encodeURIComponent(
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
        console.log("ban");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView style={{ padding: 30 }}>
      <View className="flex-1 justify-center p-5">
        <Text className="text-2xl font-bold mb-6 text-center">Register</Text>

        <RequiredInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />

        <RequiredInput
          label="Full Name"
          value={fullname}
          onChangeText={setFullname}
          placeholder="Enter your full name"
        />

        <RequiredInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />

        <RequiredInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
        />

        <OptionalInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
        />

        <RequiredInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <RequiredInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-green-600 py-4 rounded-md"
          style={{
            backgroundColor: "#AD40AF",
          }}
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
    </ScrollView>
  );
}
