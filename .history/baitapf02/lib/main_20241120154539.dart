// import 'package:baitapf02/Screen/OTP_screen.dart';
// import 'package:baitapf02/Screen/forget_password_screen.dart';
// import 'package:baitapf02/Screen/login_screen.dart';
// import 'package:baitapf02/Screen/manager_screen.dart';
// import 'package:baitapf02/Screen/register_screen.dart';
// import 'package:baitapf02/Screen/reset_password_screen.dart';
// import 'package:baitapf02/Screen/category_screen.dart';

// import 'package:flutter/material.dart';
// import 'package:flutter_dotenv/flutter_dotenv.dart';

// void main() async {
//   await dotenv.load(fileName: ".env");
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'App Flutter',
//       theme: ThemeData(primarySwatch: Colors.blue),
//       initialRoute: '/',
//       routes: {
//         '/': (context) => LoginScreen(), // Assuming you have a LoginScreen
//         '/manager': (context) => ManagerScreen(),
//         '/register': (context) => RegisterScreen(),
//         // '/otp': (context) {
//         //       final args = ModalRoute.of(context)!.settings.arguments as OTPScreen;
//         //       return OTPScreen(
//         //         otpCode: args.otpCode,
//         //         action: args.action,
//         //         username: args.username,
//         //         password: args.password,
//         //         email: args.email,
//         //         fullname: args.fullname,
//         //         phone: args.phone,
//         //       );
//         //     },
//         '/forget-password': (context) => ForgotPasswordScreen(),
//         '/reset-password': (context) => ResetPasswordScreen(),
//         '/category': (context) => CategoryScreen(),
//       },
//     );
//   }
// }

import 'package:baitapf02/Screen/OTP_screen.dart';
import 'package:baitapf02/Screen/forget_password_screen.dart';
import 'package:baitapf02/Screen/login_screen.dart';
import 'package:baitapf02/Screen/manager_screen.dart';
import 'package:baitapf02/Screen/register_screen.dart';
import 'package:baitapf02/Screen/reset_password_screen.dart';

import 'package:baitapf02/Screen/category_screen.dart';
import 'package:baitapf02/Screen/AddCategoryScreen.dart';
import 'package:baitapf02/Screen/EditCategoryScreen.dart'; // Thêm import EditCategoryScreen

import 'package:baitapf02/Screen/PublisherScreen.dart';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'App Flutter',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/manager': (context) => ManagerScreen(),
        '/register': (context) => RegisterScreen(),
        '/forget-password': (context) => ForgotPasswordScreen(),
        '/reset-password': (context) => ResetPasswordScreen(),
        '/category': (context) => CategoryScreen(),
        '/edit-category': (context) {
          final args = ModalRoute.of(context)!.settings.arguments
              as Map<String, dynamic>;
          return EditCategoryScreen(
            categoryId: args['categoryId'],
            categoryName: args['categoryName'],
          );
        },
        '/add-category': (context) =>
            AddCategoryScreen(), // Thêm route cho màn hình add

        '/publisher': (context) => PublisherScreen(),
        '/edit-publisher': (context) {
          final args = ModalRoute.of(context)!.settings.arguments
              as Map<String, dynamic>;
          return EditCategoryScreen(
            publisherId: args['publisherId'],
            publisherName: args['publisherName'],
            publisherDescription: args['publisherDescription'],
          );
        },
      },
    );
  }
}
