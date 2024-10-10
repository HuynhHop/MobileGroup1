import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../../screens/HomeScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import EditProfileScreen from "../../screens/EditProfileScreen";
import CustomDrawer from "../components/CustomDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import TabNavigator from "./TabNavigator";
import CartScreen from "../../screens/CartScreen";

import { useAuth } from "../hook/authContext";
import OrderScreen from "../../screens/OrderScreen";
const Drawer = createDrawerNavigator();

// Drawer Navigator cho các màn hình sau khi đăng nhập
export default function DrawerNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props}></CustomDrawer>}
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
        component={TabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      {isAuthenticated && (
        <>
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

          <Drawer.Screen
            name="Cart"
            component={CartScreen}
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="cart-outline" size={22} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="StateOrder"
            component={OrderScreen}
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="list" size={22} color={color} />
              ),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}
