import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface OfferCardProps {
  logo: React.ReactNode;
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
      <View style={styles.logoContainer}>
        {logo}
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
