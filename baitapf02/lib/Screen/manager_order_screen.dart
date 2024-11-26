import 'dart:convert';
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
      Uri.parse('$apiUrl/order/getAll'),
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
                              child: ListTile(
                                title: Text("Order ID: ${order.id}"),
                                subtitle: Text("Total: \$${order.totalPrice}"),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    if (status != "Delivered" && status != "Cancelled")
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
                                            builder: (context) =>
                                                OrderDetailScreen(orderId: order.id),
                                          ),
                                        );
                                      },
                                    ),
                                    if (status != "Cancelled" && status != "Delivered")
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
  final double totalPrice;
  final String status;
  final bool isDelivered;

  Order({
    required this.id,
    required this.totalPrice,
    required this.status,
    required this.isDelivered,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['_id'],
      totalPrice: json['totalPrice'].toDouble(),
      status: json['status'],
      isDelivered: json['isDelivered'] ?? false, // Gán giá trị mặc định nếu không tồn tại
    );
  }
}

class OrderDetailScreen extends StatelessWidget {
  final int orderId;

  OrderDetailScreen({required this.orderId});

  @override
  Widget build(BuildContext context) {
    // TODO: Xây dựng màn hình chi tiết đơn hàng
    return Scaffold(
      appBar: AppBar(title: Text("Order Detail")),
      body: Center(child: Text("Order ID: $orderId")),
    );
  }
}
