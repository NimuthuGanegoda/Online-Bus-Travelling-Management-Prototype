
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
            Image.asset('assets/images/Dhome.jpg'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Navigate to other screens
              },
              child: const Text('Start Route'),
            ),
          ],
        ),
      ),
    );
  }
}
