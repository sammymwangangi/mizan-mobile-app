import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { SHAMS_TOKENS } from '../../../constants/shams';

interface Props {
  title: string;
  subtitle?: string;
  step?: 1 | 2 | 3; // progress dots, total fixed at 3
  onBack: () => void;
}

const DOTS = 3 as const;

const ShamsHeader: React.FC<Props> = ({ title, subtitle, step = 1, onBack }) => {
  return (
    <View style={styles.container}>
      {/* Shared pattern background */}
      <Image source={SHAMS_TOKENS.pattern} style={styles.pattern} resizeMode="contain" />

      {/* Top row */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={{ color: '#FFFFFF' }}>‹ Back</Text>
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      {/* Title */}
      <MaskedView
        style={{ height: 60, minWidth: 260, alignSelf: 'flex-start' }}
        maskElement={<Text style={[styles.titleText, { color: '#000' }]}>{title}</Text>}
      >
        <LinearGradient
          colors={SHAMS_TOKENS.headingGradient.colors as any}
          locations={SHAMS_TOKENS.headingGradient.locations as any}
          start={SHAMS_TOKENS.headingGradient.start as any}
          end={SHAMS_TOKENS.headingGradient.end as any}
          style={{ flex: 1 }}
        />
      </MaskedView>

      {!!subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: DOTS }).map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i < step ? '#D4AF37' : 'rgba(255,255,255,0.3)' }]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  pattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: 238,
    opacity: 0.8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  titleText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: '#fff',
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#C8C9E4',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default ShamsHeader;

