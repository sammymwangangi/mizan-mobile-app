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
import WeekendCard from 'components/WeekendCard';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Main component
const TransactionsScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const flatListRef = useRef(null);

  // Sample data for cards
  const cards = [
    { id: '1', number: '4777 8900 0134 5545', validity: '10/2026', brand: 'Mastercard' },
    { id: '2', number: '4722 3300 0234 7890', validity: '05/2025', brand: 'Visa' },
    { id: '3', number: '4453 1200 0334 1234', validity: '12/2024', brand: 'Mastercard' },
  ];

  // Sample data for transactions
  const transactions = [
    {
      id: '1',
      title: 'Cab to home',
      subtitle: 'UBER',
      amount: 8.48,
      time: '6:41 pm',
      icon: "cab.png"
    },
    {
      id: '2',
      title: 'Lunch',
      subtitle: 'Arkam Ahmed',
      amount: 18.00,
      time: '6:41 pm',
      icon: "lunch.png"
    },
  ];

  // Sample data for reminders
  const reminders = [
    {
      id: '1',
      title: 'Pay your electricity bill',
      amount: '$55.00',
      dueDate: '21st Mar 2022',
      icon: "reminders-icon-1.png"
    },
    {
      id: '2',
      title: 'Pay your electricity bill',
      amount: '$55.00',
      dueDate: '21st Mar 2022',
      icon: "reminders-icon-2.png"
    },
  ];

  // Sample data for offers
  const offers = [
    {
      id: '1',
      title: 'Special Ramadhan offers',
      subtitle: '50% discount on the Carrefour app',
      logo: 'carrefour.png'
    },
    {
      id: '2',
      title: 'Special Ramadhan offers',
      subtitle: '50% discount on the Carrefour app',
      logo: 'offer-2.png'
    },
  ];

  // Sample data for weekend offers
  const weekendOffers = [
    {
      id: '1',
      title: 'Special Ramadhan offers',
      subtitle: 'Get heavy discount on the Carrefour app',
      icon: 'bowl.png',
      backgroundColor: '#6E59F7',
      textColor: '#FFFFFF',
    },
    {
      id: '2',
      title: 'Special Ramadhan offers',
      subtitle: 'Get heavy discount on the Carrefour app',
      icon: 'bowl2.png',
      backgroundColor: '#E0D2FF',
      textColor: '#6E59F7',
    },
  ];

  // Handle card scroll
  const handleCardScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveCardIndex(index);
  };

  // Reference to the ScrollView
  const cardsScrollViewRef = React.useRef<ScrollView>(null);

  // Scroll to the Balance Card (second card) when component mounts
  React.useEffect(() => {
    // Calculate the x position to scroll to (card width + margin)
    const cardWidth = 320;
    const cardMargin = 19; // Match the margin used in handlePaginationDotPress
    const xOffset = activeCardIndex * (cardWidth + cardMargin);

    // Add a small delay to ensure the ScrollView is properly rendered
    const timer = setTimeout(() => {
      cardsScrollViewRef.current?.scrollTo({ x: xOffset, animated: false });
    }, 100);

    return () => clearTimeout(timer);
  }, [activeCardIndex]);

  // Function to handle pagination dot clicks
  const handlePaginationDotPress = (index: number) => {
    setActiveCardIndex(index);
    // Calculate the x position to scroll to (card width + margin)
    const cardWidth = 320;
    const cardMargin = 19;
    const xOffset = index * (cardWidth + cardMargin);

    // Scroll to the selected card
    cardsScrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
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
        ref={cardsScrollViewRef}
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
          {/* {renderPaginationDots()} */}

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.paginationDotContainer}
                onPress={() => handlePaginationDotPress(index)}
              >
                {index === activeCardIndex ? (
                  <LinearGradient
                    colors={['#CE72E3', '#8A2BE2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.paginationDot, styles.activePaginationDot]}
                  />
                ) : (
                  <View style={styles.paginationDot} />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
          <View style={styles.insightImageWrapper}>
            <Image
              source={require('../assets/payments/mashallah.png')}
              style={styles.insightImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Mashallah!</Text>
            <Text style={styles.insightText}>
              Good Job! your spending have reduced by 10% from last month
            </Text>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <ChevronRight size={16} color="#A276FF" />
            </TouchableOpacity>
          </View>
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
        <View style={styles.offersSectionContainer}>

          <View style={styles.offersHeader}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Offers</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Special offers handpicked for you</Text>
          </View>

          <FlatList
            data={offers}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingBottom: 30 }}
            renderItem={({ item }) => (
              <OfferCard
                logo={item.logo}
                title={item.title}
                subtitle={item.subtitle}
              />
            )}
          />
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

          <FlatList
            data={weekendOffers}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingBottom: 30 }}
            renderItem={({ item }) => (
              <WeekendCard
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                backgroundColor={item.backgroundColor}
                textColor={item.textColor}
              />
            )}
          />
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
    ...FONTS.bold(20),
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
    width: 280,
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
  paginationDotContainer: {
    marginHorizontal: 5,
    padding: 5, // Add padding for better touch target
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E6E6FF',
  },
  activePaginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionContainer: {
    paddingHorizontal: SIZES.padding,
    marginTop: 25,
  },
  offersSectionContainer: {
    marginTop: 25,
  },
  offersHeader: {
    paddingHorizontal: SIZES.padding,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    ...FONTS.semibold(20),
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E0D2FF',
    marginTop: 25,
    width: '100%',
    minHeight: 152,
    overflow: 'hidden',
    paddingHorizontal: 0, // Remove horizontal padding
    paddingVertical: 0, // Remove vertical padding
  },
  insightImageWrapper: {
    width: 150,
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  insightImage: {
    width: '100%',
    height: '100%',
  },
  insightContent: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,

  },
  insightTitle: {
    ...FONTS.semibold(18),
    color: COLORS.text,
    marginBottom: 6,
  },
  insightText: {
    ...FONTS.body4,
    color: COLORS.text,
    opacity: 0.85,
    marginBottom: 14,
    width: 162
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    ...FONTS.semibold(14),
    color: '#A276FF',
    marginRight: 5,
  },
  addNewButton: {
    backgroundColor: '#A276FF',
    paddingHorizontal: 19,
    paddingVertical: 14,
    borderRadius: 40,
    shadowColor: '#391A73',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 15,
  },
  addNewText: {
    ...FONTS.semibold(12),
    color: COLORS.textWhite,
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
    ...FONTS.semibold(13),
    color: COLORS.text,
  },
  reminderDueDate: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  viewAllText: {
    ...FONTS.semibold(14),
    color: '#A276FF',
  },

  weekendDealCard: {
    backgroundColor: "#6E59F7",
    width: 276,
    height: 153,
    borderRadius: 25,
    padding: 15,
    overflow: 'hidden',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
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
