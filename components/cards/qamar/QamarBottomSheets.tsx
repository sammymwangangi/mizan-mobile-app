import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Pressable, StyleSheet, BackHandler, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BARAKAH_PURPLE, REFERRAL_CHANNELS, QAMAR_ANALYTICS } from '../../../constants/qamar';
import { AnimatedProgressRing, AnimatedSuccessCheck, ConfettiBurst } from '../../shared/AnimatedComponents';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ChevronLeft } from 'lucide-react-native';

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
      
      <View className="bg-white rounded-3xl p-8 mx-8 items-center">
        <AnimatedSuccessCheck visible={visible} />
        
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
          Order Complete
        </Text>
        <Text className="text-gray-600 text-center">
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

// Fund Success Sheet
export const FundSuccessSheet: React.FC<SuccessSheetProps> = ({ visible, onComplete }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 items-center justify-center">
      <View className="bg-white rounded-3xl p-8 mx-8 items-center">
        <AnimatedSuccessCheck visible={visible} />
        
        <Text className="text-lg font-semibold text-gray-900 mt-4">
          Funded!
        </Text>
      </View>
    </View>
  </Modal>
);

// Referral Sheet
interface ReferralSheetProps extends BaseSheetProps {
  onShare: (channel: string) => void;
  onSkip: () => void;
}

export const ReferralSheet: React.FC<ReferralSheetProps> = ({ visible, onShare, onSkip }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl p-6">
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
        
        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
          Share the love — you both get $10
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Invite friends to join Mizan Money
        </Text>

        <View className="flex-row flex-wrap justify-center mb-6">
          {REFERRAL_CHANNELS.map((channel) => (
            <TouchableOpacity
              key={channel.id}
              onPress={() => onShare(channel.id)}
              className="w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center m-2"
            >
              <Text className="text-2xl">{channel.name.charAt(0)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={onSkip}
          className="w-full h-14 bg-gray-100 rounded-full justify-center items-center"
        >
          <Text className="text-gray-700 font-semibold text-lg">Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

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
