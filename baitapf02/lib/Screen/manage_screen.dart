import 'dart:convert'; // Để xử lý JSON
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ManagerScreen extends StatefulWidget {
  @override
  _ManagerScreenState createState() => _ManagerScreenState();
}

class _ManagerScreenState extends State<ManagerScreen> {
  final apiUrl = dotenv.env['API_URL']; // Thay URL API thật
  final storage = FlutterSecureStorage(); // Dùng Flutter Secure Storage để lấy token
  int uncheckedOrdersCount = 0; // Số lượng đơn hàng chưa được check
  bool isLoading = true; // Trạng thái đang tải dữ liệu

  @override
  void initState() {
    super.initState();
    fetchUncheckedOrders(); // Gọi API khi màn hình được tải
  }

  Future<void> fetchUncheckedOrders() async {
    try {
      final token = await storage.read(key: "accessToken"); // Retrieve the access token
      if (token == null) {
        throw Exception("Token not found");
      }

      // Prepare the API URL
      final url = Uri.parse('$apiUrl/order/getAll?isChecked=false');

      // Make the HTTP GET request
      final response = await http.get(
        url,
        headers: {
          "Authorization": "Bearer $token",
          "Content-Type": "application/json",
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["success"] == true) {
          // Update the state with the fetched count
          setState(() {
            uncheckedOrdersCount = data["counts"];
            isLoading = false;
          });
        } else {
          throw Exception("Failed to fetch orders: ${data["message"]}");
        }
      } else {
        throw Exception("HTTP Error: ${response.statusCode}");
      }
    } catch (error) {
      setState(() {
        isLoading = false;
      });
      debugPrint("Error fetching unchecked orders: $error");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to load unchecked orders")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Nhận userData từ arguments
    final userData =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manager Dashboard'),
        backgroundColor: Colors.deepPurple,
        centerTitle: true,
      ),
      body: Column(
        children: [
          const SizedBox(height: 20), // Khoảng cách trên cùng
          CircleAvatar(
            radius: 60, // Kích thước vừa phải cho ảnh đại diện
            backgroundImage: NetworkImage(userData['image']),
            backgroundColor: Colors.grey[300],
          ),
          const SizedBox(height: 10),
          Text(
            "Welcome, ${userData['fullname']}", // Hiển thị tên người dùng
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Expanded(
            child: GridView.count(
              crossAxisCount: 3, // Hiển thị 3 cột
              crossAxisSpacing: 20, // Khoảng cách giữa các cột
              mainAxisSpacing: 20, // Khoảng cách giữa các hàng
              padding: const EdgeInsets.all(10),
              children: [
                _buildGridItem(context, Icons.person, 'User', '/user_manager'),
                _buildGridItem(context, Icons.book, 'Product', '/product_manager'),
                // _buildGridItem(context, Icons.person_outline, 'Author', null),
                _buildGridItem(
                    context, Icons.library_books, 'Publisher', '/publisher'),
                _buildOrderGridItem(context),
                _buildGridItem(context, Icons.category, 'Category', '/category'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderGridItem(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, '/order_manager'); // Chuyển hướng sang Order Manager
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white, // Nền trắng giúp icon dễ nhìn hơn
          borderRadius: BorderRadius.circular(15), // Bo góc nhẹ
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 2,
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.shopping_cart, size: 40, color: Colors.deepPurpleAccent),
            const SizedBox(height: 5),
            Text(
              'Order',
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            isLoading
                ? const CircularProgressIndicator() // Hiển thị loader khi đang tải
                : Text(
                    '$uncheckedOrdersCount new Order',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.redAccent,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridItem(
      BuildContext context, IconData icon, String label, String? routeName) {
    return GestureDetector(
      onTap: () {
        if (routeName != null) {
          Navigator.pushNamed(context, routeName);
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white, // Nền trắng giúp icon dễ nhìn hơn
          borderRadius: BorderRadius.circular(15), // Bo góc nhẹ
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 2,
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: Colors.deepPurpleAccent), // Màu icon
            const SizedBox(height: 5),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}