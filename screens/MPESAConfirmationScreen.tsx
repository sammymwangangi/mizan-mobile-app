import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type MPESAConfirmationRouteProp = RouteProp<RootStackParamList, 'MPESAConfirmation'>;
type MPESAConfirmationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MPESAConfirmation'>;

const MPESAConfirmationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MPESAConfirmationNavigationProp>();
  const route = useRoute<MPESAConfirmationRouteProp>();
  const { recipientId, recipientName, recipientPhone, amount } = route.params;

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle continue button press
  const handleContinue = () => {
    // In a real app, you would process the payment here
    // For now, just navigate to the success screen
    navigation.navigate('MPESASuccess', {
      recipientName,
      amount,
      transactionId: `MP${Math.floor(Math.random() * 1000000)}`,
    });
  };

  // Handle go back button press
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Currency and Amount Section */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencyText}>USD</Text>
            <Text style={styles.balanceText}>Balance $180.50</Text>
            <View style={styles.amountDisplay}>
              <Text style={styles.amountText}>${amount}</Text>
              <Text style={styles.feeText}>No fees</Text>
            </View>
          </View>

          {/* Trust Verification */}
          <View style={styles.trustContainer}>
            <Text style={styles.trustTitle}>
              Do you know and trust the payee
            </Text>
            <Text style={styles.trustText}>
              Dui, in sapien tempus dictum ultricies scelerisqueplatea non.Dui, in sapien tempus dictum ultricies scelerisque molestie ul, in sapictum ultricies scelerisque molestie platea non.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <LinearGradient
                colors={['#A276FF', '#8336E6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>CONTINUE</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.goBackButton}
              onPress={handleGoBack}
            >
              <Text style={styles.goBackButtonText}>NO, GO BACK</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 30,
    alignItems: 'center',
  },
  amountContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    width: '100%',
  },
  currencyText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  balanceText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    position: 'absolute',
    top: 15,
    right: 15,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  amountText: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  feeText: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  trustContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  trustTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  trustText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 20,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 15,
  },
  continueButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    fontWeight: '600',
    letterSpacing: 1,
  },
  goBackButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  goBackButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default MPESAConfirmationScreen;
