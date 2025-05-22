import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const LOGOS: Record<string, any> = {
  'carrefour.png': require('../assets/payments/carrefour.png'),
  'offer-2.png': require('../assets/payments/offer-2.png'),
};

interface OfferCardProps {
  logo: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  logo,
  title,
  subtitle,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={LOGOS[logo]}
        style={styles.iconImage}
        resizeMode="contain"
      />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 276,
    height: 153,
    backgroundColor: COLORS.card,
    borderRadius: 25,
    padding: 15,
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },

  iconImage: {
    width: 42,
    height: 32,
  },
  details: {
    flex: 1,
  },
  title: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 5,
  },
  subtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
});

export default OfferCard;
