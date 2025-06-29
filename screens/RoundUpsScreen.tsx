import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { normalize } from '../utils';
import { useRoundUps } from '../contexts/RoundUpsContext';

// Import new Round-Ups components
import DestinationModal from '../components/roundups/DestinationModal';
import FlippableCard from '../components/roundups/FlippableCard';
import ActionStation from '../components/roundups/ActionStation';
import PromotionalCards from '../components/roundups/PromotionalCards';

type RoundUpsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoundUps'>;

const RoundUpsScreen = () => {
  const navigation = useNavigation<RoundUpsScreenNavigationProp>();
  const { state } = useRoundUps();

  // New state for the redesigned screen
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [roundUpsAmount, setRoundUpsAmount] = useState(10); // Amount available for transfer
  const [shareCardState, setShareCardState] = useState<'initial' | 'grabbed'>('initial');
  const [donationCardState, setDonationCardState] = useState<'initial' | 'shared'>('initial');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    navigation.navigate('RoundUpsSettings');
  };

  // Handle hold-to-fill completion
  const handleHoldToFillComplete = () => {
    setShowDestinationModal(true);
  };

  // Handle destination selection
  const handleDestinationSelect = (destination: 'zakat' | 'investments') => {
    console.log(`Transferring $${roundUpsAmount} to ${destination}`);
    setShowDestinationModal(false);
    // Reset the round-ups amount to 0 after transfer
    setRoundUpsAmount(0);
    // Here you would typically update the backend/state
  };

  // Action Station handlers
  const handleAddFunds = () => {
    console.log('Add funds pressed');
    // Navigate to add funds screen
  };

  const handleBoost = () => {
    console.log('Boost pressed');
    // Navigate to boost screen
  };

  const handleInvest = () => {
    console.log('Invest pressed');
    // Navigate to investment screen
  };

  const handleWithdraw = () => {
    console.log('Withdraw pressed');
    // Navigate to withdraw screen
  };

  // Promotional card handlers
  const handleGrabShare = () => {
    if (roundUpsAmount >= 10) {
      setShareCardState('grabbed');
      setRoundUpsAmount(prev => prev - 10); // Deduct $10 for the share
      console.log('Share grabbed successfully');
    } else {
      console.log('Insufficient round-ups amount');
    }
  };

  const handleDonate = () => {
    if (roundUpsAmount > 0) {
      setDonationCardState('shared');
      setRoundUpsAmount(0); // Donate all round-ups
      console.log('Donation completed');
    } else {
      console.log('No round-ups to donate');
    }
  };

  const handleTellFriend = () => {
    console.log('Tell a friend pressed');
    // Navigate to sharing flow
  };

  if (state.isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading Round-Ups...</Text>
      </View>
    );
  }

  // Mock data for the new design
  const roundUpsData = {
    roundUps: roundUpsAmount,
    investments: 150.00,
    autoZakat: 73.00,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Round-Ups</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
            <Settings size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Card with Liquid Progress, AAOIFI Badge, and Balance Summary */}
          <FlippableCard
            roundUpsAmount={roundUpsData.roundUps}
            investmentsAmount={roundUpsData.investments}
            zakatAmount={roundUpsData.autoZakat}
            certified={true}
            onFlip={(isFlipped) => console.log('Card flipped:', isFlipped)}
            onHoldToFillComplete={handleHoldToFillComplete}
          />

          {/* Action Station */}
          <ActionStation
            onAddFunds={handleAddFunds}
            onBoost={handleBoost}
            onInvest={handleInvest}
            onWithdraw={handleWithdraw}
          />

          {/* Promotional Cards */}
          <PromotionalCards
            shareCardState={shareCardState}
            donationCardState={donationCardState}
            roundUpsAmount={roundUpsAmount}
            onGrabShare={handleGrabShare}
            onDonate={handleDonate}
            onTellFriend={handleTellFriend}
          />

        </ScrollView>

        {/* Destination Selection Modal */}
        <DestinationModal
          visible={showDestinationModal}
          amount={roundUpsAmount}
          onSelectDestination={handleDestinationSelect}
          onClose={() => setShowDestinationModal(false)}
        />


      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: normalize(16),
  },
  backButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: COLORS.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.semibold(18),
    color: COLORS.text,
  },
  settingsButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: COLORS.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: normalize(20),
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },


});

export default RoundUpsScreen;
