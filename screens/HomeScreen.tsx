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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Bell, CreditCard, Send, Clock, Smartphone, Home, BarChart2, Clock3, User } from 'lucide-react-native';
import GradientBackground from '../components/GradientBackground';
import { formatCurrency } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const HomeScreen = () => {
  // Get safe area insets
  const insets = useSafeAreaInsets();

  // State for card pagination
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  // Reference to the ScrollView
  const cardsScrollViewRef = React.useRef<ScrollView>(null);

  // Mock data
  const userData = {
    name: 'Robin Habibi',
    plan: 'Ethics Basic',
    balance: 2433.45,
    milestone: 3500,
  };

  const quickActions = [
    { id: '1', icon: <CreditCard size={24} color="#8C5FED" />, title: 'Cards' },
    { id: '2', icon: <Clock size={24} color="#8C5FED" />, title: 'Pay Later' },
    { id: '3', icon: <Send size={24} color="#8C5FED" />, title: 'Send' },
    { id: '4', icon: <Smartphone size={24} color="#8C5FED" />, title: 'M-Pesa' },
  ];

  const promotions = [
    { id: '1', title: 'Special Offers', color: '#90CAF9', image: require('../assets/home/whatsHot/special-offers.png') },
    { id: '2', title: 'Ramadhan Plan', color: '#9575CD', image: require('../assets/home/whatsHot/ramadhan-plan.png') },
    { id: '3', title: 'Free Banking for kids', color: '#F48FB1', image: require('../assets/home/whatsHot/free-banking-for-kids.png') },
    { id: '4', title: 'Order a Metal Card', color: '#FFB74D', image: require('../assets/home/whatsHot/order-a-metal-card.png') },
    { id: '5', title: 'StashAway with Round-Ups', color: '#AED581', image: require('../assets/home/whatsHot/stash-away.png') },
    { id: '6', title: 'Smart Budgeting', color: '#4FC3F7', image: require('../assets/home/whatsHot/smart-budgeting.png') },
  ];

  // Progress percentage is hardcoded in the SVG circles (67%)

  // Function to handle pagination dot clicks
  const handlePaginationDotPress = (index: number) => {
    setActiveCardIndex(index);
    // Calculate the x position to scroll to (card width + margin)
    const cardWidth = 320;
    const cardMargin = 15;
    const xOffset = index * (cardWidth + cardMargin);

    // Scroll to the selected card
    cardsScrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Gradient Background */}
      <GradientBackground
        colors={['#8C5FED', '#8C5FED', '#CE72E3']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 1.4, y: 0.5 }}
        style={{
          ...styles.headerBackground,
          paddingTop: insets.top
        }}
      >
        {/* Top pattern image */}
        <Image
          source={require('../assets/home/top-pattern.png')}
          style={styles.topPattern}
          resizeMode="contain"
        />
      </GradientBackground>

      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/home/user-avatar.png')}
                style={styles.avatar}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.planText}>Your plan: {userData.plan}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={COLORS.textWhite} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cards Section */}
          <View style={styles.cardsSection}>
            <ScrollView
              ref={cardsScrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsScrollContainer}
              pagingEnabled
              onMomentumScrollEnd={(event) => {
                const contentOffset = event.nativeEvent.contentOffset;
                const viewSize = event.nativeEvent.layoutMeasurement;
                // Calculate the page number by dividing the x offset by the width of the view
                const pageNum = Math.floor(contentOffset.x / (viewSize.width - 30));
                setActiveCardIndex(pageNum);
              }}
            >
              {/* Credit Score Card */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.chartContainer}>
                    <Svg height="120" width="120" viewBox="0 0 100 100">
                      <Circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#E6E6FF"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <Circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#8A2BE2"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 45 * 0.67} ${2 * Math.PI * 45 * (1 - 0.67)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        strokeLinecap="round"
                      />
                    </Svg>
                    <View style={styles.chartCenterText}>
                      <Text style={styles.chartPercentage}>67%</Text>
                      <Text style={styles.chartLabel}>Good</Text>
                    </View>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Credit Score</Text>
                    <Text style={styles.cardValue}>300/600</Text>
                  </View>
                </View>
              </View>

              {/* Balance Card */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.progressContainer}>
                    <Svg height="120" width="120" viewBox="0 0 100 100">
                      <Circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#E6E6FF"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <Circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#CE72E3"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 45 * 0.67} ${2 * Math.PI * 45 * (1 - 0.67)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        strokeLinecap="round"
                      />
                      <G>
                        <SvgText
                          x="50"
                          y="45"
                          fontSize="16"
                          fontWeight="bold"
                          fill="#8A2BE2"
                          textAnchor="middle"
                        >
                          67%
                        </SvgText>
                        <SvgText
                          x="50"
                          y="65"
                          fontSize="10"
                          fill="#666666"
                          textAnchor="middle"
                        >
                          next milestone
                        </SvgText>
                      </G>
                    </Svg>
                  </View>

                  <View style={styles.balanceInfo}>
                    <Text style={styles.balanceLabel}>Bank Balance</Text>
                    <Text style={styles.balanceAmount}>{formatCurrency(userData.balance)}</Text>

                    <View style={styles.milestoneContainer}>
                      <Text style={styles.milestoneLabel}>Milestone</Text>
                      <Text style={styles.milestoneAmount}>{formatCurrency(userData.milestone)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Upgrade Card */}
              <View style={styles.card}>
                <Image
                  source={require('../assets/home/upgrade-card-pattern.png')}
                  style={styles.upgradePattern}
                  resizeMode="contain"
                />
                <View style={[styles.cardContent, styles.upgradeCardContent]}>
                  <View>
                    <Text style={styles.upgradeTitle}>Upgrade your current plan?</Text>
                    <Text style={styles.upgradeDescription}>
                      You are on Basic Plan. Top up $ 2 only to access more benefits
                    </Text>
                    <TouchableOpacity style={styles.upgradeButtonContainer}>
                      <LinearGradient
                        colors={['#CE72E3', '#8A2BE2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.upgradeButton}
                      >
                        <Text style={styles.upgradeButtonText}>MORE DETAILS</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

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
    paddingTop: 0,
  },
  headerBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 390,
    height: 231,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 0,
  },
  topPattern: {
    width: 214,
    height: 208,
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0.2,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 69.48,
    height: 69.48,
    borderRadius: 50,
    backgroundColor: '#6B3BA6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    opacity: 0.9,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 50,
    opacity: 1,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  welcomeText: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.8,
    fontSize: 16,
  },
  userName: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: 'bold',
  },
  planText: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.8,
    fontSize: 16,
    marginTop: 5,
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5921D0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

  },
  notificationDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: 'red',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsSection: {
    marginTop: 20,
  },
  cardsScrollContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 10,
  },
  card: {
    width: 320,
    height: 190,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenterText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPercentage: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  chartLabel: {
    ...FONTS.body4,
    color: '#4CAF50',
  },
  cardTextContainer: {
    justifyContent: 'center',
  },
  cardTitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  cardValue: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: 'bold',
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
  upgradePattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    opacity: 0.8,
  },
  upgradeTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '80%',
  },
  upgradeDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 20,
    width: '90%',
  },
  upgradeCardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  upgradeButtonContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  upgradeButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  upgradeButtonText: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 12,
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
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.padding,
    marginTop: 20,
  },
  actionButton: {
    width: 160,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
  },
  actionIconContainer: {
    marginRight: 10,
  },
  actionText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
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