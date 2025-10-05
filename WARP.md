# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Mizan Money** is an Islamic-compliant banking and fintech mobile application built with React Native and Expo. The app provides features including banking services, card management, M-PESA integration, charitable donations through Islamic Corner, investment portfolios, and Round-Ups functionality.

### Tech Stack
- **Framework**: Expo SDK 54 (managed workflow)
- **Runtime**: React 19.1.0, React Native 0.81.4
- **Language**: TypeScript 5.9.2
- **Backend**: Supabase (authentication, database, storage)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation v7 (Native Stack + Bottom Tabs)
- **State Management**: React Context API
- **Animations**: React Native Reanimated 4.1.0
- **Charts**: Victory Native 41.17.3
- **Icons**: Lucide React Native 0.509.0

## Common Development Commands

### Starting & Running
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator/device
npm run android

# Run on web browser
npm run web

# Start with cleared cache (recommended when issues occur)
npx expo start --clear
```

### Building & Prebuild
```bash
# Generate native projects (required before running native builds)
npm run prebuild

# Fix wheel picker issues before prebuild (automatically runs with prebuild)
npm run fix-wheel-picker
```

### Code Quality
```bash
# Lint all JavaScript/TypeScript files
npm run lint

# Format and fix all files
npm run format

# Lint only (ESLint)
eslint "**/*.{js,jsx,ts,tsx}"

# Format only (Prettier)
prettier "**/*.{js,jsx,ts,tsx,json}" --write
```

### Package Management
```bash
# Install dependencies (runs patch-package automatically)
npm install

# Apply patches after install
npm run postinstall
```

### Development Tips
- Always use `npx expo install` instead of `npm install` for Expo-compatible packages
- After pulling changes, run `npx expo start --clear` to avoid cache issues
- Check `.env` file for required environment variables (Supabase credentials)

## Architecture Overview

### Application Structure

The app follows a screen-based architecture with context providers for global state management and custom hooks for shared logic.

#### Navigation Hierarchy
```
App.tsx (Root)
├── AuthProvider (Global auth state)
│   └── NavigationContainer
│       └── RootStack
│           ├── Auth Flow (Unauthenticated)
│           │   ├── Intro/Onboarding
│           │   ├── WelcomeScreen
│           │   ├── AuthOptionsScreen
│           │   ├── Auth (Email/Password)
│           │   ├── OTP Verification
│           │   ├── EmailInput/EmailVerification
│           │   └── KYC (Know Your Customer)
│           │
│           └── Main App (Authenticated)
│               ├── TabNavigator (Bottom tabs with animated custom tab bar)
│               │   ├── Home
│               │   ├── Transactions
│               │   ├── Reports
│               │   ├── IslamicCorner
│               │   └── Support
│               │
│               ├── Profile & Settings
│               ├── Cards Flow (Multiple card types: Shams, Noor, Qamar)
│               ├── SendMoney & M-PESA
│               ├── Shop & Checkout
│               └── Round-Ups (Investment & Charity)
```

#### Conditional Rendering Flow
The app determines initial route based on authentication state:
- `isCheckingAuth=true` → Shows SplashScreen
- `isUserLoggedIn=false` → Auth flow starting from Intro
- `isUserLoggedIn=true` → Main app with TabNavigator
- `isInSignupFlow=true` → Continues incomplete signup/KYC process

### Authentication & User Management

**Implementation**: Supabase-based authentication with custom hooks and secure storage

**Key Files**:
- `hooks/useAuth.tsx` - Auth context provider and hook with full CRUD operations
- `supabaseConfig.ts` - Supabase client initialization
- `services/smsService.ts` - SMS OTP service for phone verification
- `services/biometricService.ts` - Biometric authentication (Face ID/Touch ID/Fingerprint)

**Auth Flow**:
1. User signs up with email/password → Creates auth.users and public.users records
2. Phone verification via SMS OTP (Kenya-compatible formatting)
3. KYC process captures user profile data
4. Optional biometric authentication setup
5. Session tokens stored in Expo SecureStore

**Important Notes**:
- Always use `useAuth()` hook, never access Supabase directly in screens
- User profile data is separate from auth data (stored in public.users table)
- Row Level Security (RLS) policies enforce data access control
- Biometric auth requires physical device testing
- SMS service configured for Kenya phone numbers (+254 format)

### Database Schema

**Supabase Tables**:
- `public.users` - Extended user profiles with KYC data
- `public.otp_verifications` - Phone verification OTPs
- `public.roundup_settings` - Round-ups configuration per user
- (See `SUPABASE_MIGRATION.md` for complete schema and setup)

**Key Fields**:
- Users: KYC status, phone verification, biometric preferences, financial profile
- Round-ups: Investment allocations, charity preferences, thresholds

### Styling System

**Centralized Theme**: `constants/theme.ts` provides:
- `COLORS` - Brand colors including Mizan gradient
- `SIZES` - Responsive size values (using normalize helper)
- `FONTS` - Poppins font family with weight variants (400, 500, 600, 700, 900)

**Responsive Utilities**: `utils/index.ts` and `utils/responsive.ts`
- `normalize(size)` - Scale sizes across devices
- `getResponsiveWidth(percentage)` - Percentage of screen width
- `getResponsiveHeight(percentage)` - Percentage of screen height  
- `getResponsivePadding(base)` - Device-appropriate padding
- `isTablet()`, `isSmallPhone()`, `getDeviceType()` - Device detection

**Styling Approach**:
- Use NativeWind (Tailwind) for utility classes
- Use StyleSheet with COLORS, FONTS, SIZES for custom styles
- Always use responsive utilities instead of hardcoded pixel values
- See `docs/RESPONSIVE_STYLING_GUIDE.md` for detailed patterns

**Font Loading**:
- Poppins font loaded via expo-font in App.tsx
- Font families managed through FONT_FAMILY constants
- Use `FONTS.weight()`, `FONTS.medium()`, `FONTS.semibold()`, `FONTS.bold()` helpers

### Component Organization

**Directory Structure**:
```
components/
├── cards/          # Card-specific components
├── charts/         # Chart components (Victory Native)
├── home/           # Home screen widgets
├── mpesa/          # M-PESA payment components
├── onboarding/     # Onboarding flow components
├── roundups/       # Round-ups feature components
└── shared/         # Reusable components
```

**Screens**: Located in `screens/` with feature-based subdirectories (`screens/cards/`)

**Patterns**:
- Functional components with hooks (no class components)
- Custom hooks for shared logic (`hooks/`)
- Context providers for feature-specific state (`contexts/`)
- Services layer for API interactions (`services/`)

### State Management

**Global State**: React Context API
- `AuthProvider` (hooks/useAuth.tsx) - User authentication and profile
- `RoundUpsProvider` (contexts/RoundUpsContext.tsx) - Round-ups feature state

**Local State**: useState, useReducer within components

**Data Fetching**: 
- Supabase queries via hooks
- No Redux or external state management libraries

### Card Management System

**Card Types** (Each with dedicated flow):
1. **Shams Card** - Metal premium card (screens/cards/shams/)
2. **Noor Card** - Standard virtual card (screens/cards/noor/)
3. **Qamar Card** - Alternative card type (screens/cards/qamar/)

**Card Creation Flow** (Typical path):
1. Intro screen explaining card benefits
2. Card Studio for customization
3. Address collection (for physical cards)
4. Review screen
5. Minting/activation screen
6. Fund card screen

**Key Implementation Files**:
- `navigation/CardNavigator.tsx` - Card flow navigation
- `navigation/CardNavigationTypes.ts` - Type definitions
- Each card type has 4-6 dedicated screens

### Round-Ups Feature

**Purpose**: Automatically round up transactions and allocate to investments or charity

**Implementation**:
- `contexts/RoundUpsContext.tsx` - State management
- `screens/RoundUpsScreen.tsx` - Main dashboard
- `screens/RoundUpsSettingsScreen.tsx` - Configuration
- `screens/InvestmentPortfolioScreen.tsx` - Portfolio view
- `services/api/RoundUpsApiService.ts` - API integration

**Settings Stored** (per user in database):
- Round-up method (nearest dollar or custom amount)
- Destination (investment or charity)
- Monthly limits and thresholds
- Investment/charity allocation percentages

**API Integration**: See `docs/EXPO_API_INTEGRATIONS.md` for:
- Plaid integration for transaction data
- Stripe for payment processing
- Alpaca/DriveWealth for investments
- Charity API integrations

### Custom Tab Bar

**Location**: `navigation/TabNavigator.tsx`

**Features**:
- Animated notch that follows active tab
- Gradient circle highlighting active icon
- Custom SVG path for curved design
- React Native Reanimated for smooth animations

**Customization**:
- Modify `getPath()` for different notch shapes
- Update `CIRCLE_SIZE`, `NOTCH_WIDTH`, `NOTCH_HEIGHT` constants
- Change gradient colors in LinearGradient component

## Environment Variables

Required in `.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_AFRICAS_TALKING_API_KEY=your-api-key
EXPO_PUBLIC_AFRICAS_TALKING_USERNAME=your-username
```

**Important**: 
- Use HTTPS API URL for Supabase (not PostgreSQL connection string)
- Anon key is safe for client-side use (RLS protects data)
- Test SMS service in development mode before production

## Troubleshooting

### Common Issues

**1. Supabase Connection Errors**
- Verify `.env` file has correct HTTPS URL format
- Check Supabase project is not paused
- Run connection test: `testSupabaseConnection()` from utils/testSupabase.ts

**2. Authentication Not Persisting**
- Clear cache: `npx expo start --clear`
- Check SecureStore permissions
- Verify session storage in AsyncStorage

**3. Font Loading Issues**
- Ensure all Poppins variants are in dependencies
- Check font loading in App.tsx useEffect
- Wait for `appIsReady` before hiding splash screen

**4. Build Errors**
- Run `npm run prebuild` before native builds
- Check for missing native dependencies
- Apply patches: `npx patch-package`

**5. Wheel Picker Issues**
- Automatically fixed by `fix-wheel-picker.js` script
- Runs before prebuild to patch wheel picker module
- Check `patches/` directory for patch files

### Debug Tools

**Supabase Connection Test**:
```typescript
import { testSupabaseConnection, testSupabaseAuth } from './utils/testSupabase';
testSupabaseConnection(); // Test API connectivity
testSupabaseAuth(); // Test auth state
```

**Auth State Debugging**:
```typescript
const { user, userProfile, loading, error } = useAuth();
console.log('Auth Debug:', { user: !!user, userId: user?.id, loading, error });
```

**Complete Reference**: See `TROUBLESHOOTING.md` for detailed debugging steps

## Testing Strategy

### Device Testing
- **iOS**: iPhone SE (small), iPhone 12/13 (medium), iPhone 14 Pro Max (large), iPad (tablet)
- **Android**: Various screen sizes, test on physical devices for biometrics
- **Web**: Chrome, Safari, Firefox (limited functionality)

### Feature Testing Priorities
1. Authentication flow (signup → OTP → KYC)
2. Biometric authentication (physical device required)
3. Card creation flows (all three card types)
4. Round-ups calculations and allocations
5. M-PESA integration
6. Responsive layouts across devices

### Expo Go Limitations
- Biometric auth requires development build
- Some native modules not available
- Build dev client for full feature testing: `npx expo run:ios` or `npx expo run:android`

## Code Patterns & Conventions

### Navigation
```typescript
// Type-safe navigation using RootStackParamList
navigation.navigate('ScreenName', { param: value });

// Access params in screen
const { param } = route.params;
```

### Styling
```typescript
// Use responsive utilities
const styles = StyleSheet.create({
  container: {
    padding: getResponsivePadding(20),
    width: getResponsiveWidth(90),
  },
  text: {
    ...FONTS.semibold(16),
    color: COLORS.text,
  },
});
```

### Authentication
```typescript
// Always use useAuth hook
const { user, signIn, signOut, updateProfile } = useAuth();

// Check auth state
if (!user) return <AuthScreen />;
```

### API Calls
```typescript
// Use Supabase client from supabaseConfig
import { supabase } from '../supabaseConfig';

const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id);
```

### Form Validation
```typescript
// Use validation utilities
import { validateEmail, validatePhone } from '../utils/validation';

if (!validateEmail(email)) {
  // Show error
}
```

## Migration & Setup Notes

**From Firebase to Supabase**: The app was migrated from Firebase to Supabase. See `SUPABASE_MIGRATION.md` for:
- Complete database schema
- Migration steps
- Feature comparisons
- Setup instructions

**Google OAuth**: Google authentication is configured. See:
- `GOOGLE_AUTH_SETUP_COMPLETE.md`
- `GOOGLE_OAUTH_ERROR_FIX.md`
- `GOOGLE_OAUTH_NO_POPUP_DEBUG.md`

## Key Documentation Files

- `docs/RESPONSIVE_STYLING_GUIDE.md` - Comprehensive responsive design patterns
- `docs/EXPO_API_INTEGRATIONS.md` - API integration guides for financial services
- `docs/SHAMS_IMPLEMENTATION.md` - Shams card implementation details
- `docs/QAMAR_IMPLEMENTATION.md` - Qamar card implementation details
- `SUPABASE_MIGRATION.md` - Database schema and auth setup
- `TROUBLESHOOTING.md` - Detailed debugging guide
- `MIGRATION_COMPLETE.md` - Migration completion notes

## Important Constraints

### Expo Managed Workflow
- **Stay within Expo's managed workflow** - avoid ejecting
- Use Expo-compatible libraries only
- Native modules require custom development builds
- Prefer web APIs over native SDKs when possible

### API Integrations
- **Never store API keys in client code** - use backend proxy
- All financial APIs should go through Supabase Edge Functions or backend
- Use secure storage (SecureStore) for tokens
- Implement proper error handling for all API calls

### Performance
- Keep bundle size small - use dynamic imports for large screens
- Optimize images (use appropriate resolutions)
- Minimize re-renders with proper memoization
- Use FlatList for long lists, not ScrollView with map

### Security
- All database access protected by Row Level Security (RLS)
- User data encrypted in SecureStore
- Session tokens auto-refreshed by Supabase
- Biometric auth available but optional

## Build Configuration

**App Identifier**: `com.wingi.mizanbankingapp`

**EAS Build**: Configured in `eas.json`
- Project ID: `2840f4e8-0d73-4221-a407-eceb34e28db3`

**Platform-Specific**:
- **iOS**: Bundle ID `com.wingi.mizanbankingapp`, supports tablets
- **Android**: Package `com.wingi.mizanbankingapp`, deep linking configured

**Deep Links**: 
- Scheme: `com.wingi.mizanbankingapp://`
- Supabase auth redirect: `https://zibhzfmeyifbrduiesoh.supabase.co`

## Patches & Workarounds

**Patch-Package**: Applied patches in `patches/` directory
- `react-native-wheel-picker` - Fixed compatibility issues
- Patches auto-applied after npm install

**Fix Scripts**:
- `fix-wheel-picker.js` - Runs before prebuild to patch wheel picker module

## Development Workflow

### Making Changes
1. Create feature branch from main
2. Make changes following existing patterns
3. Test on iOS and Android (Expo Go or dev build)
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Commit with descriptive messages

### Adding New Screens
1. Create screen in `screens/` or appropriate subdirectory
2. Add screen to navigation in `App.tsx`
3. Add type to `navigation/types.ts` (RootStackParamList)
4. Follow existing screen structure and styling patterns

### Adding New Features
1. Consider if feature needs context provider
2. Create service layer for API interactions
3. Add types in `types/` directory
4. Update documentation in `docs/` if complex
5. Test across device sizes using responsive utilities

### Database Changes
1. Update schema in Supabase dashboard
2. Update types in `types/supabase.ts`
3. Add/update RLS policies
4. Test queries with proper auth context
5. Document changes in SUPABASE_MIGRATION.md

---

**Last Updated**: Generated from codebase analysis on 2025-10-01
