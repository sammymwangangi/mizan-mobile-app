import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { formatCurrency } from '../utils';

const ICONS: Record<string, any> = {
  'cab.png': require('../assets/payments/cab.png'),
  'lunch.png': require('../assets/payments/lunch.png'),
};

interface TransactionItemProps {
  icon: string; // now expects image filename
  title: string;
  subtitle: string;
  amount: number;
  time: string;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  icon,
  title,
  subtitle,
  amount,
  time,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <Image
          source={ICONS[icon]}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  details: {
    flex: 1,
  },
  title: {
    ...FONTS.semibold(13),
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    ...FONTS.semibold(13),
    color: COLORS.text,
  },
  time: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
});

export default TransactionItem;
