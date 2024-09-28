import React from "react";
import { View, Text, TextInput } from "react-native";

const RequiredInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}) => (
  <View className="mb-5">
    <Text className="font-semibold">
      {label} <Text style={{ color: "red" }}>*</Text>
    </Text>
    <TextInput
      className="h-12 border border-gray-300 rounded-md px-3"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

export default RequiredInput;
