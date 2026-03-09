
import 'package:flutter/material.dart';
import 'package:passenger_app/screens/home_screen.dart';
import 'package:passenger_app/screens/profile_screen.dart';
import 'package:passenger_app/screens/routes_screen.dart';
import 'package:passenger_app/screens/history_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bus Tracking App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const HomeScreen(),
      routes: {
        '/profile': (context) => const ProfileScreen(),
        '/routes': (context) => const RoutesScreen(),
        '/history': (context) => const HistoryScreen(),
      },
    );
  }
}
