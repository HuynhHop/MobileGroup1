import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const API_URL = process.env.API_URL;
  const [accessToken, setAccessToken] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  console.log(".");

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("@accessToken");
      setAccessToken(token);
    };
    getToken();
    fetchComments();
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

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/comment?product=${product._id}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!accessToken || !newComment) return;

    try {
      const response = await fetch(`${API_URL}/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          product: product._id,
          comment: newComment,
        }),
      });
      console.log(product._id);
      const data = await response.json();
      if (data.success) {
        alert("Comment added successfully!");
        setNewComment("");
        fetchComments();
      } else {
        alert(`Failed to add comment: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.log("Error while adding comment:", err); // Debug line
      res
        .status(500)
        .json({ success: false, message: "An error occurred: " + err.message });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="flex-1">
        {/* Back button and product image */}
        <View className="flex-row justify-start mx-5 mt-10">
          <TouchableOpacity
            className="bg-opacity-20 border border-gray-50 rounded-xl"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size="30" color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
          <View className="flex-row justify-center mt-5 pb-10">
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: 290, height: 290 }}
            />
          </View>

          <View className="bg-orange-50 px-6 pt-8 space-y-2 rounded-t-3xl">
            <Text className="text-black text-2xl font-bold">
              {product?.name}
            </Text>

            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500 font-semibold">
                {product?.description || "Description of this book here"}
              </Text>
              <Text className="text-gray-500 font-semibold">
                Sold:{" "}
                <Text className="text-gray-800 font-extrabold">
                  {product?.soldCount}
                </Text>
              </Text>
            </View>

            <Text className="text-black tracking-wider py-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
              culpa nostrum dolor, eaque iste totam ex labore omnis est,
              laboriosam voluptas minus itaque ipsa, iusto molestias unde
              numquam doloribus pariatur?
            </Text>

            {/* Comments Section */}
            <View className="mt-5">
              <Text className="text-lg font-bold text-black">Comments</Text>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <View key={index} className="my-3 p-4 bg-gray-100 rounded-lg">
                    <Text className="text-black font-semibold">
                      {comment.user?.username || "User"}
                    </Text>
                    <Text className="text-gray-700">{comment.comment}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-700">No comments available.</Text>
              )}
            </View>

            {/* Add Comment Form */}
            <TextInput
              className="h-10 border border-gray-400 p-2 mt-5 rounded-md text-black"
              placeholder="Enter your comment..."
              placeholderTextColor="#888"
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <Button title="Add Comment" onPress={handleAddComment} />
          </View>
        </ScrollView>
      </View>

      <View className="flex-row justify-between p-4 bg-white border-t border-gray-300 absolute bottom-0 w-full h-20">
        <Text className="text-3xl">
          $ {product.price}{" "}
          <FontAwesome5 name="coins" size={30} color="#787816" />
        </Text>
        <TouchableOpacity
          className="bg-black bg-opacity-80 p-3 rounded-lg"
          onPress={handleAddToCart} // Call the handleAddToCart function on press
        >
          <Text className="text-2xl text-center text-white font-bold">
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookDetail;
