import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const ICONS: Record<string, any> = {
  'bowl.png': require('../assets/payments/bowl.png'),
  'bowl2.png': require('../assets/payments/bowl2.png'),
};

interface WeekendCardProps {
  icon: string;
  title: string;
  subtitle: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
}

const WeekendCard: React.FC<WeekendCardProps> = ({
  icon,
  title,
  subtitle,
  backgroundColor,
  textColor,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: backgroundColor || COLORS.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={ICONS[icon]}
        style={styles.iconImage}
        resizeMode="contain"
      />
      <View style={styles.details}>
        <Text style={[styles.title, { color: textColor || COLORS.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: textColor || COLORS.textLight }]}>{subtitle}</Text>
        <Text style={[styles.terms, { color: textColor || COLORS.textLight }]}>*T&C apply</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 276,
    height: 153,
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
    justifyContent: 'center',
  },
  title: {
    ...FONTS.semibold(13),
    marginBottom: 5,
  },
  subtitle: {
    ...FONTS.body5,
  },
  terms: {
    ...FONTS.medium(12),
    marginTop: 5,
  },
});

export default WeekendCard;
