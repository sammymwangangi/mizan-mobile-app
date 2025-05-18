import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Image, 
  ImageSourcePropType,
  ViewStyle
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
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  title: {
    ...FONTS.body5,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default CardActionButton;
