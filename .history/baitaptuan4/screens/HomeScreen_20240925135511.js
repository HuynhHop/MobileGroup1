import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import ListItem from "../src/components/ListItem";
import debounce from "lodash.debounce";
import { useAuth } from "../src/hook/authContext";
import BannerSlider from "../src/components/BannerSlider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsBestSeller, setProductsBestSeller] = useState([]);
  const { isAuthenticated, user, setUser } = useAuth();
  const API_URL = process.env.API_URL;
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem("@accessToken");
      console.log("token : ", token);
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuthStatus();
  }, [isAuthenticated]);
  useEffect(() => {
    const fetchDataBestseller = async () => {
      try {
        const response = await fetch(
          `${API_URL}/product?sort=-soldCount&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setProductsBestSeller(
          Array.isArray(data.products) ? data.products : []
        );
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchDataBestseller();
  }, []);
  // Fetch all products initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/product/getall`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProducts(() => (Array.isArray(data.products) ? data.products : []));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Debounced search function
  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      try {
        const url =
          query.trim() === ""
            ? `${API_URL}/product/`
            : `${API_URL}/product?name=${query}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (error) {
        console.error("Error fetching search results", error);
        setProducts([]); // Clear products on error
      }
    }, 500),
    []
  );

  // Call the debounced search function when searchQuery changes
  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery, fetchSearchResults]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 30 }}>
      <ScrollView style={{ padding: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text
            className="font-semibold mt-2"
            style={{ fontSize: 22, color: "#00008B" }}
          >
            {user ? "Hello, " + user?.fullname : "Welcome to bookstore"}
          </Text>
          {isAuthenticated ? (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <ImageBackground
                source={require("../assets/images/user-profile.jpg")}
                style={{ width: 75, height: 75 }}
                imageStyle={{ borderRadius: 25 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate("Auth")}>
              <ImageBackground
                source={require("../assets/images/login_user.jpg")}
                style={{ width: 55, height: 55 }}
                imageStyle={{ borderRadius: 25 }}
              />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            borderColor: "#C6C6C6",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}
        >
          <TextInput
            className="w-full"
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 22, color: "#4682B4" }}>Best Seller</Text>
          {/* <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: "#0aada8" }}>See all</Text>
          </TouchableOpacity> */}
        </View>
        {productsBestSeller.length > 0 ? (
          <BannerSlider products={productsBestSeller} navigation={navigation} />
        ) : (
          <Text>No best-selling products available</Text>
        )}
        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 22, color: "#4682B4" }}>Books</Text>
        </View>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((item) => (
            <ListItem
              key={item._id}
              item={item}
              navigation={navigation}
            ></ListItem>
          ))
        ) : (
          <Text>No products found</Text> // Message when no products are available
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
