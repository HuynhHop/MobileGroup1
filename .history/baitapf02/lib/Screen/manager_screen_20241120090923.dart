import 'package:flutter/material.dart';

// class ManagerScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     final user =
//         ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;

//     return Scaffold(
//       appBar: AppBar(
//         title: Text(
//           'Admin Page',
//           style: TextStyle(color: Colors.black),
//         ),
//         backgroundColor: Colors.pink[100],
//         centerTitle: true,
//         iconTheme: IconThemeData(color: Colors.black),
//       ),
//       body: Column(
//         children: [
//           SizedBox(height: 20),
//           CircleAvatar(
//             radius: 60,
//             backgroundColor: Colors.blue,
//             child: Icon(Icons.person, color: Colors.white, size: 50),
//           ),
//           SizedBox(height: 20),
//           Expanded(
//             child: GridView.count(
//               crossAxisCount: 3, // Giữ số lượng cột là 3
//               crossAxisSpacing: 10, // Giảm khoảng cách giữa các cột
//               mainAxisSpacing: 10, // Giảm khoảng cách giữa các hàng
//               padding: EdgeInsets.all(10), // Giảm padding xung quanh GridView
//               children: [
//                 _buildGridItem(Icons.person, 'User'),
//                 _buildGridItem(Icons.book, 'Product'),
//                 _buildGridItem(Icons.person_outline, 'Author'),
//                 _buildGridItem(Icons.library_books, 'Publisher'),
//                 _buildGridItem(Icons.shopping_cart, 'Order'),
//                 _buildGridItem(Icons.category, 'Category'),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildGridItem(IconData icon, String label) {
//     return Center(
//       child: SizedBox(
//         width: 80, // Đặt chiều rộng nhỏ hơn một chút
//         height: 80, // Đặt chiều cao nhỏ hơn một chút
//         child: Container(
//           decoration: BoxDecoration(
//             color: Colors.pink[50],
//             shape: BoxShape.circle,
//             boxShadow: [
//               BoxShadow(
//                 color: Colors.grey.withOpacity(0.3),
//                 spreadRadius: 2,
//                 blurRadius: 5,
//                 offset: Offset(0, 3),
//               ),
//             ],
//           ),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Icon(icon, size: 30, color: Colors.pink[800]),
//               SizedBox(height: 8),
//               Text(
//                 label,
//                 style: TextStyle(
//                   fontSize: 12, // Giảm kích thước chữ
//                   color: Colors.black,
//                   fontWeight: FontWeight.w600,
//                 ),
//                 textAlign: TextAlign.center,
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

class ManagerScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Nhận userData từ arguments
    final userData =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Admin Page',
          style: TextStyle(color: Colors.black),
        ),
        backgroundColor: Colors.pink[100],
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          SizedBox(height: 15),
          CircleAvatar(
            radius: 70, // Tăng kích thước ảnh đại diện
            backgroundImage:
                NetworkImage(userData['image']), // Hiển thị ảnh đại diện
            backgroundColor: Colors.grey[300],
          ),
          SizedBox(height: 15),
          Text(
            "Welcome, ${userData['fullname']}", // Hiển thị tên đầy đủ
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          // SizedBox(height: 10),
          Expanded(
            child: GridView.count(
              crossAxisCount: 3, // Giữ số lượng cột là 3
              crossAxisSpacing: 2, // Giảm khoảng cách giữa các cột
              mainAxisSpacing: 2, // Giảm khoảng cách giữa các hàng
              padding: EdgeInsets.all(5), // Padding xung quanh GridView
              children: [
                _buildGridItem(Icons.person, 'User'),
                _buildGridItem(Icons.book, 'Product'),
                _buildGridItem(Icons.person_outline, 'Author'),
                _buildGridItem(Icons.library_books, 'Publisher'),
                _buildGridItem(Icons.shopping_cart, 'Order'),
                _buildGridItem(Icons.category, 'Category'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGridItem(IconData icon, String label) {
    return Center(
      child: SizedBox(
        width: 100, // Tăng chiều rộng
        height: 100, // Tăng chiều cao
        child: Container(
          decoration: BoxDecoration(
            color: Colors.pink[50],
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.3),
                spreadRadius: 2,
                blurRadius: 5,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon,
                  size: 40, color: Colors.pink[800]), // Tăng kích thước icon
              SizedBox(height: 10), // Giảm khoảng cách giữa icon và text
              Text(
                label,
                style: TextStyle(
                  fontSize: 14, // Tăng kích thước chữ
                  color: Colors.black,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
