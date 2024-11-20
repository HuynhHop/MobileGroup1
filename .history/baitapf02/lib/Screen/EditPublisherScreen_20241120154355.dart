import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class EditPublisherScreen extends StatefulWidget {
  final int publisherId;
  final String publisherName;
  final String publisherDescription;

  const EditPublisherScreen({
    Key? key,
    required this.publisherId,
    required this.publisherName,
    required this.publisherDescription,
  }) : super(key: key);

  @override
  _EditPublisherScreenState createState() => _EditPublisherScreenState();
}

class _EditPublisherScreenState extends State<EditPublisherScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final _storage = const FlutterSecureStorage();
  bool isUpdating = false;

  @override
  void initState() {
    super.initState();
    _nameController.text = widget.publisherName;
    _descriptionController.text = widget.publisherDescription;
  }

  Future<void> updatePublisher() async {
    final apiUrl = dotenv.env['API_URL'];
    final accessToken = await _storage.read(key: "accessToken");

    if (accessToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("AccessToken is missing. Please login.")),
      );
      return;
    }

    setState(() {
      isUpdating = true;
    });

    try {
      final response = await http.put(
        Uri.parse('$apiUrl/publisher/${widget.publisherId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
        body: jsonEncode({
          'name': _nameController.text,
          'description': _descriptionController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data['success']) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(data['message'])),
          );
          Navigator.pop(context, true); // Trả kết quả về màn hình trước
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(data['message'])),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: ${response.statusCode}")),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Something went wrong: $error")),
      );
    } finally {
      setState(() {
        isUpdating = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: const Text(
          'Edit Publisher',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Publisher Name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _descriptionController,
              maxLines: 5,
              decoration: const InputDecoration(
                labelText: 'Publisher Description',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            isUpdating
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: updatePublisher,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      padding: const EdgeInsets.symmetric(
                          vertical: 12, horizontal: 24),
                    ),
                    child: const Text(
                      'Update',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
