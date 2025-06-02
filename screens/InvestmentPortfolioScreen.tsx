import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency, normalize } from '../utils';
import { useRoundUps } from '../contexts/RoundUpsContext';
import GradientBackground from '../components/GradientBackground';

type InvestmentPortfolioScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InvestmentPortfolio'>;

const { width } = Dimensions.get('window');

const InvestmentPortfolioScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<InvestmentPortfolioScreenNavigationProp>();
  const { state } = useRoundUps();

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (state.isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading Portfolio...</Text>
      </View>
    );
  }

  const portfolio = state.portfolio;
  const summary = state.summary;

  if (!portfolio) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Portfolio data not available</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <TouchableOpacity style={styles.headerBackButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Investment Portfolio</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Portfolio Overview Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <PieChart size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Portfolio Overview</Text>
              </View>
            </View>

            <View style={styles.portfolioOverview}>
              <View style={styles.mainValue}>
                <Text style={styles.portfolioTotalValue}>{formatCurrency(portfolio.totalValue)}</Text>
                <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
              </View>

              <View style={styles.performanceRow}>
                <View style={styles.performanceItem}>
                  <View style={styles.performanceHeader}>
                    <TrendingUp size={16} color={COLORS.success} />
                    <Text style={styles.performanceLabel}>Total Growth</Text>
                  </View>
                  <Text style={[styles.performanceValue, { color: COLORS.success }]}>
                    {formatCurrency(portfolio.totalGrowth)}
                  </Text>
                  <Text style={[styles.performancePercentage, { color: COLORS.success }]}>
                    +{portfolio.growthPercentage.toFixed(2)}%
                  </Text>
                </View>

                <View style={styles.performanceItem}>
                  <View style={styles.performanceHeader}>
                    <DollarSign size={16} color={COLORS.textLight} />
                    <Text style={styles.performanceLabel}>Contributions</Text>
                  </View>
                  <Text style={styles.performanceValue}>
                    {formatCurrency(portfolio.totalContributions)}
                  </Text>
                  <Text style={styles.performanceSubtext}>
                    From Round-Ups
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Round-Ups Statistics */}
          {summary && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <BarChart3 size={24} color={COLORS.primary} />
                  <Text style={styles.cardTitle}>Round-Ups Impact</Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatCurrency(summary.totalInvested)}</Text>
                  <Text style={styles.statLabel}>Total Invested</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatCurrency(summary.currentMonth.invested)}</Text>
                  <Text style={styles.statLabel}>This Month</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressTitle}>Monthly Investment Goal</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: '68%' }]} />
                </View>
                <Text style={styles.progressLabel}>
                  {formatCurrency(summary.currentMonth.invested)} of {formatCurrency(100)} goal
                </Text>
              </View>
            </View>
          )}

          {/* Holdings */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Holdings</Text>
              <Text style={styles.riskLevel}>Risk: {portfolio.riskLevel}</Text>
            </View>

            {portfolio.holdings.map((holding, index) => (
              <View key={holding.symbol} style={styles.holdingItem}>
                <View style={styles.holdingLeft}>
                  <View style={styles.holdingSymbol}>
                    <Text style={styles.holdingSymbolText}>{holding.symbol}</Text>
                  </View>
                  <View style={styles.holdingInfo}>
                    <Text style={styles.holdingName}>{holding.name}</Text>
                    <Text style={styles.holdingShares}>
                      {holding.shares.toFixed(3)} shares @ {formatCurrency(holding.currentPrice)}
                    </Text>
                  </View>
                </View>

                <View style={styles.holdingRight}>
                  <Text style={styles.holdingValue}>{formatCurrency(holding.totalValue)}</Text>
                  <View style={styles.holdingGainLoss}>
                    {holding.gainLoss >= 0 ? (
                      <TrendingUp size={12} color={COLORS.success} />
                    ) : (
                      <TrendingDown size={12} color={COLORS.error} />
                    )}
                    <Text style={[
                      styles.holdingGainLossText,
                      { color: holding.gainLoss >= 0 ? COLORS.success : COLORS.error }
                    ]}>
                      {holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercentage.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Asset Allocation */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Asset Allocation</Text>
            </View>

            <View style={styles.allocationContainer}>
              <View style={styles.allocationItem}>
                <View style={styles.allocationDot} style={[styles.allocationDot, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.allocationLabel}>Stocks</Text>
                <Text style={styles.allocationPercentage}>60%</Text>
              </View>
              <View style={styles.allocationItem}>
                <View style={[styles.allocationDot, { backgroundColor: COLORS.secondary }]} />
                <Text style={styles.allocationLabel}>ETFs</Text>
                <Text style={styles.allocationPercentage}>30%</Text>
              </View>
              <View style={styles.allocationItem}>
                <View style={[styles.allocationDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.allocationLabel}>Bonds</Text>
                <Text style={styles.allocationPercentage}>10%</Text>
              </View>
            </View>
          </View>

          {/* Performance Note */}
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>📈 Portfolio Performance</Text>
            <Text style={styles.noteText}>
              Your Round-Ups portfolio has grown {portfolio.growthPercentage.toFixed(1)}% since inception. 
              Keep using Round-Ups to continue building your investment portfolio automatically!
            </Text>
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
  headerBackButton: {
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
  headerSpacer: {
    width: normalize(40),
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
    marginBottom: normalize(16),
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
  loadingText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: normalize(20),
  },
  backButton: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    backgroundColor: COLORS.primary,
    borderRadius: normalize(20),
  },
  backButtonText: {
    ...FONTS.medium(14),
    color: COLORS.textWhite,
  },
  portfolioOverview: {
    alignItems: 'center',
  },
  mainValue: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  portfolioTotalValue: {
    ...FONTS.semibold(32),
    color: COLORS.text,
  },
  portfolioLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: normalize(4),
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  performanceLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginLeft: normalize(4),
  },
  performanceValue: {
    ...FONTS.semibold(16),
    color: COLORS.text,
  },
  performancePercentage: {
    ...FONTS.body5,
    marginTop: normalize(2),
  },
  performanceSubtext: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(2),
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(20),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.semibold(18),
    color: COLORS.text,
  },
  statLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(4),
  },
  progressContainer: {
    marginTop: normalize(16),
    paddingTop: normalize(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  progressTitle: {
    ...FONTS.medium(14),
    color: COLORS.text,
    marginBottom: normalize(8),
  },
  progressBarContainer: {
    height: normalize(8),
    backgroundColor: COLORS.border,
    borderRadius: normalize(4),
    overflow: 'hidden',
    marginBottom: normalize(8),
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: normalize(4),
  },
  progressLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  riskLevel: {
    ...FONTS.body5,
    color: COLORS.primary,
    backgroundColor: COLORS.background2,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(12),
    textTransform: 'capitalize',
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  holdingSymbol: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: COLORS.background2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  holdingSymbolText: {
    ...FONTS.semibold(12),
    color: COLORS.primary,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  holdingShares: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(2),
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    ...FONTS.semibold(14),
    color: COLORS.text,
  },
  holdingGainLoss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(2),
  },
  holdingGainLossText: {
    ...FONTS.body5,
    marginLeft: normalize(4),
  },
  allocationContainer: {
    marginTop: normalize(8),
  },
  allocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  allocationDot: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    marginRight: normalize(12),
  },
  allocationLabel: {
    ...FONTS.body4,
    color: COLORS.text,
    flex: 1,
  },
  allocationPercentage: {
    ...FONTS.semibold(14),
    color: COLORS.text,
  },
  noteCard: {
    backgroundColor: COLORS.background2,
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(16),
  },
  noteTitle: {
    ...FONTS.semibold(14),
    color: COLORS.text,
    marginBottom: normalize(8),
  },
  noteText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    lineHeight: normalize(20),
  },
});

export default InvestmentPortfolioScreen;
