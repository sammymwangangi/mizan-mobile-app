import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Animated, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { CTA_GRADIENT, ANALYTICS_EVENTS, SHAMS_TOKENS, SHAMS_FEATURES, BARAKAH_PURPLE } from '../../../constants/shams';
import ShamsCardPreview from '../../../components/cards/shams/ShamsCardPreview';
import ShamsHeader from '../../../components/cards/shams/ShamsHeader';
import { FONTS } from 'constants/theme';
import { ShamsMintingSheet, ShamsCancelSheet, ShamsErrorSheet, ShamsSuccessSheet, TnCSheet } from 'components/cards/shams/ShamsBottomSheets';

type ShamsReviewNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsReview'>;
type ShamsReviewRouteProp = RouteProp<RootStackParamList, 'ShamsReview'>;

interface ToggleSettings {
  smartSpending: boolean;
  fraudProtection: boolean;
  aiPro: boolean;
}

interface FeatureToggles {
  smartSpend: boolean;
  fraudShield: boolean;
  robinAI: boolean;
  ethicalPillars: boolean;
}

const ShamsReviewScreen: React.FC = () => {
  const navigation = useNavigation<ShamsReviewNavigationProp>();
  const route = useRoute<ShamsReviewRouteProp>();
  const { planId, selectedMetal, selectedColor, deliveryAddress } = route.params;

  const [features, setFeatures] = useState<FeatureToggles>({
    smartSpend: false,
    fraudShield: false,
    robinAI: false,
    ethicalPillars: false,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTnc, setShowTnc] = useState(false);
  const [showMinting, setShowMinting] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Simulate minting progress
  useEffect(() => {
    if (!showMinting) return;

    const interval = setInterval(() => {
      setMintingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowMinting(false);
          setShowSuccess(true);
          return 100;
        }
        return prev + 2; // Increment by 2% every 100ms (completes in ~5 seconds)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showMinting]);

  const handleFeatureToggle = (featureId: keyof FeatureToggles) => {
    setFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
    Haptics.selectionAsync();
  };

  const handleTermsToggle = () => {
    // Open the T&C modal instead of toggling acceptance immediately
    setShowTnc(true);
    // PostHog.capture?.(QAMAR_ANALYTICS.CARD_TNC_OPEN);
    Haptics.selectionAsync();
  };

  // Minting flow handlers and effects (modal-based on this screen)
  const handleMintingCancel = () => {
    setShowCancel(true);
  };

  const handleKeepMinting = () => {
    setShowCancel(false);
  };

  const handleCancelOrder = () => {
    setShowCancel(false);
    setShowMinting(false);
    navigation.goBack();
  };

  const handleRetryError = () => {
    setShowError(false);
    setShowMinting(true);
    setMintingProgress(0);
  };

  const handleExitError = () => {
    setShowError(false);
    navigation.goBack();
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // PostHog.capture?.(SHAMS_ANALYTICS.CARD_ORDER_SUCCESS);
    const cardId = `shams-${Date.now()}`;
    navigation.navigate('ShamsOrderStatus', { planId, selectedMetal, selectedColor, cardId });
  };

  const handleOrderCard = () => {
    if (!termsAccepted) {
      // Disabled-tap flashes red outline around T&C switch
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    Haptics.selectionAsync();

    // Track analytics
    // PostHog.capture?.(QAMAR_ANALYTICS.CARD_ORDER_SUBMIT, {
    //   plan: 'qamar',
    //   toggles: features
    // });

    // Start modal-based minting flow on this screen
    setShowMinting(true);
    setMintingProgress(0);
  };

  const FeatureToggle: React.FC<{
    feature: typeof SHAMS_FEATURES[0],
    value: boolean,
    onToggle: () => void
  }> = ({ feature, value, onToggle }) => {
    const parts = (feature.description || '').split('\n');
    const hasExample = parts.length > 1;
    return (
      <View className="flex-row items-center justify-between py-4">
        <View className="flex-1 mr-4">
          <Text style={{ ...FONTS.semibold(15), color: '#F5F5FC' }}>
        {feature.name}
          </Text>
          {!!parts[0] && (
        <Text style={{ ...FONTS.medium(9), color: '#F5F5FC', marginTop: 4 }}>
          {parts[0]}
        </Text>
          )}
          {hasExample && (
        <Text style={{ ...FONTS.medium(9), color: '#94A3B8', fontStyle: 'italic', marginTop: 4 }}>
          {parts[1]}
        </Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#1B8800' }}
          thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
          ios_backgroundColor="#E5E7EB"
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // increases thumb/track size
        />
      </View>
    );
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: SHAMS_TOKENS.background }}>
        <View>

          <ShamsHeader
            title="Review & Order"
            subtitle="Let's personalise your card"
            step={3}
            onBack={() => navigation.goBack()}
          />

          {/* Bottom Sheets (modals) */}
          <ShamsMintingSheet
            visible={showMinting}
            onClose={() => setShowMinting(false)}
            progress={mintingProgress}
            onCancel={handleMintingCancel}
          />

          <ShamsCancelSheet
            visible={showCancel}
            onClose={() => setShowCancel(false)}
            onKeep={handleKeepMinting}
            onCancel={handleCancelOrder}
          />

          <ShamsErrorSheet
            visible={showError}
            onClose={() => setShowError(false)}
            onRetry={handleRetryError}
            onExit={handleExitError}
          />

          <ShamsSuccessSheet
            visible={showSuccess}
            onClose={() => setShowSuccess(false)}
            onComplete={handleSuccessComplete}
          />
        </View>

        {/* Content */}
        <ScrollView>
          <View className="flex-1 px-5">
            {/* Card Preview */}
            <View className="items-center mb-8">
              <ShamsCardPreview metalId={selectedMetal} playSheen />
            </View>

            {/* Feature Toggles */}
            <View className="mb-2">
              <View>
                {SHAMS_FEATURES.map((feature, index) => (
                  <View key={feature.id}>
                    <FeatureToggle
                      feature={feature}
                      value={features[feature.id as keyof FeatureToggles]}
                      onToggle={() => handleFeatureToggle(feature.id as keyof FeatureToggles)}
                    />
                    {index < SHAMS_FEATURES.length - 1 && (
                      <View className="h-px bg-gray-400" />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Terms & Conditions */}
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <View className="flex-row items-center justify-between py-4">
                <Text style={{ ...FONTS.semibold(14), color: '#F5F5FC' }}>
                  I agree to the Terms & Conditions
                </Text>
                <Switch
                  value={termsAccepted}
                  onValueChange={handleTermsToggle}
                  trackColor={{ false: '#E5E7EB', true: '#1B8800' }}
                  thumbColor={termsAccepted ? '#FFFFFF' : '#F3F4F6'}
                  ios_backgroundColor="#E5E7EB"
                  style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                />
              </View>
            </Animated.View>
          </View>
        </ScrollView>

        {/* CTA Button */}
        <View className="px-5 pb-8">
          <Animated.View
            style={{
              transform: [{ translateX: shakeAnim }],
            }}
          >
            <TouchableOpacity
              onPress={handleOrderCard}
              activeOpacity={0.9}
              className="w-full"
            >
              <LinearGradient
                colors={termsAccepted ? CTA_GRADIENT.colors : ['#D39C90', '#FFFFFF', '#D39B8E']}
                start={CTA_GRADIENT.start}
                end={CTA_GRADIENT.end}
                className={`h-14 ${!termsAccepted ? 'opacity-50' : ''
                  }`}
                  style={{ borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text className="text-white font-semibold text-lg">
                  Enter the Gold Club
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* T&C Sheet */}
      <TnCSheet
        visible={showTnc}
        onClose={() => setShowTnc(false)}
        onAgree={() => { setTermsAccepted(true); setShowTnc(false); }}
        onDecline={() => { setShowTnc(false); navigation.goBack(); }}
      />
    </>
  );
};

export default ShamsReviewScreen;
