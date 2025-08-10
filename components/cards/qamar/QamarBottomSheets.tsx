import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Pressable, StyleSheet, BackHandler, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BARAKAH_PURPLE, QAMAR_ANALYTICS } from '../../../constants/qamar';
import { AnimatedProgressRing, AnimatedSuccessCheck, ConfettiBurst } from '../../shared/AnimatedComponents';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ChevronLeft, Check } from 'lucide-react-native';

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
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, fontSize: 20, fontWeight: '700', color: '#0F172A' }}>
              Terms and Conditions
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
            <Text className="text-base font-semibold text-gray-900 mb-2">The fine print</Text>

            <Text className="text-gray-900 font-semibold">Your Amanah</Text>
            <Text className="text-gray-600 mb-3">Data is encrypted, never sold, and you can delete it any time.</Text>

            <Text className="text-gray-900 font-semibold">Shariah Compliance</Text>
            <Text className="text-gray-600 mb-3">Noor Card is riba-free and audited by Shariah board.</Text>

            <Text className="text-gray-900 font-semibold">Reg-compliant</Text>
            <Text className="text-gray-600 mb-3">Using Mizan Money means you accept our Terms & Privacy Policy. Read the full legal text</Text>
            <View style={{ height: 8 }} />
          </ScrollView>

          {/* Actions */}
          <View className="px-6 pb-8">
            <TouchableOpacity onPress={() => { onAgree(); /* PostHog.capture?.(QAMAR_ANALYTICS.CARD_TNC_AGREE); */ }} className="w-full">
              <LinearGradient
                colors={[BARAKAH_PURPLE, '#9F7AFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 rounded-full justify-center items-center"
                style={{ borderRadius: 40 }}
              >
                <Text className="text-white font-semibold text-lg">Agree</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { onDecline(); /* PostHog.capture?.(QAMAR_ANALYTICS.CARD_TNC_DECLINE); */ }} className="w-full h-14 bg-gray-100 rounded-full justify-center items-center mt-3" style={{ borderRadius: 40 }}>
              <Text className="text-gray-700 font-semibold text-lg">Decline & Exit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { handleEmailCopy(); /* PostHog.capture?.(QAMAR_ANALYTICS.CARD_TNC_EMAIL); */ }} className="mt-3">
              <Text className="text-indigo-500 text-center">Email me a copy</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

// Minting Progress Sheet
interface MintingSheetProps extends BaseSheetProps {
  progress: number;
  onCancel: () => void;
}

export const MintingSheet: React.FC<MintingSheetProps> = ({ visible, progress, onCancel }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl" style={{ height: '60%' }}>
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="w-12 h-1 bg-gray-300 rounded-full" />
          <TouchableOpacity onPress={onCancel} className="w-6 h-6">
            <Text className="text-gray-400 text-lg">×</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-1 items-center justify-center px-6">
          <AnimatedProgressRing progress={progress} />
          
          <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
            Creating your card
          </Text>
          <Text className="text-gray-600 text-center">
            Sabr in shaa Allah, almost done
          </Text>
        </View>
      </View>
    </View>
  </Modal>
);

// Cancel Confirmation Sheet
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

// Error Sheet
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

// Success Sheet
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
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginBottom: 10 }} />

            {/* Outlined circle with check */}
            <View style={{ width: 118, height: 118, borderRadius: 59, borderWidth: 3, borderColor: '#A08CFF', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={44} color="#A08CFF" strokeWidth={3} />
            </View>

            {/* Title */}
            <Text style={{ marginTop: 24, fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Funded!</Text>
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

// Wallet Success Sheet
export const WalletSuccessSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => (
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
