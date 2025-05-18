import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Search, UserPlus, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/mpesa/SearchBar';

type MPESAScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MPESA'>;

const MPESAScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MPESAScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle search query change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Handle send money button press
  const handleSendMoney = () => {
    navigation.navigate('MPESARecipient');
  };

  // Handle invite friend button press
  const handleInviteFriend = () => {
    // Navigate to invite friend screen or show bottom sheet
    console.log('Invite friend pressed');
  };

  // Handle from contact list button press
  const handleFromContactList = () => {
    // Navigate to contact list screen or show bottom sheet
    console.log('From contact list pressed');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>M-PESA</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search for contacts or transactions"
          />

          {/* Send Money Button */}
          <TouchableOpacity
            style={styles.sendMoneyButton}
            onPress={handleSendMoney}
          >
            <LinearGradient
              colors={['#A276FF', '#8336E6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendMoneyGradient}
            >
              <Text style={styles.sendMoneyText}>SEND MONEY</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Can't find message */}
          <Text style={styles.cantFindText}>
            Can't find who you are looking for?
          </Text>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            {/* Invite a friend */}
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleInviteFriend}
            >
              <View style={styles.quickActionIconContainer}>
                <UserPlus size={24} color={COLORS.primary} />
              </View>
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>Invite a friend</Text>
                <Text style={styles.quickActionSubtitle}>
                  To make instant payments
                </Text>
              </View>
            </TouchableOpacity>

            {/* From your contact list */}
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleFromContactList}
            >
              <View style={styles.quickActionIconContainer}>
                <Users size={24} color={COLORS.primary} />
              </View>
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>From your contact list</Text>
                <Text style={styles.quickActionSubtitle}>
                  To make your first bank transfer
                </Text>
              </View>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 30,
  },
  sendMoneyButton: {
    marginTop: 20,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  sendMoneyGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendMoneyText: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cantFindText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginTop: 10,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quickActionTextContainer: {
    flex: 1,
  },
  quickActionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
});

export default MPESAScreen;
