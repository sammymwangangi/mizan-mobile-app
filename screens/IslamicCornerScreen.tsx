import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

// Define the navigation prop type
type IslamicCornerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const IslamicCornerScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<IslamicCornerScreenNavigationProp>();

  // State for selected period
  const [selectedPeriod, setSelectedPeriod] = useState('June 2022');

  // Mock data for charity contributions
  const contributionsData = {
    total: 73.75,
    directDeposits: 50.44,
    roundUps: 23.31,
    breakdown: [
      {
        label: 'T',
        percentage: 32,
        color: '#F9ACFF',
        icon: require('../assets/islamic-corner/shade-icon.png')
      },
      {
        label: 'B',
        percentage: 36,
        color: '#A276FF',
        icon: require('../assets/islamic-corner/graph-donate-icon.png')
      },
      {
        label: 'A',
        percentage: 32,
        color: '#75CCFD',
        icon: require('../assets/islamic-corner/mosque-icon.png')
      },
    ]
  };

  // Mock data for campaigns
  const campaigns = [
    {
      id: '1',
      title: 'Chill under the Shade of Allah',
      cause: 'Help feed the needy',
      amountRaised: 103000,
      targetAmount: 312000,
      progress: 33,
      daysRemaining: 3,
      image: require('../assets/islamic-corner/allah-shade.png'),
    },
    {
      id: '2',
      title: 'Build a Masjid',
      cause: 'Help build a house of Allah',
      amountRaised: 250000,
      targetAmount: 500000,
      progress: 50,
      daysRemaining: 15,
      image: require('../assets/islamic-corner/allah-shade.png'),
    },
  ];

  // Handle campaign press
  const handleCampaignPress = (campaignId: string) => {
    navigation.navigate('CampaignDetails', { campaignId });
  };

  // Render charity contribution card
  const renderContributionCard = () => {
    return (
      <View style={styles.contributionCard}>
        <View style={styles.periodSelector}>
          <Text style={styles.periodLabel}>Charity contributions</Text>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>{selectedPeriod}</Text>
            <ChevronDown size={16} color={COLORS.primaryAccent} />
          </TouchableOpacity>
        </View>

        <View style={styles.contributionCircleContainer}>
          {/* Progress Circle */}
          <View style={styles.progressCircleContainer}>
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
              {contributionsData.breakdown.map((segment, index) => {
                const segmentPercentage = segment.percentage / 100;
                const circumference = 2 * Math.PI * 80;
                const offset = index === 0 ? 0 :
                  contributionsData.breakdown
                    .slice(0, index)
                    .reduce((acc, curr) => acc + curr.percentage, 0) / 100;

                return (
                  <Circle
                    key={index}
                    cx="90"
                    cy="90"
                    r="80"
                    stroke={segment.color}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${segmentPercentage * circumference} ${circumference}`}
                    strokeDashoffset={-offset * circumference}
                    transform="rotate(-90, 90, 90)"
                  />
                );
              })}

              {/* Center Text */}
              <G>
                <SvgText
                  x="90"
                  y="80"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="400"
                  fill="#6D6E8A"
                >
                  My Jannah
                </SvgText>
                <SvgText
                  x="65"
                  y="105"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="600"
                  fill="#1B1C39"
                >
                  ${'    '}{contributionsData.total}
                </SvgText>
              </G>
            </Svg>

            {/* Segment Labels */}
            {contributionsData.breakdown.map((segment, index) => {
              // Calculate the start angle for this segment
              const prevPercent = contributionsData.breakdown
                .slice(0, index)
                .reduce((acc, curr) => acc + curr.percentage, 0);
              const segmentAngle = (segment.percentage / 100) * 360;
              const startAngle = (prevPercent / 100) * 360;
              // Center angle for label
              const centerAngle = startAngle + segmentAngle / 2;
              // Convert to radians
              const angleRad = (centerAngle - 90) * (Math.PI / 180); // -90 to start from top
              const labelRadius = 110;
              const x = 90 + labelRadius * Math.cos(angleRad);
              const y = 90 + labelRadius * Math.sin(angleRad);

              return (
                <View
                  key={index}
                  style={[
                    styles.segmentLabel,
                    {
                      backgroundColor: segment.color,
                      left: x - 35, // adjust for label width
                      top: y - 20,  // adjust for label height
                    }
                  ]}
                >
                  <Image
                    source={segment.icon}
                    style={styles.segmentIcon}
                  />
                  <Text style={styles.segmentLabelText}>{segment.percentage}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Contribution Breakdown */}
        <View style={styles.contributionBreakdown}>
          <View style={styles.contributionItem}>
            <View style={styles.contributionDot} />
            <Text style={styles.contributionItemText}>via </Text>
            <Text style={styles.contributionItemHighlight}>Direct Deposits</Text>
            <Text style={styles.contributionItemAmount}>${contributionsData.directDeposits}</Text>
          </View>

          <View style={styles.contributionItem}>
            <View style={styles.contributionDot} />
            <Text style={styles.contributionItemText}>via </Text>
            <Text style={styles.contributionItemHighlight}>Round-ups</Text>
            <Text style={styles.contributionItemAmount}>${contributionsData.roundUps}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render campaign card
  const renderCampaignCard = ({ item }: { item: typeof campaigns[0] }) => {
    return (
      <TouchableOpacity
        style={styles.campaignCard}
        onPress={() => handleCampaignPress(item.id)}
      >
        {/* Background Image */}
        <Image source={item.image} style={styles.campaignImage} />

        {/* White Overlay for Content */}
        <View style={styles.campaignOverlay}>
          {/* Icon Circle */}

          {/* Campaign Info */}
          <View style={styles.campaignContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 20 }}>
              <View style={styles.campaignIconContainer}>
                <Image
                  source={require('../assets/islamic-corner/graph-donate-icon.png')}
                  style={styles.campaignIcon}
                />
              </View>
              <View>
                <Text style={styles.campaignTitle}>{item.title}</Text>
                <Text style={styles.campaignCause}>Cause : {item.cause}</Text>
              </View>
            </View>

            <View style={styles.campaignProgressContainer}>
              <Text style={styles.campaignAmount}>$ {item.amountRaised.toLocaleString()} USD raised</Text>
              <Text style={styles.campaignPercentage}>{item.progress}%</Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${item.progress}%` }
                ]}
              />
            </View>

            <View style={styles.campaignTimeContainer}>
              <Image
                source={require('../assets/islamic-corner/clock-icon.png')}
                style={styles.clockIcon}
              />
              <Text style={styles.campaignTimeText}>{item.daysRemaining} days to go</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background2} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Islamic Corner</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Charity Contribution Card */}
          {renderContributionCard()}

          {/* Campaigns Section */}
          <View style={styles.campaignsSection}>
            <FlatList
              data={campaigns}
              renderItem={renderCampaignCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.campaignsContainer}
              snapToInterval={310} // Card width (290) + horizontal margin (20)
              decelerationRate="fast"
              snapToAlignment="center"
              pagingEnabled
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background2,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contributionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 25,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  periodLabel: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    ...FONTS.semibold(14),
    color: COLORS.primaryAccent,
    marginRight: 5,
  },
  contributionCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  progressCircleContainer: {
    width: 180,
    height: 180,
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
  contributionBreakdown: {
    marginTop: 30,
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 10,
  },
  contributionDot: {
    width: 10,
    height: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#6D6E8A',
    backgroundColor: COLORS.textWhite,
    marginRight: 10,
  },
  contributionItemText: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  contributionItemHighlight: {
    ...FONTS.body5,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  contributionItemAmount: {
    ...FONTS.semibold(10),
    color: COLORS.text,
    marginLeft: 16,
  },
  campaignsSection: {
    marginBottom: 20,
  },
  campaignsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 136,
  },
  campaignCard: {
    width: 290,
    height: 454,
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  campaignOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
  },
  campaignContent: {
    padding: 15,
    paddingTop: 5,
  },
  campaignIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#A276FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  campaignIcon: {
    width: 24,
    height: 19,
    tintColor: COLORS.textWhite,
  },
  campaignTitle: {
    ...FONTS.semibold(12),
    color: COLORS.text,
  },
  campaignCause: {
    ...FONTS.semibold(12),
    color: '#A276FF',
  },
  campaignProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  campaignAmount: {
    ...FONTS.semibold(12),
    color: COLORS.text,
  },
  campaignPercentage: {
    ...FONTS.h6,
    color: COLORS.text,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9DDFA',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6B3BA6',
    borderRadius: 4,
  },
  campaignTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clockIcon: {
    width: 14,
    height: 14,
    marginRight: 8,
    tintColor: '#A4A5C3',
  },
  campaignTimeText: {
    ...FONTS.body5,
    color: '#6D6E8A',
  },
});

export default IslamicCornerScreen;
