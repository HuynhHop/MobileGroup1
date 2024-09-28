// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import React, { useEffect } from "react";
// import { Text, View } from "react-native";
// import LoginScreen from "../../screens/LoginScreen";
// import RegisterScreen from "../../screens/RegisterScreen";
// import ForgotPasswordScreen from "../../screens/ForgotPasswordScreen";
// import ResetPasswordScreen from "../../screens/ResetPasswordScreen";
// import OTPScreen from "../../screens/OTPScreen";
// import HomeScreen from "../../screens/HomeScreen";
// import EditProfileScreen from "../../screens/EditProfileScreen";
// import ProfileScreen from "../../screens/ProfileScreen";

// const Stack = createNativeStackNavigator();
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import DrawerNavigator from "./DrawerNavigator";
// const Drawer = createDrawerNavigator();

// const AuthStack = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//       <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//       <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
//       <Stack.Screen name="OTP" component={OTPScreen} />
//       {/* <Stack.Screen name="Main" component={DrawerNavigator} /> */}
//     </Stack.Navigator>
//   );
// };

// export default AuthStack;

import React, { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Lazy load screens
const LoginScreen = React.lazy(() => import("../../screens/LoginScreen"));
const RegisterScreen = React.lazy(() => import("../../screens/RegisterScreen"));
const ForgotPasswordScreen = React.lazy(() =>
  import("../../screens/ForgotPasswordScreen")
);
const ResetPasswordScreen = React.lazy(() =>
  import("../../screens/ResetPasswordScreen")
);
const OTPScreen = React.lazy(() => import("../../screens/OTPScreen"));

// Fallback UI for lazy loading
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const AuthStack = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        {/* <Stack.Screen name="Main" component={DrawerNavigator} /> */}
      </Stack.Navigator>
    </Suspense>
  );
};

export default AuthStack;
