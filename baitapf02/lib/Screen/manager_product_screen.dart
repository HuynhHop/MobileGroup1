import 'package:baitapf02/Screen/add_product_screen.dart';
import 'package:baitapf02/Screen/edit_product_screen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ManagerProductScreen extends StatefulWidget {
  @override
  _ManagerProductScreenState createState() => _ManagerProductScreenState();
}

class _ManagerProductScreenState extends State<ManagerProductScreen> {
  final storage = FlutterSecureStorage();
  final apiUrl = dotenv.env['API_URL'];
  List products = [];

  Future<void> fetchProducts() async {
    final token = await storage.read(key: "accessToken");
    final response = await http.get(
      Uri.parse('$apiUrl/product/getAll'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        products = data['products'];
      });
    }
  }

  Future<void> deleteProduct(int productId) async {
    final token = await storage.read(key: "accessToken");
    final response = await http.delete(
      Uri.parse('$apiUrl/product/$productId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      // Xóa sản phẩm khỏi danh sách sau khi xóa thành công
      setState(() {
        products.removeWhere((product) => product['_id'] == productId);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Product deleted successfully!")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to delete product.")),
      );
    }
  }

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text("Product Manager"),
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => AddProductScreen()),
                ).then((_) => fetchProducts()); // Refresh danh sách sau khi thêm
              },
            ),
          ],
        ),
      ),
      body: products.isEmpty
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];
              return ListTile(
                leading: ClipRRect(
                  borderRadius: BorderRadius.circular(8), // Tùy chọn: Bo tròn góc ảnh
                  child: Image.network(
                    product['imageUrl'] ?? '',
                    width: 60, // Chiều rộng cố định
                    height: 60, // Chiều cao cố định
                    fit: BoxFit.cover, // Đảm bảo ảnh được cắt hoặc điều chỉnh để phù hợp
                    errorBuilder: (context, error, stackTrace) => Container(
                      width: 60,
                      height: 60,
                      color: Colors.grey[300], // Màu nền nếu ảnh không tải được
                      child: Icon(
                        Icons.image_not_supported,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ),
                title: Text(product['name']),
                subtitle: Text('Price: ${product['price']}'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: Icon(Icons.edit),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => EditProductScreen(product: product),
                          ),
                        ).then((_) => fetchProducts());
                      },
                    ),
                    IconButton(
                      icon: Icon(Icons.delete),
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: Text("Delete Product"),
                            content: Text(
                                "Are you sure you want to delete this product?"),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: Text("Cancel"),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  deleteProduct(product['_id']);
                                },
                                child: Text("Delete"),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              );
            },
          ),
    );
  }
}
