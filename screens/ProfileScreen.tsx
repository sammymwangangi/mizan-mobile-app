import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Alert } from 'react-native';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Reset navigation stack and navigate to Auth screen
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              })
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('../assets/profile/profile-image.png')} 
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.uploadButton}>
              <Image
                source={require('../assets/profile/upload-icon.png')}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>Tap to upload</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionItem}>
              <Image
                source={require('../assets/profile/settings.png')}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Image
                source={require('../assets/profile/notifications.png')}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Notifications Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Image
                source={require('../assets/profile/cancel.png')}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Cancel Membership</Text>
            </TouchableOpacity>
          </View>

          {/* Power Off Button */}
          <TouchableOpacity 
            style={styles.powerOffButton}
            onPress={handleLogout}
          >
            <Image
              source={require('../assets/profile/power.png')}
              style={styles.powerIcon}
            />
            <Text style={styles.powerText}>Power-off</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AB9BE9',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.semibold(20),
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 120,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  uploadIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  uploadText: {
    fontSize: 18,
    fontFamily: 'Poppins',
    color: COLORS.text,
  },
  optionsContainer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  optionText: {
    ...FONTS.medium(18),
    color: COLORS.textWhite,
  },
  powerOffButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  powerIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  powerText: {
    ...FONTS.semibold(12),
    color: COLORS.textWhite,
  },
});

export default ProfileScreen;
