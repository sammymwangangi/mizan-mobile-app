import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { FONTS } from 'constants/theme';

// Simple normalize function to replace the import
const normalize = (size: number) => size;
const { width } = Dimensions.get('window');

type CardClaimNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardClaim'>;

const CardClaimScreen: React.FC = () => {
  const navigation = useNavigation<CardClaimNavigationProp>();
  const scale = useRef(new Animated.Value(1)).current;

  // Card subtle animation (1 -> 1.03 scale)
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        })
      ]).start(() => animate());
    };

    animate();
  }, [scale]);

  const handleClaimCard = () => {
    // Analytics event could be added here
    navigation.navigate('PlanSelect');
  };

  // Sizes for responsive layout
  const heroWidth = width - normalize(40);
  const heroHeight = normalize(260);

  return (
    <View className="flex-1 bg-white px-5 pt-10 pb-8">
      {/* Hero Gradient Card */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={["#F9ACFF", "#A276FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: heroWidth,
            height: heroHeight,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: 'center',
            padding: 20
          }}
        >
          {/* Title inside gradient */}
          <Text
            style={{
              position: 'absolute',
              top: 100,
              left: 20,
              zIndex: 3,
              color: 'white',
              ...FONTS.bold(32),
            }}
          >
            Claim your first{"\n"}Mizan Card
          </Text>

          {/* Absolute-positioned cards for stack effect */}
          <View style={{ flex: 1 }}>
            <Image
              source={require('../../assets/cards/claim/claim-green-card.png')}
              style={{
                position: 'absolute',
                width: heroWidth * 0.5,
                height: heroHeight * 0.8,
                left: -heroWidth * 0.135,
                top: heroHeight * 0.1,
                transform: [{ rotate: '0deg' }],
                zIndex: 1,
                resizeMode: 'contain'
              }}
            />
            <Image
              source={require('../../assets/cards/claim/claim-purple-card.png')}
              style={{
                position: 'absolute',
                width: heroWidth * 0.5,
                height: heroHeight * 0.8,
                left: heroWidth * 0.19,
                top: heroHeight * 0.1,
                transform: [{ rotate: '0deg' }],
                zIndex: 2,
                resizeMode: 'contain'
              }}
            />
            <Image
              source={require('../../assets/cards/claim/claim-orange-card.png')}
              style={{
                position: 'absolute',
                width: heroWidth * 0.5,
                height: heroHeight * 0.8,
                right: -heroWidth * 0.135,
                top: heroHeight * 0.10,
                transform: [{ rotate: '0deg' }],
                zIndex: 0,
                resizeMode: 'contain'
              }}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Info Panel overlapping the gradient */}
      <View
        style={{
          marginTop: -58,
          alignSelf: 'center',
          width: heroWidth,
          height: normalize(200),
          borderRadius: 20,
          backgroundColor: 'white',
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation: 2,
        }}
      >
        <Text style={{ color: '#6B7280', marginBottom: 8, ...FONTS.medium(16), }}>
          Bismillah. Begin your journey of{"\n"}
          ethical spending and halal investing <Text>›</Text>
        </Text>
        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 4, height: 4, borderRadius: 3, backgroundColor: '#6D6E8A', marginRight: 8 }} />
            <Text style={{ color: '#6D6E8A',fontStyle:'italic', ...FONTS.body3 }}>30-day risk-free trial</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 4, height: 4, borderRadius: 3, backgroundColor: '#6D6E8A', marginRight: 8 }} />
            <Text style={{ color: '#6D6E8A',fontStyle:'italic', ...FONTS.body3 }}>No Riba. Ever</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 4, height: 4, borderRadius: 3, backgroundColor: '#6D6E8A', marginRight: 8 }} />
            <Text style={{ color: '#6D6E8A',fontStyle:'italic', ...FONTS.body3 }}>First 1,000 users only</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 4, height: 4, borderRadius: 3, backgroundColor: '#6D6E8A', marginRight: 8 }} />
            <Text style={{ color: '#6D6E8A',fontStyle:'italic', ...FONTS.body3 }}>AI Perks</Text>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <View style={{ paddingTop: 16 }} />
      <TouchableOpacity
        onPress={handleClaimCard}
        activeOpacity={0.9}
        style={{
          marginTop: -40,
          height: 45,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#A276FF',
          shadowColor: '#391A73',
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.15,
          shadowRadius: 30,
          elevation: 12,
          alignSelf: 'center',
          width: heroWidth,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Unlock my card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardClaimScreen;
