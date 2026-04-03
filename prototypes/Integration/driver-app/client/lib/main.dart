import 'package:driver_app/screens/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://thfphwduxzyojnnbuwey.supabase.co',
    anonKey: 'sb_publishable_UtG5RfQWaq_3TSU8nFYe5g_ppp-LLUz',
  );

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
