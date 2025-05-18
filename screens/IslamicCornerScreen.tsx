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
        color: '#F5A9F2',
        icon: require('../assets/islamic-corner/shade-icon.png')
      },
      {
        label: 'B',
        percentage: 36,
        color: '#8336E6',
        icon: require('../assets/islamic-corner/graph-donate-icon.png')
      },
      {
        label: 'A',
        percentage: 32,
        color: '#69DBFF',
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
            <ChevronDown size={16} color={COLORS.primary} />
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
                strokeWidth="16"
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
                    strokeWidth="16"
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
                  fontSize="14"
                  fontWeight="500"
                  fill="#666666"
                >
                  My Jannah
                </SvgText>
                <SvgText
                  x="90"
                  y="105"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="700"
                  fill="#333333"
                >
                  ${contributionsData.total}
                </SvgText>
              </G>
            </Svg>

            {/* Segment Labels */}
            {contributionsData.breakdown.map((segment, index) => {
              // Position labels around the circle
              const angle = (segment.percentage / 100) * Math.PI * 2 * 0.5 +
                contributionsData.breakdown
                  .slice(0, index)
                  .reduce((acc, curr) => acc + curr.percentage, 0) / 100 * Math.PI * 2;

              const labelRadius = 110;
              const x = 90 + labelRadius * Math.cos(angle - Math.PI / 2);
              const y = 90 + labelRadius * Math.sin(angle - Math.PI / 2);

              return (
                <View
                  key={index}
                  style={[
                    styles.segmentLabel,
                    {
                      backgroundColor: segment.color,
                      left: x - 35,
                      top: y - 20,
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
          <View style={styles.campaignIconContainer}>
            <Image
              source={require('../assets/islamic-corner/graph-donate-icon.png')}
              style={styles.campaignIcon}
            />
          </View>

          {/* Campaign Info */}
          <View style={styles.campaignContent}>
            <Text style={styles.campaignTitle}>{item.title}</Text>
            <Text style={styles.campaignCause}>Cause : {item.cause}</Text>

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
      <StatusBar barStyle="dark-content" />

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
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  contributionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    ...FONTS.body4,
    color: COLORS.primary,
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
    marginTop: 20,
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contributionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginRight: 10,
  },
  contributionItemText: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  contributionItemHighlight: {
    ...FONTS.body4,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  contributionItemAmount: {
    ...FONTS.body4,
    color: COLORS.text,
    marginLeft: 'auto',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8336E6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -30,
    left: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  campaignIcon: {
    width: 28,
    height: 28,
    tintColor: COLORS.textWhite,
  },
  campaignTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
  },
  campaignCause: {
    ...FONTS.body4,
    color: '#B39DDB',
    marginBottom: 20,
  },
  campaignProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  campaignAmount: {
    ...FONTS.body3,
    fontWeight: '600',
    color: COLORS.text,
  },
  campaignPercentage: {
    ...FONTS.body3,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0E6FF',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8336E6',
    borderRadius: 4,
  },
  campaignTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clockIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#9E9E9E',
  },
  campaignTimeText: {
    ...FONTS.body4,
    color: '#9E9E9E',
  },
});

export default IslamicCornerScreen;
