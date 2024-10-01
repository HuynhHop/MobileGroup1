import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../src/hook/authContext";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CartScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const API_URL = process.env.API_URL;
  const [checkedItems, setCheckedItems] = useState({});

  const fetchCartItems = async () => {
    const accessToken = await AsyncStorage.getItem("@accessToken");
    try {
      const response = await fetch(`${API_URL}/cart/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart.items);
        setTotalPrice(data.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0));
        setTotalQuantity(data.cart.items.reduce((total, item) => total + item.quantity, 0));
      } else {
        console.error("Error fetching cart:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems(); // Fetch cart items every time CartScreen is focused
    }, [])
  );

  const handleDeleteItem = (itemId) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const accessToken = await AsyncStorage.getItem("@accessToken");
          try {
            const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            });

            const data = await response.json();

            if (data.success) {
              // Fetch updated cart items after successful deletion
              fetchCartItems();
            } else {
              console.error("Error deleting item:", data.message);
            }
          } catch (error) {
            console.error("Error deleting item:", error);
          }
        },
      },
    ]);
  };

  const toggleItemChecked = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCheckout = async () => {
    const accessToken = await AsyncStorage.getItem("@accessToken");
    try {
      for (const item of cartItems) {
        if (checkedItems[item._id]) {
          const response = await fetch(`${API_URL}/cart/item/${item._id}/checkout`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ selectedForCheckout: true }),
          });

          const data = await response.json();

          if (!data.success) {
            throw new Error(data.message);
          }

          // Call delete item function after successful checkout
          await handleDeleteItem(item._id);
        }
      }

      Alert.alert("Checkout Successful", "Your items are ready for checkout!", [{ text: "OK" }]);
      // Refresh cart items after successful checkout
      fetchCartItems();
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert("Checkout Failed", "There was an error during checkout. Please try again.", [{ text: "OK" }]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>My Cart</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/user-profile.jpg")}
            style={styles.userIcon}
          />
        </TouchableOpacity>
      </View>

      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <View key={item._id} style={styles.cartItem}>
            <TouchableOpacity onPress={() => toggleItemChecked(item._id)}>
              <View style={styles.checkbox}>
                {checkedItems[item._id] ? (
                  <Text style={styles.checked}>✔️</Text>
                ) : (
                  <Text style={styles.unchecked}>⬜️</Text>
                )}
              </View>
            </TouchableOpacity>
            <Image
              source={{ uri: item.product.imageUrl }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text>{item.product.name}</Text>
              <Text>
                {item.product.price.toFixed(2)}{"  "}
                <FontAwesome5 name="coins" size={20} color="#CDAD00" />
              </Text>
              <Text>Quantity: {item.quantity}</Text>
            </View>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate('BookDetail', { product: item.product })}
            >
              <Text style={styles.detailButtonText}>Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteItem(item._id)}>
              <Icon name="delete" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>Your cart is empty.</Text>
      )}

      <View style={styles.cartSummary}>
        <Text>Total Items: {totalQuantity}</Text>
        <Text>
          Total Price: {totalPrice.toFixed(2)}{"  "}
          <FontAwesome5 name="coins" size={20} color="#CDAD00" />
        </Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
  },
  checkbox: {
    marginRight: 8,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    fontSize: 20,
  },
  unchecked: {
    fontSize: 20,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  productDetails: {
    flex: 1,
  },
  detailButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  detailButtonText: {
    color: "#333",
  },
  cartSummary: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  checkoutButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CartScreen;
