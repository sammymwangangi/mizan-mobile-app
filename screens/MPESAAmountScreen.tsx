import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type MPESAAmountRouteProp = RouteProp<RootStackParamList, 'MPESAAmount'>;
type MPESAAmountNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MPESAAmount'>;

const MPESAAmountScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MPESAAmountNavigationProp>();
  const route = useRoute<MPESAAmountRouteProp>();
  const { recipientId, recipientName, recipientPhone } = route.params || {};

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState('USD');
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

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError('Please enter a valid amount');
      isValid = false;
    } else {
      setAmountError('');
    }

    return isValid;
  };

  // Handle send button press
  const handleSend = () => {
    if (validateForm()) {
      navigation.navigate('MPESAConfirmation', {
        recipientId,
        recipientName,
        recipientPhone,
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
          <Text style={styles.headerTitle}>Enter Amount</Text>
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
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <Text style={styles.feeText}>No fees</Text>
            </View>
            {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}

            <Text style={styles.amountHint}>Enter the amount you want to send</Text>
          </View>

          {/* Note Input */}
          <TouchableOpacity style={styles.noteContainer}>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add note"
              placeholderTextColor={COLORS.placeholder}
              multiline
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </TouchableOpacity>


            {/* Keyboard Send Button - Only show when keyboard is visible */}
            {keyboardVisible && (
              <View style={styles.keyboardButtonContainer}>
                <TouchableOpacity
                  style={styles.keyboardSendButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    if (validateForm()) {
                      handleSend();
                    }
                  }}
                >
                  <Text style={styles.keyboardSendButtonText}>SEND</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Send Button - Only show when keyboard is not visible */}
          {!keyboardVisible && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
              >
                <LinearGradient
                  colors={['#A276FF', '#8336E6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendButtonGradient}
                >
                  <Text style={styles.sendButtonText}>SEND</Text>
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
    paddingBottom: 20,
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
    marginBottom: 10,
  },
  currencyText: {
    ...FONTS.body3,
    color: COLORS.text,
    marginRight: 5,
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
  errorText: {
    ...FONTS.body5,
    color: COLORS.error,
    marginTop: 5,
  },
  amountHint: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: 10,
    textAlign: 'center',
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

  buttonContainer: {
    padding: SIZES.padding,
  },
  sendButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    fontWeight: '600',
    letterSpacing: 1,
  },
  keyboardButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  keyboardSendButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  keyboardSendButtonText: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
});

export default MPESAAmountScreen;
