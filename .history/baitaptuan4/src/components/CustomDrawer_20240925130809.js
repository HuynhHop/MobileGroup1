// import React from "react";
// import {
//   View,
//   Text,
//   ImageBackground,
//   Image,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import {
//   DrawerContentScrollView,
//   DrawerItemList,
// } from "@react-navigation/drawer";

// import Ionicons from "react-native-vector-icons/Ionicons";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import { useUser } from "../hook/userContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native"; // Import useNavigation
// import { useAuth } from "../hook/authContext";

// const CustomDrawer = (props) => {
//   const { user, setUser } = useUser();
//   const navigation = useNavigation();
//   const { setIsAuthenticated } = useAuth();

//   const handleLogout = async () => {
//     const accessToken = await AsyncStorage.getItem("@accessToken");
//     const API_URL = process.env.API_URL;
//     console.log("access token ", accessToken);
//     try {
//       const response = await fetch(`${API_URL}/user/logout`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         await AsyncStorage.removeItem("@accessToken");
//         setUser(null);
//         setIsAuthenticated(false);
//         Alert.alert("Success", "Logout successful", [
//           {
//             text: "OK",
//             onPress: () => {
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: "Main" }], // Điều hướng về màn hình Auth và xóa lịch sử
//               });
//             },
//           },
//         ]);
//       } else {
//         Alert.alert("Error", "Logout successful failed");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong", error);
//     }
//   };

//   console.log(user);

//   return (
//     <View style={{ flex: 1 }}>
//       <DrawerContentScrollView
//         {...props}
//         contentContainerStyle={{ backgroundColor: "#8200d6" }}
//       >
//         <ImageBackground
//           source={require("../../assets/images/menu-bg.jpeg")}
//           style={{ padding: 20 }}
//         >
//           <Image
//             source={require("../../assets/images/user-profile.jpg")}
//             style={{
//               height: 80,
//               width: 80,
//               borderRadius: 40,
//               marginBottom: 10,
//             }}
//           />
//           <Text
//             style={{
//               color: "#fff",
//               fontSize: 18,

//               marginBottom: 5,
//             }}
//           >
//             {user?.fullname}
//           </Text>
//           <View style={{ flexDirection: "row" }}>
//             <Text
//               style={{
//                 color: "#fff",
//                 marginRight: 5,
//               }}
//             >
//               280 Coins
//             </Text>
//             <FontAwesome5 name="coins" size={14} color="#fff" />
//           </View>
//         </ImageBackground>
//         <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
//           <DrawerItemList {...props} />
//         </View>
//       </DrawerContentScrollView>
//       <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
//         <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <Ionicons name="share-social-outline" size={22} />
//             <Text
//               style={{
//                 fontSize: 15,
//                 marginLeft: 5,
//               }}
//             >
//               Tell a Friend
//             </Text>
//           </View>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={handleLogout}
//           style={{ paddingVertical: 15 }}
//         >
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <Ionicons name="exit-outline" size={22} />
//             <Text
//               style={{
//                 fontSize: 15,
//                 marginLeft: 5,
//               }}
//             >
//               Sign Out
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CustomDrawer;

import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useUser } from "../hook/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hook/authContext";

const CustomDrawer = (props) => {
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const { setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("@accessToken");
      if (!accessToken) {
        Alert.alert("Error", "No access token found.");
        return; // Ngừng thực hiện nếu không có token
      }

      const API_URL = process.env.API_URL;
      console.log("access token ", accessToken); // Có thể giúp trong quá trình debug

      const response = await fetch(`${API_URL}/user/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem("@accessToken");
        setUser(null);
        setIsAuthenticated(false);
        Alert.alert("Success", "Logout successful", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Main" }],
              });
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Logout failed. Please try again.");
      }
    } catch (error) {
      // Alert.alert("Error", "Something went wrong. Please try again.");
      // console.error(error); // Log chi tiết lỗi
      const responseBody = await response.json(); // Lấy phản hồi chi tiết
      console.log("Logout Response:", responseBody); // In phản hồi để kiểm tra
      Alert.alert(
        "Error",
        responseBody.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#8200d6" }}
      >
        <ImageBackground
          source={require("../../assets/images/menu-bg.jpeg")}
          style={{ padding: 20 }}
        >
          <Image
            source={require("../../assets/images/user-profile.jpg")}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              marginBottom: 5,
            }}
          >
            {user?.fullname}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#fff", marginRight: 5 }}>280 Coins</Text>
            <FontAwesome5 name="coins" size={14} color="#fff" />
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="share-social-outline" size={22} />
            <Text style={{ fontSize: 15, marginLeft: 5 }}>Tell a Friend</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} />
            <Text style={{ fontSize: 15, marginLeft: 5 }}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
