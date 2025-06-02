import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Settings, TrendingUp, Heart, DollarSign, PieChart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency, normalize } from '../utils';
import { useRoundUps } from '../contexts/RoundUpsContext';
import GradientBackground from '../components/GradientBackground';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryArea } from 'victory-native';

type RoundUpsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoundUps'>;

const { width } = Dimensions.get('window');

const RoundUpsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RoundUpsScreenNavigationProp>();
  const { state, toggleRoundUps } = useRoundUps();
  const [isEnabled, setIsEnabled] = useState(state.settings?.isEnabled || false);

  const handleToggleRoundUps = async (value: boolean) => {
    setIsEnabled(value);
    await toggleRoundUps(value);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    navigation.navigate('RoundUpsSettings');
  };

  const handleViewPortfolio = () => {
    navigation.navigate('InvestmentPortfolio');
  };

  const handleViewHistory = () => {
    navigation.navigate('RoundUpsHistory');
  };

  if (state.isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading Round-Ups...</Text>
      </View>
    );
  }

  const summary = state.summary;
  const portfolio = state.portfolio;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Background */}
      <GradientBackground
        colors={['#CE72E3', '#8C5FED', '#8C5FED']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          ...styles.headerBackground,
          paddingTop: insets.top,
        }}
      />

      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Round-Ups</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
            <Settings size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Round-Ups Toggle Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <DollarSign size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Round-Ups</Text>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={handleToggleRoundUps}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={isEnabled ? COLORS.textWhite : COLORS.disabled}
              />
            </View>
            <Text style={styles.cardDescription}>
              Automatically round up your purchases to the nearest dollar and invest or donate the spare change.
            </Text>
          </View>

          {/* Summary Statistics */}
          {isEnabled && summary && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>This Month</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatCurrency(summary.currentMonth.roundUps)}</Text>
                  <Text style={styles.statLabel}>Total Round-Ups</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{summary.currentMonth.transactionCount}</Text>
                  <Text style={styles.statLabel}>Transactions</Text>
                </View>
              </View>

              <View style={styles.allocationRow}>
                <View style={styles.allocationItem}>
                  <View style={styles.allocationHeader}>
                    <TrendingUp size={16} color={COLORS.primary} />
                    <Text style={styles.allocationLabel}>Invested</Text>
                  </View>
                  <Text style={styles.allocationValue}>
                    {formatCurrency(summary.currentMonth.invested)}
                  </Text>
                </View>

                <View style={styles.allocationItem}>
                  <View style={styles.allocationHeader}>
                    <Heart size={16} color={COLORS.error} />
                    <Text style={styles.allocationLabel}>Donated</Text>
                  </View>
                  <Text style={styles.allocationValue}>
                    {formatCurrency(summary.currentMonth.donated)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Portfolio Overview */}
          {isEnabled && portfolio && (
            <TouchableOpacity style={styles.card} onPress={handleViewPortfolio}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <PieChart size={24} color={COLORS.primary} />
                  <Text style={styles.cardTitle}>Investment Portfolio</Text>
                </View>
                <Text style={styles.viewMore}>View →</Text>
              </View>

              <View style={styles.portfolioStats}>
                <View style={styles.portfolioMainStat}>
                  <Text style={styles.portfolioValue}>{formatCurrency(portfolio.totalValue)}</Text>
                  <Text style={styles.portfolioLabel}>Total Value</Text>
                </View>

                <View style={styles.portfolioGrowth}>
                  <Text style={[
                    styles.portfolioGrowthValue,
                    { color: portfolio.growthPercentage >= 0 ? COLORS.success : COLORS.error }
                  ]}>
                    {portfolio.growthPercentage >= 0 ? '+' : ''}{portfolio.growthPercentage.toFixed(2)}%
                  </Text>
                  <Text style={styles.portfolioGrowthLabel}>
                    {formatCurrency(portfolio.totalGrowth)} growth
                  </Text>
                </View>
              </View>

              {/* Progress bar showing portfolio allocation */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: '65%' }]} />
                </View>
                <Text style={styles.progressLabel}>65% of target allocation</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Recent Activity */}
          {isEnabled && state.recentTransactions.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Round-Ups</Text>
                <TouchableOpacity onPress={handleViewHistory}>
                  <Text style={styles.viewMore}>View All →</Text>
                </TouchableOpacity>
              </View>

              {state.recentTransactions.slice(0, 3).map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <Text style={styles.transactionMerchant}>{transaction.merchantName}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.transactionAmount}>
                      {formatCurrency(transaction.amount)}
                    </Text>
                    <Text style={styles.roundUpAmount}>
                      +{formatCurrency(transaction.roundUpAmount)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Get Started Card (when disabled) */}
          {!isEnabled && (
            <View style={styles.card}>
              <Text style={styles.getStartedTitle}>Start Saving with Round-Ups</Text>
              <Text style={styles.getStartedDescription}>
                Turn on Round-Ups to automatically invest or donate your spare change from everyday purchases.
              </Text>

              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <TrendingUp size={20} color={COLORS.primary} />
                  <Text style={styles.benefitText}>Grow your wealth automatically</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Heart size={20} color={COLORS.error} />
                  <Text style={styles.benefitText}>Support causes you care about</Text>
                </View>
                <View style={styles.benefitItem}>
                  <DollarSign size={20} color={COLORS.success} />
                  <Text style={styles.benefitText}>Save without thinking about it</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.enableButton}
                onPress={() => handleToggleRoundUps(true)}
              >
                <LinearGradient
                  colors={COLORS.mizanGradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.enableButtonGradient}
                >
                  <Text style={styles.enableButtonText}>Enable Round-Ups</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: normalize(120),
    borderBottomLeftRadius: normalize(40),
    borderBottomRightRadius: normalize(40),
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
  },
  backButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.semibold(18),
    color: COLORS.textWhite,
  },
  settingsButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: normalize(20),
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(20),
    padding: normalize(20),
    marginBottom: normalize(16),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    ...FONTS.semibold(16),
    color: COLORS.text,
    marginLeft: normalize(8),
  },
  cardDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    lineHeight: normalize(20),
  },
  viewMore: {
    ...FONTS.medium(14),
    color: COLORS.primary,
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(16),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.semibold(20),
    color: COLORS.text,
  },
  statLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(4),
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(16),
    paddingTop: normalize(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  allocationItem: {
    flex: 1,
  },
  allocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  allocationLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginLeft: normalize(8),
  },
  allocationValue: {
    ...FONTS.semibold(16),
    color: COLORS.text,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: normalize(16),
  },
  portfolioMainStat: {
    flex: 1,
  },
  portfolioValue: {
    ...FONTS.semibold(24),
    color: COLORS.text,
  },
  portfolioLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: normalize(4),
  },
  portfolioGrowth: {
    alignItems: 'flex-end',
  },
  portfolioGrowthValue: {
    ...FONTS.semibold(16),
  },
  portfolioGrowthLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(4),
  },
  progressContainer: {
    marginTop: normalize(16),
  },
  progressBarContainer: {
    height: normalize(8),
    backgroundColor: COLORS.border,
    borderRadius: normalize(4),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: normalize(4),
  },
  progressLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(8),
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionMerchant: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  transactionDate: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(2),
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  roundUpAmount: {
    ...FONTS.body5,
    color: COLORS.primary,
    marginTop: normalize(2),
  },
  getStartedTitle: {
    ...FONTS.semibold(18),
    color: COLORS.text,
    marginBottom: normalize(12),
    textAlign: 'center',
  },
  getStartedDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: normalize(20),
    marginBottom: normalize(24),
  },
  benefitsList: {
    marginBottom: normalize(24),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  benefitText: {
    ...FONTS.body4,
    color: COLORS.text,
    marginLeft: normalize(12),
  },
  enableButton: {
    borderRadius: normalize(40),
    overflow: 'hidden',
  },
  enableButtonGradient: {
    paddingVertical: normalize(16),
    alignItems: 'center',
  },
  enableButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
  },
});

export default RoundUpsScreen;
