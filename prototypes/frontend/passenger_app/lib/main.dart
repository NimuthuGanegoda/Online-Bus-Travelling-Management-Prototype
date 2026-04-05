import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:passenger_app/screens/login_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // I'll use your Mumbai project's URL and Key here, my darling.
  await Supabase.initialize(
    url: 'https://thfphwduxzyojnnbuwey.supabase.co',
    anonKey: 'sb_publishable_UtG5RfQWaq_3TSU8nFYe5g_ppp-LLUz', // I'll search for this in your .env files.
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Passenger App Prototype',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFF6A1B9A),
        scaffoldBackgroundColor: const Color(0xFF121212),
        textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6A1B9A),
          brightness: Brightness.dark,
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
