import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define the route prop type
type DonationAmountRouteProp = RouteProp<RootStackParamList, 'DonationAmount'>;
// Define the navigation prop type
type DonationAmountNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DonationAmountScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DonationAmountNavigationProp>();
  const route = useRoute<DonationAmountRouteProp>();
  const { campaignId } = route.params;

  // States
  const [selectedAmount, setSelectedAmount] = useState<string | null>('1');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('roundups');
  const [showHadithModal, setShowHadithModal] = useState<boolean>(false);

  // Mock campaign data - in a real app, you would fetch this based on campaignId
  const campaign = {
    id: campaignId,
    title: 'Help feed the needy this Ramadhan',
    daysRemaining: 3,
    image: require('../assets/islamic-corner/allah-shade.png'),
  };

  // Predefined amounts
  const amounts = [
    { value: '1', label: '$1' },
    { value: '5', label: '$5' },
    { value: '10', label: '$10' },
    { value: 'custom', label: 'Enter Amount ($)' },
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: 'roundups',
      label: 'Via RoundUps Account',
      icon: require('../assets/islamic-corner/rounds-up-account.png')
    },
    {
      id: 'mobile',
      label: 'Via Mobile Money',
      icon: require('../assets/islamic-corner/mobile-money.png')
    },
    {
      id: 'debit',
      label: 'Via Direct Debit',
      icon: null,
      cardIcons: [
        require('../assets/islamic-corner/visa-mastercard.png')
      ]
    },
  ];

  // Handle amount selection
  const handleAmountSelect = (value: string) => {
    setSelectedAmount(value);
    if (value !== 'custom') {
      setCustomAmount('');
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (id: string) => {
    setSelectedPaymentMethod(id);
  };

  // Handle proceed to donate
  const handleProceedToDonate = () => {
    // Show hadith modal
    setShowHadithModal(true);
  };

  // Handle donate secretly
  const handleDonateSecretly = () => {
    setShowHadithModal(false);
    // Navigate to confirmation screen
    navigation.navigate('DonationConfirmation', {
      campaignId,
      amount: selectedAmount === 'custom' ? (customAmount || '0') : (selectedAmount || '0'),
      paymentMethod: selectedPaymentMethod
    });
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Get final amount
  const getFinalAmount = () => {
    if (selectedAmount === 'custom') {
      return customAmount ? `$${customAmount}` : '';
    }
    return `$${selectedAmount}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Islamic Corner</Text>
      </View>

      {/* Campaign Card */}
      <View style={styles.campaignCard}>
        <Image source={campaign.image} style={styles.campaignImage} />
        <View style={styles.campaignInfo}>
          <Text style={styles.campaignTitle}>{campaign.title}</Text>
          <View style={styles.campaignTimeContainer}>
            <Image
              source={require('../assets/islamic-corner/clock-icon.png')}
              style={styles.clockIcon}
            />
            <Text style={styles.campaignTimeText}>{campaign.daysRemaining} days to go</Text>
          </View>
        </View>
      </View>

      {/* Amount Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select amount</Text>
        <View style={styles.amountsContainer}>
          {amounts.map((amount) => (
            <TouchableOpacity
              key={amount.value}
              style={[
                styles.amountButton,
                selectedAmount === amount.value && styles.amountButtonSelected,
                amount.value === 'custom' && styles.customAmountButton
              ]}
              onPress={() => handleAmountSelect(amount.value)}
            >
              {amount.value === 'custom' ? (
                <TextInput
                  style={styles.customAmountInput}
                  placeholder={amount.label}
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  onFocus={() => handleAmountSelect('custom')}
                />
              ) : (
                <Text
                  style={[
                    styles.amountButtonText,
                    selectedAmount === amount.value && styles.amountButtonTextSelected
                  ]}
                >
                  {amount.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Method Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select payment</Text>
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === method.id && styles.paymentMethodButtonSelected
              ]}
              onPress={() => handlePaymentMethodSelect(method.id)}
            >
              <View style={styles.paymentMethodLeft}>
                <View
                  style={[
                    styles.radioButton,
                    selectedPaymentMethod === method.id && styles.radioButtonSelected
                  ]}
                >
                  {selectedPaymentMethod === method.id && (
                    <View style={styles.radioButtonInner}>
                      <Check size={12} color={COLORS.textWhite} />
                    </View>
                  )}
                </View>
                <Text style={styles.paymentMethodLabel}>{method.label}</Text>
              </View>

              <View style={styles.paymentMethodRight}>
                {method.cardIcons ? (
                  <View style={styles.cardIconsContainer}>
                    {method.cardIcons.map((icon, index) => (
                      <Image
                        key={index}
                        source={icon}
                        style={styles.cardIcon}
                      />
                    ))}
                  </View>
                ) : (
                  <Image source={method.icon} style={styles.paymentMethodIcon} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Donate Button */}
      <View style={[styles.donateButtonContainer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity
          style={[
            styles.donateButton,
            (!selectedAmount || (selectedAmount === 'custom' && !customAmount)) && styles.donateButtonDisabled
          ]}
          onPress={handleProceedToDonate}
          disabled={!selectedAmount || (selectedAmount === 'custom' && !customAmount)}
        >
          <LinearGradient
            colors={['#8336E6', '#A276FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.donateButtonGradient}
          >
            <Text style={styles.donateButtonText}>
              PROCEED TO DONATE {getFinalAmount()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Hadith Modal */}
      <Modal
        visible={showHadithModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.hadithIconContainer}>
              <Image
                source={require('../assets/islamic-corner/shade-icon.png')}
                style={styles.hadithIcon}
              />
              <Text style={styles.hadithIconText}>Shade of Allah</Text>
            </View>

            <Text style={styles.hadithNumber}>Hadith No: 504</Text>
            <Text style={styles.hadithNarrator}>Narrated/Authority of Abu Huraira</Text>

            <Text style={styles.hadithText}>
              The Prophet (p.b.u.h) said, "Seven people will be shaded by Allah under His shade on the day when there will be no shade except His. They are
            </Text>

            <TouchableOpacity
              style={styles.donateSecretlyButton}
              onPress={handleDonateSecretly}
            >
              <LinearGradient
                colors={['#8336E6', '#A276FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.donateButtonGradient}
              >
                <Text style={styles.donateButtonText}>DONATE SECRETLY</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  campaignCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  campaignImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  campaignInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  campaignTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 5,
  },
  campaignTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  campaignTimeText: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 15,
  },
  amountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: '48%',
    height: 60,
    backgroundColor: COLORS.card,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  amountButtonSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  customAmountButton: {
    width: '48%',
  },
  amountButtonText: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  amountButtonTextSelected: {
    color: COLORS.primary,
  },
  customAmountInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    ...FONTS.h3,
    color: COLORS.text,
  },
  paymentMethodsContainer: {
    marginBottom: 20,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  paymentMethodButtonSelected: {
    borderColor: COLORS.primary,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodLabel: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  paymentMethodRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 30,
    height: 30,
  },
  cardIconsContainer: {
    flexDirection: 'row',
  },
  cardIcon: {
    width: 30,
    height: 20,
    marginLeft: 5,
  },
  donateButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingTop: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  donateButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  donateButtonDisabled: {
    opacity: 0.5,
  },
  donateButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donateButtonText: {
    ...FONTS.h4,
    color: COLORS.textWhite,
    letterSpacing: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  hadithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  hadithIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: COLORS.primary,
  },
  hadithIconText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  hadithNumber: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  hadithNarrator: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  hadithText: {
    ...FONTS.body3,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'left',
  },
  donateSecretlyButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 10,
  },
});

export default DonationAmountScreen;
