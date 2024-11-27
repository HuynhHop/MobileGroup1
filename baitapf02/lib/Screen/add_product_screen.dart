import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AddProductScreen extends StatefulWidget {
  @override
  _AddProductScreenState createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  final _formKey = GlobalKey<FormState>();
  final Map<String, dynamic> _productData = {};
  File? _imageFile;
  final picker = ImagePicker();
  final storage = FlutterSecureStorage();
  final apiUrl = dotenv.env['API_URL'];

  Future<void> _pickImage() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
      });
    }
  }

  Future<void> addProduct() async {
    final token = await storage.read(key: "accessToken");

    final request = http.MultipartRequest('POST', Uri.parse('$apiUrl/product/store'));
    request.headers['Authorization'] = 'Bearer $token';
    request.fields['name'] = _productData['name'] ?? '';
    request.fields['price'] = _productData['price'].toString();
    request.fields['pageNumber'] = _productData['pageNumber'].toString();
    // request.fields['author'] = _productData['author'] ?? '';
    request.fields['publisher'] = _productData['publisher'] ?? '';
    request.fields['categories'] = json.encode(_productData['categories']);

    if (_imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('image', _imageFile!.path),
      );
    }

    final response = await request.send();

    if (response.statusCode == 200) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Add product successfully')));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error adding product")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Add Book")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  width: 200,  
                  height: 200,
                  // decoration: BoxDecoration(
                  //   border: Border.all(color: Colors.grey),
                  //   borderRadius: BorderRadius.circular(8),
                  // ),
                  child: _imageFile == null
                      ? Center(child: Text("Tap to select an image"))
                      : Image.file(_imageFile!, fit: BoxFit.cover),
                ),
              ),
              SizedBox(height: 16),
              TextFormField(
                decoration: InputDecoration(labelText: "Name"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Name is required.";
                  }
                  return null;
                },
                onSaved: (value) => _productData['name'] = value,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: "Price"),
                keyboardType: TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Price is required.";
                  }
                  final double? price = double.tryParse(value);
                  if (price == null) {
                    return "Please enter a price.";
                  } else if (price < 0) {
                    return "Price cannot valid.";
                  }
                  return null;
                },
                onSaved: (value) {
                  _productData['price'] = double.parse(value!);
                },
              ),
              TextFormField(
                decoration: InputDecoration(labelText: "Page Number"),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Page Number is required.";
                  }
                  final int? pages = int.tryParse(value);
                  if (pages == null || pages <= 0) {
                    return "Please enter a valid number greater than 0.";
                  }
                  return null;
                },
                onSaved: (value) => _productData['pageNumber'] = int.parse(value!),
              ),
              // TextFormField(
              //   decoration: InputDecoration(labelText: "Author"),
              //   validator: (value) {
              //     if (value == null || value.isEmpty) {
              //       return "Author is required.";
              //     }
              //     return null;
              //   },
              //   onSaved: (value) => _productData['author'] = value,
              // ),
              TextFormField(
                decoration: InputDecoration(labelText: "Publisher"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Publisher is required.";
                  }
                  return null;
                },
                onSaved: (value) => _productData['publisher'] = value,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: "Categories"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Categories are required.";
                  }
                  try {
                    value.split(',').map((e) => int.parse(e.trim())).toList();
                  } catch (e) {
                    return "Please enter valid category ID separated by commas.";
                  }
                  return null;
                },
                onSaved: (value) => _productData['categories'] = value!
                    .split(',')
                    .map((e) => int.parse(e.trim()))
                    .toList(),
              ),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    addProduct();
                  }
                },
                child: Text("Add"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
