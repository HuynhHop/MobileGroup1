import 'dart:convert';
import 'package:baitapf02/Screen/order_detail_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ManagerOrderScreen extends StatefulWidget {
  @override
  _ManagerOrderScreen createState() => _ManagerOrderScreen();
}

class _ManagerOrderScreen extends State<ManagerOrderScreen> {
  final List<String> statuses = ["Pending", "Shipping", "Transported", "Delivered", "Cancelled"];
  String currentStatus = "Pending"; // Trạng thái hiển thị mặc định
  final storage = FlutterSecureStorage();
  final apiUrl = dotenv.env['API_URL'];

  Future<List<Order>> fetchOrders(String status) async {
    final token = await storage.read(key: "accessToken"); // Lấy token từ bộ nhớ
    final response = await http.get(
      Uri.parse('$apiUrl/order/getAllAdmin'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List orders = jsonDecode(response.body)['orders'];

      // Phân loại các đơn hàng theo trạng thái
      return orders
          .map((order) => Order.fromJson(order))
          .where((order) {
            if (status == "Delivered") {
              // Lọc các đơn hàng có status = "Transported" và isDelivered = true
              return order.status == "Transported" && order.isDelivered;
            } else if (status == "Transported"){ 
              return order.status == "Transported" && order.isDelivered == false;
            } else {
              return order.status == status;
            }
          })
          .toList();
    } else {
      throw Exception("Failed to fetch orders");
    }
  }

  void updateStatus(int orderId) async {
    final currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex < statuses.length - 1) {
      final nextStatus = statuses[currentIndex + 1];
      final token = await storage.read(key: "accessToken");
      final response = await http.put(
        Uri.parse('$apiUrl/order/updateStatus/$orderId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'status': nextStatus}),
      );
      if (response.statusCode == 200) {
        setState(() {}); // Reload danh sách đơn hàng
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Order updated to $nextStatus')));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to update status')));
      }
    }
  }

  void cancelledStatus(int orderId, String status) async {
      final token = await storage.read(key: "accessToken");
      final response = await http.put(
        Uri.parse('$apiUrl/order/updateStatus/$orderId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'status': status}),
      );
      if (response.statusCode == 200) {
        setState(() {}); // Reload danh sách đơn hàng
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Order updated to $status')));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to update status')));
      }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: statuses.length,
      child: Scaffold(
        appBar: AppBar(
          title: Text('Admin Orders'),
          bottom: TabBar(
            tabs: statuses.map((status) => Tab(text: status)).toList(),
            onTap: (index) {
              setState(() {
                currentStatus = statuses[index];
              });
            },
          ),
        ),
        body: TabBarView(
          children: statuses.map((status) {
            return FutureBuilder<List<Order>>(
              future: fetchOrders(status), // Gọi fetchOrders với từng status
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else {
                  final orders = snapshot.data!;
                  return orders.isEmpty
                      ? Center(child: Text('No orders in $status status'))
                      : ListView.builder(
                          itemCount: orders.length,
                          itemBuilder: (context, index) {
                            final order = orders[index];
                            return Card(
                              margin: const EdgeInsets.symmetric(vertical: 8.0),
                              child: ListTile(
                                title: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text("ORDER ID: ${order.id}"),
                                    Text("USER ID: ${order.userid}"),
                                    Text("Date: ${DateTime.parse(order.date).toLocal().toString().split(' ')[0]}"), // Format the date
                                    Text("${order.details.length} items"), // Number of items
                                    Text("Total Price: \$${order.totalPrice.toStringAsFixed(2)}"), // Total price

                                    // Display product details in a smaller, light-colored container
                                    ...order.details.map((detail) {
                                      return Padding(
                                        padding: const EdgeInsets.symmetric(vertical: 5.0),
                                        child: Container(
                                          padding: EdgeInsets.all(8.0),
                                          decoration: BoxDecoration(
                                            color: Colors.grey[200], // Light background color
                                            borderRadius: BorderRadius.circular(8.0), // Rounded corners
                                          ),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text("Product Name: ${detail.productName}"),
                                              Text("Price: \$${detail.productPrice.toStringAsFixed(2)}"),
                                              Text("Quantity: ${detail.quantity}"),
                                            ],
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ],
                                ),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    if (status != "Transported" && status != "Delivered" && status != "Cancelled")
                                      IconButton(
                                        icon: Icon(Icons.check),
                                        onPressed: () {
                                          updateStatus(order.id); // Cập nhật trạng thái tiếp theo
                                        },
                                      ),
                                    IconButton(
                                      icon: Icon(Icons.info),
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) => OrderDetailScreen(orderId: order.id),
                                          ),
                                        );
                                      },
                                    ),
                                    if (status != "Transported" && status != "Cancelled" && status != "Delivered")
                                      IconButton(
                                        icon: Icon(Icons.cancel),
                                        onPressed: () {
                                          cancelledStatus(order.id, "Cancelled");
                                        },
                                      ),
                                  ],
                                ),
                              ),
                            );
                          },
                        );
                }
              },
            );
          }).toList(),
        ),

      ),
    );
  }
}

class Order {
  final int id;
  final int userid;
  final double totalPrice;
  final String status;
  final bool isDelivered;
  final String date;
  final List<OrderDetail> details;

  Order({
    required this.id,
    required this.userid,
    required this.totalPrice,
    required this.status,
    required this.isDelivered,
    required this.date,
    required this.details,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    var detailsList = json['details'] as List;
    List<OrderDetail> orderDetails = detailsList.map((i) => OrderDetail.fromJson(i)).toList();

    return Order(
      id: json['_id'],
      totalPrice: json['totalPrice'].toDouble(),
      userid: json['user'],
      status: json['status'],
      isDelivered: json['isDelivered'] ?? false,
      date: json['date'],
      details: orderDetails,
    );
  }
}

class OrderDetail {
  final String productName;
  final double productPrice;
  final int quantity;

  OrderDetail({
    required this.productName,
    required this.productPrice,
    required this.quantity,
  });

  factory OrderDetail.fromJson(Map<String, dynamic> json) {
    return OrderDetail(
      productName: json['productName'],
      productPrice: json['productPrice'].toDouble(),
      quantity: json['quantity'],
    );
  }
}
