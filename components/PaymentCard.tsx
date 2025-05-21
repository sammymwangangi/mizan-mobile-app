import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

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
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/cards/card-gradient-background.png')}
        style={styles.card}
        imageStyle={styles.cardBgImage}
      >
        {/* Pattern on the left side */}
        <Image
          source={require('../assets/cards/card-pattern.png')}
          style={styles.pattern}
          resizeMode="contain"
        />
        {/* Top row: logo and wifi */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }} />
          <Image
            source={require('../assets/cards/white-logo.png')}
            style={styles.mizanLogo}
            resizeMode="contain"
          />
        </View>
        {/* Card number */}
        <View style={styles.cardNumberRow}>
          <Text style={styles.cardNumber}>{cardNumber}</Text>
          <Image
            source={require('../assets/cards/wifi.png')}
            style={styles.wifi}
            resizeMode="contain"
          />
        </View>
        {/* Bottom row: validity and brand */}
        <View style={styles.bottomRow}>
          <View style={styles.validityBlock}>
            <Text style={styles.validThruLabel}>VALID THRUss</Text>
            <Text style={styles.validity}>{validity}</Text>
          </View>
          
          <Image
            source={require('../assets/cards/mastercard.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  card: {
    width: 286,
    height: 166,
    borderRadius: 18,
    overflow: 'hidden',
    padding: 0,
    justifyContent: 'flex-start',
  },
  cardBgImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  pattern: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 163.15,
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 18,
    marginRight: 18,
    zIndex: 2,
  },
  mizanLogo: {
    width: 80,
    height: 32,
  },
  cardNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    zIndex: 2,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: 'OCR-A',
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    zIndex: 2,
  },
  validityBlock: {
    flexDirection: 'column',
  },
  validThruLabel: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.8,
    fontWeight: '400',
  },
  validity: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  wifi: {
    width: 28,
    height: 28,
    marginLeft: 10,
    marginRight: 10,
  },
  brandLogo: {
    width: 38,
    height: 38,
  },
});

export default PaymentCard;
