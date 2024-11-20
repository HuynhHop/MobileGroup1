import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class PublisherScreen extends StatefulWidget {
  @override
  _PublisherScreenState createState() => _PublisherScreenState();
}

class _PublisherScreenState extends State<PublisherScreen> {
  List<Map<String, dynamic>> publishers = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchPublishers();
  }

  Future<void> fetchPublishers() async {
    final apiUrl = dotenv.env['API_URL'];

    try {
      final response = await http.get(
        Uri.parse('$apiUrl/publisher'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["success"]) {
          setState(() {
            publishers = List<Map<String, dynamic>>.from(data["publishers"]);
            isLoading = false;
          });
        } else {
          setState(() {
            isLoading = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Failed to fetch publishers")),
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
        backgroundColor: Colors.deepPurple,
        title: const Text(
          'Publishers',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : publishers.isEmpty
              ? const Center(
                  child: Text(
                    "No publishers available",
                    style: TextStyle(fontSize: 18),
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: ListView.builder(
                    itemCount: publishers.length,
                    itemBuilder: (context, index) {
                      final publisher = publishers[index];
                      return Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                          side: const BorderSide(color: Colors.black, width: 1),
                        ),
                        margin: const EdgeInsets.only(bottom: 10),
                        child: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              CircleAvatar(
                                backgroundColor: Colors.deepPurple[100],
                                child: Text(
                                  publisher['_id'].toString(),
                                  style: const TextStyle(color: Colors.black),
                                ),
                              ),
                              const SizedBox(width: 15),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "Name: ${publisher['name']}",
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 5),
                                    Text(
                                      publisher['description'],
                                      maxLines: 1,
                                      overflow: TextOverflow
                                          .ellipsis, // Thêm "..." nếu dài quá
                                      style: const TextStyle(fontSize: 14),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 10),
                              IconButton(
                                onPressed: () {
                                  // Sửa thông tin nhà xuất bản (nếu có tính năng)
                                },
                                icon:
                                    const Icon(Icons.edit, color: Colors.black),
                              ),
                              IconButton(
                                onPressed: () {
                                  // Xóa nhà xuất bản (nếu có tính năng)
                                },
                                icon: const Icon(Icons.delete,
                                    color: Colors.black),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}