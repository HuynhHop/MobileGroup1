import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";

const BannerSlider = ({ products, navigation }) => {
  const scrollRef = useRef(null); // Reference for FlatList auto-scrolling
  const scrollInterval = useRef(null); // Store interval to auto-scroll

  useEffect(() => {
    let currentIndex = 0;

    const scrollProducts = () => {
      if (scrollRef.current && products.length > 0) {
        scrollRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
        currentIndex = (currentIndex + 1) % products.length;
      }
    };

    // Tự động cuộn ngang sau mỗi 3 giây
    scrollInterval.current = setInterval(scrollProducts, 3000);

    return () => clearInterval(scrollInterval.current); // Cleanup interval on unmount
  }, [products]);

  return (
    <FlatList
      ref={scrollRef}
      data={products}
      keyExtractor={(item) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
        //onPress={() => navigation.navigate("ProductDetail", { id: item._id })}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 120,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
    marginHorizontal: 5,
  },
});

export default BannerSlider;
