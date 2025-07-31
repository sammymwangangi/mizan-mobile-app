import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type SendMoneySuccessRouteProp = RouteProp<RootStackParamList, 'SendMoneySuccess'>;
type SendMoneySuccessNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SendMoneySuccess'>;

const SendMoneySuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SendMoneySuccessNavigationProp>();
  const route = useRoute<SendMoneySuccessRouteProp>();
  const { recipientName, amount, transactionId } = route.params;

  // Handle done button press
  const handleDone = () => {
    // Navigate back to home screen
    navigation.navigate('Home', {});
  };

  // Format date
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#A276FF', '#8336E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Check size={32} color={COLORS.textWhite} />
          </View>
        </View>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successAmount}>${amount}</Text>
        <Text style={styles.successDate}>{formatDate()}</Text>
      </LinearGradient>

      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.content}>
          {/* Transaction Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient</Text>
              <Text style={styles.detailValue}>{recipientName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>${amount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{transactionId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{formatDate()}</Text>
            </View>
          </View>

          {/* Share Receipt */}
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>SHARE RECEIPT</Text>
          </TouchableOpacity>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
          >
            <LinearGradient
              colors={['#A276FF', '#8336E6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.doneButtonGradient}
            >
              <Text style={styles.doneButtonText}>DONE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    ...FONTS.h2,
    color: COLORS.textWhite,
    marginBottom: 10,
  },
  successAmount: {
    ...FONTS.h1,
    color: COLORS.textWhite,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  successDate: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    paddingTop: 30,
  },
  detailsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  detailValue: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  shareButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginBottom: 15,
  },
  shareButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  doneButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default SendMoneySuccessScreen;
