import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons cho icon
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { useAuth } from "../src/hook/authContext";

const ProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation(); // Use useNavigation to get navigation object

  if (!user) {
    // Nếu user là null hoặc undefined, hiển thị thông báo hoặc điều hướng người dùng
    return (
      <View style={styles.container}>
        <Text>User not logged in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Use navigation object to go back
      >
        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <Image
        source={{ uri: "https://www.bootdey.com/image/900x400/FF7F50/000000" }}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
          }}
          style={styles.avatar}
        />
        <Text style={[styles.name, styles.textWithShadow]}>{user.username}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Fullname :</Text>
          <Text style={styles.infoValue}>{user.fullname}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email :</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Phone :</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Bio:</Text>
          <Text style={styles.infoValue}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
            non massa sem. Etiam finibus odio quis feugiat facilisis.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40, // Adjust for better placement
    left: 20,
    zIndex: 1,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
  },
  coverImage: {
    height: 200,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 150,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
  content: {
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
  },
});
export default ProfileScreen;
