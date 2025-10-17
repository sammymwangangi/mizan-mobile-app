import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Pressable, StyleSheet, BackHandler, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BARAKAH_PURPLE, QAMAR_ANALYTICS } from '../../../constants/qamar';
import { AnimatedProgressRing, AnimatedSuccessCheck, ConfettiBurst } from '../../shared/AnimatedComponents';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ChevronLeft, Check } from 'lucide-react-native';
import { FONTS } from 'constants/theme';

interface BaseSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface TnCSheetProps extends BaseSheetProps {
  onAgree: () => void;
  onDecline: () => void;
}

export const TnCSheet: React.FC<TnCSheetProps> = ({ visible, onClose, onAgree, onDecline }) => {
  const sheetRef = React.useRef<BottomSheet>(null);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onDecline();
      return true;
    });
    return () => sub.remove();
  }, [visible, onDecline]);

  if (!visible) return null;

  const handleEmailCopy = () => {
    const emailBody = encodeURIComponent('Please send me a copy of the Terms & Conditions and Privacy Policy.');
    Linking.openURL(`mailto:support@mizanmoney.ai,mizanmoneyapp@gmail.com?subject=Terms%20%26%20Conditions&body=${emailBody}`);
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Backdrop */}
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={onDecline} />

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={["70%"]}
        enablePanDownToClose
        onChange={(i) => { if (i === -1) onDecline(); }}
        backgroundStyle={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 48, height: 4, borderRadius: 2 }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {/* Header */}
          <View className="px-6 pt-3 pb-2 flex-row items-center">
            <View className="w-8 h-8 items-center justify-center mr-2">
              <ChevronLeft color="#94A3B8" size={24} onPress={onDecline} />
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, ...FONTS.bold(28), color: '#000000' }}>
              Terms and Conditions
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
            <Text className="mb-2" style={{ ...FONTS.semibold(16), color: '#000000' }}>The fine print</Text>

            <Text style={{ ...FONTS.semibold(16), color: '#888888' }}>Your Amanah:</Text>
            <Text style={{ ...FONTS.body3, color: '#888888' }}>Data is encrypted, never sold, and you can delete it any time.</Text>

            <Text style={{ ...FONTS.semibold(16), color: '#888888' }}>Shariah Compliance:</Text>
            <Text style={{ ...FONTS.body3, color: '#888888' }}>Noor Card is riba-free and audited by Shariah board.</Text>

            <Text style={{ ...FONTS.semibold(16), color: '#888888' }}>Reg-compliant:</Text>
            <Text style={{ ...FONTS.body3, color: '#888888' }}>Using Mizan Money means you accept our Terms & Privacy Policy. Read the full legal text</Text>
            <View style={{ height: 8 }} />
          </ScrollView>

          {/* Actions */}
          <View className="px-6 pb-8">
            <TouchableOpacity onPress={() => { onAgree(); /* PostHog.capture?.(QAMAR_ANALYTICS.CARD_TNC_AGREE); */ }} className="w-full">
              <LinearGradient
                colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 justify-center items-center"
                style={{ borderRadius: 40 }}
              >
                <Text style={{ ...FONTS.semibold(18), color: '#1B1C39' }}>Agree</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { onDecline();}}>
              <LinearGradient
                colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 justify-center items-center"
                style={{ borderRadius: 40, opacity: 0.3, marginTop: 12 }}
              >
                <Text style={{ ...FONTS.semibold(16), color: '#6D6E8A' }}>I&apos;ll review later</Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

// Minting Progress Sheet (Qamar/Barakah version)
interface MintingSheetProps extends BaseSheetProps {
  progress: number;
  onCancel: () => void;
}

export const MintingSheet: React.FC<MintingSheetProps> = ({ visible, progress, onCancel }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-3xl" style={{ height: '60%', marginHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="w-12 h-1 bg-gray-300 rounded-full" />
          <TouchableOpacity onPress={onCancel} className="w-6 h-6">
            <Text className="text-gray-400 text-lg">×</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <AnimatedProgressRing progress={progress} />

          <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
            Minting card
          </Text>
          <Text className="text-gray-600 text-center text-[16px]">
            A little sabr, we’re almost done
          </Text>
        </View>
      </View>
    </View>
  </Modal>
);

// Shams Minting Progress Sheet
export const ShamsMintingSheet: React.FC<MintingSheetProps> = ({ visible, progress, onCancel }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-3xl" style={{ height: '60%', marginHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="w-12 h-1 bg-gray-300 rounded-full" />
          <TouchableOpacity onPress={onCancel} className="w-6 h-6">
            <Text style={{ color: '#DDA79B', fontSize: 24, fontWeight: '300' }}>×</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <AnimatedProgressRing progress={progress} size={110} strokeWidth={8} color="#DDA79B" />

          <Text style={{ ...FONTS.bold(28), color: '#1B1C39', marginTop: 24, marginBottom: 8 }}>
            Minting card
          </Text>
          <Text style={{ ...FONTS.medium(16), color: '#6D6E8A', textAlign: 'center' }}>
            A little sabr, we&apos;re almost done
          </Text>
        </View>
      </View>
    </View>
  </Modal>
);

// Cancel Confirmation Sheet (Qamar/Barakah version)
interface CancelSheetProps extends BaseSheetProps {
  onKeep: () => void;
  onCancel: () => void;
}

export const CancelSheet: React.FC<CancelSheetProps> = ({ visible, onKeep, onCancel }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl p-6">
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
          Change of heart?
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          You can always come back later to complete your order
        </Text>

        <View className="space-y-3">
          <TouchableOpacity onPress={onKeep} className="w-full">
            <LinearGradient
              colors={[BARAKAH_PURPLE, '#9F7AFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 rounded-full justify-center items-center"
            >
              <Text className="text-white font-semibold text-lg">Keep</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCancel}
            className="w-full h-14 bg-gray-100 rounded-full justify-center items-center"
          >
            <Text className="text-gray-700 font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Shams Cancel Confirmation Sheet
export const ShamsCancelSheet: React.FC<CancelSheetProps> = ({ visible, onKeep, onCancel }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl p-6">
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

        <Text style={{ ...FONTS.bold(20), color: '#1B1C39', textAlign: 'center', marginBottom: 8 }}>
          Need a moment?
        </Text>
        <Text style={{ ...FONTS.medium(14), color: '#6D6E8A', textAlign: 'center', marginBottom: 32 }}>
          You can finish your order later{'\n'}in shaa Allah. No fees charged yet.
        </Text>

        <View className="space-y-3">
          <TouchableOpacity onPress={onKeep} className="w-full">
            <LinearGradient
              colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 rounded-full justify-center items-center"
              style={{ borderRadius: 40, marginBottom: 12 }}
            >
              <Text style={{ ...FONTS.semibold(16), color: '#1B1C39' }}>Keep Minting</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCancel}
            className="w-full"
          >
            <LinearGradient
              colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 rounded-full justify-center items-center"
              style={{ borderRadius: 40, marginBottom: 12 , opacity: 0.3 }}
            >
              <Text style={{ ...FONTS.semibold(16), color: '#1B1C39' }}>Save & Exit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Error Sheet (Qamar/Barakah version)
interface ErrorSheetProps extends BaseSheetProps {
  onRetry: () => void;
  onExit: () => void;
}

export const ErrorSheet: React.FC<ErrorSheetProps> = ({ visible, onRetry, onExit }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl p-6">
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <Text className="text-red-500 text-2xl">📶</Text>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-2">
            Connection lost
          </Text>
          <Text className="text-gray-600 text-center">
            Allah knows best. No fees charged
          </Text>
        </View>

        <View className="space-y-3">
          <TouchableOpacity onPress={onRetry} className="w-full">
            <LinearGradient
              colors={[BARAKAH_PURPLE, '#9F7AFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 rounded-full justify-center items-center"
            >
              <Text className="text-white font-semibold text-lg">Tap to retry</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onExit}
            className="w-full h-14 bg-gray-100 rounded-full justify-center items-center"
          >
            <Text className="text-gray-700 font-semibold text-lg">Save & Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Shams Error Sheet
export const ShamsErrorSheet: React.FC<ErrorSheetProps> = ({ visible, onRetry, onExit }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl p-6">
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#FEF2F2' }}>
            <Text className="text-2xl">📶</Text>
          </View>

          <Text style={{ ...FONTS.bold(20), color: '#1B1C39', marginBottom: 8 }}>
            Connection lost
          </Text>
          <Text style={{ ...FONTS.medium(14), color: '#6D6E8A', textAlign: 'center' }}>
            Allah knows best. No fees{'\n'}charged
          </Text>
        </View>

        <View className="space-y-3">
          <TouchableOpacity onPress={onRetry} className="w-full">
            <LinearGradient
              colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 rounded-full justify-center items-center"
            >
              <Text style={{ ...FONTS.semibold(16), color: '#1B1C39' }}>Retry Now</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onExit}
            className="w-full h-14 rounded-full justify-center items-center"
            style={{ backgroundColor: '#F5F5F8' }}
          >
            <Text style={{ ...FONTS.semibold(16), color: '#6D6E8A' }}>Save & Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Success Sheet (Qamar/Barakah version)
interface SuccessSheetProps extends BaseSheetProps {
  onComplete: () => void;
}

export const SuccessSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 items-center justify-center">
      <ConfettiBurst visible={visible} onComplete={onComplete} />

      {/* Modal container with explicit sizing per spec */}
      <View
        style={{
          width: 341,
          height: 304,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 20,
          paddingHorizontal: 24
        }}
      >
        {/* Optional handle bar for visual polish */}
        <View style={{ width: 56, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', marginBottom: 12 }} />

        {/* Success check at exact 120x120 */}
        <AnimatedSuccessCheck visible={visible} size={120} />

        {/* Texts with spacing */}
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#0F172A', marginTop: 16 }}>
          Order Complete
        </Text>
        <Text style={{ fontSize: 14, color: '#475569', textAlign: 'center', marginTop: 8 }}>
          You&apos;re good to go
        </Text>
      </View>
    </View>
  </Modal>
);

// Shams Success Sheet
export const ShamsSuccessSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 items-center justify-center">
      <ConfettiBurst visible={visible} onComplete={onComplete} colors={['#DDA79B', '#F8E7A0']} />

      {/* Modal container with explicit sizing per spec */}
      <View
        style={{
          width: 341,
          height: 304,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 20,
          paddingHorizontal: 24
        }}
      >
        {/* Optional handle bar for visual polish */}
        <View style={{ width: 56, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', marginBottom: 12 }} />

        {/* Success check at exact 120x120 with rose gold color */}
        <AnimatedSuccessCheck visible={visible} size={120} color="#DDA79B" />

        {/* Texts with spacing */}
        <Text style={{ ...FONTS.bold(22), color: '#1B1C39', marginTop: 16 }}>
          Order Complete
        </Text>
        <Text style={{ ...FONTS.medium(14), color: '#6D6E8A', textAlign: 'center', marginTop: 8 }}>
          Welcome to the Gold Club
        </Text>
      </View>
    </View>
  </Modal>
);

// Fund Loader Sheet
export const FundLoaderSheet: React.FC<BaseSheetProps> = ({ visible }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 items-center justify-center">
      <View className="bg-white rounded-3xl p-8 mx-8 items-center">
        <View className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
        <Text className="text-lg font-semibold text-gray-900">
          Funding...
        </Text>
      </View>
    </View>
  </Modal>
);

// Fund Success Sheet (Figma: 340x300, outlined circle, auto-dismiss)
export const FundSuccessSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => {
  React.useEffect(() => {
    if (visible) {
      const t = setTimeout(() => onComplete && onComplete(), 1600);
      return () => clearTimeout(t);
    }
  }, [visible, onComplete]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-end">
        <View style={{ position: 'relative', alignItems: 'center', marginBottom: 24 }}>
          {/* Purple base accent shadow */}
          <LinearGradient
            colors={[ '#6B4EFF', '#8F00E0' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', bottom: 8, width: 340, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, opacity: 1 }}
          />

          {/* Card */}
          <View style={{ width: 340, height: 300, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, alignItems: 'center', paddingTop: 14 }}>
            {/* Handle indicator */}
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#DDA79B', marginBottom: 10 }} />

            {/* Outlined circle with check */}
            <View style={{ width: 118, height: 118, borderRadius: 59, borderWidth: 3, borderColor: '#A08CFF', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={44} color="#DDA79B" strokeWidth={3} />
            </View>

            {/* Title */}
            <Text style={{ marginTop: 24, fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Funded!</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Wallet Added Sheet (same spec as FundSuccessSheet, but text "Added" and animated check)
export const WalletAddedSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => {
  React.useEffect(() => {
    if (visible) {
      const t = setTimeout(() => onComplete && onComplete(), 1600);
      return () => clearTimeout(t);
    }
  }, [visible, onComplete]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-end">
        <View style={{ position: 'relative', alignItems: 'center', marginBottom: 24 }}>
          {/* Purple base accent shadow */}
          <LinearGradient
            colors={[ '#6B4EFF', '#8F00E0' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', bottom: 8, width: 340, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          />

          {/* Card */}
          <View style={{ width: 340, height: 300, backgroundColor: '#FFFFFF', borderRadius: 24, alignItems: 'center', paddingTop: 14 }}>
            {/* Handle indicator */}
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginBottom: 10 }} />

            {/* Animated filled check, centered */}
            <AnimatedSuccessCheck visible={visible} size={76} color="#A08CFF" />

            {/* Title */}
            <Text style={{ marginTop: 24, fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Added</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Referral Sheet (Figma: 340x300, heart icon, $5 copy, top-right close, social icons)
interface ReferralSheetProps extends BaseSheetProps {
  onShare: (channel: string) => void;
  onSkip: () => void;
}

export const ReferralSheet: React.FC<ReferralSheetProps> = ({ visible, onShare, onSkip }) => {
  if (!visible) return null; // guard to avoid duplicate mounting artifacts
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ position: 'relative', alignItems: 'center', marginBottom: 24, alignSelf: 'center' }}>
          {/* Purple base accent */}
          <LinearGradient
            colors={[ '#6B4EFF', '#8F00E0' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', bottom: 8, width: 340, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          />

          {/* Card */}
          <View style={{ width: 340, height: 300, backgroundColor: '#FFFFFF', borderRadius: 24, paddingTop: 12, paddingHorizontal: 16 }}>
            {/* Handle + Close */}
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginBottom: 6 }} />
              <TouchableOpacity onPress={onSkip} style={{ position: 'absolute', right: 6, top: -6, padding: 8 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 22 }}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Heart */}
            <View style={{ alignItems: 'center', marginTop: 6 }}>
              <Image source={require('../../../assets/cards/social/heart.png')} style={{ width: 28, height: 28 }} />
            </View>

            {/* Title */}
            <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 20, fontWeight: '800', color: '#0F172A' }}>
              Share the love, you{"\n"}both get $5.00
            </Text>
            <Text style={{ marginTop: 8, textAlign: 'center', fontSize: 12, color: '#6B7280' }}>
              Once their first top-up is complete,{"\n"}we credit you instantly.
            </Text>

            {/* Social icons row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 18, paddingHorizontal: 10 }}>
              <TouchableOpacity onPress={() => onShare('whatsapp')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/whatsapp.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onShare('instagram')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/instagram.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onShare('twitter')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/twitter.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onShare('messenger')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/messenger.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Shams Referral Sheet
export const ShamsReferralSheet: React.FC<ReferralSheetProps> = ({ visible, onShare, onSkip }) => {
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ position: 'relative', alignItems: 'center', marginBottom: 24, alignSelf: 'center' }}>
          {/* Rose gold base accent */}
          <LinearGradient
            colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', bottom: 8, width: 340, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          />

          {/* Card */}
          <View style={{ width: 340, height: 300, backgroundColor: '#FFFFFF', borderRadius: 24, paddingTop: 12, paddingHorizontal: 16 }}>
            {/* Handle + Close */}
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginBottom: 6 }} />
              <TouchableOpacity onPress={onSkip} style={{ position: 'absolute', right: 6, top: -6, padding: 8 }}>
                <Text style={{ color: '#DDA79B', fontSize: 22 }}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Heart */}
            <View style={{ alignItems: 'center', marginTop: 6, width: '100%'  }}>
              <Image source={require('../../../assets/cards/shams/referral-heart.png')} style={{ width: 50, height: 44 }} />
            </View>

            {/* Title */}
            <Text style={{ marginTop: 10, textAlign: 'center', ...FONTS.bold(20), color: '#1B1C39' }}>
              Share the love, you{"\n"}both get $10.00
            </Text>
            <Text style={{ marginTop: 8, textAlign: 'center', ...FONTS.medium(12), color: '#6D6E8A' }}>
              Once their first top-up is complete,{"\n"}we credit you instantly.
            </Text>

            {/* Social icons row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 18, paddingHorizontal: 10 }}>
              <TouchableOpacity onPress={() => onShare('whatsapp')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/whatsapp.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onShare('instagram')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/instagram.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onShare('twitter')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/twitter.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onShare('messenger')} style={{ padding: 6 }}>
                <Image source={require('../../../assets/cards/social/messenger.png')} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Shams Apple Wallet Sheet
export const ShamsAppleWalletSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => {
  React.useEffect(() => {
    if (visible) {
      const t = setTimeout(() => onComplete && onComplete(), 1600);
      return () => clearTimeout(t);
    }
  }, [visible, onComplete]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-end">
        <View style={{ position: 'relative', alignItems: 'center', marginBottom: 24 }}>
          {/* Rose gold base accent shadow */}
          <LinearGradient
            colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', bottom: 8, width: 340, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          />

          {/* Card */}
          <View style={{ width: 340, height: 300, backgroundColor: '#FFFFFF', borderRadius: 24, alignItems: 'center', paddingTop: 14 }}>
            {/* Handle indicator */}
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginBottom: 10 }} />

            {/* Outlined circle with check */}
            <View style={{ width: 118, height: 118, borderRadius: 59, borderWidth: 3, borderColor: '#DDA79B', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={44} color="#DDA79B" strokeWidth={3} />
            </View>

            {/* Title */}
            <Text style={{ marginTop: 24, ...FONTS.bold(20), color: '#1B1C39' }}>Added to Apple Wallet</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Shams Google Wallet Sheet
export const ShamsGoogleWalletSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => {
  React.useEffect(() => {
    if (visible) {
      const t = setTimeout(() => onComplete && onComplete(), 1600);
      return () => clearTimeout(t);
    }
  }, [visible, onComplete]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-end">
        <View style={{ position: 'relative', alignItems: 'center', marginBottom: 24 }}>
          {/* Rose gold base accent shadow */}
          <LinearGradient
            colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', bottom: 8, width: 340, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          />

          {/* Card */}
          <View style={{ width: 340, height: 300, backgroundColor: '#FFFFFF', borderRadius: 24, alignItems: 'center', paddingTop: 14 }}>
            {/* Handle indicator */}
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginBottom: 10 }} />

            {/* Outlined circle with check */}
            <View style={{ width: 118, height: 118, borderRadius: 59, borderWidth: 3, borderColor: '#DDA79B', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={44} color="#DDA79B" strokeWidth={3} />
            </View>

            {/* Title */}
            <Text style={{ marginTop: 24, ...FONTS.bold(20), color: '#1B1C39' }}>Added to Google Wallet</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Wallet Success Sheet (legacy compact) - unused; prefer WalletAddedSheet above
export const WalletSuccessSheet: React.FC<SuccessSheetProps> = ({ visible }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 items-center justify-center">
      <View className="bg-white rounded-3xl p-8 mx-8 items-center">
        <AnimatedSuccessCheck visible={visible} />

        <Text className="text-lg font-semibold text-gray-900 mt-4">
          Added
        </Text>
      </View>
    </View>
  </Modal>
);
