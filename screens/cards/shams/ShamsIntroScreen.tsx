import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, StatusBar, SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { FONTS } from 'constants/theme';

// Design tokens specific to Shams intro per spec
const BG = '#1B1C39';
const TITLE_GRADIENT = ['#D39C90', '#FFFFFF', '#D39B8E'] as const; // 45°
const TITLE_LOCATIONS = [0, 0.5, 1] as const;
const MIZAN_GRADIENT = ['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF'] as const;
const MIZAN_LOCATIONS = [0, 0.14, 0.28, 0.41, 0.5, 0.6, 1] as const;

type ShamsIntroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsIntro'>;

const ShamsIntroScreen: React.FC = () => {
  const navigation = useNavigation<ShamsIntroNavigationProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.03, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]).start(() => setTimeout(startAnimation, 4000));
    };
    startAnimation();
  }, [scaleAnim]);

  const handleUnlockShams = () => {
    Haptics.selectionAsync();
    navigation.navigate({ name: 'ShamsStudio', params: { planId: 'shams' } });
  };

  const MoreLink = () => (
    <Text onPress={() => Alert.alert('Learn more', 'Opens details')} style={{ textDecorationLine: 'underline', fontWeight: '600', color: '#FFFFFF' }}>more&gt;</Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView />

      {/* Pattern background top-right */}
      <Image source={require('../../../assets/cards/shams/shams-pattern.png')} style={styles.pattern} resizeMode="contain" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#FFFFFF', fontSize: 17 }}>‹ Back</Text>
        </TouchableOpacity>
        {/* Title with gradient */}
        <MaskedView
          style={{ height: 80, minWidth: 260 }}
          maskElement={<Text style={[styles.title, { color: '#000' }]}>Begin your Shams{"\n"}journey</Text>}
        >
          <LinearGradient
            colors={TITLE_GRADIENT as any}
            locations={TITLE_LOCATIONS as any}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </MaskedView>
        <Text style={styles.subtitle}>
          <Text style={{ color: '#FFFFFF' }}>Spend </Text>
          <Text style={{ fontStyle: 'italic', color: '#FFFFFF' }}>ethically</Text>
          <Text style={{ color: '#FFFFFF' }}>.</Text>
          <Text> </Text>
          <Text style={{ color: '#C8C9E4' }}>Grow confidently.</Text>
        </Text>

          {/* Cloud gradient circle */}
          <LinearGradient colors={TITLE_GRADIENT as any} locations={TITLE_LOCATIONS as any} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.9 }} style={styles.cloudCircle}>
            <Image source={require('../../../assets/cards/shams/cloud-icon.png')} style={{ width: 23, height: 12 }} />
          </LinearGradient>
        {/* Hero Card container */}
        <View style={styles.heroCard}>

          {/* Header text inside hero with Mizan gradient */}
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <MaskedView style={{ height: 24, minWidth: 220 }} maskElement={<Text style={styles.heroHeader}>Virtual debit + Metal card</Text>}>
              <LinearGradient colors={MIZAN_GRADIENT as any} locations={MIZAN_LOCATIONS as any} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
            </MaskedView>
          </View>

        </View>
        {/* Card image */}
        <Animated.Image source={require('../../../assets/cards/shams/skewed-card.png')} style={[styles.cardImage, { transform: [{ scale: scaleAnim }] }]} resizeMode="contain" />

        {/* Price badge */}
        <View style={styles.priceBadge}>
          <Text style={{color: '#1B1C39', ...FONTS.bold(13) }}>$ 9.99/mo • </Text>
          <Text style={styles.priceText}>Limited mint — 500 cards only</Text>
        </View>

        {/* Benefits */}
        <Text style={styles.sectionTitle}>All Qamar Privileges plus :</Text>
        <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Save & Invest with Robin Habibi AI</Text>
        <View style={{ marginTop: 6 }}>
          <View style={styles.subBulletRow}><View style={styles.subBullet} /><Text style={styles.subText}>24/7 AI market foresight</Text></View>
          <View style={styles.subBulletRow}><View style={styles.subBullet} /><Text style={styles.subText}>Power Round-ups and Many <MoreLink /></Text></View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Spend better - 0% pay later</Text>
        <View style={styles.subBulletRow}><View style={styles.subBullet} /><Text style={styles.subText}>Unlimited credit report access</Text></View>
        <View style={styles.subBulletRow}><View style={styles.subBullet} /><Text style={styles.subText}>Instant 0% riba free pay later & many <MoreLink /> </Text></View>

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Give mindfully & VIP perks</Text>
        <View style={styles.subBulletRow}><View style={styles.subBullet} /><Text style={styles.subText}>Hand-couriered delivery</Text></View>
        <View style={styles.subBulletRow}><View style={styles.subBullet} /><Text style={styles.subText}>Early access to rare halal deals</Text></View>
        <View style={styles.subBulletRow}><View style={styles.subBullet} /><Text style={styles.subText}>Access to VIP Charity events (Invite Only)</Text></View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleUnlockShams}>
          <LinearGradient colors={TITLE_GRADIENT as any} locations={TITLE_LOCATIONS as any} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.ctaButton}>
            <Text style={styles.ctaText}>Unlock Shams</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CARD_HEIGHT = 216;

const styles = StyleSheet.create({
  pattern: { position: 'absolute', top: 0, right: 0, width: 250, height: 238, opacity: 0.8 },
  backBtn: { alignSelf: 'flex-start',paddingVertical: 12, paddingHorizontal: 4},
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24, marginTop: 60 },
  title: { ...FONTS.semibold(33), color: '#fff', lineHeight: 36 },
  subtitle: { marginTop: 8, fontFamily: 'Poppins', fontSize: 13, color: '#C8C9E4' },
  heroCard: { height: CARD_HEIGHT, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 13, marginTop: 24, paddingHorizontal: 10, paddingTop: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', position: 'relative' },
  cloudCircle: { position: 'absolute', top: 160, left: 10, width: 36, height: 33, borderRadius: 18, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  heroHeader: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: '#fff', textAlign: 'center' },
  cardImage: { position: 'absolute', width: 416, height: '100%', top: -60, left: -12 },
  priceBadge: { marginTop: 10, width: 320, height: 20, borderRadius: 20, backgroundColor: '#E0D2FF',flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  priceText: { ...FONTS.medium(13), color: '#1B1C39' },
  sectionTitle: { marginTop: 16, fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: '#FFFFFF' },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF', marginTop: 7, marginRight: 10 },
  benefitText: { flex: 1, color: '#FFFFFF', fontFamily: 'Poppins', fontSize: 13 },
  subBulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6, marginLeft: 16 },
  subBullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFFFFF', marginTop: 8, marginRight: 10, opacity: 0.7 },
  subText: { flex: 1, color: '#C8C9E4', fontFamily: 'Poppins', fontSize: 12 },
  ctaContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  ctaButton: { height: 55, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#1B1C39', ...FONTS.semibold(18) },
});

export default ShamsIntroScreen;
