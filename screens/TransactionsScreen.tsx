import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, ChevronRight, CreditCard, Clock, ShoppingBag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils';

// Import components
import PaymentCard from '../components/PaymentCard';
import TransactionItem from '../components/TransactionItem';
import ReminderItem from '../components/ReminderItem';
import OfferCard from '../components/OfferCard';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Main component
const TransactionsScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const flatListRef = useRef(null);

  // Sample data for cards
  const cards = [
    { id: '1', number: '**** **** **** 4012', validity: '10/2026', brand: 'Mastercard' },
    { id: '2', number: '**** **** **** 7890', validity: '05/2025', brand: 'Visa' },
    { id: '3', number: '**** **** **** 1234', validity: '12/2024', brand: 'Mastercard' },
  ];

  // Sample data for transactions
  const transactions = [
    {
      id: '1',
      title: 'Cab to home',
      subtitle: 'UBER',
      amount: 8.48,
      time: '6:41 pm',
      icon: <ShoppingBag size={20} color={COLORS.primary} />
    },
    {
      id: '2',
      title: 'Lunch',
      subtitle: 'Arkam Ahmed',
      amount: 18.00,
      time: '6:41 pm',
      icon: <ShoppingBag size={20} color={COLORS.primary} />
    },
  ];

  // Sample data for reminders
  const reminders = [
    {
      id: '1',
      title: 'Pay your electricity bill',
      amount: '$55.00',
      dueDate: '21st Mar 2022',
      icon: <Clock size={20} color={COLORS.primary} />
    },
    {
      id: '2',
      title: 'Pay your electricity bill',
      amount: '$55.00',
      dueDate: '21st Mar 2022',
      icon: <Clock size={20} color={COLORS.primary} />
    },
  ];

  // Sample data for offers
  const offers = [
    {
      id: '1',
      title: 'Special Ramadhan offers',
      subtitle: '50% discount on the Carrefour app',
      logo: <CreditCard size={20} color={COLORS.primary} />
    },
    {
      id: '2',
      title: 'Special Ramadhan offers',
      subtitle: '50% discount on the Carrefour app',
      logo: <CreditCard size={20} color={COLORS.primary} />
    },
  ];

  // Handle card scroll
  const handleCardScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveCardIndex(index);
  };

  // Render pagination dots
  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeCardIndex ? styles.paginationDotActive : {}
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Payments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={cards}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleCardScroll}
            renderItem={({ item, index }) => (
              <PaymentCard
                cardNumber={item.number}
                validity={item.validity}
                brand={item.brand}
                isActive={index === activeCardIndex}
              />
            )}
          />
          {renderPaginationDots()}
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Transaction</Text>

          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              icon={transaction.icon}
              title={transaction.title}
              subtitle={transaction.subtitle}
              amount={transaction.amount}
              time={transaction.time}
            />
          ))}
        </View>

        {/* Insight Banner */}
        <View style={styles.insightBannerContainer}>
          <LinearGradient
            colors={['#A276FF', '#9406E2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.insightBanner}
          >
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Mashallah!</Text>
              <Text style={styles.insightText}>
                Good Job! Your spending has reduced by 10% from last month
              </Text>
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ChevronRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.insightImageContainer}>
              {/* Placeholder for celebration image */}
              <View style={styles.insightImagePlaceholder} />
            </View>
          </LinearGradient>
        </View>

        {/* Reminders Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Reminders</Text>
            <TouchableOpacity style={styles.addNewButton}>
              <Text style={styles.addNewText}>+ ADD NEW</Text>
            </TouchableOpacity>
          </View>

          {reminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              icon={reminder.icon}
              title={reminder.title}
              amount={reminder.amount}
              dueDate={reminder.dueDate}
            />
          ))}
        </View>

        {/* Offers Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Offers</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Special offers handpicked for you</Text>

          <View style={styles.offersRow}>
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                logo={offer.logo}
                title={offer.title}
                subtitle={offer.subtitle}
              />
            ))}
          </View>
        </View>

        {/* Fun Weekend Ahead */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Fun Weekend Ahead!</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>
            Getting bored at home this weekend? Join in fun weekend and get exciting offers!
          </Text>

          <View style={styles.weekendDealsContainer}>
            <TouchableOpacity style={styles.weekendDealCard}>
              <LinearGradient
                colors={['#A276FF', '#9406E2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.weekendDealGradient}
              >
                <Text style={styles.weekendDealTitle}>Fancy Dinner</Text>
                <Text style={styles.weekendDealSubtitle}>
                  Get heavy discount on the Carrefour app
                </Text>
                <Text style={styles.weekendDealTerms}>*T&C apply</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.weekendDealCard}>
              <LinearGradient
                colors={['#A276FF', '#9406E2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.weekendDealGradient}
              >
                <Text style={styles.weekendDealTitle}>Fancy Dinner</Text>
                <Text style={styles.weekendDealSubtitle}>
                  Get heavy discount on the Carrefour app
                </Text>
                <Text style={styles.weekendDealTerms}>*T&C apply</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  carouselContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  cardContainer: {
    width: width,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBrand: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    letterSpacing: 2,
  },
  cardLogo: {
    width: 40,
    height: 30,
  },
  cardValidity: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    alignSelf: 'flex-end',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 16,
  },
  sectionContainer: {
    paddingHorizontal: SIZES.padding,
    marginTop: 25,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  sectionSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIcon: {
    width: 20,
    height: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '500',
  },
  transactionSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '600',
  },
  transactionTime: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  insightBannerContainer: {
    paddingHorizontal: SIZES.padding,
    marginTop: 25,
  },
  insightBanner: {
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  insightContent: {
    flex: 1,
    justifyContent: 'center',
  },
  insightTitle: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    marginBottom: 5,
  },
  insightText: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: 10,
  },
  insightImageContainer: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    marginRight: 5,
  },
  addNewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addNewText: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    fontWeight: '500',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderIcon: {
    width: 20,
    height: 20,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderTitle: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '500',
  },
  reminderDueDate: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  viewAllText: {
    ...FONTS.body5,
    color: COLORS.primary,
    fontWeight: '500',
  },
  offersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offerLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  offerLogo: {
    width: 25,
    height: 25,
  },
  offerTitle: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 5,
  },
  offerSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  weekendDealsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekendDealCard: {
    width: '48%',
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
  },
  weekendDealGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  weekendDealTitle: {
    ...FONTS.h4,
    color: COLORS.textWhite,
    marginBottom: 8,
  },
  weekendDealSubtitle: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: 10,
  },
  weekendDealTerms: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.7,
  },
});

export default TransactionsScreen;
