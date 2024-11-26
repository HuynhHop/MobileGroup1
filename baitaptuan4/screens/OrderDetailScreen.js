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
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params; // Nhận orderId từ navigation params
  const [orderDetails, setOrderDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const API_URL = process.env.API_URL;

  // Hàm để fetch chi tiết đơn hàng
  const fetchOrderDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("@accessToken");
      const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrderDetails(data.orderDetails);

        // Tính toán tổng số lượng và tổng giá ngay sau khi fetch dữ liệu
        const newTotalPrice = data.orderDetails.reduce(
          (total, item) => total + item.productPrice * item.quantity,
          0
        );
        const newTotalQuantity = data.orderDetails.reduce(
          (total, item) => total + item.quantity,
          0
        );

        setTotalPrice(newTotalPrice);
        setTotalQuantity(newTotalQuantity);

        // Thiết lập trạng thái checkbox mặc định
        setCheckedItems(() =>
          data.orderDetails.reduce((acc, item) => {
            acc[item._id] = false; // Mặc định không được chọn
            return acc;
          }, {})
        );
      } else {
        console.error("Error fetching order details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Hàm gọi khi có thay đổi ở checkbox
  const toggleItemChecked = (itemId) => {
    setCheckedItems((prev) => {
      const newCheckedItems = {
        ...prev,
        [itemId]: !prev[itemId],
      };
      // Tính toán lại tổng khi checkbox thay đổi
      // calculateTotals(newCheckedItems);
      return newCheckedItems;
    });
  };

  // // Hàm tính toán tổng khi checkbox thay đổi
  // const calculateTotals = (newCheckedItems) => {
  //   const selectedItems = orderDetails.filter(
  //     (item) => newCheckedItems[item._id]
  //   );
  //   const newTotalPrice = selectedItems.reduce(
  //     (total, item) => total + item.productPrice * item.quantity,
  //     0
  //   );
  //   const newTotalQuantity = selectedItems.reduce(
  //     (total, item) => total + item.quantity,
  //     0
  //   );
  //   setTotalPrice(newTotalPrice);
  //   setTotalQuantity(newTotalQuantity);
  // };

  // Hook useEffect để gọi fetchOrderDetails khi màn hình được load
  useEffect(() => {
    fetchOrderDetails();
  }, []);

  // Hàm xóa sản phẩm
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
              fetchOrderDetails(); // Làm mới chi tiết đơn hàng sau khi xóa
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Details</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/user-profile.jpg")}
            style={styles.userIcon}
          />
        </TouchableOpacity>
      </View>

      {orderDetails.length > 0 ? (
        orderDetails.map((item) => (
          <View key={item._id} style={styles.orderItem}>
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
              <Text>{item.productName}</Text>
              <Text>
                {item.productPrice.toFixed(2)}{"  "}
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
            {/* <TouchableOpacity onPress={() => handleDeleteItem(item._id)}>
              <Icon name="delete" size={24} color="#FF0000" />
            </TouchableOpacity> */}
          </View>
        ))
      ) : (
        <Text>No order details found.</Text>
      )}

      <View style={styles.orderSummary}>
        <Text>Total Items: {totalQuantity}</Text>
        <Text>
          Total Price: {totalPrice.toFixed(2)}{"  "}
          <FontAwesome5 name="coins" size={20} color="#CDAD00" />
        </Text>
      </View>
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
  orderItem: {
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
  orderSummary: {
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default OrderDetailScreen;
