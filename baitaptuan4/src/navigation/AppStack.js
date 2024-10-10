import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import AuthStack from "./AuthStack";
import DrawerNavigator from "./DrawerNavigator";
import BookDetail from "../../screens/BookDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabNavigator from "./TabNavigator";
import OrderScreen from "../../screens/OrderScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem("@accessToken");
      console.log("token : ", token);
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);
  if (isLoading) {
    return null;
  }
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"Main"}
      // initialRouteName={isAuthenticated ? "Main" : "Auth"}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="BookDetail" component={BookDetail} />
      <Stack.Screen name="Order" component={OrderScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
