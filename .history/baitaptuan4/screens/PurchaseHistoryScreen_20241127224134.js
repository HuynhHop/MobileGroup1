import React, { useEffect, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

// const PurchaseHistoryScreen = ({ navigation }) => {
//   const [purchasedOrders, setPurchasedOrders] = useState([]);
//   const [checkedItems, setCheckedItems] = useState({});
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const API_URL = process.env.API_URL;
//   console.log("Purchase");

//   const fetchPurchasedOrders = async () => {
//     try {
//       const accessToken = await AsyncStorage.getItem("@accessToken");
//       const response = await fetch(
//         `${API_URL}/order/getOrderByUser?status=Transported`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         setPurchasedOrders(data.orders);
//         setCheckedItems({});
//       } else {
//         console.error("Error fetching purchase history:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching purchase history:", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchPurchasedOrders();
//     }, [])
//   );

//   const toggleItemChecked = (itemId) => {
//     setCheckedItems((prev) => ({
//       ...prev,
//       [itemId]: !prev[itemId],
//     }));
//     calculateTotals();
//   };

//   const calculateTotals = () => {
//     const selectedItems = purchasedOrders.filter(
//       (order) => checkedItems[order._id]
//     );
//     const newTotalPrice = selectedItems.reduce(
//       (total, order) =>
//         total + order.details[0].productPrice * order.details[0].quantity,
//       0
//     );
//     const newTotalQuantity = selectedItems.reduce(
//       (total, order) => total + order.details[0].quantity,
//       0
//     );
//     setTotalQuantity(newTotalQuantity);
//     setTotalPrice(newTotalPrice);
//   };

//   useFocusEffect(
//     useCallback(() => {
//       calculateTotals();
//     }, [checkedItems])
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>{"<"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Purchase History</Text>
//         <TouchableOpacity>
//           <Image
//             source={require("../assets/images/user-profile.jpg")}
//             style={styles.userIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       {purchasedOrders.length > 0 ? (
//         purchasedOrders.map((order) => (
//           <View key={order._id} style={styles.orderItem}>
//             <TouchableOpacity onPress={() => toggleItemChecked(order._id)}>
//               <View style={styles.checkbox}>
//                 {checkedItems[order._id] ? (
//                   <Text style={styles.checked}>✔️</Text>
//                 ) : (
//                   <Text style={styles.unchecked}>⬜️</Text>
//                 )}
//               </View>
//             </TouchableOpacity>
//             <Image
//               source={{ uri: order.details[0].imageUrl }}
//               style={styles.productImage}
//             />
//             <View style={styles.productDetails}>
//               <Text style={styles.productName}>
//                 {order.details[0].productName}
//               </Text>
//               <Text style={styles.productPrice}>
//                 {order.details[0].productPrice.toFixed(2)}
//                 {"  "}
//                 <FontAwesome5 name="coins" size={20} color="#CDAD00" />
//               </Text>
//               <Text>Quantity: {order.details[0].quantity}</Text>
//               <Text>Status: {order.status}</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.detailButton}
//               onPress={() =>
//                 navigation.navigate("BookDetail", {
//                   product: order.details[0].productId,
//                 })
//               }
//             >
//               <Text style={styles.detailButtonText}>Details</Text>
//             </TouchableOpacity>
//           </View>
//         ))
//       ) : (
//         <Text>No purchase history found.</Text>
//       )}

//       <View style={styles.orderSummary}>
//         <Text>Total Items: {totalQuantity}</Text>
//         <Text>
//           Total Price: {totalPrice.toFixed(2)}
//           {"  "}
//           <FontAwesome5 name="coins" size={20} color="#CDAD00" />
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     marginTop: 30,
//   },
//   backButton: {
//     fontSize: 24,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   orderItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     borderRadius: 8,
//   },
//   checkbox: {
//     marginRight: 8,
//     width: 30,
//     height: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checked: {
//     fontSize: 20,
//   },
//   unchecked: {
//     fontSize: 20,
//   },
//   productImage: {
//     width: 50,
//     height: 50,
//     marginRight: 16,
//   },
//   productDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   userIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   productPrice: {
//     fontSize: 14,
//     color: "#333",
//   },
//   detailButton: {
//     marginRight: 8,
//     backgroundColor: "#007BFF",
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//   },
//   detailButtonText: {
//     color: "#fff",
//   },
//   orderSummary: {
//     marginTop: 16,
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//   },
// });

// export default PurchaseHistoryScreen;
const PurchaseHistoryScreen = ({ navigation }) => {
  const [purchasedOrders, setPurchasedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const API_URL = process.env.API_URL;

  const fetchPurchasedOrders = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("@accessToken");
      const response = await fetch(
        `${API_URL}/order/getOrderByUser?status=Transported&sort=-_id`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setPurchasedOrders(data.orders);
        setCheckedItems({});
      } else {
        console.error("Error fetching purchase history:", data.message);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPurchasedOrders();
    }, [])
  );

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {selectedOrder ? "Order Details" : "Purchase History"}
        </Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/user-profile.jpg")}
            style={styles.userIcon}
          />
        </TouchableOpacity>
      </View>

      {selectedOrder ? (
        <View>
          <TouchableOpacity onPress={handleBackToOrders}>
            <Text style={styles.backButton}>Back to Orders</Text>
          </TouchableOpacity>
          {selectedOrder.details.map((detail) => (
            <View key={detail._id} style={styles.orderItem}>
              <Image
                source={{ uri: detail.imageUrl }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{detail.productName}</Text>
                <Text style={styles.productPrice}>
                  {detail.productPrice.toFixed(2)}{" "}
                  <FontAwesome5 name="coins" size={20} color="#CDAD00" />
                </Text>
                <Text>Quantity: {detail.quantity}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : purchasedOrders.length > 0 ? (
        purchasedOrders.map((order) => (
          <TouchableOpacity
            key={order._id}
            style={styles.orderItem}
            onPress={() => handleOrderClick(order)}
          >
            <Image
              source={{ uri: order.details[0].imageUrl }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>Order #{order._id}</Text>
              <Text>Total Price: {order.totalPrice.toFixed(2)}</Text>
              <Text>Status: {order.status}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No purchase history found.</Text>
      )}
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
  productName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  productPrice: {
    fontSize: 14,
    color: "#333",
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
export default PurchaseHistoryScreen;
