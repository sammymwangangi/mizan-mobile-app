import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS, cancelAnimation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { NoorColor } from '../../../constants/noor';

// SVG assets (requires react-native-svg-transformer). If transformer is not installed yet,
// we gracefully no-op the decorative layers. After approval we can add the transformer.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Rectangle1 from '../../../assets/cards/card-studio/qamar-card/rectangle1.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Rectangle2 from '../../../assets/cards/card-studio/qamar-card/rectangle2.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Pattern1 from '../../../assets/cards/card-studio/qamar-card/pattern1.svg';

import MizanLogoIcon from '../../../assets/cards/noor/noor-card-logo.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MizanLogo from '../../../assets/cards/card-studio/qamar-card/mizan-logo.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MastercardLogo from '../../../assets/cards/noor/mastercard-logo.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Contactless from '../../../assets/cards/card-studio/qamar-card/contactless.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Chip from '../../../assets/cards/card-studio/qamar-card/chip.svg';

// Gracefully handle environments without SVG transformer
const toComponent = (M: any): React.ComponentType<any> | null => {
  if (!M) return null;
  if (typeof M === 'function') return M as any;
  if (typeof M?.default === 'function') return M.default as any;
  return null;
};

interface Props {
  color: NoorColor | null;
  playSheen?: boolean;
  onSheenEnd?: () => void;
  width?: number; // default 300
  height?: number; // default 190
  expiryText?: string; // e.g., "Exp 12/2026"
}

const CARD_W = 335;
const CARD_H = 200;
const RADIUS = 16;

const NoorCardPreview: React.FC<Props> = ({ color, playSheen = false, onSheenEnd, width = CARD_W, height = CARD_H, expiryText = 'Exp 12/2026' }) => {
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

  const gradientId = 'bg-gradient';

  // Map gradient angle (deg) to x1,y1,x2,y2 for react-native-svg (0deg = left-to-right)
  const angleToPoints = (angleDeg: number) => {
    const angle = (angleDeg % 360) * (Math.PI / 180);
    // Convert to unit vector
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    // Map [-1,1] to [0,1]
    const x1 = 0.5 - x / 2;
    const y1 = 0.5 - y / 2;
    const x2 = 0.5 + x / 2;
    const y2 = 0.5 + y / 2;
    return { x1, y1, x2, y2 };
  };

  const hasGradient = !!color?.gradient;
  const points = hasGradient ? angleToPoints(color!.gradient!.angle) : angleToPoints(45);

  return (
    <View style={[styles.wrapper, { width, height }]}> 
      <View style={[styles.card, { width, height, borderRadius: RADIUS }]}> 
        <Svg width={width} height={height}>
          <Defs>
            {hasGradient && (
              <SvgLinearGradient id={gradientId} x1={points.x1.toString()} y1={points.y1.toString()} x2={points.x2.toString()} y2={points.y2.toString()}>
                {color!.gradient!.stops.map((s, idx) => (
                  <Stop key={idx} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
                ))}
              </SvgLinearGradient>
            )}
          </Defs>

          {/* Background fill */}
          <Rect x={0} y={0} width={width} height={height} rx={RADIUS} ry={RADIUS} fill={hasGradient ? `url(#${gradientId})` : (color?.value || '#8F00E0')} />

          {/* Main pattern overlay (anchored bottom-left) */}
          {toComponent(MizanLogoIcon) ? (
            React.createElement(toComponent(MizanLogoIcon)!, {
              width: 203,
              height: 120,
              preserveAspectRatio: 'xMinYMax meet',
              x: 0,
              y: 0,
            })
          ) : null}
        </Svg>

        {/* Brand and icons overlays (absolute positioned) */}
        <View pointerEvents="none" style={styles.overlay}>
          <View style={[styles.logoRow]}>
            {toComponent(MizanLogo) ? React.createElement(toComponent(MizanLogo)!, { width: 67, height: 30 }) : null}
          </View>

          <View style={styles.footerRow}>
            {toComponent(MastercardLogo) ? React.createElement(toComponent(MastercardLogo)!, { width: 48, height: 28 }) : null}
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
    opacity: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerRow: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    opacity: 0.9,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
  expiryRow: {
    position: 'absolute',
    left: 16,
    bottom: 18,
  },
  expiryText: {
    color: 'white',
    opacity: 0.9,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NoorCardPreview;

