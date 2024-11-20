import 'package:baitapf02/Screen/OTP_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String username = "";
  String password = "";
  String confirmPassword = "";
  String fullname = "";
  String email = "";
  String phone = "";
  String address = "";

  final apiurl = dotenv.env['API_URL'];

  void handleSendOTP() async {
    if (username.isEmpty ||
        password.isEmpty ||
        confirmPassword.isEmpty ||
        email.isEmpty ||
        phone.isEmpty) {
      _showAlert("Error", "Please fill in all required fields");
      return;
    }

    if (password != confirmPassword) {
      _showAlert("Error", "Passwords do not match");
      return;
    }

    try {
      final response = await http.post(
        Uri.parse(
            '$apiurl/user/sendOTP?email=${Uri.encodeComponent(email)}&action=CreateAccount'),
        headers: {"Content-Type": "application/json"},
        body: json.encode({"username": username, "phone": phone}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final otpCode = data['otp_code'];
        final action = data['action'];

        _showAlert("Success", "OTP sent to your email", () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => OTPScreen(
                otpCode: otpCode,
                action: action,
                username: username,
                password: password,
                email: email,
                fullname: fullname,
                phone: phone,
              ),
            ),
          );
        });
      } else {
        final data = json.decode(response.body);
        _showAlert("Error", data['message'] ?? "Failed to send OTP");
      }
    } catch (error) {
      _showAlert("Error", error.toString());
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
        title: Text('Register'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushNamed(context, '/'),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              onChanged: (value) => username = value,
              decoration: InputDecoration(
                labelText: "Username",
                prefixIcon: Icon(Icons.person),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              onChanged: (value) => password = value,
              obscureText: true,
              decoration: InputDecoration(
                labelText: "Password",
                prefixIcon: Icon(Icons.lock),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              onChanged: (value) => confirmPassword = value,
              obscureText: true,
              decoration: InputDecoration(
                labelText: "Confirm Password",
                prefixIcon: Icon(Icons.lock_outline),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              onChanged: (value) => fullname = value,
              decoration: InputDecoration(
                labelText: "Full Name",
                prefixIcon: Icon(Icons.account_circle),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              onChanged: (value) => email = value,
              decoration: InputDecoration(
                labelText: "Email",
                prefixIcon: Icon(Icons.email),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              onChanged: (value) => phone = value,
              decoration: InputDecoration(
                labelText: "Phone",
                prefixIcon: Icon(Icons.phone),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              onChanged: (value) => address = value,
              decoration: InputDecoration(
                labelText: "Address",
                prefixIcon: Icon(Icons.home),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: handleSendOTP,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurple,
                foregroundColor: Colors.white, // Đặt màu chữ thành trắng
                padding: EdgeInsets.symmetric(horizontal: 80, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text("Register", style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}
