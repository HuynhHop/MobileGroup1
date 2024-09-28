import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { windowWidth } from "../utils/Dimension";

export default function ListItem({ image, name, price, onPress }) {
  let imageSource = require("../../assets/images/products/harryPoster.jpg");

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Image
          source={imageMap[image] ? imageMap[image] : imageMap["harryPoster"]}
          style={{ width: 55, height: 55, borderRadius: 10, marginRight: 8 }}
        />

        <View style={{ width: windowWidth - 220 }}>
          <Text
            style={{
              color: "#333",
              fontSize: 14,
            }}
          >
            {price}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: "#333",
              fontSize: 14,
              textTransform: "uppercase",
            }}
          >
            {name}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: "#0aada8",
          padding: 10,
          width: 100,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",

            fontSize: 14,
          }}
        >
          Buy now
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: "#0aada8",
          padding: 10,
          width: 100,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",

            fontSize: 14,
          }}
        >
          Detail
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}
