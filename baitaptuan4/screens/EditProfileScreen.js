import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { useAuth } from "../src/hook/authContext";

const EditProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { user, setUser } = useAuth();
  const API_URL = process.env.API_URL;
  useEffect(() => {
    if (user) {
      setUsername(user?.username);
      setFullname(user?.fullname);
      setPhone(user?.phone);
      setAddress(user?.address);
      setEmail(user?.email);
    }
  }, []);
  const handleSendOTP = async () => {
    try {
      const response = await fetch(
        `${API_URL}/user/sendOTP?email=${encodeURIComponent(
          email
        )}&action=EditAccount`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { otp_code, action } = await response.json();

      if (response.ok) {
        // Nếu sendOTP thành công
        Alert.alert("Success", "Send OTP to your email", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Auth", {
                screen: "OTP",
                params: {
                  otp_code, // Mã OTP
                  action, // Hành động liên quan
                  username, // Tên đăng nhập
                  email, // Email
                  fullname, // Tên đầy đủ
                  phone, // Số điện thoại
                  address, // Địa chỉ
                },
              }),
          },
        ]);
      } else {
        Alert.alert("Error", "Edit Account failed");
        console.log("aa")
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView style={{ padding: 30 }}>
      <View className="flex-1 justify-center p-5">
        <Text className="text-2xl font-bold mb-5 text-center">
          Update profile
        </Text>

        <TextInput
          className="h-12 border border-gray-300 px-3 rounded-md mb-5"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={false}
        />

        <TextInput
          className="h-12 border border-gray-300 px-3 rounded-md mb-5"
          placeholder="Full Name"
          value={fullname}
          onChangeText={setFullname}
          autoCapitalize="words"
        />
        <TextInput
          className="h-12 border border-gray-300 px-3 rounded-md mb-5"
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="words"
        />

        <TextInput
          className="h-12 border border-gray-300 px-3 rounded-md mb-5"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false}
        />

        <TextInput
          className="h-12 border border-gray-300 px-3 rounded-md mb-5"
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-md"
          onPress={handleSendOTP}
        >
          <Text className="text-white text-center font-bold">Edit user</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
