import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Clock, Lock, Heart, Share2, Instagram, MessageCircle } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { normalize, formatCurrency } from '../../utils';

interface PromoCardProps {
  title: string;
  subtitle?: string;
  amount?: number;
  timeLeft?: string;
  progress?: number;
  type: 'share' | 'donation' | 'investment';
  onPress?: () => void;
}

const PromoCard: React.FC<PromoCardProps> = ({
  title,
  subtitle,
  amount,
  timeLeft,
  progress = 0,
  type,
  onPress,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const getIcon = () => {
    switch (type) {
      case 'share':
        return <Lock size={20} color={COLORS.text} />;
      case 'donation':
        return <Heart size={20} color={COLORS.error} />;
      case 'investment':
        return <Share2 size={20} color={COLORS.primary} />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'share':
        return 'Grab Now';
      case 'donation':
        return 'Donate via Round-Ups';
      case 'investment':
        return 'Shukran, Habibi!';
      default:
        return 'Learn More';
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'share':
        return styles.grabButton;
      case 'donation':
        return styles.donateButton;
      case 'investment':
        return styles.shareButton;
      default:
        return styles.defaultButton;
    }
  };

  return (
    <TouchableOpacity style={styles.promoCard} onPress={handlePress}>
      <View style={styles.promoHeader}>
        <View style={styles.promoIconContainer}>
          {getIcon()}
        </View>
        <View style={styles.promoTitleContainer}>
          <Text style={styles.promoTitle}>{title}</Text>
          {timeLeft && (
            <View style={styles.timeContainer}>
              <Clock size={12} color={COLORS.textLight} />
              <Text style={styles.timeText}>{timeLeft}</Text>
            </View>
          )}
        </View>
      </View>

      {subtitle && (
        <Text style={styles.promoSubtitle}>{subtitle}</Text>
      )}

      {amount && (
        <Text style={styles.promoAmount}>{formatCurrency(amount)}</Text>
      )}

      {progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={COLORS.mizanGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>
      )}

      <TouchableOpacity style={getButtonStyle()} onPress={handlePress}>
        {type === 'investment' ? (
          <LinearGradient
            colors={COLORS.mizanGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButtonContent}
          >
            <Text style={styles.gradientButtonText}>{getButtonText()}</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.buttonText}>{getButtonText()}</Text>
        )}
      </TouchableOpacity>

      {type === 'investment' && (
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialIcon}>
            <Instagram size={16} color={COLORS.textWhite} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <MessageCircle size={16} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface Props {
  shareCardState: 'initial' | 'grabbed';
  donationCardState: 'initial' | 'shared';
  roundUpsAmount: number;
  onGrabShare?: () => void;
  onDonate?: () => void;
  onTellFriend?: () => void;
}

const PromotionalCards: React.FC<Props> = ({
  shareCardState,
  donationCardState,
  roundUpsAmount,
  onGrabShare,
  onDonate,
  onTellFriend,
}) => {
  const [timeLeft, setTimeLeft] = useState('4 hours left');

  useEffect(() => {
    // Mock countdown timer
    const timer = setInterval(() => {
      // This would normally calculate actual time remaining
      setTimeLeft('4 hours left');
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Share Card */}
      {shareCardState === 'initial' ? (
        <View style={styles.promoCard}>
          <View style={styles.cardHeader}>
            <Lock size={20} color={COLORS.text} />
            <Text style={styles.cardTitle}>Grab your first share</Text>
            <View style={styles.timeContainer}>
              <Clock size={12} color={COLORS.textLight} />
              <Text style={styles.timeText}>{timeLeft}</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <LinearGradient
              colors={COLORS.mizanGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressFill}
            />
          </View>

          <Text style={styles.shareAmount}>$ 10.00 = 0.02 Halal AAPL</Text>

          <TouchableOpacity
            style={[styles.actionButton, { opacity: roundUpsAmount >= 10 ? 1 : 0.5 }]}
            onPress={onGrabShare}
            disabled={roundUpsAmount < 10}
          >
            <Text style={styles.actionButtonText}>Grab Now</Text>
          </TouchableOpacity>

          <Text style={styles.socialProof}>1,321 investors have joined the journey.</Text>
        </View>
      ) : (
        <View style={styles.promoCard}>
          <View style={styles.cardHeader}>
            <Lock size={20} color={COLORS.text} />
            <Text style={styles.cardTitle}>Grabbed</Text>
          </View>

          <View style={styles.progressBar}>
            <LinearGradient
              colors={COLORS.mizanGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: '100%' }]}
            />
          </View>

          <Text style={styles.shareAmount}>You now own 0.02 Halal AAPL Stock</Text>

          <TouchableOpacity style={styles.gradientButton} onPress={onTellFriend}>
            <LinearGradient
              colors={COLORS.mizanGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButtonContent}
            >
              <Text style={styles.gradientButtonText}>Tell a friend</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.socialProof}>Blessings on your journey.</Text>
        </View>
      )}

      {/* Donation Card */}
      {donationCardState === 'initial' ? (
        <View style={styles.promoCard}>
          <View style={styles.cardHeader}>
            <Heart size={20} color={COLORS.error} />
            <Text style={styles.cardTitle}>Give a little, Change a lot</Text>
          </View>

          <Text style={styles.donationSubtitle}>$ 5,401 raised / $ 10,000 Donation Goal</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={COLORS.mizanGradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: '54%' }]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { opacity: roundUpsAmount > 0 ? 1 : 0.5 }]}
            onPress={onDonate}
            disabled={roundUpsAmount <= 0}
          >
            <Text style={styles.actionButtonText}>Donate via Round-Ups</Text>
          </TouchableOpacity>

          <Text style={styles.socialProof}>341 kind souls</Text>
        </View>
      ) : (
        <View style={styles.promoCard}>
          <View style={styles.cardHeader}>
            <Heart size={20} color={COLORS.error} />
            <Text style={styles.cardTitle}>It counts! Share the cause</Text>
          </View>

          <Text style={styles.donationSubtitle}>God sees it all.</Text>

          <TouchableOpacity style={styles.gradientButton} onPress={onTellFriend}>
            <LinearGradient
              colors={COLORS.mizanGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButtonContent}
            >
              <Text style={styles.gradientButtonText}>Shukran, Habibi!</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon}>
              <Instagram size={16} color={COLORS.textWhite} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <MessageCircle size={16} color={COLORS.textWhite} />
            </TouchableOpacity>
          </View>

          <Text style={styles.socialProof}>Blessings on your journey.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(20),
    gap: normalize(16),
  },
  promoCard: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(25),
    padding: normalize(20),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(10) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(20),
    elevation: 5,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  promoIconContainer: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: COLORS.background2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  promoTitleContainer: {
    flex: 1,
  },
  promoTitle: {
    ...FONTS.semibold(16),
    color: COLORS.text,
  },
  promoSubtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: normalize(8),
  },
  promoAmount: {
    ...FONTS.semibold(18),
    color: COLORS.primary,
    marginBottom: normalize(16),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
    gap: normalize(12),
  },
  cardTitle: {
    ...FONTS.semibold(16),
    color: COLORS.text,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(4),
  },
  timeText: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  progressBar: {
    height: normalize(6),
    backgroundColor: COLORS.border,
    borderRadius: normalize(3),
    overflow: 'hidden',
    marginBottom: normalize(16),
  },
  progressFill: {
    height: '100%',
    borderRadius: normalize(3),
    width: '100%',
  },
  shareAmount: {
    ...FONTS.semibold(18),
    color: COLORS.text,
    marginBottom: normalize(16),
  },
  donationSubtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: normalize(16),
    lineHeight: normalize(20),
  },
  progressContainer: {
    marginBottom: normalize(16),
  },
  progressBarContainer: {
    height: normalize(6),
    backgroundColor: COLORS.border,
    borderRadius: normalize(3),
    overflow: 'hidden',
  },
  actionButton: {
    backgroundColor: COLORS.background2,
    borderRadius: normalize(25),
    paddingVertical: normalize(12),
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  actionButtonText: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  gradientButton: {
    borderRadius: normalize(25),
    overflow: 'hidden',
    marginBottom: normalize(12),
  },
  gradientButtonContent: {
    paddingVertical: normalize(12),
    alignItems: 'center',
  },
  gradientButtonText: {
    ...FONTS.medium(14),
    color: COLORS.textWhite,
  },
  socialProof: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(12),
    marginBottom: normalize(12),
  },
  socialIcon: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grabButton: {
    backgroundColor: COLORS.success,
  },
  donateButton: {
    backgroundColor: COLORS.primary,
  },
  shareButton: {
    backgroundColor: COLORS.secondary,
  },
  defaultButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    ...FONTS.semibold(14),
    color: COLORS.textWhite,
  },

});

export default PromotionalCards;
