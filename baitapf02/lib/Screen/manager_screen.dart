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
                //_buildGridItem(context, Icons.person_outline, 'Author', null),
                _buildGridItem(
                    context, Icons.library_books, 'Publisher', '/publisher'),
                _buildGridItem(context, Icons.shopping_cart, 'Order', '/order_manager'),
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
          color: Colors.white, // Nền trắng giúp icon dễ nhìn hơn
          shape: BoxShape.circle,
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


// import 'package:flutter/material.dart';
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
// import 'package:http/http.dart' as http;
// import 'package:flutter_dotenv/flutter_dotenv.dart';

// class ManagerScreen extends StatelessWidget {
//   final storage = FlutterSecureStorage();

//   @override
//   Widget build(BuildContext context) {
//     // Nhận userData từ arguments
//     final userData =
//         ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;

//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Manager Dashboard'),
//         backgroundColor: Colors.deepPurple,
//         centerTitle: true,
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.logout),
//             tooltip: 'Logout',
//             onPressed: () async {
//               bool success = await handleLogout(context);
//               if (success) {
//                 Navigator.pushReplacementNamed(context, '/login');
//               }
//             },
//           ),
//         ],
//       ),
//       body: Column(
//         children: [
//           SizedBox(height: 20), // Khoảng cách trên cùng
//           CircleAvatar(
//             radius: 60, // Kích thước vừa phải cho ảnh đại diện
//             backgroundImage: NetworkImage(userData['image']),
//             backgroundColor: Colors.grey[300],
//           ),
//           SizedBox(height: 10),
//           Text(
//             "Welcome, ${userData['fullname']}", // Hiển thị tên người dùng
//             style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
//           ),
//           SizedBox(height: 20),
//           Expanded(
//             child: GridView.count(
//               crossAxisCount: 3, // Hiển thị 3 cột
//               crossAxisSpacing: 20, // Khoảng cách giữa các cột
//               mainAxisSpacing: 20, // Khoảng cách giữa các hàng
//               padding: const EdgeInsets.all(10),
//               children: [
//                 _buildGridItem(context, Icons.person, 'User', null),
//                 _buildGridItem(context, Icons.book, 'Product', null),
//                 _buildGridItem(context, Icons.person_outline, 'Author', null),
//                 _buildGridItem(context, Icons.library_books, 'Publisher', null),
//                 _buildGridItem(context, Icons.shopping_cart, 'Order', null),
//                 _buildGridItem(context, Icons.category, 'Category',
//                     '/category'), // Điều hướng tới trang Category
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildGridItem(
//       BuildContext context, IconData icon, String label, String? routeName) {
//     return GestureDetector(
//       onTap: () {
//         if (routeName != null) {
//           Navigator.pushNamed(context, routeName);
//         }
//       },
//       child: Container(
//         decoration: BoxDecoration(
//           color: Colors.pink[50],
//           shape: BoxShape.circle,
//           boxShadow: [
//             BoxShadow(
//               color: Colors.grey.withOpacity(0.3),
//               spreadRadius: 2,
//               blurRadius: 4,
//               offset: Offset(0, 2),
//             ),
//           ],
//         ),
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Icon(icon, size: 40, color: Colors.deepPurple),
//             SizedBox(height: 5),
//             Text(
//               label,
//               style: TextStyle(
//                 fontSize: 14,
//                 color: Colors.black87,
//                 fontWeight: FontWeight.w500,
//               ),
//               textAlign: TextAlign.center,
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Future<bool> handleLogout(BuildContext context) async {
//     final apiUrl = dotenv.env['API_URL'];
//     try {
//       final token = await storage.read(key: "accessToken");


//     return Scaffold(
//       body: Center(
//         child: Column(
//           children: [
//             SizedBox(height: 40), // Khoảng cách trên cùng
//             CircleAvatar(
//               radius: 80, // Kích thước lớn hơn cho ảnh đại diện
//               //backgroundImage: NetworkImage(userData['image']),
//               backgroundColor: Colors.grey[300],
//             ),
//             SizedBox(height: 20),
//             Text(
//               "Welcome, ${userData['fullname']}", // Hiển thị tên người dùng
//               style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
//             ),
//             SizedBox(height: 30),
//             Expanded(
//               child: GridView.count(
//                 crossAxisCount: 4, // Hiển thị 4 cột thay vì 3 để phù hợp PC
//                 crossAxisSpacing: 20, // Tăng khoảng cách giữa các cột
//                 mainAxisSpacing: 20, // Tăng khoảng cách giữa các hàng
//                 padding: EdgeInsets.all(40), // Tăng padding xung quanh
//                 children: [
//                   _buildGridItem(context, Icons.person, 'User', '/user_manager'),
//                   _buildGridItem(context, Icons.book, 'Product', null),
//                   _buildGridItem(context, Icons.person_outline, 'Author', null),
//                   _buildGridItem(
//                       context, Icons.library_books, 'Publisher', null),
//                   _buildGridItem(context, Icons.shopping_cart, 'Order', null),
//                   _buildGridItem(context, Icons.category, 'Category',
//                       '/category'), // Điều hướng tới trang Category
//                 ],
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
//       final response = await http.get(
//         Uri.parse('$apiUrl/user/logout'),
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer $token',
//         },
//       );

//       if (response.statusCode == 200) {
//         // Xóa token khỏi storage
//         await storage.delete(key: "accessToken");
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text("Logged out successfully")),
//         );
//         return true;
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text("Logout failed: ${response.body}")),
//         );
//         return false;
//       }
//     } catch (error) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text("An error occurred: $error")),
//       );
//       return false;
//     }
//   }
// }
