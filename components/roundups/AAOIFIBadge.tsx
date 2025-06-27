import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Plus, CheckCircle } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { normalize } from '../../utils';

interface Props {
  certified?: boolean;
}

const AAOIFIBadge: React.FC<Props> = ({ certified = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {certified ? (
          <CheckCircle size={16} color={COLORS.success} />
        ) : (
          <Plus size={16} color={COLORS.primary} />
        )}
      </View>
      <Text style={styles.text}>
        AAOIFI-Certified
      </Text>
      <View style={styles.statusIndicator}>
        <View style={[
          styles.statusDot, 
          { backgroundColor: certified ? COLORS.success : COLORS.textLight }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background2,
    borderRadius: normalize(20),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    alignSelf: 'flex-start',
    marginBottom: normalize(20),
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
