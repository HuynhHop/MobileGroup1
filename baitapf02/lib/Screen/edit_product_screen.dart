import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:image_picker/image_picker.dart'; // Image picker
import 'dart:io'; // File handling

class EditProductScreen extends StatefulWidget {
  final Map<String, dynamic> product;

  EditProductScreen({required this.product});

  @override
  _EditProductScreenState createState() => _EditProductScreenState();
}

class _EditProductScreenState extends State<EditProductScreen> {
  final _formKey = GlobalKey<FormState>();
  late Map<String, dynamic> _updatedData;
  File? _imageFile;

  @override
  void initState() {
    super.initState();
    _updatedData = {...widget.product};

    // Check if there is an existing image URL and set it if available
    if (widget.product['imageUrl'] != null && widget.product['imageUrl'].startsWith('http')) {
      // If it's a URL, no need to use File() here, load via network
      _imageFile = null;
    } else if (widget.product['imageUrl'] != null) {
      // If it's a local file path, use it
      _imageFile = File(widget.product['imageUrl']);
    }
  }

  // Pick image from gallery
  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
        _updatedData['imageUrl'] = _imageFile!.path; // Store the local path
      });
    }
  }

  // Update product
  Future<void> updateProduct() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      final storage = FlutterSecureStorage();
      final token = await storage.read(key: "accessToken");
      final apiUrl = dotenv.env['API_URL'];

      final response = await http.put(
        Uri.parse('$apiUrl/product/${widget.product['_id']}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(_updatedData),
      );

      if (response.statusCode == 200) {
        Navigator.pop(context);
      } else {
        final responseBody = json.decode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(responseBody['message'] ?? 'Failed to update product')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Edit Product")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Image selection
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
                      ? widget.product['imageUrl'] != null
                          ? widget.product['imageUrl'].startsWith('http')
                              ? Image.network(
                                  widget.product['imageUrl'], // Load network image
                                  fit: BoxFit.contain, // Use BoxFit.contain to fit the image inside the container
                                )
                              : Image.file(
                                  File(widget.product['imageUrl']), // Load local file if available
                                  fit: BoxFit.contain, // Use BoxFit.contain to fit the image inside the container
                                )
                          : Center(child: Text("Tap to select an image"))
                      : Image.file(_imageFile!, fit: BoxFit.contain), // Use BoxFit.contain for selected image
                ),
              ),
              SizedBox(height: 16),
              // Name field
              TextFormField(
                initialValue: widget.product['name'],
                decoration: InputDecoration(labelText: "Name"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Name is required.";
                  }
                  return null;
                },
                onSaved: (value) => _updatedData['name'] = value,
              ),
              // Price field
              TextFormField(
                initialValue: widget.product['price'].toString(),
                decoration: InputDecoration(labelText: "Price"),
                keyboardType: TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Price is required.";
                  }
                  final double? price = double.tryParse(value);
                  if (price == null) {
                    return "Please enter a valid price.";
                  } else if (price < 0) {
                    return "Price cannot be negative.";
                  }
                  return null;
                },
                onSaved: (value) => _updatedData['price'] = double.parse(value!),
              ),
              // Page number field
              TextFormField(
                initialValue: widget.product['pageNumber'].toString(),
                decoration: InputDecoration(labelText: "Page Number"),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Page number is required.";
                  }
                  final int? pageNumber = int.tryParse(value);
                  if (pageNumber == null) {
                    return "Please enter a valid page number.";
                  }
                  return null;
                },
                onSaved: (value) => _updatedData['pageNumber'] = int.parse(value!),
              ),
              // // Author field
              // TextFormField(
              //   initialValue: widget.product['author'].toString(),
              //   decoration: InputDecoration(labelText: "Author"),
              //   validator: (value) {
              //     if (value == null || value.isEmpty) {
              //       return "Author is required.";
              //     }
              //     return null;
              //   },
              //   onSaved: (value) => _updatedData['author'] = value,
              // ),
              // Publisher field
              TextFormField(
                initialValue: widget.product['publisher'].toString(),
                decoration: InputDecoration(labelText: "Publisher"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Publisher is required.";
                  }
                  return null;
                },
                onSaved: (value) => _updatedData['publisher'] = value,
              ),
              // Categories field
              TextFormField(
                initialValue: widget.product['categories'].join(', '),
                decoration: InputDecoration(labelText: "Categories"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Categories are required.";
                  }
                  return null;
                },
                onSaved: (value) {
                  _updatedData['categories'] = value!
                      .split(',')
                      .map((e) => e.trim())
                      .toList();
                },
              ),
              SizedBox(height: 16),
              // Save button
              ElevatedButton(
                onPressed: updateProduct,
                child: Text("Save"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
