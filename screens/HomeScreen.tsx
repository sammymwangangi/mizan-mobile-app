import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Bell } from 'lucide-react-native';
import GradientBackground from '../components/GradientBackground';
import { formatCurrency, normalize, getResponsiveWidth } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import LiquidProgress from '../components/home/LiquidProgress';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  // const [value, setValue] = useState<number>(67);
  // Get safe area insets
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // State for card pagination - start with the Balance Card (index 1)
  const [activeCardIndex, setActiveCardIndex] = React.useState(1);

  // Reference to the ScrollView
  const cardsScrollViewRef = React.useRef<ScrollView>(null);

  // Scroll to the Balance Card (second card) when component mounts
  React.useEffect(() => {
    // Calculate the x position to scroll to (card width + margin)
    const cardWidth = getResponsiveWidth(82); // Use responsive width
    const cardMargin = normalize(19); // Match the margin used in handlePaginationDotPress
    const xOffset = activeCardIndex * (cardWidth + cardMargin);

    // Add a small delay to ensure the ScrollView is properly rendered
    const timer = setTimeout(() => {
      cardsScrollViewRef.current?.scrollTo({ x: xOffset, animated: false });
    }, 100);

    return () => clearTimeout(timer);
  }, [activeCardIndex]);

  // Mock data
  const userData = {
    name: 'Robin Habibi',
    plan: 'Noor',
    balance: 2433.45,
    milestone: 67,
  };

  const quickActions = [
    { id: '1', icon: require('../assets/home/icons/cards.png'), title: 'Cards' },
    { id: '2', icon: require('../assets/home/icons/pay-later.png'), title: 'Pay Later' },
    { id: '3', icon: require('../assets/home/icons/send.png'), title: 'Send' },
    { id: '4', icon: require('../assets/home/icons/m-pesa.png'), title: 'Round Ups' },
  ];

  const promotions = [
    { id: '1', title: 'Special Offers', color: '#90CAF9', image: require('../assets/home/whatsHot/special-offers.png'), textColor: '#FFFFFF' },
    { id: '2', title: 'Ramadhan Plan', color: '#9575CD', image: require('../assets/home/whatsHot/ramadhan-plan.png'), textColor: '#FFFFFF', gradient: true },
    { id: '3', title: 'Free Banking for kids', color: '#F48FB1', image: require('../assets/home/whatsHot/free-banking-for-kids.png'), textColor: '#FFFFFF' },
    { id: '4', title: 'Order a Metal Card', color: '#FFB74D', image: require('../assets/home/whatsHot/order-a-metal-card.png'), textColor: '#CE72E3', gradient: true },
    { id: '5', title: 'StashAway with Round-Ups', color: '#AED581', image: require('../assets/home/whatsHot/stash-away.png'), textColor: '#CE72E3', gradient: true },
    { id: '6', title: 'Smart Budgeting', color: '#4FC3F7', image: require('../assets/home/whatsHot/smart-budgeting.png'), textColor: '#FFFFFF', gradient: true },
  ];

  // Progress percentage is hardcoded in the SVG circles (67%)

  // Function to handle pagination dot clicks
  const handlePaginationDotPress = (index: number) => {
    setActiveCardIndex(index);
    // Calculate the x position to scroll to (card width + margin)
    const cardWidth = getResponsiveWidth(82); // Use responsive width
    const cardMargin = normalize(19);
    const xOffset = index * (cardWidth + cardMargin);

    // Scroll to the selected card
    cardsScrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Gradient Background */}
      <GradientBackground
        colors={['#CE72E3', '#8C5FED', '#8C5FED' ]}
        start={{ x: 1, y: 0}}
        end={{ x: 1, y: 0 }}
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
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image
                source={require('../assets/profile/profile-image.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
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
                    <Svg height="130" width="120" viewBox="0 0 100 100">
                      <Circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#E6E6FF"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <Circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#8A2BE2"
                        strokeWidth="5"
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
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <LiquidProgress value={67} size={117} />
                  </View>


                  <View style={styles.balanceInfo}>
                    <Text style={styles.balanceLabel}>Bank Balance</Text>
                    <Text style={styles.balanceAmount}>{formatCurrency(userData.balance)}</Text>

                    <View style={styles.milestoneContainer}>
                      <Text style={styles.milestoneLabel}>Round-ups</Text>
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
                        colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                        locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
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
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={() => {
                  if (action.title === 'Cards') {
                    navigation.navigate('CardsDashboard');
                  } else if (action.title === 'M-Pesa') {
                    navigation.navigate('MPESA');
                  } else if (action.title === 'Send') {
                    navigation.navigate('SendMoney');
                  } else if (action.title === 'Pay Later') {
                    navigation.navigate('Shop');
                  } else if (action.title === 'Round Ups') {
                    navigation.navigate('RoundUps');
                  } else {
                    console.log(`${action.title} pressed`);
                  }
                }}
              >
                <View style={styles.actionIconContainer}>
                  <Image source={action.icon} style={styles.actionIcon} resizeMode="contain" />
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
                  style={styles.promotionCard}
                >
                  <Image
                    source={promo.image}
                    style={styles.promotionBackground}
                    resizeMode="cover"
                  />
                  {promo.gradient ? (
                    <LinearGradient
                      colors={['#CE72E3', '#8A2BE2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientText}
                    >
                      <Text style={[styles.promotionTitle, { color: promo.textColor }]}>{promo.title}</Text>
                    </LinearGradient>
                  ) : (
                    <Text style={[styles.promotionTitle, { color: promo.textColor }]}>{promo.title}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
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
    width: '100%', // Use full width instead of fixed 390px
    height: normalize(231),
    borderBottomLeftRadius: normalize(40),
    borderBottomRightRadius: normalize(40),
    zIndex: 0,
  },
  topPattern: {
    width: normalize(214),
    height: normalize(208),
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0.7,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: normalize(60),
    paddingBottom: normalize(20),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: normalize(69.48),
    height: normalize(69.48),
    borderRadius: normalize(50),
    backgroundColor: '#6B3BA650',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
    opacity: 1,
  },
  avatar: {
    width: normalize(46),
    height: normalize(46),
    borderRadius: normalize(50),
    opacity: 1,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  welcomeText: {
    ...FONTS.medium(14),
    color: COLORS.textWhite,
  },
  userName: {
    ...FONTS.medium(14),
    color: COLORS.textWhite,
  },
  planText: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    fontSize: normalize(12),
    marginTop: normalize(5),
  },
  notificationButton: {
    width: normalize(46),
    height: normalize(46),
    borderRadius: normalize(23),
    backgroundColor: '#5921D0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

  },
  notificationDot: {
    width: normalize(11),
    height: normalize(11),
    borderRadius: normalize(5.5),
    backgroundColor: 'red',
    position: 'absolute',
    top: normalize(-2),
    right: normalize(8),
  },
  scrollContent: {
    paddingBottom: normalize(20),
  },
  cardsSection: {
    marginTop: normalize(20),
  },
  cardsScrollContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: normalize(10),
  },
  card: {
    width: getResponsiveWidth(82), // Responsive width instead of fixed 320px
    height: normalize(190),
    borderRadius: normalize(25),
    backgroundColor: COLORS.card,
    marginRight: normalize(15),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartContainer: {
    position: 'relative',
    width: normalize(120),
    height: normalize(130),
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
    color: "#1B1C39",
    fontWeight: 'bold',
  },
  chartLabel: {
    ...FONTS.body4,
    color: '#28B661',
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: normalize(20),
  },
  cardTitle: {
    ...FONTS.body3,
    color: "#6D6E8A",
    marginBottom: normalize(5),
  },
  cardValue: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  balanceInfo: {
    justifyContent: 'center',
  },
  balanceLabel: {
    ...FONTS.medium(14),
    color: COLORS.textLight,
    marginBottom: normalize(5),
  },
  balanceAmount: {
    ...FONTS.semibold(20),
    color: COLORS.text,
    marginBottom: normalize(15),
  },
  milestoneContainer: {
    marginTop: normalize(10),
  },
  milestoneLabel: {
    ...FONTS.medium(14),
    color: COLORS.textLight,
  },
  milestoneAmount: {
    ...FONTS.semibold(20),
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
    width: normalize(120),
    height: normalize(120),
    opacity: 0.8,
  },
  upgradeTitle: {
    ...FONTS.semibold(16),
    color: COLORS.text,
    marginBottom: normalize(10),
    width: '80%',
  },
  upgradeDescription: {
    ...FONTS.medium(12),
    color: COLORS.textLight,
    marginBottom: normalize(20),
    width: '90%',
  },
  upgradeCardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  upgradeButtonContainer: {
    marginTop: normalize(10),
    alignSelf: 'flex-start',
  },
  upgradeButton: {
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(40),
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(70), // Responsive width instead of fixed 280px
  },
  upgradeButtonText: {
    ...FONTS.semibold(15),
    color: COLORS.textWhite,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(15),
  },
  paginationDotContainer: {
    marginHorizontal: normalize(5),
    padding: normalize(5), // Add padding for better touch target
  },
  paginationDot: {
    width: normalize(10),
    height: normalize(10),
    borderRadius: normalize(5),
    backgroundColor: '#E6E6FF',
  },
  activePaginationDot: {
    width: normalize(10),
    height: normalize(10),
    borderRadius: normalize(5),
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.padding,
    marginTop: normalize(20),
    gap: normalize(16),
  },
  actionButton: {
    width: '47%',
    height: normalize(56),
    borderRadius: normalize(25),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 15,
  },
  actionIconContainer: {
    marginRight: normalize(12),
  },
  actionIcon: {
    width: normalize(32),
    height: normalize(32),
  },
  actionText: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  sectionContainer: {
    marginTop: normalize(30),
    paddingHorizontal: SIZES.padding,
    paddingBottom: normalize(100),
  },
  sectionTitle: {
    ...FONTS.semibold(20),
    color: COLORS.text,
    marginBottom: normalize(15),
  },
  promotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  promotionCard: {
    width: '48%', // Fixed 48% width for 2 columns with space between
    height: normalize(199),
    borderRadius: normalize(14),
    marginBottom: normalize(15),
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 15,
  },
  promotionBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
  promotionTitle: {
    ...FONTS.semibold(14),
    position: 'absolute',
    left: normalize(10),
    top: normalize(10),
    width: '90%', // Ensure text doesn't overflow
    paddingRight: normalize(5),
  },
  gradientText: {
    ...FONTS.semibold(14),
    position: 'absolute',
    left: normalize(10),
    top: normalize(10),
    width: '90%', // Ensure text doesn't overflow
    borderRadius: normalize(4),
    paddingRight: normalize(5),
  },

});

export default HomeScreen;