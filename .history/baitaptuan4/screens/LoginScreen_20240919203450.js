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

import { useUser } from "../src/hook/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "../src/components/InputField";
import CustomButton from "../src/components/CustomButton";
import { useAuth } from "../src/hook/authContext";
// export default function LoginScreen({ navigation }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { setUser } = useUser();
//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert("Error", "Please enter both username and password");
//       return;
//     }

//     try {
//       const response = await fetch("http://192.168.56.1:3000/user/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // If login is successful, handle accessToken
//         console.log(data.userData); // You can use accessToken here
//         setUser(data.userData);
//         await AsyncStorage.setItem("@accessToken", data.accessToken);
//         Alert.alert("Success", "Login successful", [
//           { text: "OK", onPress: () => navigation.navigate("Main") }, // Redirect to Home screen or any other screen
//         ]);
//       } else {
//         // Handle errors (e.g., invalid credentials)
//         Alert.alert("Error", data.message || "Login failed");
//       }
//     } catch (error) {
//       // Handle network or other errors
//       Alert.alert("Error", error.message || "Something went wrong");
//     }
//   };

//   // return (
//   //   <View className="flex-1 justify-center px-4">
//   //     <Text className="text-3xl font-semibold text-center mb-6">Login</Text>

//   //     <TextInput
//   //       className="border border-gray-300 p-3 rounded-md mb-4"
//   //       placeholder="Username"
//   //       value={username}
//   //       onChangeText={setUsername}
//   //       autoCapitalize="none"
//   //     />

//   //     <TextInput
//   //       className="border border-gray-300 p-3 rounded-md mb-6"
//   //       placeholder="Password"
//   //       value={password}
//   //       onChangeText={setPassword}
//   //       secureTextEntry
//   //     />

//   //     <TouchableOpacity
//   //       className="bg-blue-600 py-3 rounded-md"
//   //       onPress={handleLogin}
//   //     >
//   //       <Text className="text-white text-center font-medium">Login</Text>
//   //     </TouchableOpacity>

//   //     <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//   //       <Text className="text-blue-600 text-center mt-4">
//   //         Don't have an account? Register
//   //       </Text>
//   //     </TouchableOpacity>

//   //     <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
//   //       <Text className="text-blue-600 text-center mt-2">Forgot password?</Text>
//   //     </TouchableOpacity>
//   //   </View>
//   // );

//   return (
//     <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
//       <View style={{ paddingHorizontal: 25 }}>
//         <View style={{ alignItems: "center" }}>
//           {/* <LoginSVG
//             height={300}
//             width={300}
//             style={{ transform: [{ rotate: "-5deg" }] }}
//           /> */}
//         </View>

//         <Text
//           style={{
//             fontFamily: "Roboto-Medium",
//             fontSize: 28,
//             fontWeight: "500",
//             color: "#333",
//             marginBottom: 30,
//           }}
//         >
//           Login
//         </Text>
//         <InputField
//           label={"Username"}
//           icon={
//             <MaterialIcons
//               name="alternate-email"
//               size={20}
//               color="#666"
//               style={{ marginRight: 5 }}
//             />
//           }
//           keyboardType="email-address"
//         />

//         <InputField
//           label={"Password"}
//           icon={
//             <Ionicons
//               name="ios-lock-closed-outline"
//               size={20}
//               color="#666"
//               style={{ marginRight: 5 }}
//             />
//           }
//           inputType="password"
//           fieldButtonLabel={"Forgot?"}
//           fieldButtonFunction={() => {}}
//         />

//         <CustomButton label={"Login"} onPress={() => {}} />

//         <Text style={{ textAlign: "center", color: "#666", marginBottom: 30 }}>
//           Or, login with ...
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "center",
//             marginBottom: 30,
//           }}
//         >
//           <Text>New to the app?</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//             <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
//               {" "}
//               Register
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useAuth();
  const { setUser } = useUser();
  const handleLogin = async () => {
    // Kiểm tra nếu username hoặc password bị trống
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      const response = await fetch("${API_URL}/user/login", {
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
        console.log(data.userData);
        setUser(data.userData);
        await AsyncStorage.setItem("@accessToken", data.accessToken);
        setIsAuthenticated(true);
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
