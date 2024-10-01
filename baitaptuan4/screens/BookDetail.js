import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const API_URL = process.env.API_URL;
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("@accessToken");
      setAccessToken(token);
    };
    getToken();
  }, []);

  const handleAddToCart = async () => {
    if (!accessToken) {
      console.log("No access token found.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.success) {
        alert("Product added to cart successfully!");
      } else {
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      alert("Error adding product to cart.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#333" }}>
      <View style={{ flex: 1 }}>
        <View className="flex-row justify-start mx-5 mt-10">
          <TouchableOpacity
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            className="border border-gray-50 rounded-xl"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size="30" color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View className="flex-row justify-center mt-5 pb-10">
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: 290, height: 290 }}
            />
          </View>

          <View
            style={{ borderTopLeftRadius: 45, borderTopRightRadius: 45 }}
            className="bg-orange-50 px-6 space-y-2"
          >
            <Text style={{ color: "#000" }} className="mt-8 text-2xl font-bold">
              {product?.name}
            </Text>

            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500 font-semibold">
                {product?.description
                  ? product?.description
                  : "Description this book here"}
              </Text>
              <Text className="text-gray-500 font-semibold">
                Sold:{" "}
                <Text className="text-gray-800 font-extrabold">
                  {product?.soldCount}
                </Text>
              </Text>
            </View>

            <View style={{ minHeight: 200 }}>
              <Text style={{ color: "#000" }} className="tracking-wider py-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Adipisci culpa nostrum dolor, eaque iste totam ex labore omnis
                est, laboriosam voluptas minus itaque ipsa, iusto molestias unde
                numquam doloribus pariatur?
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Text className="text-3xl">
          $ {product.price}
          <FontAwesome5 name="coins" size={30} color="#787816" />
        </Text>
        <TouchableOpacity
          className="text-3xl p-3 ml-16 rounded-lg"
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text className="text-2xl text-center text-white font-bold">
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 160,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
  },
  addToCartButton: {
    backgroundColor: "rgba(45, 41, 36, 0.8)",
    padding: 10,
    borderRadius: 10,
  },
});

export default BookDetail;
