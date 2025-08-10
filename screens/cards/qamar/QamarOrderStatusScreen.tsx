import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import QamarCardPreview from '../../../components/cards/qamar/QamarCardPreview';
import { BARAKAH_PURPLE, QAMAR_COLORS } from '../../../constants/qamar';
import { FONTS } from 'constants/theme';
import type { RootStackParamList } from '../../../navigation/types';
import { ConfettiBurst } from '../../../components/shared/AnimatedComponents';

// Types
export type QamarOrderStatusNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QamarOrderStatus'>;
export type QamarOrderStatusRouteProp = RouteProp<RootStackParamList, 'QamarOrderStatus'>;

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

const QamarOrderStatusScreen: React.FC = () => {
  const navigation = useNavigation<QamarOrderStatusNavigationProp>();
  const route = useRoute<QamarOrderStatusRouteProp>();
  const { selectedColor, cardId } = route.params;


  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      {/* Confetti on load; positioned overlayed but non-interactive */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <ConfettiBurst visible={true} />
      </View>
      <View className="px-5 pt-12 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ ...FONTS.semibold(14), color: '#6B4EFF' }}>Home</Text>
        </TouchableOpacity>
        <Text style={{ ...FONTS.bold(28), color: '#0F172A', marginTop: 8 }}>Mabrook Habibi!</Text>
        <Text style={{ ...FONTS.medium(12), color: '#6B7280', marginTop: 6 }}>
          Step 3 / 3 - Your card is being packed with baraka and will be dispatched shortly, in shaa Allah.
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
        {/* Card Preview */}
        <View style={{ marginTop: 10, marginBottom: 16 }}>
          <QamarCardPreview
            color={(QAMAR_COLORS.find(c => c.id === selectedColor) || null)}
            playSheen={true}
            expiryText="Exp 12/2026"
          />
        </View>

        {/* Shukran card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            marginBottom: 16,
            // Shadow to match app's card shadow
            shadowColor: '#6943AF',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 20 },
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <PointerTriangle />
          <Text style={{ ...FONTS.bold(22), color: '#0F172A', marginBottom: 10 }}>Shukran for the order</Text>
          <Text style={{ ...FONTS.medium(14), color: '#6B7280' }}>
            Your free virtual card is live. Activate your physical card with this button once it arrives.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('FundCard', { cardId, selectedColor })}
            activeOpacity={0.9}
            style={{ alignSelf: 'flex-start', marginTop: 16 }}
          >
            <View
              style={{
                height: 40,
                paddingHorizontal: 18,
                borderRadius: 20,
                backgroundColor: '#E9D8FD',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...FONTS.semibold(14), color: '#4C1D95' }}>Activate now</Text>
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
          <Text style={{ ...FONTS.bold(20), color: '#0F172A', marginBottom: 10 }}>Track Order Status</Text>

          {/* Horizontal line with dots */}
          <View style={{ marginTop: 6, marginBottom: 12 }}>
            <View style={{ height: 6, backgroundColor: '#E9E3FF', borderRadius: 3, position: 'relative' }} />
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
              <Text style={{ ...FONTS.bold(14), color: '#4C1D95' }}>Ordered</Text>
              <Text style={{ ...FONTS.medium(12), color: '#64748B' }}>Nov 06th</Text>
            </View>
            <View style={{ alignItems: 'center', width: '33%' }}>
              <Text style={{ ...FONTS.bold(14), color: '#64748B' }}>Dispatched</Text>
            </View>
            <View style={{ alignItems: 'center', width: '33%' }}>
              <Text style={{ ...FONTS.bold(14), color: '#64748B' }}>Delivery</Text>
              <Text style={{ ...FONTS.medium(12), color: '#64748B' }}>est. Nov 10th</Text>
            </View>
          </View>

          {/* Bottom CTA */}
          <TouchableOpacity onPress={() => navigation.navigate('CardsDashboard')} activeOpacity={0.9} style={{ marginTop: 16 }}>
            <LinearGradient
              colors={[BARAKAH_PURPLE, '#9F7AFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ ...FONTS.bold(16), color: '#FFFFFF' }}>Start using virtual card</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default QamarOrderStatusScreen;

