import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../src/hook/authContext";
import { useFocusEffect } from "@react-navigation/native";

const OrderScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const API_URL = process.env.API_URL;

  const fetchOrders = async () => {
    const accessToken = await AsyncStorage.getItem("@accessToken");
    try {
      const response = await fetch(`${API_URL}/order/getAllsByUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("Error fetching orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  const handleCancelOrder = (orderId) => {
    alert(`Cancel Order ${orderId}`);
    // Add cancel order logic here
  };

  const handleRestoreOrder = (orderId) => {
    alert(`Restore Order ${orderId}`);
    // Add restore order logic here
  };

  const renderOrdersByStatus = (status) => {
    const filteredOrders = orders.filter(order => order.status === status);
    return (
      <View className="mb-4">
        <Text className="font-semibold text-lg text-gray-800">{status}</Text>
        {filteredOrders.length === 0 ? (
          <Text className="text-gray-400">No orders in this status.</Text>
        ) : (
          filteredOrders.map((order) => (
            <View key={order._id} style={styles.orderItem}>
              <Text style={styles.orderId}>ORDER ID: {order._id}</Text>
              <Text>Date: {new Date(order.date).toLocaleDateString()}</Text>
              <Text>{order.details.length} items</Text>
              <Text>Total Price: ${order.totalPrice.toFixed(2)}</Text>

              {/* Render product details */}
              {order.details.map((detail) => (
                <View key={detail._id} style={styles.productDetail}>
                  <Text style={styles.productName}>Product Name: {detail.productName}</Text>
                  <Text>Price: ${detail.productPrice.toFixed(2)}</Text>
                  <Text>Quantity: {detail.quantity}</Text>
                </View>
              ))}

              <View style={styles.buttonContainer}>
                {/* Detail Button */}
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order._id })}
                >
                  <Text style={styles.buttonText}>Detail</Text>
                </TouchableOpacity>

                {/* Conditional Buttons */}
                {status === 'Pending' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelOrder(order._id)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                )}

                {status === 'Cancelled' && (
                  <TouchableOpacity
                    style={styles.restoreButton}
                    onPress={() => handleRestoreOrder(order._id)}
                  >
                    <Text style={styles.buttonText}>Restore</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <View className="p-4 bg-gray-100 h-full">
      <ScrollView>
        {/* Render order status buttons */}
        <View className="flex-row justify-around mb-4">
          {['Pending', 'Shipping', 'Transported', 'Cancelled'].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.selectedStatusButton,
                selectedStatus === status && styles.selectedStatusScale, // Add scaling effect
              ]}
            >
              <Text style={[styles.statusButtonText, selectedStatus === status && styles.selectedText]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Render orders for the selected status */}
        {renderOrdersByStatus(selectedStatus)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  orderId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
  },
  productDetail: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  productName: {
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  restoreButton: {
    backgroundColor: "#38a169", // Change to green for restore
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  statusButton: {
    backgroundColor: "#e2e8f0", // Gray background
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5, // Add some margin to separate buttons
    elevation: 2,
  },
  selectedStatusButton: {
    backgroundColor: "#38a169", // Change to a green color for better contrast
  },
  selectedStatusScale: {
    transform: [{ scale: 1.1 }], // Scale up the selected button
  },
  statusButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff", // White text when selected
  },
});

export default OrderScreen;
