import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

// Sample cart items
const cartItems = [
  {
    id: '1',
    name: 'Apple iPhone 13 Pro 128gb Blue',
    price: 199.45,
    image: require('../assets/shop/Product1.png'),
    description: 'At non risus, sagittis feugiat',
  },
  {
    id: '2',
    name: 'Macbook Pro 16" M1 Max space gray',
    price: 199.45,
    image: require('../assets/shop/Product2.png'),
    description: 'At non risus, sagittis feugiat',
  },
];

const CheckoutScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = 9.45;
  const total = subtotal + shipping;

  // Handle buy now button press
  const handleBuyNow = () => {
    if (termsAccepted) {
      navigation.navigate('Payment');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header with gradient background */}
      <LinearGradient
        colors={['#D155FF', '#8F00E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 16 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={COLORS.textWhite} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Checkout</Text>

          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Product price</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total price</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxContainer}>
            {termsAccepted ? (
              <LinearGradient
                colors={['#D155FF', '#8F00E0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.checkbox}
              >
                <Check size={16} color={COLORS.textWhite} />
              </LinearGradient>
            ) : (
              <View style={[styles.checkbox, styles.checkboxUnchecked]} />
            )}
          </View>
          <Text style={styles.termsText}>
            I agree with <Text style={styles.termsHighlight}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Buy Now Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="BUY NOW PAY LATER"
          onPress={handleBuyNow}
          disabled={!termsAccepted}
          gradient={true}
          gradientColors={['#D155FF', '#8F00E0']}
          style={styles.buyButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: COLORS.textWhite,
    fontWeight: '600',
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 30,
  },
  cartItemsContainer: {
    marginTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  itemPrice: {
    ...FONTS.h4,
    color: '#D155FF',
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  summaryValue: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: '600',
  },
  totalValue: {
    ...FONTS.h3,
    color: '#D155FF',
    fontWeight: '700',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    borderWidth: 2,
    borderColor: '#D155FF',
    backgroundColor: 'transparent',
  },
  termsText: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  termsHighlight: {
    fontWeight: '700',
    color: '#D155FF',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  buyButton: {
    width: '100%',
    borderRadius: 25,
  },
});

export default CheckoutScreen;
