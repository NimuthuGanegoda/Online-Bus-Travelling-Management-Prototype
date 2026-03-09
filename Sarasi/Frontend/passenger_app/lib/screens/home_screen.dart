
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bus Tracking App'),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text('Menu'),
            ),
            ListTile(
              title: const Text('Home'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('Profile'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/profile');
              },
            ),
            ListTile(
              title: const Text('Routes'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/routes');
              },
            ),
            ListTile(
              title: const Text('Trip History'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/history');
              },
            ),
          ],
        ),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Image.asset('assets/images/home.jpg', height: 250,),
              const SizedBox(height: 20),
              ElevatedButton(
                child: const Text('View Bus Routes'),
                onPressed: () {
                  Navigator.pushNamed(context, '/routes');
                },
              ),
              const SizedBox(height: 10),
               ElevatedButton(
                child: const Text('My Profile'),
                onPressed: () {
                  Navigator.pushNamed(context, '/profile');
                },
              ),
              const SizedBox(height: 10),
               ElevatedButton(
                child: const Text('Trip History'),
                onPressed: () {
                  Navigator.pushNamed(context, '/history');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
