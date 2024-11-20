import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class OTPScreen extends StatefulWidget {
  final String otpCode;
  final String action;
  final String username;
  final String password;
  final String email;
  final String fullname;
  final String phone;

  OTPScreen({
    required this.otpCode,
    required this.action,
    required this.username,
    required this.password,
    required this.email,
    required this.fullname,
    required this.phone,
  });

  @override
  _OTPScreenState createState() => _OTPScreenState();
}

class _OTPScreenState extends State<OTPScreen> {
  final TextEditingController otpController = TextEditingController();
  bool isLoading = false;
  final apiurl = dotenv.env['API_URL'];

  void handleActionWithOTP() async {
    if (otpController.text != widget.otpCode) {
      _showAlert("Error", "OTP không khớp");
      return;
    }

    setState(() {
      isLoading = true;
    });

    if (widget.action == "CreateAccount") {
      try {
        final response = await http.post(
          Uri.parse('$apiurl/user/register'),
          headers: {"Content-Type": "application/json"},
          body: json.encode({
            "username": widget.username,
            "password": widget.password,
            "fullname": widget.fullname,
            "email": widget.email,
            "phone": widget.phone,
          }),
        );

        final data = json.decode(response.body);
        setState(() {
          isLoading = false;
        });

        if (response.statusCode == 200) {
          _showAlert("Success", data['message'], () {
            Navigator.pushNamed(context, '/');
          });
        } else {
          _showAlert("Error", data['message'] ?? "Đăng ký thất bại");
        }
      } catch (error) {
        setState(() {
          isLoading = false;
        });
        _showAlert("Error", error.toString());
      }
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
        title: Text('Xác thực OTP'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Nhập mã OTP",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.deepPurple,
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: otpController,
              decoration: InputDecoration(
                labelText: "Nhập mã OTP",
                labelStyle: TextStyle(color: Colors.grey[700]),
                prefixIcon: Icon(Icons.security, color: Colors.deepPurple),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              keyboardType: TextInputType.number,
              maxLength: 6,
            ),
            SizedBox(height: 20),
            isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: handleActionWithOTP,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: Colors.white, // Đặt màu chữ thành trắng
                      padding:
                          EdgeInsets.symmetric(horizontal: 80, vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      'Đăng ký',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
