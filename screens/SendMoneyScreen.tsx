import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, ChevronDown, User, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type SendMoneyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SendMoney'>;

const SendMoneyScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SendMoneyNavigationProp>();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [recipientError, setRecipientError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle currency selection
  const handleCurrencySelect = () => {
    // In a real app, show a currency picker
    console.log('Currency selection pressed');
  };

  // Clear recipient input
  const handleClearRecipient = () => {
    setRecipient('');
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;

    if (!recipient.trim()) {
      setRecipientError('Please enter a recipient');
      isValid = false;
    } else {
      setRecipientError('');
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError('Please enter a valid amount');
      isValid = false;
    } else {
      setAmountError('');
    }

    return isValid;
  };

  // Handle continue button press
  const handleContinue = () => {
    if (validateForm()) {
      // Navigate to confirmation screen
      navigation.navigate('SendMoneyConfirmation', {
        recipientName: recipient,
        amount,
      });
    }
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
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={{ width: 24 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Recipient Input */}
            <View style={styles.recipientContainer}>
              <Text style={styles.sectionTitle}>Who to pay</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.recipientInputContainer}>
                  <User size={20} color={COLORS.textLight} style={styles.recipientIcon} />
                  <TextInput
                    style={styles.recipientInput}
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder="Enter name, phone, or email"
                    placeholderTextColor={COLORS.placeholder}
                    autoCapitalize="none"
                  />
                  {recipient.length > 0 && (
                    <TouchableOpacity onPress={handleClearRecipient}>
                      <X size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                  )}
                </View>
                {recipientError ? <Text style={styles.errorText}>{recipientError}</Text> : null}
              </View>
            </View>

            {/* Currency and Amount Section */}
            <View style={styles.amountContainer}>
              {/* Currency Selector */}
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={handleCurrencySelect}
              >
                <Text style={styles.currencyText}>{currency}</Text>
                <ChevronDown size={16} color={COLORS.text} />
                <Text style={styles.balanceText}>Balance $180.50</Text>
              </TouchableOpacity>

              {/* Amount Display */}
              <View style={styles.amountDisplay}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={COLORS.placeholder}
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Text style={styles.feeText}>No fees</Text>
              </View>
              {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}
            </View>

            {/* Note Input */}
            <View style={styles.noteContainer}>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add note (optional)"
                placeholderTextColor={COLORS.placeholder}
                multiline
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* Transfer Methods */}
            <View style={styles.transferMethodsContainer}>
              <Text style={styles.sectionTitle}>Transfer Methods</Text>

              <TouchableOpacity style={styles.methodCard}>
                <Image
                  source={require('../assets/home/icons/cards.png')}
                  style={styles.methodIcon}
                  resizeMode="contain"
                />
                <View style={styles.methodTextContainer}>
                  <Text style={styles.methodTitle}>Bank Transfer</Text>
                  <Text style={styles.methodDescription}>Transfer to any bank account</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.methodCard}>
                <Image
                  source={require('../assets/home/icons/m-pesa.png')}
                  style={styles.methodIcon}
                  resizeMode="contain"
                />
                <View style={styles.methodTextContainer}>
                  <Text style={styles.methodTitle}>Mobile Money</Text>
                  <Text style={styles.methodDescription}>Send to mobile money accounts</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Keyboard Continue Button - Only show when keyboard is visible */}
            {keyboardVisible && (
              <View style={styles.keyboardButtonContainer}>
                <TouchableOpacity
                  style={styles.keyboardContinueButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    if (validateForm()) {
                      handleContinue();
                    }
                  }}
                >
                  <Text style={styles.keyboardContinueButtonText}>CONTINUE</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Continue Button - Only show when keyboard is not visible */}
          {!keyboardVisible && (
            <View style={styles.buttonContainer}>
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
            </View>
          )}
        </KeyboardAvoidingView>
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
  },
  recipientContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 15,
  },
  inputWrapper: {
    marginBottom: 10,
  },
  recipientInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recipientIcon: {
    marginRight: 10,
  },
  recipientInput: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.text,
  },
  errorText: {
    ...FONTS.body5,
    color: COLORS.error,
    marginTop: 5,
  },
  amountContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  balanceText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginLeft: 'auto',
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dollarSign: {
    ...FONTS.h2,
    color: COLORS.text,
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    ...FONTS.h1,
    color: COLORS.text,
    padding: 0,
  },
  feeText: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  noteContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  noteInput: {
    ...FONTS.body3,
    color: COLORS.text,
    padding: 0,
    minHeight: 40,
  },
  transferMethodsContainer: {
    marginBottom: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitle: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  methodDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  buttonContainer: {
    padding: SIZES.padding,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
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
  keyboardButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  keyboardContinueButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  keyboardContinueButtonText: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
});

export default SendMoneyScreen;
