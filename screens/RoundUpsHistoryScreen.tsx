import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Calendar, TrendingUp, Heart } from 'lucide-react-native';
import { formatCurrency, normalize } from '../utils';
import { useRoundUps } from '../contexts/RoundUpsContext';
import GradientBackground from '../components/GradientBackground';

type RoundUpsHistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoundUpsHistory'>;

const RoundUpsHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RoundUpsHistoryScreenNavigationProp>();
  const { state } = useRoundUps();

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (state.isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading History...</Text>
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
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Round-Ups History</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Calendar size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>All Time Summary</Text>
              </View>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{formatCurrency(state.summary?.totalRoundUps || 0)}</Text>
                <Text style={styles.summaryLabel}>Total Round-Ups</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{formatCurrency(state.summary?.totalInvested || 0)}</Text>
                <Text style={styles.summaryLabel}>Invested</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{formatCurrency(state.summary?.totalDonated || 0)}</Text>
                <Text style={styles.summaryLabel}>Donated</Text>
              </View>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Round-Ups</Text>
            
            {state.recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    {transaction.roundUpDestination === 'investment' ? (
                      <TrendingUp size={16} color={COLORS.primary} />
                    ) : (
                      <Heart size={16} color={COLORS.error} />
                    )}
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionMerchant}>{transaction.merchantName}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                    </Text>
                  </View>
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

          {/* Coming Soon Note */}
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>📊 More Features Coming Soon</Text>
            <Text style={styles.noteText}>
              We're working on detailed analytics, filtering options, and export functionality for your Round-Ups history.
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
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    ...FONTS.semibold(18),
    color: COLORS.text,
  },
  summaryLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(4),
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: COLORS.background2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  transactionInfo: {
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

export default RoundUpsHistoryScreen;
