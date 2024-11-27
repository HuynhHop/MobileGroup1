import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class UserManagerScreen extends StatefulWidget {
  @override
  _UserManagerScreenState createState() => _UserManagerScreenState();
}

class _UserManagerScreenState extends State<UserManagerScreen> {
  List<Map<String, dynamic>> users = [];
  bool isLoading = true;
  final storage = FlutterSecureStorage();
  final apiUrl = dotenv.env['API_URL'];
  
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    fetchUsers(); // Fetch users every time the screen is loaded or reloaded
  }

  Future<void> fetchUsers() async {
    try {
      final token = await storage.read(key: "accessToken");
      final response = await http.get(
        Uri.parse('$apiUrl/user/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success']) {
          setState(() {
            users = List<Map<String, dynamic>>.from(data['users']);
            isLoading = false;
          });
        } else {
          showSnackBar('Failed to fetch users');
          setState(() => isLoading = false);
        }
      } else {
        showSnackBar('Error: ${response.statusCode}');
        setState(() => isLoading = false);
      }
    } catch (error) {
      showSnackBar('Something went wrong: $error');
      setState(() => isLoading = false);
    }
  }

  Future<void> deleteUser(int id) async {

    try {
      final token = await storage.read(key: "accessToken");
      final response = await http.delete(
        Uri.parse('$apiUrl/user/${id}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success']) {
          showSnackBar('User deleted successfully');
          fetchUsers(); // Refresh user list after deletion
        } else {
          showSnackBar('Failed to delete user');
        }
      } else {
        showSnackBar('Error: ${response.statusCode}');
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
      appBar: AppBar(
        title: Text('User Manager'),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
              Navigator.pushNamed(context, '/add_user').then((result) {
                if (result == true) {
                  fetchUsers(); // Refresh the user
                }
              });
            },
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                return ListTile(
                  leading: CircleAvatar(
                    child: Text(user['username'][0].toUpperCase()),
                  ),
                  title: Text(user['username']),
                  subtitle: Text(user['email']),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                      icon: Icon(Icons.edit),
                      onPressed: () {
                        Navigator.pushNamed(
                          context,
                          '/edit_user',
                          arguments: user, // Pass user data to edit screen
                        ).then((result) {
                          // Check if the result is true (indicating a successful update)
                          if (result == true) {
                            fetchUsers(); // Refresh the user list after update
                          }
                        });
                      },
                    ),
                      IconButton(
                        icon: Icon(Icons.delete, color: Colors.red),
                        onPressed: () => deleteUser(user['_id']),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
