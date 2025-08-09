import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { normalize } from '../../utils';
import { ArrowLeft } from 'lucide-react-native';

// Navigation type
type PlanSelectNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlanSelect'>;

// Button with press feedback matching spec
const CTAButton: React.FC<{ title: string; onPress: () => void } & { style?: any }> = ({ title, onPress, style }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[
        styles.ctaButton,
        { backgroundColor: pressed ? '#7541FF' : '#FFFFFF' },
        style,
      ]}
    >
      <Text style={styles.ctaText}>{title}</Text>
    </TouchableOpacity>
  );
};

const PlanSelectScreen: React.FC = () => {
  const navigation = useNavigation<PlanSelectNavigationProp>();

  const handleNoor = () => navigation.navigate('CardStudio', { planId: 'noor' });
  const handleQamar = () => navigation.navigate('QamarIntro', { planId: 'qamar' });
  const handleShams = () => navigation.navigate('ShamsIntro');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ paddingVertical: normalize(32) }} />
      {/* Header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}
        >
          <Text style={{ color: '#007AFF', ...FONTS.body3 }}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome to Card Studio</Text>
        <View style={{ width: normalize(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Noor */}
        <View style={styles.card}>
          <View style={styles.textBlock}>
            <Text style={styles.planTitle}>Noor - Lightest way to spend</Text>
            <Text style={styles.planDesc}>
              Forever-free virtual card.{"\n"}Mint in seconds{"\n"}Track barakah spend.
            </Text>
          </View>
          <Image
            source={require('../../assets/cards/card-studio/noor-mockup.png')}
            style={[styles.noorImage]}
            resizeMode="contain"
          />
          <CTAButton title="Get Noor" onPress={handleNoor} />
        </View>

        {/* Qamar */}
        <View style={styles.card}>
          <View style={styles.textBlock}>
            <Text style={styles.planTitle}>Qamar - Guided by the Moon</Text>
            <Text style={styles.planDesc}>
              Your next-level physical card for effortless halal investing—powered by a sprinkle of AI.
            </Text>
          </View>
          <Image source={require('../../assets/cards/card-studio/qamar-gradient-card.png')} style={styles.qamarGradient} resizeMode="contain" />
          <Image source={require('../../assets/cards/card-studio/qamar-black-card.png')} style={styles.qamarBlack} resizeMode="contain" />
          <Image source={require('../../assets/cards/card-studio/qamar-bottom-card.png')} style={styles.qamarBottom} resizeMode="contain" />
          <CTAButton title="Get Qamar" onPress={handleQamar} />
        </View>

        {/* Shams */}
        <View style={styles.card}>
          <View style={styles.textBlock}>
            <Text style={styles.planTitle}>Shams  - Rise with the Sun</Text>
            <Text style={styles.planDesc}>
              Metal prestige & cashback{`\n`}auto-donated to waqf –{`\n`}Invest like a veteran with purpose.
            </Text>
          </View>
          <Image source={require('../../assets/cards/card-studio/shams-metal-card.png')} style={styles.shamsMetal} resizeMode="contain" />
          <Image source={require('../../assets/cards/card-studio/shams-pink-card.png')} style={styles.shamsPink} resizeMode="contain" />
          <Image source={require('../../assets/cards/card-studio/shams-blue-card.png')} style={styles.shamsBlue} resizeMode="contain" />
          <CTAButton title="Get Shams" onPress={handleShams} />
        </View>
      </ScrollView>

      <View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}
        >
          <Text style={{ color: '#E0D2FF', ...FONTS.body3, alignSelf: 'center' }}>Already got a card? Link it here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CARD_HEIGHT = normalize(180);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background2,
    paddingBottom: normalize(24),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginVertical: normalize(18),
  },
  backButton: {
    width: normalize(24),
    height: normalize(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...FONTS.semibold(32),
    color: '#1B1C39',
    textAlign: 'center',
    width: normalize(200),
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: normalize(24),
  },
  card: {
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(25),
    marginBottom: normalize(27),
    padding: normalize(16),
    overflow: 'hidden',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 15,
  },
  textBlock: {
    width: '62%',
  },
  planTitle: {
    ...FONTS.semibold(15),
    color: '#1B1C39',
    marginBottom: normalize(8),
  },
  planDesc: {
    ...FONTS.body5,
    color: '#6D6E8A',
  },
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
  // Noor imagery
  noorImage: {
    position: 'absolute',
    right: normalize(2),
    top: normalize(16),
    width: normalize(120),
    height: CARD_HEIGHT - normalize(40),
  },
  // Qamar layering
  qamarGradient: {
    position: 'absolute',
    right: -normalize(25),
    top: -normalize(2),
    width: normalize(160),
    height: normalize(140),
    transform: [{ rotate: '0deg' }],
  },
  qamarBlack: {
    position: 'absolute',
    right: normalize(35),
    top: normalize(56),
    width: normalize(140),
    height: normalize(140),
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  qamarBottom: {
    position: 'absolute',
    right: -normalize(47),
    bottom: -normalize(20),
    width: normalize(140),
    height: normalize(100),
    transform: [{ rotate: '0deg' }],
    zIndex: 1,
  },
  // Shams layering
  shamsMetal: {
    position: 'absolute',
    right: -normalize(27),
    top: -normalize(16),
    width: normalize(150),
    height: normalize(150),
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  shamsPink: {
    position: 'absolute',
    right: normalize(27),
    top: normalize(50),
    width: normalize(140),
    height: normalize(140),
    transform: [{ rotate: '0deg' }],
    zIndex: 3,
  },
  shamsBlue: {
    position: 'absolute',
    right: -normalize(48),
    bottom: -normalize(8),
    width: normalize(130),
    height: normalize(96),
    transform: [{ rotate: '0deg' }],
    zIndex: 1,
  },
});

export default PlanSelectScreen;
