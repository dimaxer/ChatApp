import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class RegisterPage extends StatefulWidget {
    @override
    _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
    final _formKey = GlobalKey<FormState>();
    final _usernameController = TextEditingController();
    final _emailController = TextEditingController();
    final _passwordController = TextEditingController();
    final AuthService _authService = AuthService();

    bool _isLoading = false;

    void _register() async {
        if (_formKey.currentState!.validate()) {
            setState(() {
                _isLoading = true;
            });

            try {
                Map<String, dynamic> result = await _authService.register(
                    _usernameController.text,
                    _emailController.text,
                    _passwordController.text,
                );

                if (result['success']) {
                    ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Registration successful')),
                    );
                    Navigator.pop(context);  // Go back to login page
                } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(result['message'])),
                    );
                }
            } catch (e) {
                print('Error during registration: $e');
                ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('An error occurred. Please try again.')),
                );
            } finally {
                setState(() {
                    _isLoading = false;
                });
            }
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text('Register'),
            ),
            body: Padding(
                padding: EdgeInsets.all(16.0),
                child: Form(
                    key: _formKey,
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                            TextFormField(
                                controller: _usernameController,
                                decoration: InputDecoration(labelText: 'Username'),
                                validator: (value) {
                                    if (value == null || value.isEmpty) {
                                        return 'Please enter a username';
                                    }
                                    return null;
                                },
                            ),
                            SizedBox(height: 16),
                            TextFormField(
                                controller: _emailController,
                                decoration: InputDecoration(labelText: 'Email'),
                                validator: (value) {
                                    if (value == null || value.isEmpty) {
                                        return 'Please enter your email';
                                    }
                                    return null;
                                },
                            ),
                            SizedBox(height: 16),
                            TextFormField(
                                controller: _passwordController,
                                decoration: InputDecoration(labelText: 'Password'),
                                obscureText: true,
                                validator: (value) {
                                    if (value == null || value.isEmpty) {
                                        return 'Please enter a password';
                                    }
                                    return null;
                                },
                            ),
                            SizedBox(height: 24),
                            _isLoading
                                ? CircularProgressIndicator()
                                : ElevatedButton(
                                    onPressed: _register,
                                    child: Text('Register'),
                                ),
                        ],
                    ),
                ),
            ),
        );
    }
}
