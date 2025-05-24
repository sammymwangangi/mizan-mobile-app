import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import Button from '../components/Button';
import PlanCard from '../components/PlanCard';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Sample data for subscription plans
const subscriptionPlans = [
  {
    id: '1',
    avatarColor: ['#D155FF', '#A276FF'],
    planName: 'Basic Ethics',
    price: '$1 Subscription fee',
    trialInfo: '(One month completely free)',
    bankingPoints: [
      'Early Salo - Get Paid 1 day earlier when you setup a direct deposit with MizanMoney.',
      'Automatically commit to a savings plan.',
      'Open a Free Bank Account in minutes',
      'Virtual Debit Card',
      'Customizable debit card',
    ],
    savingsPoints: [
      'Smart Budgeting Tools to help you save more',
      'Put your spare change to work with our Stashnow feature. (Where your spare change gets invested in performing stocks)',
    ],
  },
  {
    id: '2',
    avatarColor: ['#8336E6', '#69DBFF'],
    planName: 'Premium Ethics',
    price: '$3 Subscription fee',
    trialInfo: '(One month completely free)',
    bankingPoints: [
      'All Basic Ethics features',
      'Priority customer support',
      'Higher transaction limits',
      'Free international transfers',
      'Premium metal card',
    ],
    savingsPoints: [
      'Advanced investment options',
      'Personalized financial advice',
      'Goal-based savings with higher returns',
    ],
  },
  {
    id: '3',
    avatarColor: ['#F053E0', '#5592EF'],
    planName: 'Metal',
    price: '$5 Subscription fee',
    trialInfo: '(One month completely free)',
    bankingPoints: [
      'All Premium Ethics features',
      'Exclusive metal card design',
      'Concierge service',
      'Unlimited ATM withdrawals',
      'Travel insurance included',
    ],
    savingsPoints: [
      'Exclusive investment opportunities',
      'Wealth management services',
      'Tax optimization strategies',
    ],
  },
];

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Handle plan scroll
  const handlePlanScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActivePlanIndex(index);
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle choose plan button press
  const handleChoosePlan = () => {
    const selectedPlan = subscriptionPlans[activePlanIndex];
    console.log(`Selected plan: ${selectedPlan.planName}`);
    // Here you would implement the logic to process the subscription
  };

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={[styles.container]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* Plan Carousel */}
          <FlatList
            ref={flatListRef}
            data={subscriptionPlans}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handlePlanScroll}
            snapToInterval={width}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContainer}
            renderItem={({ item, index }) => (
              <PlanCard
                avatarColor={item.avatarColor}
                planName={item.planName}
                price={item.price}
                trialInfo={item.trialInfo}
                bankingPoints={item.bankingPoints}
                savingsPoints={item.savingsPoints}
                isActive={index === activePlanIndex}
              />
            )}
          />

          {/* Choose Plan Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="CHOOSE THIS PLAN"
              onPress={handleChoosePlan}
              gradient={true}
              gradientColors={['#A276FF', '#8336E6']}
              size="large"
              style={styles.chooseButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
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
    paddingVertical: 40,
  },
  buttonContainer: {
    padding: SIZES.padding,
    marginBottom: 30,
  },
  chooseButton: {
    ...FONTS.semibold(15),
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 60,
  },
});

export default SubscriptionScreen;
