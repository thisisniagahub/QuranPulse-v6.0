import os
import subprocess
import sys
import time
from pathlib import Path

# ==========================================
# 🚀 QURAN PULSE GENESIS SCRIPT
# ==========================================
# This script automates the creation of the Quran Pulse Mobile App (Flutter).
# It enforces Clean Architecture, installs dependencies, and writes boilerplate code.
#
# USAGE: python genesis_flutter.py
# ==========================================

PROJECT_NAME = "quran_pulse_mobile"
ORG_DOMAIN = "com.antigravity"
FLUTTER_CMD = "flutter.bat" if os.name == 'nt' else "flutter"

# 🎨 THEME COLORS (Noor-e-Cyber)
COLOR_PRIMARY = "0xFF06B6D4"  # Cyan 500
COLOR_BACKGROUND = "0xFF0F172A" # Slate 900
COLOR_SURFACE = "0xFF1E293B"    # Slate 800

def print_step(step):
    print(f"\n⚡ [GENESIS] {step}...")

def run_command(command, cwd=None):
    try:
        subprocess.check_call(command, shell=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error executing: {command}")
        # Continue even if error to allow partial setup, but warn
        pass

def create_project():
    if os.path.exists(PROJECT_NAME):
        print(f"⚠️ Directory {PROJECT_NAME} already exists. Skipping creation.")
        return

    print_step(f"Initializing Flutter Project: {PROJECT_NAME}")
    run_command(f"{FLUTTER_CMD} create --org {ORG_DOMAIN} --platforms android,ios {PROJECT_NAME}")

def install_dependencies():
    cwd = os.path.join(os.getcwd(), PROJECT_NAME)
    
    print_step("Installing Production Dependencies")
    deps = [
        "flutter_riverpod",
        "riverpod_annotation",
        "go_router",
        "supabase_flutter",
        "isar",
        "isar_flutter_libs",
        "google_fonts",
        "flutter_animate",
        "flutter_svg",
        "gap",
        "intl",
        "shared_preferences",
        "just_audio",           # Critical for Audio
        "audio_service",        # Critical for Background Audio
        "lucide_icons",         # Matches Web
        "cached_network_image"
    ]
    run_command(f"{FLUTTER_CMD} pub add {' '.join(deps)}", cwd=cwd)

    print_step("Installing Dev Dependencies")
    dev_deps = [
        "build_runner",
        "riverpod_generator",
        "isar_generator",
        "flutter_lints",
        "custom_lint",
        "riverpod_lint"
    ]
    run_command(f"{FLUTTER_CMD} pub add -d {' '.join(dev_deps)}", cwd=cwd)

def create_structure():
    base_path = Path(PROJECT_NAME) / "lib"
    
    # Remove default main.dart
    default_main = base_path / "main.dart"
    if default_main.exists():
        default_main.unlink()

    # Define Folder Tree (Clean Architecture)
    dirs = [
        "src/core/constants",
        "src/core/theme",
        "src/core/utils",
        "src/core/router",
        "src/features/auth/data",
        "src/features/auth/presentation",
        "src/features/quran/data/models",
        "src/features/quran/presentation/screens",
        "src/features/quran/presentation/widgets",
        "src/features/iqra/presentation",
        "src/features/home/presentation",
        "src/shared/widgets",
        "src/shared/providers",
    ]

    for d in dirs:
        (base_path / d).mkdir(parents=True, exist_ok=True)

def write_file(path, content):
    full_path = Path(PROJECT_NAME) / "lib" / path
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"   📄 Created: {path}")

def generate_boilerplate():
    print_step("Generating Architecture Boilerplate")

    # 1. THEME (Noor-e-Cyber)
    write_file("src/core/theme/app_theme.dart", f"""
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {{
  static const primaryColor = Color({COLOR_PRIMARY});
  static const backgroundColor = Color({COLOR_BACKGROUND});
  static const surfaceColor = Color({COLOR_SURFACE});

  static ThemeData get darkTheme {{
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: backgroundColor,
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        surface: surfaceColor,
        background: backgroundColor,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
    );
  }}
}}
""")

    # 2. ROUTER
    write_file("src/core/router/app_router.dart", """
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/quran/presentation/screens/quran_home_screen.dart';

part 'app_router.g.dart';

@riverpod
GoRouter goRouter(GoRouterRef ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/quran',
        builder: (context, state) => const QuranHomeScreen(),
      ),
    ],
  );
}
""")

    # 3. HOME SCREEN
    write_file("src/features/home/presentation/home_screen.dart", """
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:gap/gap.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("QuranPulse v6.0")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.activity, size: 64, color: Colors.cyan),
            const Gap(20),
            const Text(
              "Welcome to Noor-e-Cyber",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const Gap(40),
            ElevatedButton.icon(
              onPressed: () => context.push('/quran'),
              icon: const Icon(LucideIcons.bookOpen),
              label: const Text("Open Quran Module"),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.cyan,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        destinations: const [
          NavigationDestination(icon: Icon(LucideIcons.home), label: 'Home'),
          NavigationDestination(icon: Icon(LucideIcons.book), label: 'Quran'),
          NavigationDestination(icon: Icon(LucideIcons.mic), label: 'Iqra'),
        ],
      ),
    );
  }
}
""")

    # 4. QURAN SCREEN STUB
    write_file("src/features/quran/presentation/screens/quran_home_screen.dart", """
import 'package:flutter/material.dart';

class QuranHomeScreen extends StatelessWidget {
  const QuranHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Al-Quran")),
      body: const Center(child: Text("Quran Module Initialized")),
    );
  }
}
""")

    # 5. ENTRY POINT (MAIN)
    write_file("main.dart", """
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'src/core/router/app_router.dart';
import 'src/core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // TODO: Replace with your actual Supabase keys
  // await Supabase.initialize(
  //   url: 'YOUR_SUPABASE_URL',
  //   anonKey: 'YOUR_SUPABASE_ANON_KEY',
  // );

  runApp(const ProviderScope(child: QuranPulseApp()));
}

class QuranPulseApp extends ConsumerWidget {
  const QuranPulseApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);

    return MaterialApp.router(
      title: 'QuranPulse',
      theme: AppTheme.darkTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
""")

def finalize():
    print_step("Running Code Generation")
    cwd = os.path.join(os.getcwd(), PROJECT_NAME)
    
    # We run build_runner to generate the router provider
    # Note: This often fails on first run if dependencies aren't perfectly resolved or if code has syntax errors
    # So we catch the error but don't stop the script.
    try:
        run_command(f"{FLUTTER_CMD} pub run build_runner build --delete-conflicting-outputs", cwd=cwd)
    except:
        print("⚠️ Build runner failed (likely due to missing generated files yet). Run 'dart run build_runner build' later.")

    print("\n✅ =============================================")
    print("✅ GENESIS COMPLETE: Mobile App Ready!")
    print("✅ =============================================")
    print(f"👉 cd {PROJECT_NAME}")
    print("👉 flutter run")
    print("=============================================\n")

if __name__ == "__main__":
    create_project()
    install_dependencies()
    create_structure()
    generate_boilerplate()
    finalize()
