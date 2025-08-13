import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import NoorCardPreview from '../../../components/cards/noor/NoorCardPreview';
import { BARAKAH_PURPLE, NOOR_COLORS } from '../../../constants/noor';
import { FONTS } from 'constants/theme';
import type { RootStackParamList } from '../../../navigation/types';
import { ConfettiBurst } from '../../../components/shared/AnimatedComponents';
import { normalize } from 'utils/responsive';

// Types
export type NoorOrderStatusNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NoorOrderStatus'>;
export type NoorOrderStatusRouteProp = RouteProp<RootStackParamList, 'NoorOrderStatus'>;

const PointerTriangle: React.FC<{ size?: number }> = ({ size = 12 }) => {
  // simple purple pointer/arrow graphic
  return (
    <View
      style={{
        position: 'absolute',
        top: -10,
        right: 24,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#A276FF',
      }}
    />
  );
};

const StatusDot: React.FC<{ active?: boolean }>= ({ active }) => (
  <View
    style={{
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: active ? BARAKAH_PURPLE : '#DAD5FF',
      borderWidth: active ? 0 : 2,
      borderColor: '#CFC8FF',
    }}
  />
);

const NoorOrderStatusScreen: React.FC = () => {
  const navigation = useNavigation<NoorOrderStatusNavigationProp>();
  const route = useRoute<NoorOrderStatusRouteProp>();
  const { selectedColor, cardId } = route.params;


  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      {/* Confetti on load; positioned overlayed but non-interactive */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <ConfettiBurst visible={true} />
      </View>
      <View className="px-6 pt-12 pb-3">
        <Text style={{ ...FONTS.semibold(32), color: '#0F172A', marginTop: 8 }}>Mabourk Habibi Your Card’s Ready!</Text>
        <Text style={{ ...FONTS.body4, color: '#6B7280', marginTop: 6 }}>
          Here’s your shiny new Noor card. Add funds to start spending right away.
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
        {/* Card Preview */}
        <View style={{ marginTop: 10, marginBottom: 16 }}>
          <NoorCardPreview
            color={(NOOR_COLORS.find(c => c.id === selectedColor) || null)}
            playSheen={true}
            expiryText="Exp 12/2026"
          />
        </View>

          

        
      </ScrollView>

      {/* Bottom CTA */}
      <TouchableOpacity onPress={() => navigation.navigate('FundCard', { cardId, selectedColor })} activeOpacity={0.9} style={{ marginVertical: 100, marginHorizontal: 20 }}>
        <LinearGradient
          colors={[BARAKAH_PURPLE, '#9F7AFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ ...FONTS.bold(16), color: '#FFFFFF' }}>Fund to Activate Card</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CardsDashboard')}
            style={[
              styles.ctaButton,
              { height: normalize(55), backgroundColor: 'E0D2FF', marginVertical: 40, marginHorizontal: 20 },
            ]}
          >
            <Text style={styles.ctaText}>I’ll do it later</Text>
          </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ctaButton: {
      position: 'absolute',
      left: normalize(2),
      right: normalize(2),
      bottom: normalize(2),
      height: normalize(46),
      borderRadius: normalize(25),
      borderWidth: 1,
      borderColor: '#A276FF',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
    },
    ctaText: {
      ...FONTS.semibold(15),
      color: '#1B1C39',
    },
});

export default NoorOrderStatusScreen;

