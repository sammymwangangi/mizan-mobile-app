import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Bell, CreditCard, Send, Clock, Smartphone, Home, BarChart2, Clock3, User } from 'lucide-react-native';
import GradientBackground from '../components/GradientBackground';
import { formatCurrency, calculatePercentage } from '../utils';

const HomeScreen = () => {
  // Mock data
  const userData = {
    name: 'Robin Habibi',
    plan: 'Ethics Basic',
    balance: 2433.45,
    milestone: 3500,
  };

  const quickActions = [
    { id: '1', icon: <CreditCard size={24} color={COLORS.primary} />, title: 'Cards' },
    { id: '2', icon: <Clock size={24} color={COLORS.primary} />, title: 'Pay Later' },
    { id: '3', icon: <Send size={24} color={COLORS.primary} />, title: 'Send' },
    { id: '4', icon: <Smartphone size={24} color={COLORS.primary} />, title: 'M-Pesa' },
  ];

  const promotions = [
    { id: '1', title: 'Special Offers', color: '#90CAF9', image: require('../assets/onboarding-images/ob1.png') },
    { id: '2', title: 'Ramadhan Plan', color: '#9575CD', image: require('../assets/onboarding-images/ob2.png') },
    { id: '3', title: 'Free Banking for kids', color: '#F48FB1', image: require('../assets/onboarding-images/ob3.png') },
    { id: '4', title: 'Order a Metal Card', color: '#FFB74D', image: require('../assets/onboarding-images/ob4.png') },
    { id: '5', title: 'StashAway with Round-Ups', color: '#AED581', image: require('../assets/onboarding-images/ob5.png') },
    { id: '6', title: 'Smart Budgeting', color: '#4FC3F7', image: require('../assets/onboarding-images/ob6.png') },
  ];

  // Calculate progress percentage
  const progressPercentage = calculatePercentage(userData.balance, userData.milestone);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Background */}
      <GradientBackground
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.headerBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/onboarding-images/ob1.png')}
              style={styles.avatar}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.planText}>Your plan: {userData.plan}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Bank Balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(userData.balance)}</Text>

              <View style={styles.milestoneContainer}>
                <Text style={styles.milestoneLabel}>Milestone</Text>
                <Text style={styles.milestoneAmount}>{formatCurrency(userData.milestone)}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{progressPercentage}%</Text>
                <Text style={styles.progressLabel}>next milestone</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.actionButton}>
                <View style={styles.actionIconContainer}>
                  {action.icon}
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* What's Hot Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What&apos;s Hot?</Text>

            <View style={styles.promotionsGrid}>
              {promotions.map((promo) => (
                <TouchableOpacity
                  key={promo.id}
                  style={[styles.promotionCard, { backgroundColor: promo.color }]}
                >
                  <Text style={styles.promotionTitle}>{promo.title}</Text>
                  <Image
                    source={promo.image}
                    style={styles.promotionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={[styles.navButton, styles.activeNavButton]}>
            <Home size={24} color={COLORS.primary} />
            <Text style={styles.activeNavText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <Send size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <BarChart2 size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <Clock3 size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <User size={24} color={COLORS.textLight} />
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
  headerBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 250,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  welcomeText: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  userName: {
    ...FONTS.h3,
    color: COLORS.textWhite,
  },
  planText: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  balanceCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  balanceAmount: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 15,
  },
  milestoneContainer: {
    marginTop: 10,
  },
  milestoneLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  milestoneAmount: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  progressLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.padding,
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    ...FONTS.body5,
    color: COLORS.text,
  },
  sectionContainer: {
    marginTop: 30,
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 15,
  },
  promotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  promotionCard: {
    width: '48%',
    height: 120,
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  promotionTitle: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
  promotionImage: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 80,
    height: 80,
    opacity: 0.8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  activeNavButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  activeNavText: {
    ...FONTS.body5,
    color: COLORS.primary,
    marginTop: 2,
  },
});

export default HomeScreen;