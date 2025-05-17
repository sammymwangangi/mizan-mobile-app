import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface BulletPointProps {
  text: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({ text }) => {
  return (
    <View style={styles.bulletPointContainer}>
      <View style={styles.bulletPoint} />
      <Text style={styles.bulletPointText}>{text}</Text>
    </View>
  );
};

interface PlanCardProps {
  avatarColor?: string[];
  planName: string;
  price: string;
  trialInfo: string;
  bankingPoints: string[];
  savingsPoints: string[];
  isActive?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  avatarColor = ['#D155FF', '#A276FF'],
  planName,
  price,
  trialInfo,
  bankingPoints,
  savingsPoints,
  isActive = false,
}) => {
  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={avatarColor}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.planName}>{planName}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.trialInfo}>{trialInfo}</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Banking</Text>
        {bankingPoints.map((point, index) => (
          <BulletPoint key={`banking-${index}`} text={point} />
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Savings</Text>
        {savingsPoints.map((point, index) => (
          <BulletPoint key={`savings-${index}`} text={point} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 40,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  activeContainer: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0E6FF',
  },
  planName: {
    ...FONTS.h2,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  price: {
    ...FONTS.body3,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  trialInfo: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: 10,
  },
  bulletPointText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    flex: 1,
  },
});

export default PlanCard;
