import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define the route prop type
type CampaignDetailsRouteProp = RouteProp<RootStackParamList, 'CampaignDetails'>;
// Define the navigation prop type
type CampaignDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CampaignDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CampaignDetailsNavigationProp>();
  const route = useRoute<CampaignDetailsRouteProp>();
  const { campaignId } = route.params;

  // Mock campaign data - in a real app, you would fetch this based on campaignId
  const campaign = {
    id: campaignId,
    title: 'Help feed the needy this Ramadhan',
    amountRaised: 103000,
    targetAmount: 312000,
    progress: 33,
    daysRemaining: 3,
    image: require('../assets/islamic-corner/allah-shade.png'),
    donors: 99,
    description: `
      Dui, in sapien tempus dictum ultricies scelerisque molestie platea non. Quis ut est tellus nunc est odio erat. Sagittis cursus id egestas nibh eu aliquam scelerisque habitant. Quam mauris metus sagittis pulvinar et egestas nunc ac.

      Phasellus cursus in maecenas condimentum sed eleifend. Dolor gravida enim netus massa non cursus in amet, aliquet. Fames tempor viverra semper augue ut sem hac.
    `,
  };

  // Handle donate button press
  const handleDonatePress = () => {
    navigation.navigate('DonationAmount', { campaignId });
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Generate donor avatars
  const donorAvatars = [
    { id: 'donor-1', avatar: require('../assets/islamic-corner/avatar1.png') },
    { id: 'donor-2', avatar: require('../assets/islamic-corner/avatar2.png') },
    { id: 'donor-3', avatar: require('../assets/islamic-corner/avatar3.png') },
    { id: 'donor-4', avatar: require('../assets/islamic-corner/avatar4.png') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Image */}
      <ImageBackground
        source={campaign.image}
        style={[styles.backgroundImage, { paddingTop: insets.top }]}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { marginTop: insets.top }]}
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color={COLORS.textWhite} />
        </TouchableOpacity>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
      </ImageBackground>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Campaign Info Card */}
        <View style={styles.campaignCard}>
          <Text style={styles.campaignTitle}>{campaign.title}</Text>

          <View style={styles.campaignProgressContainer}>
            <Text style={styles.campaignAmount}>
              $ {campaign.amountRaised.toLocaleString()} USD raised
            </Text>
            <Text style={styles.campaignPercentage}>{campaign.progress}%</Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${campaign.progress}%` }
              ]}
            />
          </View>

          <View style={styles.campaignTimeContainer}>
            <Image
              source={require('../assets/islamic-corner/clock-icon.png')}
              style={styles.clockIcon}
            />
            <Text style={styles.campaignTimeText}>{campaign.daysRemaining} days to go</Text>
          </View>
        </View>

        {/* Donor Avatars */}
        <View style={styles.donorsSection}>
          <View style={styles.donorAvatars}>
            {donorAvatars.map((donor, index) => (
              <Image
                key={donor.id}
                source={donor.avatar}
                style={[
                  styles.donorAvatar,
                  { marginLeft: index > 0 ? -15 : 0 }
                ]}
              />
            ))}
          </View>
          <Text style={styles.donorsText}>{campaign.donors}+ people donated</Text>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About this cause</Text>
          <Text style={styles.aboutText}>{campaign.description}</Text>
        </View>
      </ScrollView>

      {/* Donate Button */}
      <View style={[styles.donateButtonContainer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity
          style={styles.donateButton}
          onPress={handleDonatePress}
        >
          <LinearGradient
            colors={['#8336E6', '#A276FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.donateButtonGradient}
          >
            <Text style={styles.donateButtonText}>DONATE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  scrollView: {
    flex: 1,
    marginTop: -50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  campaignCard: {
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
  campaignTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 15,
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
  donorsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  donorAvatars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  donorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  donorsText: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  aboutSection: {
    paddingHorizontal: 20,
  },
  aboutTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 10,
  },
  aboutText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  donateButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingTop: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  donateButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  donateButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donateButtonText: {
    ...FONTS.h4,
    color: COLORS.textWhite,
    letterSpacing: 1,
  },
});

export default CampaignDetailsScreen;
