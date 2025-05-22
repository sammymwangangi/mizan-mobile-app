import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
  ColorValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
  gradientColors?: [ColorValue, ColorValue, ...ColorValue[]];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  leftIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  gradient = true,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  leftIcon,
  ...rest
}) => {
  const getButtonStyles = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};

    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, paddingVertical: SIZES.base, paddingHorizontal: SIZES.padding / 2 };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, paddingVertical: SIZES.padding / 1.5, paddingHorizontal: SIZES.padding };
        break;
      default: // medium
        buttonStyle = { ...buttonStyle, paddingVertical: SIZES.padding / 2, paddingHorizontal: SIZES.padding };
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: COLORS.secondary,
          borderRadius: SIZES.radius,
        };
        break;
      case 'outline':
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary,
          borderRadius: SIZES.radius,
        };
        break;
      case 'text':
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
        };
        break;
      default: // primary
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: gradient ? 'transparent' : COLORS.primary,
          borderRadius: SIZES.radius,
        };
    }

    // Disabled state
    if (disabled) {
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: variant === 'outline' || variant === 'text' ? 'transparent' : COLORS.disabled,
        borderColor: variant === 'outline' ? COLORS.disabled : buttonStyle.borderColor,
        opacity: variant === 'text' ? 0.5 : 1,
      };
    }

    return buttonStyle;
  };

  const getTextStyles = (): TextStyle => {
    let textStyleObj: TextStyle = {
      ...FONTS.semibold(16),
      letterSpacing: 1,
      color: COLORS.textWhite
    };

    // Size styles
    switch (size) {
      case 'small':
        textStyleObj = {
          ...textStyleObj,
          ...FONTS.semibold(14)
        };
        break;
      case 'large':
        textStyleObj = {
          ...textStyleObj,
          ...FONTS.semibold(18)
        };
        break;
      default: // medium
        textStyleObj = {
          ...textStyleObj,
          ...FONTS.semibold(16)
        };
    }

    // Variant styles
    switch (variant) {
      case 'outline':
        textStyleObj = { ...textStyleObj, color: disabled ? COLORS.disabled : COLORS.primary };
        break;
      case 'text':
        textStyleObj = { ...textStyleObj, color: disabled ? COLORS.disabled : COLORS.primary };
        break;
      default: // primary, secondary
        textStyleObj = { ...textStyleObj, color: COLORS.textWhite };
    }

    return textStyleObj;
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.textWhite}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
        </View>
      )}
    </>
  );

  if (gradient && variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.container, style]}
        {...rest}
      >
        <LinearGradient
          colors={gradientColors || ['#E9B8FF', '#A9C7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[getButtonStyles(), styles.gradientButton]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), styles.container, style]}
      {...rest}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 28,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default Button;
