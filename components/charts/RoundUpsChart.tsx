import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { CartesianChart, Area } from 'victory-native';
import { COLORS } from '../../constants/theme';

interface RoundUpsChartProps {
  data: { month: string; amount: number }[];
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const RoundUpsChart: React.FC<RoundUpsChartProps> = ({
  data,
  width = screenWidth - 40,
  height = 200,
}) => {
  // Victory Native XL (v40+) uses the new CartesianChart API
  // This implementation follows the latest syntax from Victory Native XL documentation

  return (
    <View style={[styles.container, { width, height }]}>
      <CartesianChart
        data={data}
        xKey="month"
        yKeys={["amount"]}
        padding={16}
        domain={{ y: [0] }}
      >
        {({ points, chartBounds }) => (
          <Area
            points={points.amount}
            y0={chartBounds.bottom}
            color={COLORS.primary}
            opacity={0.3}
          />
        )}
      </CartesianChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default RoundUpsChart;
