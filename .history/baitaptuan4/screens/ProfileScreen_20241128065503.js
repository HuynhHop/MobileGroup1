import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../src/hook/authContext";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation(); // Use useNavigation to get navigation object
  console.log("ProfileScreen");
  if (!user) {
    // Nếu user là null hoặc undefined, hiển thị thông báo và button
    return (
      <View style={styles.containernoUser}>
        <Text style={styles.noUserText}>User not logged in</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Auth")} // Chuyển hướng đến trang đăng nhập
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Avatar.Image
            source={require("../assets/images/user-profile.jpg")}
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
              {user.username}
            </Title>
            <Caption style={styles.caption}>@{user.username}_profile</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {user?.address ? user?.address : "HCM"}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {user?.phone ? user?.phone : "+8435715656"}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {user?.email ? user?.email : "user@gmail.com"}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="information-outline" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            perferendis sit modi sed beatae aperiam itaque, tempora incidunt
            numquam iste molestias doloremque omnis temporibus vel suscipit!
            Totam velit nemo deserunt.
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
          <Title>
            280.00{"  "}
            <FontAwesome5 name="coins" size={28} color="#CDAD00" />
          </Title>
          <Caption>Wallet</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>12</Title>
          <Caption>Orders</Caption>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
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
  loginButton: {
    backgroundColor: "#1E90FF", // Màu xanh đẹp cho nút
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  containernoUser: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center", // Center nội dung khi không có user
    alignItems: "center", // Center nội dung khi không có user
  },
  noUserText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF0000", // Màu đỏ để nhấn mạnh
  },
});
export default ProfileScreen;
