import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryArea, VictoryTheme, VictoryAxis } from 'victory-native';
import { COLORS } from '../../constants/theme';

interface RoundUpsChartProps {
  data: Array<{ x: string; y: number }>;
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const RoundUpsChart: React.FC<RoundUpsChartProps> = ({
  data,
  width = screenWidth - 40,
  height = 200,
}) => {
  return (
    <View style={styles.container}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        padding={{ left: 50, top: 20, right: 20, bottom: 50 }}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `$${t}`}
          style={{
            tickLabels: { fontSize: 12, fill: COLORS.textLight },
            grid: { stroke: COLORS.border, strokeWidth: 0.5 },
          }}
        />
        <VictoryAxis
          style={{
            tickLabels: { fontSize: 12, fill: COLORS.textLight },
            grid: { stroke: COLORS.border, strokeWidth: 0.5 },
          }}
        />
        <VictoryArea
          data={data}
          style={{
            data: {
              fill: COLORS.primary,
              fillOpacity: 0.3,
              stroke: COLORS.primary,
              strokeWidth: 2,
            },
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundUpsChart;
