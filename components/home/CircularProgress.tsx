import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// Create an animated version of Path
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number; // Progress in percentage (0-100)
  backgroundColor?: string;
  progressColor?: string;
  waveColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 200,
  strokeWidth = 10,
  progress = 67,
  backgroundColor = '#e0e0e0',
  progressColor = '#6200ea',
  waveColor = '#bb86fc',
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate the progress circle
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  // Animate the wave movement
  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Fix for strokeDashoffset type mismatch
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  }) as unknown as number;

  // Create the wave path for the liquid fill effect
  const waveHeight = 10;
  const waveLength = size / 2;
  const wavePath = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -waveLength],
  });

  const fillHeight = (size * (progress / 100)) / 2;
  const waveY = size - fillHeight;

  const waveD = `
    M 0 ${waveY}
    Q ${waveLength / 4} ${waveY - waveHeight}, ${waveLength / 2} ${waveY}
    T ${waveLength} ${waveY}
    T ${waveLength * 2} ${waveY}
    L ${size} ${size}
    L 0 ${size}
    Z
  `;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Liquid Fill Wave */}
        <AnimatedPath
          d={waveD}
          fill={waveColor}
          transform={[{ translateX: wavePath }]}
        />
      </Svg>
      {/* Text Overlay */}
      <View style={styles.textContainer}>
        <Animated.Text style={styles.text}>
          {Math.round(progress)}%
        </Animated.Text>
        <Animated.Text style={styles.subText}>
          next milestone
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  subText: {
    fontSize: 16,
    color: '#6200ea',
  },
});

export default CircularProgress;