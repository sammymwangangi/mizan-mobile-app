import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import RoundUpsChart from '../components/charts/RoundUpsChart';
import { normalize } from '../utils';

// Example component demonstrating how to use the updated RoundUpsChart
// with the latest Victory Native XL syntax

const RoundUpsChartExample = () => {
  // Mock data for Round-Ups over time
  const roundUpsData = [
    { month: 'Jan', amount: 45.50 },
    { month: 'Feb', amount: 67.25 },
    { month: 'Mar', amount: 89.75 },
    { month: 'Apr', amount: 123.40 },
    { month: 'May', amount: 156.80 },
    { month: 'Jun', amount: 189.25 },
  ];

  // Mock data for investment growth
  const investmentData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1350 },
    { month: 'Mar', amount: 1480 },
    { month: 'Apr', amount: 1620 },
    { month: 'May', amount: 1750 },
    { month: 'Jun', amount: 1890 },
  ];

  // Mock data for charity donations
  const charityData = [
    { month: 'Jan', amount: 25.00 },
    { month: 'Feb', amount: 42.50 },
    { month: 'Mar', amount: 38.75 },
    { month: 'Apr', amount: 55.20 },
    { month: 'May', amount: 67.30 },
    { month: 'Jun', amount: 71.85 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Round-Ups Charts Examples</Text>
      <Text style={styles.subtitle}>
        Using Victory Native XL with latest syntax
      </Text>

      {/* Round-Ups Monthly Progress */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Round-Ups</Text>
        <Text style={styles.chartDescription}>
          Your spare change savings over the last 6 months
        </Text>
        <RoundUpsChart
          data={roundUpsData}
          width={SIZES.width - 40}
          height={200}
        />
      </View>

      {/* Investment Portfolio Growth */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Investment Portfolio Growth</Text>
        <Text style={styles.chartDescription}>
          Total portfolio value from Round-Ups investments
        </Text>
        <RoundUpsChart
          data={investmentData}
          width={SIZES.width - 40}
          height={200}
        />
      </View>

      {/* Charity Donations */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Charity Donations</Text>
        <Text style={styles.chartDescription}>
          Monthly donations from your Round-Ups
        </Text>
        <RoundUpsChart
          data={charityData}
          width={SIZES.width - 40}
          height={200}
        />
      </View>

      {/* Usage Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Use RoundUpsChart</Text>
        
        <Text style={styles.instructionsSubtitle}>1. Import the component:</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {`import RoundUpsChart from '../components/charts/RoundUpsChart';`}
          </Text>
        </View>

        <Text style={styles.instructionsSubtitle}>2. Prepare your data:</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {`const data = [
  { month: 'Jan', amount: 45.50 },
  { month: 'Feb', amount: 67.25 },
  // ... more data points
];`}
          </Text>
        </View>

        <Text style={styles.instructionsSubtitle}>3. Use the component:</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {`<RoundUpsChart
  data={data}
  width={300}
  height={200}
/>`}
          </Text>
        </View>

        <Text style={styles.note}>
          <Text style={styles.noteTitle}>Note: </Text>
          This component uses Victory Native XL (v40+) with the latest CartesianChart API. 
          The data format requires objects with &apos;month&apos; and &apos;amount&apos; properties.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
    paddingBottom: normalize(40),
  },
  title: {
    ...FONTS.semibold(24),
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: normalize(32),
  },
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(20),
    padding: normalize(20),
    marginBottom: normalize(24),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 5,
  },
  chartTitle: {
    ...FONTS.semibold(18),
    color: COLORS.text,
    marginBottom: normalize(8),
  },
  chartDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: normalize(20),
  },
  instructionsContainer: {
    backgroundColor: COLORS.background2,
    borderRadius: normalize(16),
    padding: normalize(20),
    marginTop: normalize(20),
  },
  instructionsTitle: {
    ...FONTS.semibold(18),
    color: COLORS.text,
    marginBottom: normalize(16),
  },
  instructionsSubtitle: {
    ...FONTS.medium(14),
    color: COLORS.text,
    marginTop: normalize(16),
    marginBottom: normalize(8),
  },
  codeBlock: {
    backgroundColor: COLORS.border,
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(8),
  },
  codeText: {
    ...FONTS.body5,
    color: COLORS.textDark,
    fontFamily: 'monospace',
  },
  note: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: normalize(16),
    lineHeight: normalize(20),
  },
  noteTitle: {
    ...FONTS.semibold(14),
    color: COLORS.primary,
  },
});

export default RoundUpsChartExample;
