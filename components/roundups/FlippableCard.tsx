import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BarChart3 } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { COLORS, FONTS } from '../../constants/theme';
import { normalize, formatCurrency } from '../../utils';
import HoldToFillLiquidProgress from './HoldToFillLiquidProgress';
import AAOIFIBadge from './AAOIFIBadge';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  roundUpsAmount: number;
  investmentsAmount: number;
  zakatAmount: number;
  certified?: boolean;
  onFlip?: (isFlipped: boolean) => void;
  onHoldToFillComplete?: () => void;
}

// Mock data for growth chart
const growthData = [
  { month: 'Jan', amount: 0 },
  { month: 'Feb', amount: 25 },
  { month: 'Mar', amount: 67 },
  { month: 'Apr', amount: 89 },
  { month: 'May', amount: 134 },
  { month: 'Jun', amount: 150 },
];

// Simple SVG chart component
const SimpleGrowthChart: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const maxValue = Math.max(...growthData.map(d => d.amount));
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Create path for the line
  const pathData = growthData.map((point, index) => {
    const x = padding + (index / (growthData.length - 1)) * chartWidth;
    const y = padding + chartHeight - (point.amount / maxValue) * chartHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create path for the area (same as line but closed)
  const areaData = pathData + ` L ${padding + chartWidth} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} />
          <Stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.1} />
        </SvgLinearGradient>
      </Defs>

      {/* Area fill */}
      <Path
        d={areaData}
        fill="url(#chartGradient)"
      />

      {/* Line */}
      <Path
        d={pathData}
        stroke={COLORS.primary}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const FlippableCard: React.FC<Props> = ({
  roundUpsAmount,
  investmentsAmount,
  zakatAmount,
  certified = true,
  onFlip,
  onHoldToFillComplete,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useSharedValue(0);

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const newFlippedState = !isFlipped;
    
    flipAnimation.value = withTiming(newFlippedState ? 1 : 0, {
      duration: 600,
    }, (finished) => {
      if (finished) {
        runOnJS(setIsFlipped)(newFlippedState);
        if (onFlip) {
          runOnJS(onFlip)(newFlippedState);
        }
      }
    });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [0, 180]);
    const opacity = interpolate(flipAnimation.value, [0, 0.5, 1], [1, 0, 0]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [180, 0]);
    const opacity = interpolate(flipAnimation.value, [0, 0.5, 1], [0, 0, 1]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <View style={styles.container}>
      {/* Front Side */}
      <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
        <View style={styles.cardContent}>
          {/* AAOIFI Badge */}
          <View style={styles.badgeContainer}>
            <AAOIFIBadge certified={certified} />
          </View>

          {/* Liquid Progress Component */}
          <View style={styles.liquidProgressContainer}>
            <HoldToFillLiquidProgress
              amount={roundUpsAmount}
              size={160}
              onComplete={onHoldToFillComplete}
              onReset={() => console.log('Progress reset')}
            />
          </View>

          {/* Balance Rows */}
          <View style={styles.balanceRowsContainer}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Round-Ups</Text>
              <Text style={[styles.balanceAmount, { color: COLORS.textLight }]}>
                {formatCurrency(roundUpsAmount)}
              </Text>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Investments</Text>
              <Text style={[styles.balanceAmount, { color: COLORS.primary }]}>
                {formatCurrency(investmentsAmount)}
              </Text>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Auto-Zakat</Text>
              <Text style={[styles.balanceAmount, { color: COLORS.primary }]}>
                {formatCurrency(zakatAmount)}
              </Text>
            </View>

            {/* Tap to see growth journey */}
            <TouchableOpacity style={styles.flipTrigger} onPress={handleFlip}>
              <BarChart3 size={16} color={COLORS.primary} />
              <Text style={styles.flipText}>Tap to see your growth journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Back Side */}
      <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
        <View style={styles.cardContent}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Growth Journey</Text>
            <TouchableOpacity onPress={handleFlip}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <SimpleGrowthChart width={screenWidth - 120} height={120} />
          </View>

          <View style={styles.chartStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(150)}</Text>
              <Text style={styles.statLabel}>Total Growth</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.success }]}>+23.5%</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: normalize(600),
    marginBottom: normalize(16),
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.card,
    borderRadius: normalize(20),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 5,
  },
  frontCard: {
    zIndex: 1,
  },
  backCard: {
    zIndex: 0,
  },
  cardContent: {
    flex: 1,
    padding: normalize(20),
  },
  badgeContainer: {
    marginBottom: normalize(16),
  },
  liquidProgressContainer: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  balanceRowsContainer: {
    backgroundColor: COLORS.background2,
    borderRadius: normalize(10),
    padding: normalize(16),
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(12),
  },
  balanceLabel: {
    ...FONTS.medium(16),
    color: COLORS.text,
  },
  balanceAmount: {
    ...FONTS.semibold(16),
  },
  flipTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(20),
    paddingVertical: normalize(12),
  },
  flipText: {
    ...FONTS.medium(14),
    color: COLORS.primary,
    marginLeft: normalize(8),
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  chartTitle: {
    ...FONTS.semibold(18),
    color: COLORS.text,
  },
  backButton: {
    ...FONTS.medium(14),
    color: COLORS.primary,
  },
  chartContainer: {
    flex: 1,
    backgroundColor: COLORS.background2,
    borderRadius: normalize(12),
    marginBottom: normalize(16),
    overflow: 'hidden',
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});

export default FlippableCard;
