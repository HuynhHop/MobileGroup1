import React from "react";
import { View, Image } from "react-native";

export default function BannerSlider({ data }) {
  return (
    <View>
      <Image source={{ uri: data.imageUrl }} />
    </View>
  );
}
