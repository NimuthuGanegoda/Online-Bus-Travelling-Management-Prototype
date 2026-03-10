
import 'package:driver_app/screens/login_screen.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SL BusTrack - Driver',
      theme: ThemeData.dark(),
      home: const LoginScreen(),
    );
  }
}
