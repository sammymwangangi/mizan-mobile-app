import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Image, 
  ImageSourcePropType,
  ViewStyle,
  View
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface CardActionButtonProps {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  style?: ViewStyle;
}

const CardActionButton: React.FC<CardActionButtonProps> = ({
  title,
  icon,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 20,
  },
  icon: {
    width: 32,
    height: 32,
  },
  title: {
    ...FONTS.medium(12),
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default CardActionButton;
