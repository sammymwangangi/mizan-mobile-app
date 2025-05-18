import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';

type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;

// Sample payment cards
const paymentCards = [
  {
    id: '1',
    cardNumber: '4735 4900 0134 5545',
    validThru: '12/2026',
    cardholderName: 'ROBIN HABIBI',
    type: 'mastercard',
    color: ['#D155FF', '#8F00E0'],
  },
  {
    id: '2',
    cardNumber: '5412 7534 9821 3456',
    validThru: '09/2025',
    cardholderName: 'ROBIN HABIBI',
    type: 'visa',
    color: ['#000000', '#434343'],
  },
  {
    id: '3',
    cardNumber: '3782 8224 6310 0055',
    validThru: '03/2024',
    cardholderName: 'ROBIN HABIBI',
    type: 'mastercard',
    color: ['#4A6FDC', '#2E4DA7'],
  },
];

// Selected product (iPhone only)
const selectedProduct = {
  id: '1',
  name: 'Apple iPhone 13 Pro 128gb Blue',
  price: 199.45,
  image: require('../assets/shop/Product1.png'),
  description: 'At non risus, sagittis feugiat',
};

const PaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);

  // Calculate totals
  const subtotal = selectedProduct.price;
  const shipping = 9.45;
  const total = subtotal + shipping;

  // Handle payment button press
  const handlePayLater = () => {
    // In a real app, this would process the payment
    // For now, just navigate back to home
    navigation.navigate('Home');
  };

  // Render payment card
  const renderCard = ({ item, index }: { item: typeof paymentCards[0]; index: number }) => {
    return (
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={item.color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardBrand}>mizan</Text>

            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumber}>{item.cardNumber}</Text>
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>VALID THRU</Text>
                <Text style={styles.cardValue}>{item.validThru}</Text>
              </View>

              <View>
                <Text style={styles.cardLabel}>CARDHOLDER</Text>
                <Text style={styles.cardValue}>{item.cardholderName}</Text>
              </View>

              <Image
                source={require('../assets/shop/mastercard.png')}
                style={styles.cardTypeIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // Handle card change
  const handleCardChange = (index: number) => {
    setActiveCardIndex(index);
  };

  // Navigate to next/previous card
  const navigateCard = (direction: 'next' | 'prev') => {
    if (!carouselRef.current) return;

    const newIndex = direction === 'next'
      ? Math.min(activeCardIndex + 1, paymentCards.length - 1)
      : Math.max(activeCardIndex - 1, 0);

    carouselRef.current.scrollToIndex({
      index: newIndex,
      animated: true,
    });

    setActiveCardIndex(newIndex);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#D155FF" />

      {/* Header with gradient background */}
      <LinearGradient
        colors={['#D155FF', '#8F00E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.textWhite} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment</Text>

        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Product */}
        <View style={styles.productContainer}>
          <Image source={selectedProduct.image} style={styles.productImage} resizeMode="cover" />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{selectedProduct.name}</Text>
            <Text style={styles.productDescription}>{selectedProduct.description}</Text>
          </View>
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

        {/* Payment Method Selection */}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethodTitle}>Swipe to select payment card</Text>

          <View style={styles.carouselContainer}>
            {/* Left Arrow */}
            {activeCardIndex > 0 && (
              <TouchableOpacity
                style={[styles.carouselArrow, styles.leftArrow]}
                onPress={() => navigateCard('prev')}
              >
                <ChevronLeft size={24} color={COLORS.primary} />
              </TouchableOpacity>
            )}

            {/* Card Carousel */}
            <FlatList
              ref={carouselRef}
              data={paymentCards}
              renderItem={renderCard}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 20}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (CARD_WIDTH + 20)
                );
                handleCardChange(index);
              }}
            />

            {/* Right Arrow */}
            {activeCardIndex < paymentCards.length - 1 && (
              <TouchableOpacity
                style={[styles.carouselArrow, styles.rightArrow]}
                onPress={() => navigateCard('next')}
              >
                <ChevronRight size={24} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Card Indicators */}
          <View style={styles.indicatorContainer}>
            {paymentCards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === activeCardIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Pay Later Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="PAY LATER"
          onPress={handlePayLater}
          gradient={true}
          gradientColors={['#D155FF', '#8F00E0']}
          style={styles.payButton}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
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
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  productDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
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
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethodTitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  carouselContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBrand: {
    ...FONTS.h4,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  cardNumberContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  cardNumber: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.7,
    marginBottom: 4,
  },
  cardValue: {
    ...FONTS.body4,
    color: COLORS.textWhite,
  },
  cardTypeIcon: {
    width: 40,
    height: 30,
  },
  carouselArrow: {
    position: 'absolute',
    zIndex: 10,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 0,
  },
  rightArrow: {
    right: 0,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#D155FF',
    width: 16,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  payButton: {
    width: '100%',
    borderRadius: 25,
  },
});

export default PaymentScreen;
