// import { createDrawerNavigator } from "@react-navigation/drawer";
// import HomeScreen from "../../screens/HomeScreen";
// import ProfileScreen from "../../screens/ProfileScreen";
// import EditProfileScreen from "../../screens/EditProfileScreen";
// import CustomDrawer from "../components/CustomDrawer";
// import Ionicons from "react-native-vector-icons/Ionicons";
// const Drawer = createDrawerNavigator();

// // Drawer Navigator cho các màn hình sau khi đăng nhập
// export default function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawer {...props}></CustomDrawer>}
//       screenOptions={{
//         headerShown: false,
//         drawerActiveBackgroundColor: "#aa18ea",
//         drawerActiveTintColor: "#fff",
//         drawerInactiveTintColor: "#333",
//         drawerLabelStyle: {
//           marginLeft: -25,
//           fontSize: 15,
//         },
//       }}
//     >
//       <Drawer.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="EditProfile"
//         component={EditProfileScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

import React, { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";

const Drawer = createDrawerNavigator();

// Lazy load screens
const HomeScreen = React.lazy(() => import("../../screens/HomeScreen"));
const ProfileScreen = React.lazy(() => import("../../screens/ProfileScreen"));
const EditProfileScreen = React.lazy(() =>
  import("../../screens/EditProfileScreen")
);

// Fallback UI for lazy loading
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

// Drawer Navigator cho các màn hình sau khi đăng nhập
export default function DrawerNavigator() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: "#aa18ea",
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#333",
          drawerLabelStyle: {
            marginLeft: -25,
            fontSize: 15,
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </Suspense>
  );
}
