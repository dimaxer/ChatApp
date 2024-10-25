import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'pages/login_page.dart';

void main() {
  // Custom log filter
  if (!kReleaseMode) {
    debugPrint = (String? message, {int? wrapWidth}) {
      if (message != null && 
          !message.contains('EGL_emulation') && 
          !message.contains('app_time_stats') &&
          !message.contains('InputMethodManager') &&
          !message.contains('ImeTracker') &&
          !message.contains('InsetsController')) {
        print(message);
      }
    };
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Login Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LoginPage(),
    );
  }
}
