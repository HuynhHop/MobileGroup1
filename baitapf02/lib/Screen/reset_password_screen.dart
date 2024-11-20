import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ResetPasswordScreen extends StatefulWidget {
  @override
  _ResetPasswordScreenState createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  String resetToken = '';
  String newPassword = '';
  String confirmPassword = '';
  bool isLoading = false;
  final apiurl = dotenv.env['API_URL'];

  void handleResetPassword() async {
    if (newPassword != confirmPassword) {
      _showAlert("Error", "Passwords do not match");
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.put(
        Uri.parse('$apiurl/user/resetPassword'),
        headers: {
          "Content-Type": "application/json",
        },
        body: json.encode({
          'resetToken': resetToken,
          'newPassword': newPassword,
        }),
      );

      final data = json.decode(response.body);
      setState(() {
        isLoading = false;
      });

      if (response.statusCode == 200) {
        _showAlert("Success", "Password has been reset", () {
          Navigator.pushNamed(context, '/'); // Navigate to Login screen
        });
      } else {
        _showAlert("Error", data['message'] ?? "Password reset failed");
      }
    } catch (error) {
      setState(() {
        isLoading = false;
      });
      _showAlert("Error", error.toString() ?? "Something went wrong");
    }
  }

  void _showAlert(String title, String message, [VoidCallback? onPressed]) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            child: Text("OK"),
            onPressed: () {
              Navigator.of(ctx).pop();
              if (onPressed != null) onPressed();
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Reset Password'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back), // Biểu tượng mũi tên quay lại
          onPressed: () => Navigator.pushNamed(context, '/'), // Quay về trang đăng nhập
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              onChanged: (value) => newPassword = value,
              decoration: InputDecoration(labelText: "New Password"),
              obscureText: true,
            ),
            TextField(
              onChanged: (value) => confirmPassword = value,
              decoration: InputDecoration(labelText: "Confirm Password"),
              obscureText: true,
            ),
            SizedBox(height: 20),
            isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: handleResetPassword,
                    child: Text('Reset Password'),
                  ),
          ],
        ),
      ),
    );
  }
}
