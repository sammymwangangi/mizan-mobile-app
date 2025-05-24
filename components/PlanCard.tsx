import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

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
    <View style={[styles.container]}>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/subscription-user.png')}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>

      <View style={{ marginTop: 60 }}>
        <MaskedView
          style={{ height: 60, width: 300 }}
          maskElement={
            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ ...FONTS.h2 }}>
                {planName}
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={['#80B2FF', '#7C27D9', '#FF68F0']}
            locations={[0, 0.5155, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </MaskedView>
      </View>

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
    position: 'relative',
    width: SIZES.width - 40,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },

  avatarContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: -40,
    left: '50%',
    right: '50%',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 155,
  },
  planName: {
    ...FONTS.h3,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 80,
  },
  price: {
    ...FONTS.semibold(14),
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
    ...FONTS.semibold(20),
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
    borderWidth: 1.5,
    borderColor: '#A276FF',
    borderRadius: 4,
    backgroundColor: 'white',
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
