import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import QamarCardPreview from '../../../components/cards/qamar/QamarCardPreview';
import { TnCSheet, MintingSheet, CancelSheet, ErrorSheet, SuccessSheet } from '../../../components/cards/qamar/QamarBottomSheets';
import { QAMAR_FEATURES, BARAKAH_PURPLE, QAMAR_ANALYTICS, QAMAR_COLORS } from '../../../constants/qamar';
import { FONTS } from 'constants/theme';

type QamarReviewNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QamarReview'>;
type QamarReviewRouteProp = RouteProp<RootStackParamList, 'QamarReview'>;

interface FeatureToggles {
  smartSpend: boolean;
  fraudShield: boolean;
  robinAI: boolean;
}

const QamarReviewScreen: React.FC = () => {
  const navigation = useNavigation<QamarReviewNavigationProp>();
  const route = useRoute<QamarReviewRouteProp>();
  const { planId, selectedColor, deliveryAddress } = route.params;

  const [features, setFeatures] = useState<FeatureToggles>({
    smartSpend: false,
    fraudShield: false,
    robinAI: false,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTnc, setShowTnc] = useState(false);
  const [showMinting, setShowMinting] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    // PostHog.capture?.(QAMAR_ANALYTICS.CARD_ORDER_SUCCESS);
    const cardId = `qamar-${Date.now()}`;
    navigation.navigate('QamarOrderStatus', { planId, selectedColor, cardId });
  };

  // Auto-progress minting similar to QamarMintingScreen
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (showMinting && mintingProgress < 100) {
      interval = setInterval(() => {
        setMintingProgress(prev => {
          const next = prev + 2; // ~5s total
          if (next % 20 === 0 && next <= 100) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          if (next >= 100) {
            if (interval) clearInterval(interval);
            setTimeout(() => {
              setShowMinting(false);
              setShowSuccess(true);
            }, 500);
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [showMinting, mintingProgress]);

  // Optional: simulate transient error mid-way
  const simulateError = () => {
    if (mintingProgress > 50 && Math.random() < 0.1) {
      setShowMinting(false);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (showMinting) {
      const t = setTimeout(simulateError, 3000);
      return () => clearTimeout(t);
    }
  }, [showMinting, mintingProgress]);

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
    feature: typeof QAMAR_FEATURES[0],
    value: boolean,
    onToggle: () => void
  }> = ({ feature, value, onToggle }) => {
    const parts = (feature.description || '').split('\n');
    const hasExample = parts.length > 1;
    return (
      <View className="flex-row items-center justify-between py-4">
        <View className="flex-1 mr-4">
          <Text style={{ ...FONTS.semibold(14), color: '#0F172A' }}>
            {feature.name}
          </Text>
          {!!parts[0] && (
            <Text style={{ ...FONTS.medium(12), color: '#6B7280', marginTop: 4 }}>
              {parts[0]}
            </Text>
          )}
          {hasExample && (
            <Text style={{ ...FONTS.medium(12), color: '#94A3B8', fontStyle: 'italic', marginTop: 4 }}>
              {parts[1]}
            </Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: BARAKAH_PURPLE }}
          thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
          ios_backgroundColor="#E5E7EB"
        />
      </View>
    );
  };

  return (
    <>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-5 pt-12 pb-[36px]">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ ...FONTS.semibold(14), color: '#6B4EFF' }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ ...FONTS.bold(26), color: '#0F172A', marginTop: 12 }}>Looks good?</Text>
          <Text style={{ ...FONTS.medium(12), color: '#64748B', marginTop: 4 }}>Step 3 / 3 - Review & mint</Text>
        {/* Bottom Sheets (modals) */}
        <MintingSheet
          visible={showMinting}
          onClose={() => setShowMinting(false)}
          progress={mintingProgress}
          onCancel={handleMintingCancel}
        />

        <CancelSheet
          visible={showCancel}
          onClose={() => setShowCancel(false)}
          onKeep={handleKeepMinting}
          onCancel={handleCancelOrder}
        />

        <ErrorSheet
          visible={showError}
          onClose={() => setShowError(false)}
          onRetry={handleRetryError}
          onExit={handleExitError}
        />

        <SuccessSheet
          visible={showSuccess}
          onClose={() => setShowSuccess(false)}
          onComplete={handleSuccessComplete}
        />
        </View>
        {/* Hidden props usage for TypeScript awareness */}
        {/* selectedColor and deliveryAddress used in analytics or future UI; retained intentionally */}

        {/* Content */}
        <View className="flex-1 px-5">

          {/* Card Preview */}
          <View className="items-center mb-4">
            <QamarCardPreview
              color={(QAMAR_COLORS.find(c => c.id === selectedColor) || null)}
              playSheen={true}
              expiryText="Exp 12/2026"
            />
            <TouchableOpacity onPress={() => navigation.navigate('QamarStudio', { planId })}>
              <Text style={{ ...FONTS.medium(12), color: '#7B5CFF', textDecorationLine: 'underline', marginTop: 8, fontStyle: 'italic' }}>Tap to edit card</Text>
            </TouchableOpacity>
          </View>

          {/* Feature Toggles */}
          <View className="mb-6">
            <View className="bg-white">
              {QAMAR_FEATURES.map((feature, index) => (
                <View key={feature.id}>
                  <FeatureToggle
                    feature={feature}
                    value={features[feature.id as keyof FeatureToggles]}
                    onToggle={() => handleFeatureToggle(feature.id as keyof FeatureToggles)}
                  />
                  {index < QAMAR_FEATURES.length - 1 && (
                    <View className="h-px bg-gray-200" />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Terms & Conditions */}
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View className="flex-row items-center justify-between py-4">
              <Text style={{ ...FONTS.semibold(14), color: '#0F172A' }}>
                I agree to the Terms & Conditions
              </Text>
              <Switch
                value={termsAccepted}
                onValueChange={handleTermsToggle}
                trackColor={{ false: '#E5E7EB', true: BARAKAH_PURPLE }}
                thumbColor={termsAccepted ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </Animated.View>


        </View>

        {/* CTA Button */}
        <View className="px-5 pb-8">
          <TouchableOpacity
            onPress={handleOrderCard}
            activeOpacity={0.9}
            className="w-full"
          >
            <LinearGradient
              colors={termsAccepted ? [BARAKAH_PURPLE, '#9F7AFF'] : ['#D1D5DB', '#D1D5DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className={`h-14 rounded-full justify-center items-center ${!termsAccepted ? 'opacity-50' : ''}`}
              style={{ borderRadius: 40 }}
            >
              <Text className="text-white font-semibold text-lg">Order Card</Text>
            </LinearGradient>
            {!termsAccepted && (
              <Text className="text-gray-400 text-xs text-center mt-2">Accept T&Cs to continue</Text>
            )}
          </TouchableOpacity>
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

export default QamarReviewScreen;
