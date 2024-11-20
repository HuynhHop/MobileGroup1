// import 'package:flutter/material.dart';

// class CategoryScreen extends StatelessWidget {
//   final List<Map<String, dynamic>> categories = [
//     {
//       'id': 1,
//       'items': 2,
//       'name': 'Tiểu thuyết',
//     },
//     {
//       'id': 2,
//       'items': 1,
//       'name': 'Tiểu thuyết',
//     },
//     {
//       'id': 3,
//       'items': 3,
//       'name': 'Truyện tranh',
//     },
//   ];

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         backgroundColor: Colors.purple,
//         title: const Text('Category', style: TextStyle(color: Colors.white)),
//         centerTitle: true,
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back, color: Colors.black),
//           onPressed: () {
//             Navigator.pop(context);
//           },
//         ),
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.add_circle, color: Colors.black),
//             onPressed: () {
//               // Add your "Add" functionality here
//             },
//           ),
//         ],
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(10.0),
//         child: ListView.builder(
//           itemCount: categories.length,
//           itemBuilder: (context, index) {
//             final category = categories[index];
//             return Card(
//               shape: RoundedRectangleBorder(
//                 borderRadius: BorderRadius.circular(10),
//                 side: BorderSide(color: Colors.black, width: 1),
//               ),
//               margin: const EdgeInsets.only(bottom: 10),
//               child: Padding(
//                 padding: const EdgeInsets.all(10.0),
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       "Category ID: ${category['id']}",
//                       style: const TextStyle(
//                         fontWeight: FontWeight.bold,
//                         fontSize: 16,
//                       ),
//                     ),
//                     const SizedBox(height: 5),
//                     Row(
//                       children: [
//                         Text(
//                           "${category['items']} items",
//                           style: const TextStyle(fontSize: 14),
//                         ),
//                         const SizedBox(width: 10),
//                         ElevatedButton(
//                           onPressed: () {
//                             // Handle "Books" action
//                           },
//                           style: ElevatedButton.styleFrom(
//                             backgroundColor: Colors.lightBlue,
//                             shape: RoundedRectangleBorder(
//                               borderRadius: BorderRadius.circular(15),
//                             ),
//                             padding: const EdgeInsets.symmetric(
//                                 horizontal: 20, vertical: 5),
//                           ),
//                           child: const Text(
//                             "Books",
//                             style: TextStyle(fontSize: 14, color: Colors.white),
//                           ),
//                         ),
//                       ],
//                     ),
//                     const SizedBox(height: 5),
//                     Text(
//                       "NAME: ${category['name']}",
//                       style: const TextStyle(fontSize: 14),
//                     ),
//                     const SizedBox(height: 10),
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.end,
//                       children: [
//                         IconButton(
//                           onPressed: () {
//                             // Handle "Edit" action
//                           },
//                           icon: const Icon(Icons.edit, color: Colors.black),
//                         ),
//                         IconButton(
//                           onPressed: () {
//                             // Handle "Delete" action
//                           },
//                           icon: const Icon(Icons.delete, color: Colors.black),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//               ),
//             );
//           },
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class CategoryScreen extends StatefulWidget {
  @override
  _CategoryScreenState createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  List<Map<String, dynamic>> categories = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchCategories(); // Gọi API khi màn hình được khởi tạo
  }

  Future<void> fetchCategories() async {
    final apiUrl = dotenv.env['API_URL'];

    try {
      final response = await http.get(
        Uri.parse('$apiUrl/category'),
        headers: {
          'Content-Type': 'application/json',
          // Nếu cần token thì thêm Authorization
          // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["success"]) {
          setState(() {
            categories = List<Map<String, dynamic>>.from(data["categoryList"]);
            isLoading = false;
          });
        } else {
          setState(() {
            isLoading = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Failed to fetch categories")),
          );
        }
      } else {
        setState(() {
          isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: ${response.statusCode}")),
        );
      }
    } catch (error) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Something went wrong: $error")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Category"),
        backgroundColor: Colors.purple,
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(
              child:
                  CircularProgressIndicator()) // Hiển thị spinner khi đang load
          : categories.isEmpty
              ? const Center(
                  child: Text(
                    "No categories available",
                    style: TextStyle(fontSize: 18),
                  ),
                )
              : ListView.builder(
                  itemCount: categories.length,
                  itemBuilder: (context, index) {
                    final category = categories[index];
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: const BorderSide(color: Colors.black, width: 1),
                      ),
                      margin: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 5),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.purple[100],
                          child: Text(
                            category['_id'].toString(),
                            style: const TextStyle(color: Colors.black),
                          ),
                        ),
                        title: Text(
                          category['name'],
                          style: const TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text("ID: ${category['_id']}"),
                        trailing: IconButton(
                          icon: const Icon(Icons.arrow_forward),
                          onPressed: () {
                            // Xử lý khi nhấn vào một category
                          },
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
