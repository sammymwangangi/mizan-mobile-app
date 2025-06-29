import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Plus, CheckCircle } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { normalize } from '../../utils';
import PlusCert from '../../assets/round-ups/certificate.png';
import Shield from '../../assets/round-ups/shield.png';

interface Props {
  certified?: boolean;
}

const AAOIFIBadge: React.FC<Props> = ({ certified = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.badgeContent}>
        <View style={styles.iconContainer}>
          {certified ? (
            <Image source={PlusCert} style={styles.plusImage} />
          ) : (
            // <Plus size={16} color={COLORS.primary} />
            <Image source={Shield} style={styles.iconImage} />
          )}
        </View>
        <Text style={styles.text}>
          AAOIFI-Certified
        </Text>
      </View>
      <View>
        <Image source={Shield} style={styles.shieldImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    width: 16,
    height: 16,
  },
  plusImage: {
    width: 25,
    height: 25,
  },
  shieldImage: {
    width: 18,
    height: 18,
  },
  iconContainer: {
    marginRight: normalize(8),
  },
  text: {
    ...FONTS.medium(12),
    color: COLORS.text,
    marginRight: normalize(8),
  },
  statusIndicator: {
    marginLeft: normalize(4),
  },
  statusDot: {
    width: normalize(6),
    height: normalize(6),
    borderRadius: normalize(3),
  },
});

export default AAOIFIBadge;
