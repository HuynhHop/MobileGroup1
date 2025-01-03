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
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const CartScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [rank, setRank] = useState("");
  const API_URL = process.env.API_URL;
  const [checkedItems, setCheckedItems] = useState({});

  const rankDiscount = {
    Silver: 0.98,
    Gold: 0.95,
    Diamond: 0.9,
  };

  const fetchCartItems = async () => {
    const accessToken = await AsyncStorage.getItem("@accessToken");
    try {
      const response = await fetch(${API_URL}/cart/, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${accessToken},
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart.items);
        setCheckedItems({}); // Reset checked items when reloading cart
      } else {
        console.error("Error fetching cart:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const fetchRank = async () => {
    const accessToken = await AsyncStorage.getItem("@accessToken");
    try {
      const response = await fetch(${API_URL}/user/member, {
        method: "GET",
        headers: {
          Authorization: Bearer ${accessToken},
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setRank(data.member?.rank); // Adjust based on your API response
      } else {
        console.log("Failed to fetch rank:", data.message);
      }
    } catch (error) {
      console.log("Error fetching rank:", error.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
      fetchRank();
    }, [])
  );

  const calculateTotals = () => {
    const selectedItems = cartItems.filter((item) => checkedItems[item._id]);
    const newTotalPrice = selectedItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const newTotalQuantity = selectedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
    setTotalQuantity(newTotalQuantity);

    const discount = rankDiscount[rank] || 1;
    setFinalPrice(newTotalPrice * discount);
  };

  const toggleItemChecked = async (itemId) => {
    const isChecked = !checkedItems[itemId];
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: isChecked,
    }));

    calculateTotals();
  };

  useEffect(() => {
    calculateTotals();
  }, [checkedItems, rank]); // Recalculate totals when checkedItems or rank changes

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
              onPress={() =>
                navigation.navigate("BookDetail", { product: item.product })
              }
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
        <Text>
          Final Price: {finalPrice.toFixed(2)}{"  "}
          <FontAwesome5 name="coins" size={20} color="#CDAD00" />
        </Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton}>
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
    marginTop: 30,
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
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  detailButton: {
    marginRight: 8,
    backgroundColor: "#007BFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  detailButtonText: {
    color: "#fff",
  },
  cartSummary: {
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  checkoutButton: {
    marginTop: 16,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CartScreen;