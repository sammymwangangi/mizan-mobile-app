import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { ChevronRight } from 'lucide-react-native';

const ICONS: Record<string, any> = {
  'reminders-icon-1.png': require('../assets/payments/reminders-icon-1.png'),
  'reminders-icon-2.png': require('../assets/payments/reminders-icon-2.png'),
};

interface ReminderItemProps {
  icon: string; // now expects image filename
  title: string;
  amount: string;
  dueDate: string;
  onPress?: () => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  icon,
  title,
  amount,
  dueDate,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
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
        <Text style={styles.dueDate}>{amount} due on {dueDate}</Text>
      </View>
      <ChevronRight size={20} color={COLORS.textLight} />
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
    width: 48,
    height: 48,
    borderRadius: 20,
    backgroundColor: '#F3EDFF',
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
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '500',
  },
  dueDate: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
});

export default ReminderItem;
