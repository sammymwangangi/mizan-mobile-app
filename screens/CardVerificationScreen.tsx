import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

type CardVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardVerification'>;

const CardVerificationScreen = () => {
  const navigation = useNavigation<CardVerificationScreenNavigationProp>();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Uploading...');

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          // Update status text when reaching certain thresholds
          if (prev === 30) {
            setStatus('Processing...');
          } else if (prev === 70) {
            setStatus('Verifying...');
          }
          return prev + 1;
        } else {
          clearInterval(interval);
          // Navigate back to cards dashboard after completion
          setTimeout(() => {
            navigation.navigate('CardsDashboard');
          }, 1000);
          return 100;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [navigation]);

  // Calculate the circumference of the circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.placeholder} />
        <View style={styles.placeholder} />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Uploading Card</Text>
        
        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <Svg height="200" width="200" viewBox="0 0 100 100">
            {/* Background Circle */}
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#E6E6FF"
              strokeWidth="10"
              fill="transparent"
            />
            
            {/* Progress Circle */}
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#8A2BE2"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90, 50, 50)"
            />
            
            {/* Percentage Text */}
            <G>
              <SvgText
                x="50"
                y="50"
                fontSize="18"
                fontWeight="bold"
                fill="#8A2BE2"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {`${progress}%`}
              </SvgText>
            </G>
          </Svg>
        </View>
        
        {/* Status Text */}
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 40,
  },
  progressContainer: {
    marginVertical: 30,
  },
  statusText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginTop: 20,
  },
});

export default CardVerificationScreen;
