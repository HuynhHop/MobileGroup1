// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// export default function RegisterScreen({ navigation }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [fullname, setFullname] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");

//   const handleSendOTP = async () => {
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }
//     try {
//       const response = await fetch(
//         `http://192.168.56.1:3000/user/sendOTP?email=${encodeURIComponent(
//           email
//         )}&action=CreateAccount`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         const { otp_code, action } = await response.json();
//         // Nếu sendOTP thành công
//         Alert.alert("Success", "Send OTP to your email", [
//           {
//             text: "OK",
//             onPress: () =>
//               navigation.navigate("OTP", {
//                 otp_code,
//                 action,
//                 username,
//                 password,
//                 email,
//                 fullname,
//                 phone,
//                 address,
//               }),
//           },
//         ]);
//       } else {
//         Alert.alert("Error", "Registration failed");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong");
//     }
//   };

//   return (
//     <View className="flex-1 justify-center p-5">
//       <Text className="text-2xl font-bold mb-6 text-center">Register</Text>

//       <TextInput
//         className="h-12 border border-gray-300 rounded-md mb-5 px-3"
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//       />

//       <TextInput
//         className="h-12 border border-gray-300 rounded-md mb-5 px-3"
//         placeholder="Full Name"
//         value={fullname}
//         onChangeText={setFullname}
//         autoCapitalize="words"
//       />

//       <TextInput
//         className="h-12 border border-gray-300 rounded-md mb-5 px-3"
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         className="h-12 border border-gray-300 rounded-md mb-5 px-3"
//         placeholder="Phone"
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//       />
//       <TextInput
//         className="h-12 border border-gray-300 rounded-md mb-5 px-3"
//         placeholder="Address"
//         value={address}
//         onChangeText={setAddress}
//         autoCapitalize="words"
//       />
//       <TextInput
//         className="h-12 border border-gray-300 rounded-md mb-5 px-3"
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TextInput
//         className="h-12 border border-gray-300 rounded-md mb-5 px-3"
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity
//         className="bg-green-600 py-4 rounded-md"
//         onPress={handleSendOTP}
//       >
//         <Text className="text-white text-center font-bold">Register</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text className="text-blue-600 text-center mt-6">
//           Already have an account? Login
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

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
  console.log("Register Screen");
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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            phone,
          }),
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
