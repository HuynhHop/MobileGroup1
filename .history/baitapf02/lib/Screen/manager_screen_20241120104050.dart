import 'package:flutter/material.dart';

class ManagerScreen extends StatelessWidget {
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
          SizedBox(height: 20), // Khoảng cách trên cùng
          CircleAvatar(
            radius: 60, // Kích thước vừa phải hơn cho ảnh đại diện
            backgroundImage: NetworkImage(userData['image']),
            backgroundColor: Colors.grey[300],
          ),
          SizedBox(height: 10),
          Text(
            "Welcome, ${userData['fullname']}", // Hiển thị tên người dùng
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 20),
          Expanded(
            child: GridView.count(
              crossAxisCount: 3, // Hiển thị 3 cột
              crossAxisSpacing: 20, // Khoảng cách giữa các cột
              mainAxisSpacing: 20, // Khoảng cách giữa các hàng
              padding: const EdgeInsets.all(10),
              children: [
                _buildGridItem(context, Icons.person, 'User', null),
                _buildGridItem(context, Icons.book, 'Product', null),
                _buildGridItem(context, Icons.person_outline, 'Author', null),
                _buildGridItem(context, Icons.library_books, 'Publisher', null),
                _buildGridItem(context, Icons.shopping_cart, 'Order', null),
                _buildGridItem(context, Icons.category, 'Category',
                    '/category'), // Điều hướng tới trang Category
              ],
            ),
          ),
        ],
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
          color: Colors.pink[50],
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 2,
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: Colors.deepPurple),
            SizedBox(height: 5),
            Text(
              label,
              style: TextStyle(
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
