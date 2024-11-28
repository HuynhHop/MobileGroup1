import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "../src/components/InputField";
import CustomButton from "../src/components/CustomButton";
import { useAuth } from "../src/hook/authContext";
import { API_URL } from "@env";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setIsAuthenticated, login } = useAuth();

  // const API_URL = process.env.API_URL;

  const handleLogin = async () => {
    console.log("Login Screen ");

    console.log("Current API URL:", API_URL);
    // Kiểm tra nếu username hoặc password bị trống
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Đăng nhập thành công
        await AsyncStorage.setItem("@accessToken", data.accessToken);
        login(data.userData);

        Alert.alert("Success", "Login successful", [
          { text: "OK", onPress: () => navigation.navigate("Main") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: "center" }}>
          {/* Placeholder for SVG or Image */}
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../assets/images/misc/login.jpg")}
              style={{
                width: 300,
                height: 300,
                borderRadius: 10,
                marginRight: 8,
              }}
            />
          </View>
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Login
        </Text>

        {/* Trường Username */}
        <InputField
          label={"Username"}
          value={username}
          onChangeText={(text) => setUsername(text)} // Đảm bảo setUsername được gọi đúng
          keyboardType="email-address"
        />

        {/* Trường Password */}
        <InputField
          label={"Password"}
          inputType="password"
          value={password}
          onChangeText={(text) => setPassword(text)} // Đảm bảo setPassword được gọi đúng
          fieldButtonLabel={"Forgot?"}
          fieldButtonFunction={() => navigation.navigate("ForgotPassword")}
        />

        <CustomButton label={"Login"} onPress={handleLogin} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
              {" "}
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
