import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
const BookDetail = ({ route }) => {
  // Lấy dữ liệu sản phẩm từ navigation props
  const { product } = route.params;

  return (
    <View className="flex-1">
      <SafeAreaView>
        <TouchableOpacity>
          <ChevronLeftIcon size="30" color="black"></ChevronLeftIcon>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  bookImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
    padding: 10,
  },

  Book: {
    margin: 20,
    flexDirection: "row",
  },

  EEI: {
    marginLeft: 20,
    fontSize: 20,
  },

  btnRegister: {
    width: "90%",
    height: 50,
    backgroundColor: "#005CA4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
    marginBottom: 100,
  },
});

export default BookDetail;
