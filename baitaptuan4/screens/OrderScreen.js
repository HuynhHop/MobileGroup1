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
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const API_URL = process.env.API_URL;
  console.log("Order Screen");

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

  const handleCancelOrder = async (orderId) => {
    const accessToken = await AsyncStorage.getItem("@accessToken");
    try {
      const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        alert("Order deleted successfully.");
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order.");
    }
  };

  const handleRestoreOrder = (orderId) => {
    alert(`Restore Order ${orderId}`);
    // Add restore order logic here
  };

  const handleConfirmDelivery = async (orderId) => {
    const accessToken = await AsyncStorage.getItem("@accessToken");
    try {
      const response = await fetch(
        `${API_URL}/order/updateIsDelivered/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ isDelivered: true }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, isDelivered: true } : order
          )
        );
        alert("Order status updated to delivered.");
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status.");
    }
  };

  const renderOrdersByStatus = (status) => {
    const filteredOrders = orders.filter((order) => order.status === status);
    return (
      <View style={styles.statusSection}>
        <Text style={styles.statusTitle}>{status}</Text>
        {filteredOrders.length === 0 ? (
          <Text style={styles.noOrdersText}>No orders in this status.</Text>
        ) : (
          filteredOrders.map((order) => (
            <View key={order._id} style={styles.orderItem}>
              <Text style={styles.orderId}>ORDER ID: {order._id}</Text>
              <Text>Date: {new Date(order.date).toLocaleDateString()}</Text>
              <Text>{order.details.length} items</Text>
              <Text>Total Price: ${order.totalPrice.toFixed(2)}</Text>

              {order.details.map((detail) => (
                <View key={detail._id} style={styles.productDetail}>
                  <Text style={styles.productName}>
                    Product Name: {detail.productName}
                  </Text>
                  <Text>Price: ${detail.productPrice.toFixed(2)}</Text>
                  <Text>Quantity: {detail.quantity}</Text>
                </View>
              ))}

              <View style={styles.buttonContainer}>
                {/* Detail Button */}
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() =>
                    navigation.navigate("OrderDetail", {
                      orderId: order._id,
                      totalPrice: order.totalPrice,
                    })
                  }
                >
                  <Text style={styles.buttonText}>Detail</Text>
                </TouchableOpacity>

                {/* Conditional Buttons */}
                {status === "Pending" && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelOrder(order._id)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                )}

                {status === "Cancelled" && (
                  <TouchableOpacity
                    style={styles.restoreButton}
                    onPress={() => handleRestoreOrder(order._id)}
                  >
                    <Text style={styles.buttonText}>Restore</Text>
                  </TouchableOpacity>
                )}

                {status === "Transported" && !order.isDelivered && (
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleConfirmDelivery(order._id)}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
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
    <View style={styles.container}>
      <ScrollView>
        {/* Render order status buttons */}
        <View style={styles.statusButtonContainer}>
          {["Pending", "Shipping", "Transported", "Cancelled"].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.selectedStatusButton,
              ]}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  selectedStatus === status && styles.selectedText,
                ]}
              >
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
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    height: "100%",
  },
  statusButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statusButton: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedStatusButton: {
    backgroundColor: "#38a169",
  },
  statusButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
  statusSection: {
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  noOrdersText: {
    color: "#aaa",
  },
  orderItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
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
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  restoreButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default OrderScreen;
