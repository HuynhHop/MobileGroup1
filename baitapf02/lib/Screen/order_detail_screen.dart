import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class OrderDetailScreen extends StatefulWidget {
  final int orderId;

  const OrderDetailScreen({Key? key, required this.orderId}) : super(key: key);

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  final storage = FlutterSecureStorage();
  final apiUrl = dotenv.env['API_URL'];
  late Future<List<OrderDetail>> _orderDetailsFuture;

  double totalPrice = 0;
  int totalItems = 0;

  @override
  void initState() {
    super.initState();
    _orderDetailsFuture = fetchOrderDetails(widget.orderId);
  }

  Future<List<OrderDetail>> fetchOrderDetails(int orderId) async {
    try {
      final token = await storage.read(key: "accessToken");
      final response = await http.get(
        Uri.parse("$apiUrl/order/$orderId"),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return (data['orderDetails'] as List)
              .map((detail) => OrderDetail.fromJson(detail))
              .toList();
        } else {
          throw Exception(data['message'] ?? "Unknown error occurred");
        }
      } else {
        throw Exception("Failed to load order details (status code: ${response.statusCode})");
      }
    } catch (error) {
      throw Exception("Error fetching order details: $error");
    }
  }

  void calculateTotals(List<OrderDetail> details) {
    totalPrice = details.fold(0, (sum, item) => sum + (item.price * item.quantity));
    totalItems = details.fold(0, (sum, item) => sum + item.quantity);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Order Details'),
      ),
      body: FutureBuilder<List<OrderDetail>>(
        future: _orderDetailsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Error: ${snapshot.error}'),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No details available'));
          } else {
            final orderDetails = snapshot.data!;
            calculateTotals(orderDetails);
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Text('Total Price: \$${totalPrice.toStringAsFixed(2)}'),
                  Text('Total Items: $totalItems'),
                  Expanded(
                    child: ListView.builder(
                      itemCount: orderDetails.length,
                      itemBuilder: (context, index) {
                        final detail = orderDetails[index];
                        return Card(
                          child: ListTile(
                            leading: Image.network(detail.imageUrl, width: 50, height: 50),
                            title: Text('Product: ${detail.productName}'),
                            subtitle: Text('Quantity: ${detail.quantity} - Price: \$${detail.price.toStringAsFixed(2)}'),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          }
        },
      ),
    );
  }
}

class OrderDetail {
  final String productName;
  final double price;
  final int quantity;
  final String imageUrl; 

  OrderDetail({
    required this.productName,
    required this.price,
    required this.quantity,
    required this.imageUrl, 
  });

  factory OrderDetail.fromJson(Map<String, dynamic> json) {
    return OrderDetail(
      productName: json['productName'],
      price: json['productPrice'].toDouble(),
      quantity: json['quantity'],
      imageUrl: json['product']['imageUrl'] ?? "https://res.cloudinary.com/dvdabwrng/image/upload/v1727817129/uploads/mxqtvpiukztolzmlbonp.jpg",
    );
  }
}
