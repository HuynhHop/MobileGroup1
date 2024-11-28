import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EditUserScreen extends StatefulWidget {
  @override
  _EditUserScreenState createState() => _EditUserScreenState();
}

class _EditUserScreenState extends State<EditUserScreen> {
  final storage = FlutterSecureStorage();
  final apiUrl = dotenv.env['API_URL'];
  final _formKey = GlobalKey<FormState>();

  late Map<String, dynamic> user;
  late TextEditingController usernameController;
  late TextEditingController fullnameController;
  late TextEditingController emailController;
  late TextEditingController phoneController;
  late TextEditingController addressController;
  bool isBlocked = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // Retrieve the user data passed via the 'arguments' in Navigator
    user = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;

    // Initialize the controllers with user data
    usernameController = TextEditingController(text: user['username']);
    fullnameController = TextEditingController(text: user['fullname']);
    emailController = TextEditingController(text: user['email']);
    phoneController = TextEditingController(text: user['phone']);
    addressController = TextEditingController(text: user['address']);
    isBlocked = user['isBlocked'] ?? false; // If not present, default to false
  }

  Future<void> updateUser() async {
    if (_formKey.currentState!.validate()) {
      try {
        final token = await storage.read(key: "accessToken");

        // Send the PUT request to update the user details
        final response = await http.put(
          Uri.parse(
              '$apiUrl/user/${user['_id']}'), // Use _id to target the user
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: jsonEncode({
            'fullname': fullnameController.text,
            'email': emailController.text,
            'phone': phoneController.text,
            'address': addressController.text,
            'isBlocked': isBlocked,
          }),
        );

        final data = jsonDecode(response.body);
        if (response.statusCode == 200) {
          if (data['success']) {
            Navigator.pop(context, true);
            ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('User updated successfully')));
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Failed to update user ')));
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text('Error: ${response.statusCode}, ${data.message}')));
        }
      } catch (error) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Something went wrong: $error')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit User'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              children: [
                // Avatar or image section (if any image needs to be displayed)
                CircleAvatar(
                  radius: 40,
                  child: Text(user['username'][0].toUpperCase()),
                ),
                SizedBox(height: 16),

                // Username field (cannot be edited)
                TextFormField(
                  controller: usernameController,
                  decoration: InputDecoration(
                    labelText: 'Username',
                    enabled: false, // Disables editing for username
                    border: OutlineInputBorder(),
                  ),
                ),
                SizedBox(height: 16),

                // Fullname field
                TextFormField(
                  controller: fullnameController,
                  decoration: InputDecoration(
                    labelText: 'Fullname',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a fullname';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Email field
                TextFormField(
                  controller: emailController,
                  decoration: InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter an email';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Phone field
                TextFormField(
                  controller: phoneController,
                  decoration: InputDecoration(
                    labelText: 'Phone',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a phone number';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Address field
                TextFormField(
                  controller: addressController,
                  decoration: InputDecoration(
                    labelText: 'Address',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter an address';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Blocked toggle switch
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Blocked'),
                    Switch(
                      value: isBlocked,
                      onChanged: (value) {
                        setState(() {
                          isBlocked = value;
                        });
                      },
                    ),
                  ],
                ),
                SizedBox(height: 24),

                // Save button
                ElevatedButton(
                  onPressed: updateUser,
                  child: Text('Save'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
