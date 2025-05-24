import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

// Define the route prop type
type DonationConfirmationRouteProp = RouteProp<RootStackParamList, 'DonationConfirmation'>;
// Define the navigation prop type
type DonationConfirmationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DonationConfirmationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DonationConfirmationNavigationProp>();
  const route = useRoute<DonationConfirmationRouteProp>();
  const { amount, paymentMethod } = route.params;

  // Mock data for the confirmation screen
  const contributionsData = {
    total: 1.00, // The amount donated
    previousContributions: {
      t: 11.55,
      b: 31.23,
      a: 31.00,
    }
  };

  // Social media platforms
  const socialPlatforms = [
    { id: 'instagram', icon: require('../assets/islamic-corner/socials/Instagram.png') },
    { id: 'twitter', icon: require('../assets/islamic-corner/socials/Twitter.png') },
    { id: 'linkedin', icon: require('../assets/islamic-corner/socials/Linkedin.png') },
    { id: 'facebook', icon: require('../assets/islamic-corner/socials/Facebook.png') },
  ];

  // Handle back button press
  const handleBackPress = () => {
    // Navigate back to Home screen with the Islamic Corner tab selected
    navigation.navigate('Home', { screen: 'IslamicCorner' });
  };

  // Handle share on social media
  const handleShare = (platformId: string) => {
    // In a real app, implement sharing functionality
    console.log(`Sharing on ${platformId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Thank You Message */}
      <View style={styles.thankYouContainer}>
        <Text style={styles.thankYouText}>Shukran Habibi</Text>
      </View>

      {/* Contribution Circle */}
      <View style={styles.contributionCircleContainer}>
        <Svg height="180" width="180" viewBox="0 0 180 180">
          {/* Background Circle */}
          <Circle
            cx="90"
            cy="90"
            r="80"
            stroke="#F5F5F8"
            strokeWidth="6"
            fill="transparent"
          />

          {/* Progress Segments */}
          {/* T Segment */}
          <Circle
            cx="90"
            cy="90"
            r="80"
            stroke="#F5A9F2"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={`${0.25 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
            strokeDashoffset={0}
            transform="rotate(-90, 90, 90)"
          />

          {/* B Segment */}
          <Circle
            cx="90"
            cy="90"
            r="80"
            stroke="#69DBFF"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={`${0.25 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
            strokeDashoffset={-0.25 * 2 * Math.PI * 80}
            transform="rotate(-90, 90, 90)"
          />

          {/* A Segment */}
          <Circle
            cx="90"
            cy="90"
            r="80"
            stroke="#8336E6"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={`${0.25 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
            strokeDashoffset={-0.5 * 2 * Math.PI * 80}
            transform="rotate(-90, 90, 90)"
          />

          {/* Center Text */}
          <G>
            <SvgText
              x="90"
              y="80"
              textAnchor="middle"
              fontSize="14"
              fontWeight="500"
              fill="#666666"
            >
              Added
            </SvgText>
            <SvgText
              x="90"
              y="110"
              textAnchor="middle"
              fontSize="24"
              fontWeight="700"
              fill="#333333"
            >
              ${parseFloat(amount as string).toFixed(2)}
            </SvgText>
          </G>
        </Svg>

        {/* Segment Labels - improved alignment */}
        {[
          {
            color: '#F5A9F2',
            icon: require('../assets/islamic-corner/shade-icon.png'),
            value: contributionsData.previousContributions.t,
            percent: 0.25,
          },
          {
            color: '#69DBFF',
            icon: require('../assets/islamic-corner/mosque-icon.png'),
            value: contributionsData.previousContributions.b,
            percent: 0.25,
          },
          {
            color: '#8336E6',
            icon: require('../assets/islamic-corner/graph-donate-icon.png'),
            value: contributionsData.previousContributions.a,
            percent: 0.25,
          },
        ].map((segment, index, arr) => {
          // Calculate start angle
          const prevPercent = arr.slice(0, index).reduce((acc, curr) => acc + curr.percent, 0);
          const segmentAngle = segment.percent * 360;
          const startAngle = prevPercent * 360;
          const centerAngle = startAngle + segmentAngle / 2;
          const angleRad = (centerAngle - 90) * (Math.PI / 180); // -90 to start from top
          const labelRadius = 92; // slightly outside the arc
          const x = 90 + labelRadius * Math.cos(angleRad);
          const y = 90 + labelRadius * Math.sin(angleRad);
          return (
            <View
              key={index}
              style={[
                styles.segmentLabel,
                {
                  backgroundColor: segment.color,
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: [
                    { translateX: -35 }, // half of label width
                    { translateY: -20 }, // half of label height
                  ],
                }
              ]}
            >
              <Image
                source={segment.icon}
                style={styles.segmentIcon}
              />
              <Text style={styles.segmentLabelText}>${segment.value}</Text>
            </View>
          );
        })}
      </View>

      {/* Share Section */}
      <View style={styles.shareSection}>
        <Text style={styles.shareText}>Help share the cause on :</Text>

        <View style={styles.socialIconsContainer}>
          {socialPlatforms.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={styles.socialIconButton}
              onPress={() => handleShare(platform.id)}
            >
              <Image source={platform.icon} style={styles.socialIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Go Back Button */}
      <View style={[styles.goBackButtonContainer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={handleBackPress}
        >
          <LinearGradient
            colors={['#8336E6', '#A276FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goBackButtonGradient}
          >
            <Text style={styles.goBackButtonText}>GO BACK</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankYouContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  thankYouText: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  contributionCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  segmentLabel: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    minWidth: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: COLORS.textWhite,
  },
  segmentLabelText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '500',
  },
  shareSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  shareText: {
    ...FONTS.body3,
    color: COLORS.text,
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  goBackButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  goBackButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  goBackButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButtonText: {
    ...FONTS.h4,
    color: COLORS.textWhite,
    letterSpacing: 1,
  },
});

export default DonationConfirmationScreen;
