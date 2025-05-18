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

type MPESASuccessRouteProp = RouteProp<RootStackParamList, 'MPESASuccess'>;
type MPESASuccessNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MPESASuccess'>;

const MPESASuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MPESASuccessNavigationProp>();
  const route = useRoute<MPESASuccessRouteProp>();
  const { recipientName, amount, transactionId } = route.params;

  // Handle done button press
  const handleDone = () => {
    // Navigate back to home screen
    navigation.navigate('Home');
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
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              <Check size={40} color={COLORS.textWhite} />
            </View>
          </View>

          {/* Success Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successMessage}>
              You have successfully sent money to {recipientName || 'the recipient'}
            </Text>
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>${amount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{transactionId}</Text>
            </View>
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>DONE</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  successIconContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successTitle: {
    ...FONTS.h1,
    color: COLORS.textWhite,
    marginBottom: 10,
  },
  successMessage: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    opacity: 0.7,
  },
  detailValue: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  doneButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default MPESASuccessScreen;
