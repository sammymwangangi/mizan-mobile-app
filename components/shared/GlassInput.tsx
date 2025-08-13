// components/shared/GlassInput.tsx
import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Platform,
  Image,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

type GlassInputProps = TextInputProps & {
  height?: number;
  radius?: number;               // pill radius
  left?: React.ReactNode;        // optional left icon
  containerStyle?: StyleProp<ViewStyle>;
  showNoise?: boolean;           // set true if you add a noise asset
};

export const GlassInput = forwardRef<TextInput, GlassInputProps>(
  (
    {
      height = 55,
      radius = 30,
      left,
      style,
      containerStyle,
      showNoise = false,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={[{ height }, containerStyle]}>
        <View style={[styles.container, { height, borderRadius: radius }]}>
          {/* Backdrop blur + base tint */}
          <BlurView
            intensity={Platform.OS === 'ios' ? 60 : 35}
            tint="dark"
            style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: radius, backgroundColor: 'rgba(255,255,255,0.06)' },
            ]}
          />

          {/* Edge highlight (top/left) */}
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          />

          {/* Soft inner shadow at the bottom */}
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          />

          {/* Specular “streak” */}
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255,255,255,0.0)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0.0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.streak,
              {
                top: 0,
                height: Math.max(55, height * 0.55),
                borderRadius: radius * 0.6,
                opacity: focused ? 0.9 : 0.7,
              },
            ]}
          />

          {/* Optional subtle film grain (add your own tiny noise png) */}
          {showNoise ? (
            <Image
              source={require('../../assets/cards/shams/noise-64.png')}
              resizeMode="repeat"
              style={[StyleSheet.absoluteFill, { opacity: 0.06, borderRadius: radius }]}
            />
          ) : null}

          {/* Double ring for depth */}
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)' },
            ]}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: radius,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.35)',
                transform: [{ translateY: 1 }],
              },
            ]}
          />

          {/* Focus ring */}
          {focused && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: radius,
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.25)',
                },
              ]}
            />
          )}

          {/* Content row */}
          <View style={[styles.row, { height, borderRadius: radius }]}>
            {left ? <View style={styles.left}>{left}</View> : null}

            <TextInput
              ref={ref}
              {...props}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              placeholderTextColor="rgba(255,255,255,0.65)"
              style={[
                styles.input,
                props.multiline ? styles.inputMultiline : null,
                left ? { paddingLeft: 8 } : null,
                style,
              ]}
            />
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  left: {
    justifyContent: 'center',
    paddingTop: 14,
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 14,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: 14,
    paddingBottom: 14,
  },
  streak: {
    position: 'absolute',
    left: '0%',
    right: '0%',
    transform: [{ rotate: '1deg' }],
  },
});

export default GlassInput;
