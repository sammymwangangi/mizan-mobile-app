import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ShamsCardPreview from '../../../components/cards/shams/ShamsCardPreview';
import ShamsHeader from '../../../components/cards/shams/ShamsHeader';
import { CTA_GRADIENT, SHAMS_TOKENS } from '../../../constants/shams';
import { FONTS } from 'constants/theme';
import type { RootStackParamList } from '../../../navigation/types';
import { ConfettiBurst } from '../../../components/shared/AnimatedComponents';

// Types
export type ShamsOrderStatusNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsOrderStatus'>;
export type ShamsOrderStatusRouteProp = RouteProp<RootStackParamList, 'ShamsOrderStatus'>;

const PointerTriangle: React.FC<{ size?: number }> = ({ size = 12 }) => {
  // Rose gold pointer/arrow graphic
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
        borderBottomColor: '#DDA79B',
      }}
    />
  );
};

const StatusDot: React.FC<{ active?: boolean }> = ({ active }) => (
  <View
    style={{
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: active ? '#DDA79B' : '#E5D4C8',
      borderWidth: active ? 0 : 2,
      borderColor: '#D9C4B5',
    }}
  />
);

const ShamsOrderStatusScreen: React.FC = () => {
  const navigation = useNavigation<ShamsOrderStatusNavigationProp>();
  const route = useRoute<ShamsOrderStatusRouteProp>();
  const { selectedMetal, selectedColor, cardId } = route.params;

  return (
    <View className="flex-1" style={{ backgroundColor: SHAMS_TOKENS.background }}>
      {/* Confetti on load; positioned overlayed but non-interactive */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
        <ConfettiBurst visible={true} colors={['#DDA79B', '#F8E7A0']} />
      </View>

      {/* Header */}
      <ShamsHeader
        title="Mabrouk Habibi!"
        subtitle="Your card is being packed with baraka and will be dispatched shortly, in shaa Allah."
        step={3}
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
        {/* Card Preview - Portrait orientation */}
        <View style={{ marginTop: 10, marginBottom: 16, alignItems: 'center' }}>
          <ShamsCardPreview
            metalId={selectedMetal}
            playSheen={true}
            expiryText="World Elite"
          />
        </View>

        {/* Welcome card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 20 },
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <PointerTriangle />
          <Text style={{ ...FONTS.bold(22), color: '#1B1C39', marginBottom: 10 }}>
            Welcome to Shams Golden Club
          </Text>
          <Text style={{ ...FONTS.medium(14), color: '#6D6E8A' }}>
            Your free virtual card is live. Activate your physical card with this button once it arrives.
          </Text>

          {/* Activate button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ShamsFund', { selectedMetal, selectedColor, cardId })}
            activeOpacity={0.9}
            style={{ marginTop: 16 }}
          >
            <View
              style={{
                height: 56,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F8',
              }}
            >
              <Text style={{ ...FONTS.bold(16), color: '#6D6E8A' }}>Activate now</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Track Order Status */}
        <View
          style={{
            backgroundColor: '#F6F5F8',
            borderRadius: 24,
            paddingTop: 18,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <Text style={{ ...FONTS.bold(20), color: '#1B1C39', marginBottom: 10 }}>Track Order Status</Text>

          {/* Horizontal line with dots */}
          <View style={{ marginTop: 6, marginBottom: 12 }}>
            <View style={{ height: 6, backgroundColor: '#E9E3E0', borderRadius: 3, position: 'relative' }} />
            <View style={{ position: 'absolute', top: -4, left: 16 }}>
              <StatusDot active />
            </View>
            <View style={{ position: 'absolute', top: -4, left: '50%', marginLeft: -7 }}>
              <StatusDot />
            </View>
            <View style={{ position: 'absolute', top: -4, right: 16 }}>
              <StatusDot />
            </View>
          </View>

          {/* Labels */}
          <View className="flex-row justify-between">
            <View style={{ alignItems: 'center', width: '33%' }}>
              <Text style={{ ...FONTS.bold(14), color: '#DDA79B' }}>Ordered</Text>
              <Text style={{ ...FONTS.medium(12), color: '#6D6E8A' }}>Nov 06th</Text>
            </View>
            <View style={{ alignItems: 'center', width: '33%' }}>
              <Text style={{ ...FONTS.bold(14), color: '#6D6E8A' }}>Priority</Text>
              <Text style={{ ...FONTS.bold(14), color: '#6D6E8A' }}>Shipping</Text>
            </View>
            <View style={{ alignItems: 'center', width: '33%' }}>
              <Text style={{ ...FONTS.bold(14), color: '#6D6E8A' }}>Delivery</Text>
              <Text style={{ ...FONTS.medium(12), color: '#6D6E8A' }}>est. Nov 10th</Text>
            </View>
          </View>

          {/* Bottom CTA */}
          <TouchableOpacity onPress={() => navigation.navigate('Home')} activeOpacity={0.9} style={{ marginTop: 16 }}>
            <LinearGradient
              colors={CTA_GRADIENT.colors as any}
              start={CTA_GRADIENT.start as any}
              end={CTA_GRADIENT.end as any}
              style={{ height: 56, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ ...FONTS.bold(16), color: '#1B1C39' }}>Start using virtual card</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShamsOrderStatusScreen;

