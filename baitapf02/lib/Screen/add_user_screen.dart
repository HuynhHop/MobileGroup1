import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AddUserScreen extends StatefulWidget {
  @override
  _AddUserScreenState createState() => _AddUserScreenState();
}

class _AddUserScreenState extends State<AddUserScreen> {
  final storage = FlutterSecureStorage();
  final TextEditingController username = TextEditingController();
  final TextEditingController password = TextEditingController();
  final TextEditingController fullname = TextEditingController();
  final TextEditingController email = TextEditingController();
  final TextEditingController phone = TextEditingController();
  final apiUrl = dotenv.env['API_URL'];
  Future<void> addUser() async {
    final body = jsonEncode({
      'username': username.text,
      'password': password.text,
      'fullname': fullname.text,
      'email': email.text,
      'phone': phone.text,
    });

    try {
      final token = await storage.read(key: "accessToken");
      final response = await http.post(
        Uri.parse('$apiUrl/user/register'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: body,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success']) {
          showSnackBar('User added successfully');
          Navigator.pop(context, true); // Quay lại màn hình trước
        } else {
          showSnackBar('Failed to add user');
        }
      } else {
        final data = jsonDecode(response.body);
        showSnackBar('Error: ${data['message']}');
      }
    } catch (error) {
      showSnackBar('Something went wrong: $error');
    }
  }

  void showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Add User')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(controller: username, decoration: InputDecoration(labelText: 'Username')),
            TextField(controller: password, decoration: InputDecoration(labelText: 'Password')),
            TextField(controller: fullname, decoration: InputDecoration(labelText: 'Fullname')),
            TextField(controller: email, decoration: InputDecoration(labelText: 'Email')),
            TextField(controller: phone, decoration: InputDecoration(labelText: 'Phone')),
            SizedBox(height: 20),
            ElevatedButton(onPressed: addUser, child: Text('Add User')),
          ],
        ),
      ),
    );
  }
}
