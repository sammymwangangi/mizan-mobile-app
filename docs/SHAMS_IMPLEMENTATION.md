# Shams Metal Card Flow Implementation

## Overview
This document outlines the implementation of the Shams metal card ordering experience based on the developer handoff notes. The implementation includes a premium metal card journey with enhanced UI components, animations, and platform-specific integrations.

## Implementation Summary

### 1. Core Constants & Configuration
**File**: `constants/shams.ts`
- Metal swatches (Titanium, Bronze, Nebula, Rose Gold)
- CTA gradient configuration
- Fund amounts ($10, $20, $50)
- Payment methods (Card, Mobile Money, PayPal)
- Analytics event constants
- Wallet integration functions

### 2. New Shams Flow Screens

#### ShamsIntroScreen (`screens/cards/shams/ShamsIntroScreen.tsx`)
- Hero card with subtle scale animation (1→1.03 every 5s)
- Features list with gold accent bullets
- Rose-gold gradient CTA button
- Dark theme (#1A1B23 background)

#### ShamsStudioScreen (`screens/cards/shams/ShamsStudioScreen.tsx`)
- Metal carousel with WebGL/Skia for iOS, PNG fallback for Android
- Metal swatch selection with tap animations (1→1.15→1 in 100ms)
- Gold wait-list upgrade banner
- Progress indicators (step 1/3)

#### ShamsAddressScreen (`screens/cards/shams/ShamsAddressScreen.tsx`)
- Google Places integration placeholder
- Manual address form with validation
- Progress bar at 66% completion
- Required field validation

#### ShamsReviewScreen (`screens/cards/shams/ShamsReviewScreen.tsx`)
- Settings toggles (Smart Spending, Fraud Protection, AI Pro)
- Terms & Conditions checkbox with shake animation
- Disabled CTA with red border shake + haptic feedback
- Progress completion (step 3/3)

### 3. Enhanced Components

#### MintingProgressSheet (`components/cards/shams/MintingProgressSheet.tsx`)
- 60% height modal with progress ring SVG
- Haptic feedback every 20% progress
- 5-step progress indicators
- 8-second total duration

#### ConfettiSuccess (`components/cards/shams/ConfettiSuccess.tsx`)
- 50 confetti pieces in gold colors (#D4AF37 + #F8E7A0)
- Animated checkmark with spring animation
- Success haptic feedback
- Auto-complete after 1 second

### 4. Updated Existing Screens

#### CardMintingScreen (`screens/cards/CardMintingScreen.tsx`)
- Integrated Shams-specific minting flow
- Bottom sheets for cancel, error, and success states
- Progress tracking with haptic feedback
- Confetti animation on completion

#### FundCardScreen (`screens/cards/FundCardScreen.tsx`)
- Updated to Shams specifications
- New fund amounts ($10, $20, $50)
- Rose-gold gradient CTA button
- Dark theme styling
- Enhanced payment method selection

#### WalletAddScreen (`screens/cards/WalletAddScreen.tsx`)
- Platform-specific wallet integration
- Apple Wallet: `passkit://card/add/{id}`
- Google Wallet: Intent URL integration
- Success modal with checkmark animation
- Haptic feedback integration

### 5. Navigation Updates
**File**: `navigation/types.ts`
- Added Shams-specific route types
- Updated CardMinting params for Shams flow
- Address and settings type definitions

## Key Features Implemented

### ✅ Completed Features
1. **Metal Swatches & Gradients**: Rose-gold gradient applied to CTA buttons
2. **Progress Indicators**: 3-step progress with visual feedback
3. **Haptic Feedback**: Selection, success, and error haptics
4. **Platform Integration**: Apple/Google Wallet deep-links
5. **Animations**: Card scaling, swatch taps, confetti, progress rings
6. **Dark Theme**: Consistent #1A1B23 background across Shams screens
7. **Form Validation**: Address form with real-time validation
8. **Bottom Sheets**: Cancel, error, minting progress, and success states

### 🔄 Partially Implemented
1. **WebGL/Skia Integration**: Placeholder for iOS metal card rendering
2. **Google Places API**: Interface ready, needs API key integration
3. **Analytics Tracking**: PostHog event calls commented out, ready for integration

### 📋 Next Steps
1. **Asset Integration**: Add actual Shams metal card images
2. **API Integration**: Connect Google Places and wallet APIs
3. **Testing**: Implement Detox test cases as specified
4. **Analytics**: Enable PostHog event tracking
5. **Accessibility**: Complete VoiceOver announcements and contrast validation

## Route Flow
```
/cards/claim → /cards/plans → /cards/shams/intro → 
/cards/shams/studio → /cards/shams/address → 
/cards/shams/review → CardMinting (with sheets) → 
/cards/fund → /wallet/add
```

## Technical Stack Used
- **UI**: Tailwind-RN (twrnc) + React-Native-Paper MD3
- **Navigation**: React-Navigation v6 (native-stack)
- **Motion**: Reanimated v3 / Expo-Haptics
- **State**: React hooks (XState machine placeholder)
- **Wallet**: Platform-specific deep-links

## File Structure
```
constants/
  └── shams.ts                    # Metal swatches, gradients, constants

screens/cards/shams/
  ├── ShamsIntroScreen.tsx        # Journey introduction
  ├── ShamsStudioScreen.tsx       # Metal selection
  ├── ShamsAddressScreen.tsx      # Delivery address
  └── ShamsReviewScreen.tsx       # Final review & order

components/cards/shams/
  ├── MintingProgressSheet.tsx    # Progress modal
  └── ConfettiSuccess.tsx         # Success animation

screens/cards/
  ├── CardMintingScreen.tsx       # Updated for Shams
  ├── FundCardScreen.tsx          # Updated styling
  └── WalletAddScreen.tsx         # Platform integration
```

## Design Compliance
- **Colors**: Exact metal swatches and rose-gold gradient as specified
- **Typography**: Consistent with existing app theme
- **Spacing**: 44×44pt touch targets for accessibility
- **Animations**: Subtle and purposeful (scale, shake, confetti)
- **Haptics**: Strategic feedback at key interaction points

This implementation provides a solid foundation for the Shams metal card experience while maintaining compatibility with the existing codebase structure.
