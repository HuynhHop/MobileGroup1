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
import Carousel from "react-native-snap-carousel";
import BannerSlider from "../src/components/BannerSlider";
import { windowWidth } from "../src/utils/Dimension";

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsBestSellers, setProductsBestSellers] = useEffect([]);
  // Fetch all products initially
  useEffect(() => {
    const fetchDataBestSeller = async () => {
      try {
        const response = await fetch(
          "http://192.168.56.1:3000/product?sort=-soldCount&limit=10",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setProductsBestSellers(
          Array.isArray(data.products) ? data.products : []
        );
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchDataBestSeller();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.56.1:3000/product/", {
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
            ? "http://192.168.56.1:3000/product/"
            : `http://192.168.56.1:3000/product?name=${query}`;
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
  // const renderBanner = ({ item, index }) => {
  //   return <BannerSlider data={item} />;
  // };
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
            Hello, {user ? user?.fullname : "undefined"}
          </Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require("../assets/images/user-profile.jpg")}
              style={{ width: 35, height: 35 }}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
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
          <Text style={{ fontSize: 18 }}>Books</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: "#0aada8" }}>See all</Text>
          </TouchableOpacity>
        </View>
        {/* <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={productsBestSellers}
          renderItem={renderBanner}
          sliderWidth={windowWidth - 40}
          itemWidth={300}
          loop={true}
        /> */}

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
