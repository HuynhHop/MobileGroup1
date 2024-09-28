import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import "react-native-gesture-handler";
import AppStack from "./src/navigation/AppStack";
import TabNavigator from "./src/navigation/TabNavigator";
import { AuthProvider } from "./src/hook/authContext";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack></AppStack>
      </NavigationContainer>
    </AuthProvider>
  );
}
