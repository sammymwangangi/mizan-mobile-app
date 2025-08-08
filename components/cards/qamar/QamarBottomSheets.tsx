import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BARAKAH_PURPLE, REFERRAL_CHANNELS, REFERRAL_MESSAGE, QAMAR_ANALYTICS } from '../../../constants/qamar';
import { AnimatedProgressRing, AnimatedSuccessCheck, ConfettiBurst } from '../../shared/AnimatedComponents';

interface BaseSheetProps {
  visible: boolean;
  onClose: () => void;
}

// Terms & Conditions Sheet
interface TnCSheetProps extends BaseSheetProps {
  onAgree: () => void;
  onDecline: () => void;
}

export const TnCSheet: React.FC<TnCSheetProps> = ({ visible, onClose, onAgree, onDecline }) => {
  const handleEmailCopy = () => {
    const emailBody = encodeURIComponent('Please send me a copy of the Terms & Conditions and Privacy Policy.');
    Linking.openURL(`mailto:support@mizanmoney.ai,mizanmoneyapp@gmail.com?subject=Terms%20%26%20Conditions&body=${emailBody}`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-4/5">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-6" />
          
          <ScrollView className="px-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </Text>
            
            <Text className="text-gray-700 text-sm leading-6 mb-4">
              By using Mizan Money services, you agree to our terms which include:
            </Text>
            
            <View className="space-y-3 mb-6">
              <Text className="text-gray-700 text-sm">
                • <Text className="font-semibold">Amenah (Trust):</Text> We handle your money with complete transparency and Islamic principles
              </Text>
              <Text className="text-gray-700 text-sm">
                • <Text className="font-semibold">Riba-Free:</Text> All our services are completely free from interest (riba)
              </Text>
              <Text className="text-gray-700 text-sm">
                • <Text className="font-semibold">GDPR Compliance:</Text> Your data is protected according to international standards
              </Text>
              <Text className="text-gray-700 text-sm">
                • <Text className="font-semibold">Halal Transactions:</Text> We only facilitate transactions that comply with Islamic law
              </Text>
              <Text className="text-gray-700 text-sm">
                • <Text className="font-semibold">Fair Usage:</Text> Our services are designed for personal and business use within legal boundaries
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleEmailCopy}
              className="bg-gray-50 rounded-xl p-4 mb-6"
            >
              <Text className="text-purple-600 text-center font-medium">
                📧 Email me a copy
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View className="px-6 pb-8 space-y-3">
            <TouchableOpacity onPress={onAgree} className="w-full">
              <LinearGradient
                colors={[BARAKAH_PURPLE, '#9F7AFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 rounded-full justify-center items-center"
              >
                <Text className="text-white font-semibold text-lg">Agree</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDecline}
              className="w-full h-14 bg-gray-100 rounded-full justify-center items-center"
            >
              <Text className="text-gray-700 font-semibold text-lg">Decline & Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
