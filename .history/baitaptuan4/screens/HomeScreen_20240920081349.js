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
import { useUser } from "../src/hook/userContext";
import ListItem from "../src/components/ListItem";
import debounce from "lodash.debounce";
import { useAuth } from "../src/hook/authContext";
import BannerSlider from "../src/components/BannerSlider";

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsBestSeller, setProductsBestSeller] = useState([]);
  const { isAuthenticated } = useAuth();
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
        const response = await fetch(`${API_URL}/product/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
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
          <Text style={{ fontSize: 18 }}>
            Hello {user ? user?.fullname : "undefined"}
          </Text>
          {isAuthenticated ? (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <ImageBackground
                source={require("../assets/images/user-profile.jpg")}
                style={{ width: 55, height: 55 }}
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
          className="mb-4"
        >
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        <BannerSlider products={productsBestSeller} navigation={navigation} />

        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 18 }}>Books</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: "#0aada8" }}>See all</Text>
          </TouchableOpacity>
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
