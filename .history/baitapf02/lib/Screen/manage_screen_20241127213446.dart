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
  final storage =
      FlutterSecureStorage(); // Dùng Flutter Secure Storage để lấy token
  int uncheckedOrdersCount = 0; // Số lượng đơn hàng chưa được check
  bool isLoading = true; // Trạng thái đang tải dữ liệu

  @override
  void initState() {
    super.initState();
    fetchUncheckedOrders(); // Gọi API khi màn hình được tải
  }

  Future<Map<String, dynamic>?> getUserData() async {
    final jsonString =
        await storage.read(key: 'userData'); // Đọc dữ liệu từ storage
    if (jsonString != null) {
      return jsonDecode(jsonString); // Chuyển chuỗi JSON thành Map
    }
    return null;
  }

  Future<void> fetchUncheckedOrders() async {
    try {
      final token =
          await storage.read(key: "accessToken"); // Retrieve the access token
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
        // Update the state with the fetched count
        setState(() {
          uncheckedOrdersCount = data["counts"];
          isLoading = false;
        });
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manager Dashboard'),
        backgroundColor: Colors.deepPurple,
        centerTitle: true,
      ),
      body: FutureBuilder<Map<String, dynamic>?>(
        future: getUserData(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data == null) {
            return const Center(child: Text('No user data found.'));
          }

          final userData = snapshot.data!;
          return _buildContent(context, userData);
        },
      ),
    );
  }

  Widget _buildContent(BuildContext context, Map<String, dynamic> userData) {
    return Column(
      children: [
        const SizedBox(height: 20),
        CircleAvatar(
          radius: 60,
          backgroundImage: NetworkImage(userData['image']),
          backgroundColor: Colors.grey[300],
        ),
        const SizedBox(height: 10),
        Text(
          "Welcome, ${userData['fullname']}",
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),
        Expanded(
          child: GridView.count(
            crossAxisCount: 3,
            crossAxisSpacing: 20,
            mainAxisSpacing: 20,
            padding: const EdgeInsets.all(10),
            children: [
              _buildGridItem(context, Icons.person, 'User', '/user_manager'),
              _buildGridItem(
                  context, Icons.book, 'Product', '/product_manager'),
              //_buildGridItem(context, Icons.person_outline, 'Author', null),
              _buildGridItem(
                  context, Icons.library_books, 'Publisher', '/publisher'),
              _buildOrderGridItem(context),
              _buildGridItem(context, Icons.category, 'Category', '/category'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOrderGridItem(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        await Navigator.pushNamed(
            context, '/order_manager'); // Chuyển hướng sang Order Manager
        fetchUncheckedOrders();
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
