import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'AddPublisherScreen.dart';
import 'EditPublisherScreen.dart';

class PublisherScreen extends StatefulWidget {
  @override
  _PublisherScreenState createState() => _PublisherScreenState();
}

class _PublisherScreenState extends State<PublisherScreen> {
  List<Map<String, dynamic>> publishers = [];
  bool isLoading = true;
  final storage = const FlutterSecureStorage();

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
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data["success"]) {
          setState(() {
            publishers = List<Map<String, dynamic>>.from(data["publishers"]);
            isLoading = false;
          });
        } else {
          showErrorSnackBar("Failed to fetch publishers");
        }
      } else {
        showErrorSnackBar("Error: ${response.statusCode}");
      }
    } catch (error) {
      showErrorSnackBar("Something went wrong: $error");
    }
  }

  Future<void> deletePublisher(String id) async {
    final apiUrl = dotenv.env['API_URL'];

    try {
      final accessToken = await storage.read(key: "accessToken");

      if (accessToken == null) {
        showErrorSnackBar("Access token not found");
        return;
      }

      final response = await http.delete(
        Uri.parse('$apiUrl/publisher/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["success"]) {
          showSuccessSnackBar("Publisher deleted successfully");
          fetchPublishers();
        } else {
          showErrorSnackBar(data["message"] ?? "Failed to delete publisher");
        }
      } else {
        showErrorSnackBar("Error: ${response.statusCode}");
      }
    } catch (error) {
      showErrorSnackBar("Something went wrong: $error");
    }
  }

  void confirmDelete(String id, String name) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Delete Publisher"),
        content:
            Text("Are you sure you want to delete the publisher \"$name\"?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              deletePublisher(id);
            },
            child: const Text("OK"),
          ),
        ],
      ),
    );
  }

  void showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: Colors.green,
    ));
  }

  void showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: Colors.red,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: const Text('Publishers', style: TextStyle(color: Colors.white)),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, size: 30, color: Colors.white),
            tooltip: 'Add Publisher',
            onPressed: () async {
              final result = await Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => AddPublisherScreen()),
              );

              if (result == true) {
                fetchPublishers();
              }
            },
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
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
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      publisher['name'],
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 5),
                                    Text(
                                      publisher['description'],
                                      style: const TextStyle(fontSize: 14),
                                      overflow: TextOverflow.ellipsis,
                                      maxLines: 2,
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                onPressed: () async {
                                  final result = await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => EditPublisherScreen(
                                        publisherId: publisher['_id'],
                                        publisherName: publisher['name'],
                                        publisherDescription:
                                            publisher['description'],
                                      ),
                                    ),
                                  );

                                  if (result == true) {
                                    fetchPublishers();
                                  }
                                },
                                icon:
                                    const Icon(Icons.edit, color: Colors.black),
                              ),
                              IconButton(
                                onPressed: () {
                                  confirmDelete(
                                    publisher['_id'].toString(),
                                    publisher['name'],
                                  );
                                },
                                icon:
                                    const Icon(Icons.delete, color: Colors.red),
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
