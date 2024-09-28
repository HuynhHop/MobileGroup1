import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { UserProvider } from "./src/hook/userContext";
import AuthStack from "./src/navigation/AuthStack";
import "react-native-gesture-handler";
import AppStack from "./src/navigation/AppStack";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppStack></AppStack>
      </NavigationContainer>
    </UserProvider>
  );
}
