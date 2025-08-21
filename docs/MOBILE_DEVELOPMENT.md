# Mobile Development Guide

This guide covers mobile app development using Next.js and Capacitor in this turborepo template.

## Table of Contents
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Development Workflow](#development-workflow)
- [Prerequisites](#prerequisites)
- [Building for Production](#building-for-production)
- [Common Issues & Solutions](#common-issues--solutions)
- [Platform-Specific Notes](#platform-specific-notes)

## Quick Start

The fastest way to start mobile development:

1. **Start development server with interactive menu:**
   ```bash
   pnpm dev
   ```

2. **Choose your development option:**
   - 🌐 **Web only** - Test mobile app in browser at `http://localhost:3003`
   - 📱 **iOS Simulator** - Automatically opens Xcode
   - 🤖 **Android Emulator** - Automatically opens Android Studio
   - 📱🤖 **Both mobile apps** - Opens both Xcode and Android Studio
   - 🚀 **All apps** - Runs everything (web, admin, mobile, api)

3. **For native development:** After selecting iOS/Android, the respective IDE will open. Press the play button to run in simulator/emulator.

## Architecture Overview

The mobile app uses **Capacitor** to wrap the Next.js application as native iOS and Android apps:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Capacitor     │    │  Native Apps    │
│                 │───▶│                 │───▶│                 │
│ React/TypeScript│    │   Web Bridge    │    │  iOS & Android  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Benefits
- **Single Codebase**: Write once in React/Next.js, deploy everywhere
- **Native Access**: Use Capacitor plugins for device features (camera, storage, etc.)
- **Web Technologies**: Leverage existing React/Next.js knowledge
- **Hot Reload**: Development with live reload on simulators/emulators

### Directory Structure

```
apps/mobile/
├── app/                 # Next.js app directory (React components)
├── lib/                 # Utilities and API client
├── ios/                 # iOS native project (Xcode)
├── android/            # Android native project (Android Studio)  
├── out/                # Built static files (synced to native platforms)
├── capacitor.config.ts # Capacitor configuration
├── next.config.ts      # Next.js config (optimized for static export)
└── package.json        # Mobile app dependencies and scripts
```

## Development Workflow

### Interactive Development Menu

The `pnpm dev` command provides an interactive menu with these options:

#### 🌐 Web Only
- Runs: Admin (port 3000), Web (port 3001), Mobile web (port 3003), API (port 3002)
- Perfect for: Testing mobile UI in browser, rapid development, debugging
- Access mobile app: `http://localhost:3003`

#### 📱 iOS Simulator  
- Runs: Mobile app (port 3003), API (port 3002)
- Opens: Xcode automatically
- Perfect for: iOS-specific testing, native feature development

#### 🤖 Android Emulator
- Runs: Mobile app (port 3003), API (port 3002)  
- Opens: Android Studio automatically
- Perfect for: Android-specific testing, native feature development

#### 📱🤖 Both Mobile Apps
- Runs: Mobile app (port 3003), API (port 3002)
- Opens: Both Xcode and Android Studio
- Perfect for: Cross-platform testing

#### 🚀 All Apps
- Runs: All development servers
- Opens: Both Xcode and Android Studio  
- Perfect for: Full-stack development

### Live Reload

Live reload works automatically when using the development menu:

1. Make changes to your React components in `apps/mobile/app/`
2. Changes are instantly reflected in:
   - Browser (if using Web only option)
   - iOS Simulator (if running iOS option)
   - Android Emulator (if running Android option)

### Manual Commands

If you prefer manual control:

```bash
# Start Next.js dev server only
pnpm --filter=mobile dev

# Open iOS project in Xcode
cd apps/mobile && npx cap open ios

# Open Android project in Android Studio  
cd apps/mobile && npx cap open android

# Sync web assets to native platforms
pnpm --filter=mobile mobile:sync

# Clean build artifacts
pnpm --filter=mobile mobile:clean
```

## Prerequisites

### For iOS Development
- **macOS** (required for iOS development)
- **Xcode** (latest version from App Store)
- **iOS Simulator** (included with Xcode)
- **CocoaPods** (for iOS dependencies)

### For Android Development  
- **Java 17** (any platform)
- **Android Studio** (latest version)
- **Android SDK** (via Android Studio)
- **Android Emulator** or physical device

### Installation Steps

#### 1. Install Java (for Android)
```bash
# Using Homebrew (macOS)
brew install openjdk@17

# Add to your shell profile (.zshrc or .bash_profile)
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

#### 2. Install CocoaPods (for iOS on macOS)
```bash
# Install Ruby (if needed)
brew install rbenv ruby-build
rbenv install 3.2.0
rbenv global 3.2.0

# Install CocoaPods
gem install cocoapods
```

#### 3. Install Dependencies
```bash
# Install all project dependencies
pnpm install

# Build the mobile app
pnpm --filter=mobile build
```

## Building for Production

### 1. Build the Next.js App
```bash
pnpm --filter=mobile build
```
This creates an optimized static export and syncs with native platforms.

### 2. iOS Production Build

1. **Open Xcode:**
   ```bash
   cd apps/mobile && npx cap open ios
   ```

2. **Configure signing:**
   - Select your development team
   - Configure bundle identifier
   - Set up provisioning profiles

3. **Archive for distribution:**
   - Product → Archive
   - Follow the wizard to upload to App Store Connect

### 3. Android Production Build

1. **Open Android Studio:**
   ```bash
   cd apps/mobile && npx cap open android
   ```

2. **Generate signed bundle:**
   - Build → Generate Signed Bundle / APK
   - Create or use existing keystore
   - Follow the wizard to create signed release

### Environment Variables

Configure different API endpoints for production:

```typescript
// In lib/api.ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
```

Set `NEXT_PUBLIC_API_URL` to your production API endpoint.

## Common Issues & Solutions

### iOS Issues

#### "CocoaPods not installed"
```bash
gem install cocoapods
cd apps/mobile/ios/App && pod install
```

#### "xcode-select: error: tool 'xcodebuild' requires Xcode"
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

#### Build fails in Xcode
1. Clean build folder: Product → Clean Build Folder
2. Delete derived data: `~/Library/Developer/Xcode/DerivedData`
3. Restart Xcode and rebuild

### Android Issues

#### "Unable to locate a Java Runtime"
Ensure Java 17 is installed and `JAVA_HOME` is set:
```bash
java -version
echo $JAVA_HOME
```

#### "SDK location not found"  
1. Open Android Studio
2. File → Project Structure → SDK Location
3. Set the Android SDK path

#### Gradle sync failed
1. File → Sync Project with Gradle Files
2. If that fails: File → Invalidate Caches and Restart

### General Issues

#### Changes not appearing in simulator/emulator
1. Ensure Next.js dev server is running (`pnpm --filter=mobile dev`)
2. Check that your device/simulator is on the same network
3. Try restarting the simulator/emulator

#### "Cannot GET /" error in simulator
1. Verify Next.js dev server is running on port 3003
2. Check firewall settings
3. Use `http://localhost:3003` instead of IP address for testing

#### Build fails with missing dependencies
```bash
# Reinstall dependencies
pnpm install

# Rebuild the app
pnpm --filter=mobile build
```

## Platform-Specific Notes

### iOS Specific
- **Minimum iOS Version**: 13.0
- **Bundle Identifier**: Configure in Xcode project settings
- **App Store**: Requires Apple Developer account ($99/year)
- **TestFlight**: Use for beta testing

### Android Specific  
- **Minimum SDK**: API 22 (Android 5.1)
- **Target SDK**: API 34 (Android 14)
- **Google Play**: Requires Google Play Console account ($25 one-time)
- **Internal Testing**: Use Google Play Console for beta testing

### Performance Considerations

#### Web vs Native
- **Navigation**: Native apps don't have browser back buttons
- **Storage**: Use Capacitor Storage plugin for persistence
- **URLs**: External links should use Capacitor Browser plugin
- **Images**: Optimize images for mobile (use Next.js Image optimization)

#### Memory Management
- Use React.memo() for expensive components
- Implement proper cleanup in useEffect hooks
- Avoid memory leaks in long-running processes

## Adding Native Features

### Installing Capacitor Plugins

1. **Install the plugin:**
   ```bash
   pnpm --filter=mobile add @capacitor/camera
   ```

2. **Sync with native platforms:**
   ```bash
   pnpm --filter=mobile mobile:sync
   ```

3. **Use in your code:**
   ```typescript
   import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
   
   const takePicture = async () => {
     const image = await Camera.getPhoto({
       quality: 90,
       source: CameraSource.Camera,
       resultType: CameraResultType.Uri
     });
     
     return image.webPath;
   };
   ```

4. **Configure permissions** (if required):
   - iOS: Add to `ios/App/App/Info.plist`
   - Android: Add to `android/app/src/main/AndroidManifest.xml`

### Popular Capacitor Plugins
- **@capacitor/camera** - Camera and photo library access
- **@capacitor/geolocation** - GPS location services
- **@capacitor/storage** - Secure native storage
- **@capacitor/push-notifications** - Push notifications
- **@capacitor/local-notifications** - Local notifications
- **@capacitor/device** - Device information
- **@capacitor/network** - Network status

## Deployment Checklist

### Before App Store Submission

#### iOS
- [ ] Configure app icons and splash screens
- [ ] Set proper bundle identifier and version
- [ ] Configure App Store Connect
- [ ] Test on physical device
- [ ] Ensure all required permissions are declared
- [ ] Verify app works offline (if applicable)

#### Android  
- [ ] Configure app icons and splash screens
- [ ] Set proper application ID and version
- [ ] Create signed release build
- [ ] Test on physical device
- [ ] Ensure all required permissions are declared
- [ ] Optimize app size (under 100MB recommended)

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/guidelines/)
- [Google Play Console](https://play.google.com/console)
- [React Native vs Capacitor](https://capacitorjs.com/docs/getting-started/vs-react-native)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Capacitor GitHub Issues](https://github.com/ionic-team/capacitor/issues)
2. Review [Next.js Documentation](https://nextjs.org/docs)
3. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
4. Join the [Capacitor Discord Community](https://discord.gg/UPYYRhtyzp)