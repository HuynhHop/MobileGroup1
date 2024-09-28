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

const CartScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const API_URL = process.env.API_URL;

  // State to track checked items
  const [checkedItems, setCheckedItems] = useState({});

  const fetchCartItems = async () => {
    const accessToken = await AsyncStorage.getItem("@accessToken");

    try {
      const response = await fetch(`${API_URL}/cart/summary`, {
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
        setCartItems(data.items);
        setTotalPrice(data.totalPrice);
        setTotalQuantity(data.totalQuantity);
      } else {
        console.error("Error fetching cart summary:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          // Call the API to delete the item from the cart (Implement this)
          // await deleteCartItem(itemId);
          fetchCartItems();
        },
      },
    ]);
  };

  const toggleItemChecked = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId], // Toggle the checked state
    }));
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

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
                  <Text style={styles.checked}>✔️</Text> // Checked state
                ) : (
                  <Text style={styles.unchecked}>⬜️</Text> // Unchecked state
                )}
              </View>
            </TouchableOpacity>
            <Image
              source={{ uri: `${API_URL}/images/${item.product.image}` }} // Adjust the image URL as needed
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text>{item.product.name}</Text>
              <Text>{item.product.price.toFixed(2)} 🥇</Text>
              <Text>Quantity: {item.quantity}</Text>
            </View>
            <TouchableOpacity style={styles.detailButton}>
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
        <Text>Total Price: {totalPrice.toFixed(2)} 🥇</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
  },
  checkbox: {
    marginRight: 8,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  detailButtonText: {
    color: '#333',
  },
  cartSummary: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
});

export default CartScreen;
