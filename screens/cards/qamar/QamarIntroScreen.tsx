import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { COLORS, FONTS, SIZES } from '../../../constants/theme';
import { normalize } from '../../../utils';
import { ArrowLeft } from 'lucide-react-native';

type QamarIntroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QamarIntro'>;
type QamarIntroRouteProp = RouteProp<RootStackParamList, 'QamarIntro'>;

const QamarIntroScreen: React.FC = () => {
  const navigation = useNavigation<QamarIntroNavigationProp>();
  const route = useRoute<QamarIntroRouteProp>();
  const { planId } = route.params;

  const handleCreateCard = () => {
    Haptics.selectionAsync();
    navigation.navigate('QamarStudio', { planId });
  };

  const benefits: string[] = [
    '30-day risk-free trial',
    'Refer a friend, you both get $10 instantly',
    '0 % Pay-Later unlocked by good habits',
    'Habibi AI coach : first 3 insights free',
    'Round-ups simple Investing',
    'Auto-sadaqah pots.'
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title and subtitle */}
        <Text style={styles.title}>Claim Qamar Card</Text>
        <Text style={styles.subtitle}>
          Start your soft investing journey to{`\n`}unlock the moon
        </Text>

        {/* Main card container */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <Image source={require('../../../assets/cards/claim/cloud-icon.png')} style={styles.cloudIcon} />
            <Text style={styles.heroHeaderText}>Physical + Virtual Card</Text>
          </View>
          {/* Credit card image (already rotated) */}
          <Image
            source={require('../../../assets/cards/claim/claim-qamar.png')}
            style={styles.qamarImage}
            resizeMode="contain"
          />
        </View>

        {/* Benefits Section */}
        <Text style={styles.sectionTitle}>Your Qamar Card Benefits</Text>
        <Text style={styles.benefitsIntro}>All in Noor plan plus:</Text>
        <View style={{ marginTop: normalize(8) }}>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.bullet} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={handleCreateCard}>
          <Text style={styles.ctaText}>Create my Qamar card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HERO_HEIGHT = normalize(216);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SIZES.padding, paddingTop: normalize(4), paddingBottom: normalize(8) },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: normalize(6) },
  backLabel: { ...FONTS.medium(14), color: '#7A4BFF' },

  scrollContent: { paddingHorizontal: SIZES.padding, paddingBottom: normalize(20) },
  title: { ...FONTS.semibold(32), color: '#1B1C39', marginTop: normalize(4) },
  subtitle: { ...FONTS.medium(12), color: '#6D6E8A', marginTop: normalize(6) },

  heroCard: {
    height: HERO_HEIGHT,
    backgroundColor: '#EFEFEF',
    borderRadius: normalize(13),
    marginTop: normalize(16),
    padding: normalize(16),
    overflow: 'hidden',
  },
  heroHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  cloudIcon: { width: normalize(32), height: normalize(32), marginRight: normalize(10) },
  heroHeaderText: { ...FONTS.semibold(16), color: '#ABACBE' },
  qamarImage: {
    position: 'absolute',
    width: '85%',
    height: HERO_HEIGHT,
    bottom: normalize(6),
    left: normalize(32),
  },

  sectionTitle: { ...FONTS.semibold(16), color: '#000000', marginTop: normalize(18) },
  benefitsIntro: { ...FONTS.body4, color: '#1B1C39', marginTop: normalize(10) },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: normalize(8) },
  bullet: { width: normalize(6), height: normalize(6), borderRadius: 3, backgroundColor: '#A276FF', marginTop: normalize(8), marginRight: normalize(10) },
  benefitText: { ...FONTS.body4, color: '#1B1C39', flex: 1 },

  ctaContainer: { paddingHorizontal: SIZES.padding, paddingBottom: normalize(16) },
  ctaButton: { height: normalize(55), borderRadius: normalize(25), backgroundColor: '#A276FF', alignItems: 'center', justifyContent: 'center' },
  ctaText: { ...FONTS.semibold(16), color: COLORS.textWhite },
});

export default QamarIntroScreen;
