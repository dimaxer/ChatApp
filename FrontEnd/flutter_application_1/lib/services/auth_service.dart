import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:async';
import 'dart:io';

class AuthService {
  final String baseUrl = 'http://10.0.2.2:3000';
  // If you're using an iOS simulator, use 'http://localhost:3000' instead
  final storage = const FlutterSecureStorage();

  Future<String> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      ).timeout(Duration(seconds: 10));
      
      print('Login response: ${response.statusCode} - ${response.body}');
      
      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        // Store the token
        await storage.write(key: 'jwt_token', value: responseData['token']);
        return 'success';
      } else if (response.statusCode == 401) {
        final responseData = json.decode(response.body);
        return responseData['message'];
      } else {
        return 'An unexpected error occurred';
      }
    } catch (e) {
      print('Error during login: $e');
      return 'An error occurred: $e';
    }
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'jwt_token');
  }

  Future<void> logout() async {
    await storage.delete(key: 'jwt_token');
  }

  Future<Map<String, dynamic>> register(String username, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'email': email,
          'password': password
        }),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      final responseData = json.decode(response.body);

      if (response.statusCode == 201) {
        await storage.write(key: 'jwt_token', value: responseData['token']);
        return {'success': true, 'message': 'Registration successful'};
      } else {
        return {'success': false, 'message': responseData['message'] ?? 'Registration failed'};
      }
    } catch (e) {
      print('Error during registration: $e');
      return {'success': false, 'message': 'An error occurred during registration'};
    }
  }

  Future<bool> testConnection() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/')).timeout(Duration(seconds: 10));
      print('Root response: ${response.statusCode} - ${response.body}');
      return response.statusCode == 200;
    } on SocketException catch (e) {
      print('SocketException: ${e.message}');
      return false;
    } catch (e) {
      print('Error testing connection: $e');
      return false;
    }
  }

  Future<bool> testPost() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/test'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'test': 'data'}),
      ).timeout(Duration(seconds: 10));
      print('Test POST response: ${response.statusCode} - ${response.body}');
      return response.statusCode == 200;
    } on SocketException catch (e) {
      print('SocketException: ${e.message}');
      return false;
    } catch (e) {
      print('Error testing POST: $e');
      return false;
    }
  }
}
