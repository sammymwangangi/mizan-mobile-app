import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS, cancelAnimation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { METAL_SWATCHES } from '../../../constants/shams';

// Reuse shared brand assets from Qamar preview for consistency (except center logo)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MastercardLogo from '../../../assets/cards/card-studio/qamar-card/mastercard-logo.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Contactless from '../../../assets/cards/card-studio/qamar-card/contactless.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Chip from '../../../assets/cards/card-studio/qamar-card/chip.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Rectangle1 from '../../../assets/cards/card-studio/qamar-card/rectangle1.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Rectangle2 from '../../../assets/cards/card-studio/qamar-card/rectangle2.svg';

const toComponent = (M: any): React.ComponentType<any> | null => {
  if (!M) return null;
  if (typeof M === 'function') return M as any;
  if (typeof M?.default === 'function') return M.default as any;
  return null;
};

export type MetalId = keyof typeof METAL_SWATCHES | string;

interface Props {
  metalId?: MetalId; // e.g., 'titanium' | 'bronze' | 'nebula' | 'roseGold'
  playSheen?: boolean;
  onSheenEnd?: () => void;
  width?: number;
  height?: number;
  expiryText?: string;
}

const CARD_W = 196; // portrait card width
const CARD_H = 323; // portrait card height
const RADIUS = 18;

const ShamsCardPreview: React.FC<Props> = ({ metalId = 'bronze', playSheen = false, onSheenEnd, width = CARD_W, height = CARD_H, expiryText = 'World Elite' }) => {
  const sheenX = useSharedValue(-width);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelAnimation(sheenX);
    };
  }, []);

  useEffect(() => {
    if (playSheen) {
      sheenX.value = -width;
      sheenX.value = withTiming(width * 1.5, { duration: 600, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished && onSheenEnd && mountedRef.current) {
          runOnJS(onSheenEnd)();
        }
      });
    }
  }, [playSheen, sheenX, width, onSheenEnd]);

  const sheenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sheenX.value }],
  }));

  const swatch = (METAL_SWATCHES as any)[metalId] || METAL_SWATCHES.bronze;
  const gradientId = 'shams-metal-gradient';

  // Simple 45° gradient using light→base→dark
  const angleToPoints = (angleDeg: number) => {
    const angle = (angleDeg % 360) * (Math.PI / 180);
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    const x1 = 0.5 - x / 2;
    const y1 = 0.5 - y / 2;
    const x2 = 0.5 + x / 2;
    const y2 = 0.5 + y / 2;
    return { x1, y1, x2, y2 };
  };
  const points = angleToPoints(45);

  return (
    <View style={[styles.wrapper, { width, height }]}>
      <View style={[styles.card, { width, height, borderRadius: RADIUS }]}> 
        <Svg width={width} height={height}>
          <Defs>
            <SvgLinearGradient id={gradientId} x1={points.x1.toString()} y1={points.y1.toString()} x2={points.x2.toString()} y2={points.y2.toString()}>
              <Stop offset="0%" stopColor={swatch.light} />
              <Stop offset="50%" stopColor={swatch.base} />
              <Stop offset="100%" stopColor={swatch.dark} />
            </SvgLinearGradient>
          </Defs>

          {/* Background fill */}
          <Rect x={0} y={0} width={width} height={height} rx={RADIUS} ry={RADIUS} fill={`url(#${gradientId})`} />
        </Svg>

        {/* Decorative rectangle */}
        <View style={[styles.decorativeRect]}>
          {toComponent(Rectangle2) ? React.createElement(toComponent(Rectangle2)!, { width: width * 1.2, height: height * 0.5 }) : null}
        </View>

        {/* Brand overlays - portrait alignment */}
        <View pointerEvents="none" style={styles.overlay}>
          {/* Chip and contactless near top center */}
          <View style={styles.topRow}>
            {toComponent(Chip) ? React.createElement(toComponent(Chip)!, { width: 36, height: 36 }) : null}
            {toComponent(Contactless) ? React.createElement(toComponent(Contactless)!, { width: 24, height: 18 }) : null}
          </View>

          {/* Center Mizan icon image */}
          <View style={styles.centerLogoWrap}>
            <Image source={require('../../../assets/cards/shams/mizan-icon.png')} style={{ width: 84, height: 84, opacity: 0.9 }} resizeMode="contain" />
          </View>

          {/* World Elite text lower-left */}
          <View style={styles.tierRow}>
            <Text style={styles.tierText}>{expiryText}</Text>
          </View>

          {/* Mastercard at bottom-right */}
          <View style={styles.footerRow}>
            {toComponent(MastercardLogo) ? React.createElement(toComponent(MastercardLogo)!, { width: 36, height: 22 }) : null}
          </View>
        </View>

        {/* Sheen overlay - diagonal sweep */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.sheen, sheenStyle]}>
            <LinearGradient
              colors={["#FFFFFF00", "#FFFFFF66", "#FFFFFF00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 80, height }}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  card: {
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
  },
  decorativeRect: {
    position: 'absolute',
    top: 0,
    right: -40,
    opacity: 0.6,
    zIndex: 1,
  },
  stackedCard: {
    position: 'absolute',
    top: 10,
    width: CARD_W,
    height: CARD_H,
    backgroundColor: '#FFFFFF20',
    borderRadius: RADIUS,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  topRow: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  centerLogoWrap: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierRow: {
    position: 'absolute',
    bottom: 28,
    left: 18,
  },
  tierText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    position: 'absolute',
    bottom: 22,
    right: 18,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    transform: [{ rotate: '12deg' }],
  },
});

export default ShamsCardPreview;

