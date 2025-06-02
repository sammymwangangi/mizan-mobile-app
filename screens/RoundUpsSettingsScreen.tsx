import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, DollarSign, TrendingUp, Heart, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency, normalize } from '../utils';
import { useRoundUps } from '../contexts/RoundUpsContext';
import GradientBackground from '../components/GradientBackground';

type RoundUpsSettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoundUpsSettings'>;

const RoundUpsSettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RoundUpsSettingsScreenNavigationProp>();
  const { state, updateSettings } = useRoundUps();

  const [isEnabled, setIsEnabled] = useState(state.settings?.isEnabled || false);
  const [roundUpMethod, setRoundUpMethod] = useState(state.settings?.roundUpMethod || 'nearest_dollar');
  const [customAmount, setCustomAmount] = useState(state.settings?.customRoundUpAmount?.toString() || '1.00');
  const [defaultDestination, setDefaultDestination] = useState(state.settings?.defaultDestination || 'investment');
  const [minimumRoundUp, setMinimumRoundUp] = useState(state.settings?.minimumRoundUp?.toString() || '0.01');
  const [maximumRoundUp, setMaximumRoundUp] = useState(state.settings?.maximumRoundUp?.toString() || '5.00');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSaveSettings = async () => {
    try {
      const newSettings = {
        isEnabled,
        roundUpMethod,
        customRoundUpAmount: roundUpMethod === 'custom_amount' ? parseFloat(customAmount) : undefined,
        defaultDestination,
        minimumRoundUp: parseFloat(minimumRoundUp),
        maximumRoundUp: parseFloat(maximumRoundUp),
      };

      await updateSettings(newSettings);
      Alert.alert('Success', 'Settings saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Background */}
      <GradientBackground
        colors={['#CE72E3', '#8C5FED', '#8C5FED']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          ...styles.headerBackground,
          paddingTop: insets.top,
        }}
      />

      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Round-Ups Settings</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Save size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Enable/Disable Round-Ups */}
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <DollarSign size={24} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Enable Round-Ups</Text>
                  <Text style={styles.settingDescription}>
                    Automatically round up your purchases
                  </Text>
                </View>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={setIsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={isEnabled ? COLORS.textWhite : COLORS.disabled}
              />
            </View>
          </View>

          {/* Round-Up Method */}
          {isEnabled && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Round-Up Method</Text>
              
              <TouchableOpacity
                style={[
                  styles.optionRow,
                  roundUpMethod === 'nearest_dollar' && styles.selectedOption
                ]}
                onPress={() => setRoundUpMethod('nearest_dollar')}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionTitle}>Nearest Dollar</Text>
                  <Text style={styles.optionDescription}>
                    Round up to the nearest whole dollar
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  roundUpMethod === 'nearest_dollar' && styles.radioButtonSelected
                ]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionRow,
                  roundUpMethod === 'custom_amount' && styles.selectedOption
                ]}
                onPress={() => setRoundUpMethod('custom_amount')}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionTitle}>Fixed Amount</Text>
                  <Text style={styles.optionDescription}>
                    Round up by a fixed amount every transaction
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  roundUpMethod === 'custom_amount' && styles.radioButtonSelected
                ]} />
              </TouchableOpacity>

              {roundUpMethod === 'custom_amount' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Custom Amount</Text>
                  <TextInput
                    style={styles.textInput}
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    placeholder="1.00"
                    keyboardType="decimal-pad"
                  />
                </View>
              )}
            </View>
          )}

          {/* Default Destination */}
          {isEnabled && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Default Destination</Text>
              
              <TouchableOpacity
                style={[
                  styles.optionRow,
                  defaultDestination === 'investment' && styles.selectedOption
                ]}
                onPress={() => setDefaultDestination('investment')}
              >
                <View style={styles.optionLeft}>
                  <TrendingUp size={20} color={COLORS.primary} />
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>Investment Portfolio</Text>
                    <Text style={styles.optionDescription}>
                      Invest spare change in diversified portfolio
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  defaultDestination === 'investment' && styles.radioButtonSelected
                ]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionRow,
                  defaultDestination === 'charity' && styles.selectedOption
                ]}
                onPress={() => setDefaultDestination('charity')}
              >
                <View style={styles.optionLeft}>
                  <Heart size={20} color={COLORS.error} />
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>Charity Donations</Text>
                    <Text style={styles.optionDescription}>
                      Donate spare change to selected charities
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  defaultDestination === 'charity' && styles.radioButtonSelected
                ]} />
              </TouchableOpacity>
            </View>
          )}

          {/* Limits */}
          {isEnabled && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Round-Up Limits</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Minimum Round-Up</Text>
                <TextInput
                  style={styles.textInput}
                  value={minimumRoundUp}
                  onChangeText={setMinimumRoundUp}
                  placeholder="0.01"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Maximum Round-Up</Text>
                <TextInput
                  style={styles.textInput}
                  value={maximumRoundUp}
                  onChangeText={setMaximumRoundUp}
                  placeholder="5.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButtonContainer} onPress={handleSaveSettings}>
            <LinearGradient
              colors={COLORS.mizanGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  headerBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: normalize(120),
    borderBottomLeftRadius: normalize(40),
    borderBottomRightRadius: normalize(40),
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
  },
  backButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.semibold(18),
    color: COLORS.textWhite,
  },
  saveButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: normalize(20),
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(20),
    padding: normalize(20),
    marginBottom: normalize(16),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 5,
  },
  cardTitle: {
    ...FONTS.semibold(16),
    color: COLORS.text,
    marginBottom: normalize(16),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingInfo: {
    marginLeft: normalize(12),
    flex: 1,
  },
  settingTitle: {
    ...FONTS.medium(16),
    color: COLORS.text,
  },
  settingDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(2),
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(12),
    marginBottom: normalize(8),
  },
  selectedOption: {
    backgroundColor: COLORS.background2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionInfo: {
    marginLeft: normalize(12),
    flex: 1,
  },
  optionTitle: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  optionDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: normalize(2),
  },
  radioButton: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  inputContainer: {
    marginTop: normalize(16),
  },
  inputLabel: {
    ...FONTS.medium(14),
    color: COLORS.text,
    marginBottom: normalize(8),
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    ...FONTS.body4,
    color: COLORS.text,
  },
  saveButtonContainer: {
    borderRadius: normalize(40),
    overflow: 'hidden',
    marginTop: normalize(20),
  },
  saveButtonGradient: {
    paddingVertical: normalize(16),
    alignItems: 'center',
  },
  saveButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
  },
});

export default RoundUpsSettingsScreen;
