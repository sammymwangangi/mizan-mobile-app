import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';

interface PaymentCardProps {
  cardNumber: string;
  validity: string;
  brand: string;
  isActive?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  cardNumber,
  validity,
  brand,
  isActive = false,
}) => {
  // Determine card logo based on brand
  const getCardLogo = () => {
    if (brand.toLowerCase().includes('visa')) {
      return require('../assets/visa-logo.png');
    } else if (brand.toLowerCase().includes('mastercard')) {
      return require('../assets/mastercard-logo.png');
    }
    // Default to mastercard if brand is not recognized
    return require('../assets/mastercard-logo.png');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D155FF', '#B532F2', '#A016E8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardBrand}>mizan</Text>
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>{cardNumber}</Text>
            <Image 
              source={getCardLogo()} 
              style={styles.cardLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cardValidity}>{validity}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBrand: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    letterSpacing: 2,
  },
  cardLogo: {
    width: 40,
    height: 30,
  },
  cardValidity: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    alignSelf: 'flex-end',
  },
});

export default PaymentCard;
