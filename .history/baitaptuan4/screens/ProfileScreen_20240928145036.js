// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons cho icon
// import { useNavigation } from "@react-navigation/native"; // Import useNavigation
// import { useAuth } from "../src/hook/authContext";
// import LoginScreen from "./LoginScreen";
// const ProfileScreen = () => {
//   const { user } = useAuth();
//   const navigation = useNavigation(); // Use useNavigation to get navigation object

//   if (!user) {
//     // Nếu user là null hoặc undefined, hiển thị thông báo và button
//     return (
//       <View style={styles.container}>
//         <Text style={styles.noUserText}>User not logged in</Text>
//         <TouchableOpacity
//           style={styles.loginButton}
//           onPress={() => navigation.navigate("Auth")} // Chuyển hướng đến trang đăng nhập
//         >
//           <Text style={styles.loginButtonText}>Go to Login</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()} // Use navigation object to go back
//       >
//         <Ionicons name="arrow-back-outline" size={24} color="#fff" />
//       </TouchableOpacity>
//       <Image
//         source={{ uri: "https://www.bootdey.com/image/900x400/FF7F50/000000" }}
//         style={styles.coverImage}
//       />
//       <View style={styles.avatarContainer}>
//         <Image
//           source={{
//             uri: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
//           }}
//           style={styles.avatar}
//         />
//         <Text style={[styles.name, styles.textWithShadow]}>
//           {user.username}
//         </Text>
//       </View>
//       <View style={styles.content}>
//         <View style={styles.infoContainer}>
//           <Text style={styles.infoLabel}>Fullname :</Text>
//           <Text style={styles.infoValue}>{user.fullname}</Text>
//         </View>
//         <View style={styles.infoContainer}>
//           <Text style={styles.infoLabel}>Email :</Text>
//           <Text style={styles.infoValue}>{user.email}</Text>
//         </View>
//         <View style={styles.infoContainer}>
//           <Text style={styles.infoLabel}>Phone :</Text>
//           <Text style={styles.infoValue}>{user.phone}</Text>
//         </View>
//         <View style={styles.infoContainer}>
//           <Text style={styles.infoLabel}>Bio:</Text>
//           <Text style={styles.infoValue}>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
//             ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
//             non massa sem. Etiam finibus odio quis feugiat facilisis.
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     justifyContent: "center", // Center nội dung khi không có user
//     alignItems: "center", // Center nội dung khi không có user
//   },
//   backButton: {
//     position: "absolute",
//     top: 40, // Adjust for better placement
//     left: 20,
//     zIndex: 1,
//     backgroundColor: "#000",
//     borderRadius: 20,
//     padding: 10,
//   },
//   coverImage: {
//     height: 200,
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//   },
//   avatarContainer: {
//     alignItems: "center",
//     marginTop: 150,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 10,
//     color: "white",
//   },
//   content: {
//     marginTop: 20,
//   },
//   infoContainer: {
//     marginTop: 20,
//   },
//   infoLabel: {
//     fontWeight: "bold",
//   },
//   infoValue: {
//     marginTop: 5,
//   },
//   noUserText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#FF0000", // Màu đỏ để nhấn mạnh
//   },
//   loginButton: {
//     backgroundColor: "#1E90FF", // Màu xanh đẹp cho nút
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   loginButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default ProfileScreen;

import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Avatar.Image
            source={{
              uri: "https://api.adorable.io/avatars/80/abott@adorable.png",
            }}
            size={80}
          />
          <View style={{ marginLeft: 20 }}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}
            >
              John Doe
            </Title>
            <Caption style={styles.caption}>@j_doe</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            Kolkata, India
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            +91-900000009
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            john_doe@email.com
          </Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
        <View
          style={[
            styles.infoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <Title>₹140.50</Title>
          <Caption>Wallet</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>12</Title>
          <Caption>Orders</Caption>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="heart-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Your Favorites</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="credit-card" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Payment</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={myCustomShare}>
          <View style={styles.menuItem}>
            <Icon name="share-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="account-check-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="settings-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
export default ProfileScreen;
