import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS, cancelAnimation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { METAL_SWATCHES } from '../../../constants/shams';

// SVG assets (gracefully degrade if transformer isn't available)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ShamsPattern from '../../../assets/cards/shams/pattern-bg.svg';
// Reuse shared brand assets from Qamar preview for consistency
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MizanLogo from '../../../assets/cards/card-studio/qamar-card/mizan-logo.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MastercardLogo from '../../../assets/cards/card-studio/qamar-card/mastercard-logo.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Contactless from '../../../assets/cards/card-studio/qamar-card/contactless.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Chip from '../../../assets/cards/card-studio/qamar-card/chip.svg';

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

const CARD_W = 335;
const CARD_H = 200;
const RADIUS = 16;

const ShamsCardPreview: React.FC<Props> = ({ metalId = 'bronze', playSheen = false, onSheenEnd, width = CARD_W, height = CARD_H, expiryText = 'Exp 12/2026' }) => {
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

          {/* Subtle pattern overlay */}
          <G opacity={0.20}>
            {toComponent(ShamsPattern) ? React.createElement(toComponent(ShamsPattern)!, { width, height, preserveAspectRatio: 'xMinYMin slice' }) : null}
          </G>
        </Svg>

        {/* Brand overlays */}
        <View pointerEvents="none" style={styles.overlay}>
          <View style={styles.logoRow}>
            {toComponent(MizanLogo) ? React.createElement(toComponent(MizanLogo)!, { width: 67, height: 30 }) : null}
          </View>
          <View style={styles.chipRow}>
            {toComponent(Contactless) ? React.createElement(toComponent(Contactless)!, { width: 28, height: 20 }) : null}
            {toComponent(Chip) ? React.createElement(toComponent(Chip)!, { width: 36, height: 36 }) : null}
          </View>
          <View style={styles.footerRow}>
            {toComponent(MastercardLogo) ? React.createElement(toComponent(MastercardLogo)!, { width: 34, height: 21 }) : null}
          </View>

          {/* Expiry text */}
          <View style={styles.expiryRow}>
            <Text style={styles.expiryText}>{expiryText}</Text>
          </View>
        </View>

        {/* Sheen overlay */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}> 
          <Animated.View style={[styles.sheen, sheenStyle]}> 
            <LinearGradient
              colors={["#FFFFFF00", "#FFFFFF80", "#FFFFFF00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 60, height }}
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
  },
  card: {
    overflow: 'hidden',
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
  logoRow: {
    position: 'absolute',
    top: 14,
    right: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    opacity: 0.9,
  },
  chipRow: {
    position: 'absolute',
    top: 66,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerRow: {
    position: 'absolute',
    bottom: 14,
    right: 16,
  },
  expiryRow: {
    position: 'absolute',
    bottom: 14,
    left: 16,
  },
  expiryText: {
    color: '#101010',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    transform: [{ rotate: '12deg' }],
  },
});

export default ShamsCardPreview;

