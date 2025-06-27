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
  onGrabShare?: () => void;
  onDonate?: () => void;
  onShareSuccess?: () => void;
}

const PromotionalCards: React.FC<Props> = ({
  onGrabShare,
  onDonate,
  onShareSuccess,
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
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Grab your first share card */}
      <PromoCard
        title="Grab your first share"
        timeLeft={timeLeft}
        amount={10.00}
        subtitle="$ 10.00 = 0.02 Halal AAPL"
        type="share"
        onPress={onGrabShare}
      />

      {/* Donation card */}
      <PromoCard
        title="Give a little, Change a lot"
        subtitle="$ 5,401 raised / $ 10,000 Donation Goal"
        progress={54}
        type="donation"
        onPress={onDonate}
      />

      {/* Success sharing card */}
      <PromoCard
        title="It counts! Share the cause"
        subtitle="Blessings on your journey."
        type="investment"
        onPress={onShareSuccess}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
  },
  promoCard: {
    width: normalize(280),
    backgroundColor: COLORS.card,
    borderRadius: normalize(20),
    padding: normalize(20),
    marginRight: normalize(16),
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
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
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
    marginBottom: normalize(4),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginLeft: normalize(4),
  },
  promoSubtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: normalize(12),
    lineHeight: normalize(20),
  },
  promoAmount: {
    ...FONTS.semibold(20),
    color: COLORS.text,
    marginBottom: normalize(16),
  },
  progressContainer: {
    marginBottom: normalize(16),
  },
  progressBar: {
    height: normalize(6),
    backgroundColor: COLORS.border,
    borderRadius: normalize(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: normalize(3),
  },
  grabButton: {
    backgroundColor: COLORS.background2,
    borderRadius: normalize(25),
    paddingVertical: normalize(12),
    alignItems: 'center',
  },
  donateButton: {
    backgroundColor: COLORS.background2,
    borderRadius: normalize(25),
    paddingVertical: normalize(12),
    alignItems: 'center',
  },
  shareButton: {
    borderRadius: normalize(25),
    overflow: 'hidden',
    marginBottom: normalize(12),
  },
  defaultButton: {
    backgroundColor: COLORS.primary,
    borderRadius: normalize(25),
    paddingVertical: normalize(12),
    alignItems: 'center',
  },
  gradientButtonContent: {
    paddingVertical: normalize(12),
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  gradientButtonText: {
    ...FONTS.medium(14),
    color: COLORS.textWhite,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(12),
  },
  socialIcon: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PromotionalCards;
