
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/images/Pprofile.jpg'),
            const SizedBox(height: 20),
            const Text('Welcome, Passenger!', style: TextStyle(fontSize: 24)),
          ],
        ),
      ),
    );
  }
}
