import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Heart, TrendingUp, X } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { normalize } from '../../utils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {
  visible: boolean;
  amount: number;
  onSelectDestination: (destination: 'zakat' | 'investments') => void;
  onClose: () => void;
}

const DestinationModal: React.FC<Props> = ({
  visible,
  amount,
  onSelectDestination,
  onClose,
}) => {
  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(50);

  useEffect(() => {
    if (visible) {
      // Animate in
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      modalTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      // Animate out
      backdropOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.8, { duration: 200 });
      modalTranslateY.value = withTiming(50, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: modalScale.value },
      { translateY: modalTranslateY.value },
    ],
  }));

  const handleSelectDestination = (destination: 'zakat' | 'investments') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectDestination(destination);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>

        {/* Modal Content */}
        <Animated.View style={[styles.modalContainer, modalStyle]}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Choose Destination</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {/* Amount Display */}
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount to Transfer</Text>
              <Text style={styles.amountValue}>${amount}</Text>
            </View>

            {/* Destination Options */}
            <View style={styles.optionsContainer}>
              {/* Zakat Option */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleSelectDestination('zakat')}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIcon}>
                    <Heart size={32} color={COLORS.error} />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Zakat</Text>
                    <Text style={styles.optionDescription}>
                      Donate to charity and help those in need
                    </Text>
                  </View>
                </View>
                <View style={styles.optionArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>

              {/* Investments Option */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleSelectDestination('investments')}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIcon}>
                    <TrendingUp size={32} color={COLORS.primary} />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Investments</Text>
                    <Text style={styles.optionDescription}>
                      Grow your wealth with Halal investments
                    </Text>
                  </View>
                </View>
                <View style={styles.optionArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Your Round-Ups will be automatically allocated to your chosen destination
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: screenWidth - normalize(40),
    maxHeight: screenHeight * 0.8,
  },
  modal: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(24),
    padding: normalize(24),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.25,
    shadowRadius: normalize(40),
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  title: {
    ...FONTS.semibold(20),
    color: COLORS.text,
  },
  closeButton: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: COLORS.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: normalize(32),
    paddingVertical: normalize(20),
    backgroundColor: COLORS.background2,
    borderRadius: normalize(16),
  },
  amountLabel: {
    ...FONTS.medium(14),
    color: COLORS.textLight,
    marginBottom: normalize(8),
  },
  amountValue: {
    ...FONTS.semibold(32),
    color: COLORS.primary,
  },
  optionsContainer: {
    marginBottom: normalize(24),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: normalize(16),
    padding: normalize(20),
    marginBottom: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    backgroundColor: COLORS.background2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(16),
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...FONTS.semibold(16),
    color: COLORS.text,
    marginBottom: normalize(4),
  },
  optionDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    lineHeight: normalize(20),
  },
  optionArrow: {
    marginLeft: normalize(12),
  },
  arrowText: {
    ...FONTS.semibold(20),
    color: COLORS.primary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: normalize(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: normalize(18),
  },
});

export default DestinationModal;
