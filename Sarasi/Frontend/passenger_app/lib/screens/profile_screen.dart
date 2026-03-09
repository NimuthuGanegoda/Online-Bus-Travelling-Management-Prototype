
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/images/Pprofile.jpg'),
            const SizedBox(height: 20),
            const Text('John Doe', style: TextStyle(fontSize: 24)),
            const Text('johndoe@example.com'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Edit profile
              },
              child: const Text('Edit Profile'),
            ),
          ],
        ),
      ),
    );
  }
}
