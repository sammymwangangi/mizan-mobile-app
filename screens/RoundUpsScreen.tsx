import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { formatCurrency, normalize } from '../utils';
import { useRoundUps } from '../contexts/RoundUpsContext';
import GradientBackground from '../components/GradientBackground';

// Import new Round-Ups components
import HoldToFillLiquidProgress from '../components/roundups/HoldToFillLiquidProgress';
import DestinationModal from '../components/roundups/DestinationModal';
import FlippableCard from '../components/roundups/FlippableCard';
import ActionStation from '../components/roundups/ActionStation';
import PromotionalCards from '../components/roundups/PromotionalCards';
import AAOIFIBadge from '../components/roundups/AAOIFIBadge';

type RoundUpsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoundUps'>;

const { width } = Dimensions.get('window');

const RoundUpsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RoundUpsScreenNavigationProp>();
  const { state } = useRoundUps();

  // New state for the redesigned screen
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [currentAmount] = useState(10); // Amount to transfer

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
    console.log(`Transferring $${currentAmount} to ${destination}`);
    setShowDestinationModal(false);
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
    console.log('Grab share pressed');
    // Navigate to share grabbing flow
  };

  const handleDonate = () => {
    console.log('Donate pressed');
    // Navigate to donation flow
  };

  const handleShareSuccess = () => {
    console.log('Share success pressed');
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
    roundUps: 0.00,
    investments: 150.00,
    autoZakat: 73.00,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Background */}
      <GradientBackground
        colors={['#CE72E3', '#8C5FED', '#8C5FED']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          ...styles.headerBackground,
          paddingTop: insets.top,
        }}
      />

      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Round-Ups</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
            <Settings size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* AAOIFI Badge */}
          <AAOIFIBadge certified={true} />

          {/* Main Liquid Progress Component */}
          <View style={styles.liquidProgressContainer}>
            <HoldToFillLiquidProgress
              amount={currentAmount}
              size={200}
              onComplete={handleHoldToFillComplete}
              onReset={() => console.log('Progress reset')}
            />
          </View>

          {/* Balance Summary Card */}
          <FlippableCard
            roundUpsAmount={roundUpsData.roundUps}
            investmentsAmount={roundUpsData.investments}
            zakatAmount={roundUpsData.autoZakat}
            onFlip={(isFlipped) => console.log('Card flipped:', isFlipped)}
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
            onGrabShare={handleGrabShare}
            onDonate={handleDonate}
            onShareSuccess={handleShareSuccess}
          />

        </ScrollView>

        {/* Destination Selection Modal */}
        <DestinationModal
          visible={showDestinationModal}
          amount={currentAmount}
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
  headerBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: normalize(120),
    borderBottomLeftRadius: normalize(40),
    borderBottomRightRadius: normalize(40),
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
  },
  backButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.semibold(18),
    color: COLORS.textWhite,
  },
  settingsButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: normalize(20),
  },
  liquidProgressContainer: {
    alignItems: 'center',
    marginVertical: normalize(20),
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },


});

export default RoundUpsScreen;
