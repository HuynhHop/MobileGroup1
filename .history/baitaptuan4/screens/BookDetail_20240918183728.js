import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const BookDetail = ({ route }) => {
  // Lấy dữ liệu sản phẩm từ navigation props
  const { product } = route.params;

  return (
    <View>
      <View style={styles.Book}>
        <View>
          <Image
            source={{ uri: product.imageUrl }} // Đảm bảo sử dụng đúng uri
            style={styles.bookImage}
          />
        </View>

        <View>
          <Text style={styles.EEI}>{product.name}</Text>
        </View>
      </View>

      <View style={{ margin: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Author : </Text>
        <Text style={{ fontSize: 20 }}>{product?.author}</Text>{" "}
        {/* Thay đổi dựa trên dữ liệu sản phẩm */}
      </View>

      <View style={{ margin: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Description : </Text>
        <Text style={{ fontSize: 18, textAlign: "justify" }}>
          {product.description}
        </Text>
      </View>

      <View style={{ margin: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Price : </Text>
        <Text style={{ fontSize: 18 }}>{product.price}</Text>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity style={styles.btnRegister}>
          <Text style={{ color: "#FFFCFC", fontSize: 20, fontWeight: "bold" }}>
            Add To Cart
          </Text>
        </TouchableOpacity>
      </View>
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
