import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated, TextInput, ScrollView, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { normalize, getResponsiveWidth, getResponsiveHeight, getResponsivePadding, isTablet } from '../utils';
import Button from '../components/Button';
import { ArrowLeft, ArrowRight, Clock, Wrench, BarChart2, TrendingUp, Umbrella, HelpCircle } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, PanGestureHandler, State } from 'react-native-gesture-handler';
import Input from '../components/Input';
import DurationPicker from '../components/DurationPicker';
import LiquidProgressCircle from '../components/LiquidProgressCircle';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useAuth } from '../hooks/useAuth';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import HomeScreen from './HomeScreen';

type KYCScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'KYC'>;

// DEVELOPMENT CONFIGURATION
// Set to true to bypass auth and navigate directly to Home screen
// Set to false when ready to implement real Supabase auth
const SIMULATION_MODE = true;

// RadioOptionCard component for the interests step
interface RadioOptionCardProps {
  text: string;
  icon: React.ReactNode;
  image: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
}

const RadioOptionCard: React.FC<RadioOptionCardProps> = ({ text, icon, image, selected, onPress }) => {
  // Render the card with or without gradient border based on selection state
  if (selected) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.cardWrapper}
      >
        <LinearGradient
          colors={['#A276FF', '#F053E0']}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 1, y: 0.75 }}
          style={{
            borderRadius: 25,
            padding: 1, // This creates the border effect
            shadowColor: '#6943AF',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.1,
            shadowRadius: 40,
            elevation: 5,
          }}
        >
          <View style={[styles.radioOptionCard, { borderWidth: 0 }]}>
            <View style={styles.radioContainer}>
              <View style={[styles.radioOuter, styles.radioOuterSelected]}>
                <LinearGradient
                  colors={['#8BB4F2', 'rgba(124, 39, 217, 0.887)', 'rgba(222, 82, 208, 0.76)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.radioInner}
                />
              </View>
            </View>
            <View style={styles.radioIconContainer}>
              {/* {icon} */}
              <Image source={image} style={{ width: 24, height: 24 }} resizeMode="contain" />
            </View>
            <View style={styles.radioTextContainer}>
              <Text style={styles.radioText}>{text}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Non-selected card
  return (
    <TouchableOpacity
      style={[styles.radioOptionCard, styles.cardWrapper]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.radioContainer}>
        <View style={styles.radioOuter}>
          {/* Empty inner circle for non-selected state */}
        </View>
      </View>
      <View style={styles.radioIconContainer}>
        <Image source={image} style={{ width: 24, height: 24 }} resizeMode="contain" />
      </View>
      <View style={styles.radioTextContainer}>
        <Text style={styles.radioText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

// KYC steps
enum KYCStep {
  FULL_NAME,
  GENDER,
  INTERESTS, // New step for "what gets you most excited"
  HUSTLE, // New step for "By the way, whats your hustle?"
  DURATION,
  INCOME, // New step for "How much do you make per month"
  SPENDING, // New step for "How do you spend your mulah?"
  FINANCIAL_EXPOSURE,
  PLAN,
  PASSCODE,
  CAMERA_ACCESS,
  SELFIE_CAPTURE,
  ID_CARD_CAPTURE,
  BILL_CAPTURE,
  DOCUMENT_SCAN,
  DOCUMENT_REVIEW,
  CARD,
  CONGRATULATIONS,
  COMPLETE
}

const KYCScreen: React.FC = () => {
  const navigation = useNavigation<KYCScreenNavigationProp>();
  const { clearSignupFlow, simulateAuthentication } = useAuth();
  const [currentStep, setCurrentStep] = useState<KYCStep>(KYCStep.FULL_NAME);
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [value, setValue] = useState<number>(78);

  // Options for the "what gets you most excited" step
  const interestOptions = [
    { id: 'budget', text: 'Build a budget i can stick to', icon: 'clock', image: require('../assets/interests/budget.png'), },
    { id: 'debts', text: 'Crushing my debts with confidence', icon: 'tool', image: require('../assets/interests/crush-debts.png') },
    { id: 'stocks', text: 'Invest in the stock market', icon: 'bar-chart-2', image: require('../assets/interests/stock.png') },
    { id: 'credit', text: 'Improve my credit score', icon: 'trending-up', image: require('../assets/interests/credit-score.png') },
    { id: 'savings', text: 'Save spare change for a rainy day', icon: 'umbrella', image: require('../assets/interests/save.png') },
    { id: 'unsure', text: 'Not sure really.', icon: 'help-circle', image: require('../assets/interests/help-circle.png') },
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['budget']);

  // Hustle options for the "By the way, whats your hustle?" step
  const hustleOptions = [
    { id: 'employed', text: 'Employed - On a 9 to 5 grind' },
    { id: 'freelancing', text: 'Freelancing - Doing what I love' },
    { id: 'business', text: 'Business - Making an Impact' },
  ];
  const [selectedHustle, setSelectedHustle] = useState<string>('employed');

  // Income options for the "How much do you make per month" step
  const incomeOptions = [
    { id: 'under500', text: '< U$ 500' },
    { id: '500to1000', text: 'U$ 500 - U$ 1,000' },
    { id: '1001to2000', text: 'U$ 1001 - U$ 2,000' },
    { id: '2001to3500', text: 'U$ 2001 - U$ 3,500' },
    { id: 'above3500', text: 'U$ 3,500 & above' },
  ];
  const [selectedIncome, setSelectedIncome] = useState<string>('under500');

  // Spending categories for the "How do you spend your mulah?" step
  const [spendingCategories, setSpendingCategories] = useState([
    { id: 'rent', name: 'Rent / Mortgage', value: 1000 },
    { id: 'transport', name: 'Transport', value: 20 },
    { id: 'groceries', name: 'Groceries/Food', value: 30 },
    { id: 'utilities', name: 'Utilities', value: 50 },
    { id: 'savings', name: 'Savings', value: 100 },
    { id: 'custom', name: 'Add your own', value: 0 },
  ]);
  const [totalSpending, setTotalSpending] = useState(2500);

  const [duration, setDuration] = useState({ years: 3, months: 6 });
  const [financialExposure, setFinancialExposure] = useState(78);
  const [selectedPlan, setSelectedPlan] = useState('Premium Ethics');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1); // Default to recommended plan
  const [customizeCard, setCustomizeCard] = useState(false);

  // Passcode states
  const [passcode, setPasscode] = useState(['', '', '', '', '', '']);
  const [confirmPasscode, setConfirmPasscode] = useState(['', '', '', '', '', '']);
  const [passcodeStep, setPasscodeStep] = useState<'create' | 'confirm' | 'biometric'>('create');
  const [passcodeError, setPasscodeError] = useState('');
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Refs for passcode inputs
  const passcodeInputRefs = useRef<(TextInput | null)[]>([]);
  const confirmPasscodeInputRefs = useRef<(TextInput | null)[]>([]);

  // Camera and document states
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [idDocumentUri, setIdDocumentUri] = useState<string | null>(null);
  const [residenceDocumentUri, setResidenceDocumentUri] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [cameraRef, setCameraRef] = useState<any>(null);

  // Animation values for the swipe button
  const translateX = useRef(new Animated.Value(0)).current;
  const arrowTranslateX = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const flatListRef = useRef<FlatList>(null);

  // Move handleNext above useEffect hooks
  const handleNext = useCallback(() => {
    // Validate full name if on the full name step
    if (currentStep === KYCStep.FULL_NAME) {
      if (!fullName.trim()) {
        setFullNameError('Please enter your full name');
        return;
      }
      setFullNameError('');
    }

    if (currentStep < KYCStep.COMPLETE) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the signup flow and navigate to authenticated app
      clearSignupFlow();
    }
  }, [currentStep, fullName, clearSignupFlow]);

  // Check biometric availability when entering passcode step
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

        setBiometricAvailable(compatible && enrolled);

        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID');
        } else {
          setBiometricType('Biometric');
        }
      } catch (error) {
        console.log('Biometric check error:', error);
        setBiometricAvailable(false);
      }
    };

    if (currentStep === KYCStep.PASSCODE) {
      checkBiometricAvailability();
    }
  }, [currentStep]);

  // Auto-complete passcode when it reaches 6 digits
  useEffect(() => {
    const handlePasscodeComplete = async () => {
      const passcodeString = passcode.join('');
      const confirmPasscodeString = confirmPasscode.join('');

      if (passcodeStep === 'create' && passcodeString.length === 6) {
        setTimeout(() => setPasscodeStep('confirm'), 300);
        return;
      }

      if (passcodeStep === 'confirm' && confirmPasscodeString.length === 6) {
        if (passcodeString === confirmPasscodeString) {
          try {
            await SecureStore.setItemAsync('user_passcode', passcodeString);
            if (biometricAvailable) {
              setTimeout(() => setPasscodeStep('biometric'), 300);
            } else {
              setTimeout(() => handleNext(), 300);
            }
          } catch (error) {
            setPasscodeError('Failed to save passcode. Please try again.');
          }
        } else {
          setPasscodeError('Passcodes do not match. Please try again.');
          setConfirmPasscode(['', '', '', '', '', '']);
        }
      }
    };

    if (currentStep === KYCStep.PASSCODE) {
      const passcodeString = passcode.join('');
      const confirmPasscodeString = confirmPasscode.join('');

      if (passcodeString.length === 6 && passcodeStep === 'create') {
        handlePasscodeComplete();
      } else if (confirmPasscodeString.length === 6 && passcodeStep === 'confirm') {
        handlePasscodeComplete();
      }
    }
  }, [passcode, confirmPasscode, passcodeStep, currentStep, biometricAvailable, handleNext]);

  // Ensure correct focus when switching between create and confirm passcode steps
  useEffect(() => {
    if (currentStep === KYCStep.PASSCODE) {
      if (passcodeStep === 'confirm') {
        // Reset confirm inputs and focus first confirm input after UI updates
        setConfirmPasscode(['', '', '', '', '', '']);
        setTimeout(() => {
          // Focus the first confirm input (small delay to allow render)
          confirmPasscodeInputRefs.current?.[0]?.focus?.();
        }, 100);
      } else if (passcodeStep === 'create') {
        // When returning to create step, ensure first create input is focused
        setTimeout(() => {
          passcodeInputRefs.current?.[0]?.focus?.();
        }, 100);
      }
    }
  }, [passcodeStep, currentStep]);

  const handleSkip = () => {
    // Skip KYC and go directly to the app
    clearSignupFlow();
    simulateAuthentication();
  };

  useEffect(() => {
    if (currentStep === KYCStep.CONGRATULATIONS) {
      // Navigate to complete step after 5 seconds
      const timer = setTimeout(() => {
        setCurrentStep(KYCStep.COMPLETE);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Animate the arrow to indicate swipe direction
  useEffect(() => {
    if (currentStep === KYCStep.COMPLETE) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(arrowTranslateX, {
            toValue: 10,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(arrowTranslateX, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }
  }, [currentStep, arrowTranslateX]);

  // const handleNext = () => {
  //   // Validate full name if on the full name step
  //   if (currentStep === KYCStep.FULL_NAME) {
  //     if (!fullName.trim()) {
  //       setFullNameError('Please enter your full name');
  //       return;
  //     }
  //     setFullNameError('');
  //   }

  //   if (currentStep < KYCStep.COMPLETE) {
  //     setCurrentStep(currentStep + 1);
  //   } else {
  //     // Complete the signup flow and navigate to authenticated app
  //     clearSignupFlow();
  //   }
  // };

  const handleBack = () => {
    if (currentStep > KYCStep.FULL_NAME) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
    // hide the back button on congratulations step
    if (currentStep === KYCStep.CONGRATULATIONS) {
      return null;
    }
  };

  const renderProgressBar = () => {
    // Total number of steps (excluding CONGRATULATIONS and COMPLETE)
    const totalSteps = KYCStep.CONGRATULATIONS;

    // Hide progress bar on congratulations step
    if (currentStep === KYCStep.CONGRATULATIONS) {
      return null;
    }

    // Create an array of step indicators
    const stepIndicators = Array.from({ length: totalSteps }, (_, index) => {
      const isActive = index <= currentStep;
      return (
        <View
          key={index}
          style={[
            styles.progressStep,
            isActive ? styles.progressStepActive : styles.progressStepInactive
          ]}
        />
      );
    });

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressStepsContainer}>
          {stepIndicators}
        </View>
      </View>
    );
  };

  const renderFullNameStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Bismillah! First things first—what&apos;s your beautiful name?</Text>
        <Text style={styles.stepTitle}>Let&apos;s start with your full legal name</Text>

        <View style={styles.fullNameContainer}>
          <Input
            value={fullName}
            onChangeText={setFullName}
            placeholder=""
            error={fullNameError}
            containerStyle={styles.fullNameInput}
          />
          <Text style={styles.inputHint}>Please use the name on your ID/Passport.</Text>
        </View>

        <View style={styles.spacer} />

        <View style={{
          width: '100%',
          paddingBottom: Platform.OS === 'ios' ? normalize(40) : normalize(30),
          paddingTop: normalize(20)
        }}>
          <TouchableOpacity
            style={{ width: '100%' }}
            onPress={handleNext}
          >
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                height: normalize(55),
                borderRadius: normalize(40),
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#6943AF',
                shadowOffset: {
                  width: 0,
                  height: 20,
                },
                shadowOpacity: 0.26,
                shadowRadius: 40,
                elevation: 8,
              }}
            >
              <Text style={{
                ...FONTS.semibold(16),
                color: COLORS.textWhite,
                letterSpacing: 0.5,
              }}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGenderStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>And what&apos;s your gender?</Text>

        <View style={styles.genderContainer}>
          {[{ key: 'male', label: 'Male', img: require('../assets/kyc/male.png') }, { key: 'female', label: 'Female', img: require('../assets/kyc/female.png') }].map(option => (
            gender === option.key ? (
              <LinearGradient
                key={option.key}
                colors={['#A276FF', '#F053E0']}
                start={{ x: 0, y: 0.25 }}
                end={{ x: 1, y: 0.75 }}
                style={{
                  borderRadius: 25, padding: 1, shadowColor: '#6943AF',
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.4,
                  shadowRadius: 25,
                  elevation: 20,
                }}
              >
                <View style={[styles.genderOption, { borderWidth: 0, borderRadius: 25, overflow: 'hidden' }]}>
                  <View style={styles.genderIconContainer}>
                    <Image
                      source={option.img}
                      style={styles.genderIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.genderText, styles.selectedGenderText]}>{option.label}</Text>
                </View>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                key={option.key}
                style={[styles.genderOption, { borderRadius: 25 }]}
                onPress={() => setGender(option.key as 'male' | 'female')}
                activeOpacity={0.7}
              >
                <View style={styles.genderIconContainer}>
                  <Image
                    source={option.img}
                    style={styles.genderIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.genderText}>{option.label}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>
      </View>
    );
  };

  const renderInterestsStep = () => {
    // Function to select or deselect an interest (multi-select behavior)
    const toggleInterest = (id: string) => {
      setSelectedInterests((prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
      );
    };

    // Get the icon component based on the icon name
    const getIconComponent = (iconName: string) => {
      switch (iconName) {
        case 'clock':
          return <Clock size={24} color="#BABBD2" />;
        case 'tool':
          return <Wrench size={24} color="#BABBD2" />;
        case 'bar-chart-2':
          return <BarChart2 size={24} color="#BABBD2" />;
        case 'trending-up':
          return <TrendingUp size={24} color="#BABBD2" />;
        case 'umbrella':
          return <Umbrella size={24} color="#BABBD2" />;
        case 'help-circle':
          return <HelpCircle size={24} color="#BABBD2" />;
        default:
          return null;
      }
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Perfect, few more steps and we shall be done</Text>
        <Text style={styles.stepTitle}>Habibi, what gets you most excited?</Text>
        <Text style={styles.interestsSubtitle}>(Feel free to select multiple)</Text>

        <View style={styles.interestsContainer}>
          {interestOptions.map((option) => (
            <RadioOptionCard
              key={option.id}
              text={option.text}
              icon={getIconComponent(option.icon)}
              image={option.image}
              selected={selectedInterests.includes(option.id)}
              onPress={() => toggleInterest(option.id)}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderHustleStep = () => {
    // Function to select a single hustle option
    const selectHustle = (id: string) => {
      setSelectedHustle(id);
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Don&apos;t worry, we are in this together</Text>
        <Text style={styles.stepTitle}>By the way, whats your hustle?</Text>

        <View style={styles.hustleContainer}>
          {hustleOptions.map((option) => (
            selectedHustle === option.id ? (
              <LinearGradient
                key={option.id}
                colors={['#A276FF', '#F053E0']}
                start={{ x: 0, y: 0.25 }}
                end={{ x: 1, y: 0.75 }}
                style={{ borderRadius: normalize(25), padding: 1, marginBottom: 15, shadowColor: '#6943AF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 20 }}
              >
                <View style={[styles.hustleCard, { borderWidth: 0, marginBottom: 1, width: '100%' }]}>
                  <Text style={[styles.hustleText, styles.hustleTextActive]}>{option.text}</Text>
                </View>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                key={option.id}
                style={[styles.hustleCard]}
                activeOpacity={0.7}
                onPress={() => selectHustle(option.id)}
              >
                <Text style={styles.hustleText}>{option.text}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>
      </View>
    );
  };

  const renderIncomeStep = () => {
    // Function to select a single income option (radio button behavior)
    const selectIncome = (id: string) => {
      setSelectedIncome(id);
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Oh wow, quite impressive</Text>
        <Text style={styles.stepTitle}>How much do you make per month?</Text>

        <View style={styles.incomeContainer}>
          {incomeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.incomeOptionContainer}
              activeOpacity={0.7}
              onPress={() => selectIncome(option.id)}
            >
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  {selectedIncome === option.id && (
                    <LinearGradient
                      colors={['#8BB4F2', 'rgba(124, 39, 217, 0.887)', 'rgba(222, 82, 208, 0.76)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.radioInner}
                    />
                  )}
                </View>
              </View>
              <Text style={styles.incomeOptionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderSpendingStep = () => {
    // Function to update a spending category value
    const updateCategoryValue = (id: string, value: number) => {
      const updatedCategories = spendingCategories.map(category =>
        category.id === id ? { ...category, value } : category
      );
      setSpendingCategories(updatedCategories);

      // Calculate total spending
      const newTotal = updatedCategories.reduce((sum, cat) => sum + cat.value, 0);
      setTotalSpending(newTotal);
    };

    // Format currency
    const formatCurrency = (amount: number) => {
      return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Umm, not bad, can be improved</Text>
        <Text style={styles.stepTitle}>How do you spend your mulah?</Text>

        <View style={styles.spendingContainer}>
          <View style={styles.totalAmountContainer}>
            <LinearGradient
              colors={['#A276FF', '#F053E0']}
              start={{ x: 0, y: 0.25 }}
              end={{ x: 1, y: 0.75 }}
              style={styles.totalAmountBorder}
            >
              <View style={styles.totalAmountInner}>
                <Text style={styles.totalAmountText}>{formatCurrency(totalSpending)}</Text>
              </View>
            </LinearGradient>
          </View>

          <ScrollView style={styles.categoriesScrollView} showsVerticalScrollIndicator={false}>
            {spendingCategories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <View style={styles.categoryLabelContainer}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>

                {category.id !== 'custom' ? (
                  <View style={styles.sliderWrapper}>
                    <View style={styles.sliderTrackContainer}>
                      <View style={styles.sliderTrackBackground} />
                      <View
                        style={[
                          styles.sliderTrackActive,
                          { width: `${(category.value / 2000) * 100}%` }
                        ]}
                      />
                      <Slider
                        style={styles.sliderAbsolute}
                        minimumValue={0}
                        maximumValue={2000}
                        value={category.value}
                        onValueChange={(value) => updateCategoryValue(category.id, Math.round(value))}
                        minimumTrackTintColor="transparent"
                        maximumTrackTintColor="transparent"
                        thumbTintColor="transparent"
                        tapToSeek={true}
                      />
                    </View>
                    {/* Custom thumb overlay */}
                    <View
                      style={[
                        styles.sliderThumbContainer,
                        { left: `${(category.value / 2000) * 100}%` }
                      ]}
                    >
                      <LinearGradient
                        colors={['#8BB4F2', '#7C27D9', '#F053E0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sliderThumbGradient}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={[styles.sliderWrapper, { justifyContent: 'center' }]}>
                    <Text style={{ color: '#9A9999', fontFamily: 'Poppins', fontSize: 13 }}>Custom amount</Text>
                  </View>
                )}

                <View style={styles.valueContainer}>
                  {category.id !== 'custom' ? (
                    <Text style={styles.valueText}>{formatCurrency(category.value)}</Text>
                  ) : (
                    <TextInput
                      style={styles.customValueInput}
                      placeholder="$0"
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                        updateCategoryValue(category.id, value);
                      }}
                    />
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderDurationStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Nice, you&apos;ve got something good going!</Text>
        <Text style={styles.stepTitle}>For how long now?</Text>

        <View style={styles.durationPickerContainer}>
          <DurationPicker
            initialYears={duration.years}
            initialMonths={duration.months}
            maxYears={6}
            maxMonths={11}
            onValueChange={(years, months) => {
              setDuration({ years, months });
            }}
          />
        </View>
      </View>
    );
  };

  const renderFinancialExposureStep = () => {
    // Determine risk level and portfolio type based on value
    const getRiskLevel = (value: number) => {
      if (value >= 70) return 'High';
      if (value >= 40) return 'Med';
      return 'Low';
    };

    const getPortfolioType = (value: number) => {
      if (value >= 70) return 'Conservative';
      if (value >= 40) return 'Moderate Portfolio';
      return 'Growth Portfolio';
    };

    const getRiskColor = (value: number) => {
      if (value >= 70) return '#FF4444'; // Red for High
      if (value >= 40) return '#FF8C00'; // Orange for Med
      return '#4CAF50'; // Green for Low
    };

    const currentRisk = getRiskLevel(value);
    const currentPortfolio = getPortfolioType(value);
    const riskColor = getRiskColor(value);

    // Get user's name from fullName state, default to "Sam" if not available
    const userName = fullName.split(' ')[0] || 'Sam';

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>we need to work on this</Text>

        {/* Dynamic title with user name and risk level */}
        <Text style={styles.stepTitle}>
          {userName}, your financial{'\n'}exposure risk : <Text style={{ color: riskColor }}>{currentRisk}</Text>
        </Text>

        <View style={styles.financialExposureMainContainer}>
          {/* Liquid Progress Circle */}
          <View style={styles.liquidProgressContainer}>
            <LiquidProgressCircle value={value} size={normalize(220)} />
          </View>

          {/* Portfolio Type Button */}
          <View style={styles.portfolioButtonContainer}>
            <TouchableOpacity style={styles.portfolioButton} activeOpacity={0.8}>
              <Text style={styles.portfolioButtonText}>{currentPortfolio}</Text>
            </TouchableOpacity>
          </View>

          {/* Slider Container */}
          <View style={styles.financialSliderContainer}>
            <View style={styles.sliderTrackContainer}>
              <View style={styles.sliderTrackBackground} />
              <View
                style={[
                  styles.sliderTrackActive,
                  { width: `${value}%` }
                ]}
              />
              <Slider
                style={styles.sliderAbsolute}
                minimumValue={0}
                maximumValue={100}
                value={value}
                onValueChange={setValue}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="transparent"
                tapToSeek={true}
              />
            </View>

            {/* Custom Slider Thumb */}
            <View
              style={[
                styles.sliderThumbContainer,
                { left: `${value}%` }
              ]}
            >
              <LinearGradient
                colors={['#8BB4F2', '#7C27D9', '#F053E0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sliderThumbGradient}
              />
            </View>
          </View>

          {/* Hint Text */}
          <Text style={styles.financialExposureHint}>
            By sliding you will notice that your financial exposure{'\n'}becomes less severe. Only you can see this.
          </Text>

          {/* Action Buttons */}
          <View style={styles.financialActionButtons}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                clearSignupFlow();
                simulateAuthentication();
              }}
            >
              <Text style={styles.skipButtonText}>Skip to home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fixButton} onPress={handleNext}>
              <Text style={styles.fixButtonText}>Let&apos;s fix this</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPlanStep = () => {
    // Plan data matching the screenshot
    const plans = [
      {
        id: 'noor',
        title: 'Start with a free plan',
        price: 'US 0.00/monthly',
        planName: 'Noor Plan',
        targetAmount: '$500',
        description: 'Use this tool to see how round-ups and depositing money each month can impact the long term value of your account.',
        isRecommended: false,
        isFree: true,
      },
      {
        id: 'qamar',
        title: 'Recommended Plan',
        price: 'US 3/monthly',
        planName: 'Qamar Plan',
        targetAmount: '$500',
        description: 'Use this tool to see how round-ups and depositing money each month can impact the long term value of your account.',
        isRecommended: true,
        isFree: false,
      },
      {
        id: 'shams',
        title: 'Try Shams',
        price: 'US 9/monthly',
        planName: 'Shams Plan',
        targetAmount: '$500',
        description: 'Use this tool to see how round-ups and depositing money each month can impact the long term value of your account.',
        isRecommended: false,
        isFree: false,
      },
    ];

    const renderPlanCard = ({ item, index }: { item: typeof plans[0], index: number }) => {
      const isSelected = selectedPlanIndex === index;

      return (
        <View style={[styles.planCard, isSelected && styles.selectedPlanCard]}>
          {/* Header */}
          <View style={styles.planCardHeader}>
            <Text style={styles.stepSubtitle}>Get a one month&apos;s free on any plan</Text>
            <Text style={styles.planCardTitle}>{item.title}</Text>
          </View>

          {/* Graph Area */}
          <View style={styles.planGraphContainer}>
            <View style={styles.planCardGraph}>
              {/* SVG Growth Curve */}
              <Svg width="100%" height={normalize(120)} viewBox="0 0 100 100">
                {/* Background grid line */}
                <Line
                  x1="15"
                  y1="85"
                  x2="85"
                  y2="85"
                  stroke="#E8E8E8"
                  strokeWidth="0.5"
                />

                {/* Growth curve */}
                <Path
                  d="M 15 85 Q 35 65, 50 45 Q 65 25, 85 15"
                  stroke="#A276FF"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Start point */}
                <Circle
                  cx="15"
                  cy="85"
                  r="2"
                  fill="#A276FF"
                />

                {/* End point */}
                <Circle
                  cx="85"
                  cy="15"
                  r="2"
                  fill="#A276FF"
                />
              </Svg>

              <Text style={styles.planCardAmount}>{item.targetAmount}</Text>
            </View>

            {/* Graph Labels */}
            <View style={styles.graphLabels}>
              <Text style={styles.graphLabel}>Today</Text>
              <Text style={styles.graphLabel}>5 Oct 2025</Text>
            </View>
          </View>

          {/* Plan Info */}
          <View style={styles.planInfo}>
            <Text style={styles.planCardPrice}>{item.price}</Text>
            <Text style={styles.planName}>{item.planName}</Text>
          </View>

          {/* Slider */}
          <View style={styles.planSliderContainer}>
            <View style={styles.sliderTrackContainer}>
              <View style={styles.sliderTrackBackground} />
              <View
                style={[
                  styles.sliderTrackActive,
                  { width: '60%' }
                ]}
              />
              <Slider
                style={styles.sliderAbsolute}
                minimumValue={0}
                maximumValue={100}
                value={60}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="transparent"
                tapToSeek={true}
              />
            </View>
          </View>

          {/* Description */}
          <Text style={styles.planDescription}>{item.description}</Text>
        </View>
      );
    };

    return (
      <View style={styles.stepContainer}>
        {/* Plan Carousel */}
        <View style={styles.planCarouselContainer}>
          <FlatList
            data={plans}
            renderItem={renderPlanCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={getResponsiveWidth(85) + normalize(20)} // Card width + margin
            decelerationRate="fast"
            contentContainerStyle={styles.planCarouselContent}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / (getResponsiveWidth(85) + normalize(20)));
              setSelectedPlanIndex(index);
            }}
          />
        </View>

        {/* Sticky CTA Button */}
        <View style={styles.planCTAContainer}>
          <TouchableOpacity style={styles.planCTAButton} onPress={handleNext}>
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.planCTAGradient}
            >
              <Text style={styles.planCTAText}>Secure my future</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPasscodeStep = () => {
    const handlePasscodeChange = (text: string, index: number) => {
      if (text.length > 1) {
        text = text[text.length - 1];
      }

      if (passcodeStep === 'create') {
        const newPasscode = [...passcode];
        newPasscode[index] = text;
        setPasscode(newPasscode);
        setPasscodeError('');

        // Auto focus to next input
        if (text !== '' && index < 5) {
          passcodeInputRefs.current[index + 1]?.focus();
        }
      } else if (passcodeStep === 'confirm') {
        const newConfirmPasscode = [...confirmPasscode];
        newConfirmPasscode[index] = text;
        setConfirmPasscode(newConfirmPasscode);
        setPasscodeError('');

        // Auto focus to next input
        if (text !== '' && index < 5) {
          confirmPasscodeInputRefs.current[index + 1]?.focus();
        }
      }
    };

    const handlePasscodeKeyPress = (e: any, index: number) => {
      // Handle backspace
      if (e.nativeEvent.key === 'Backspace' && index > 0) {
        if (passcodeStep === 'create' && passcode[index] === '') {
          passcodeInputRefs.current[index - 1]?.focus();
        } else if (passcodeStep === 'confirm' && confirmPasscode[index] === '') {
          confirmPasscodeInputRefs.current[index - 1]?.focus();
        }
      }
    };

    const handleBiometricSetup = async () => {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Enable ${biometricType} for secure access`,
          fallbackLabel: 'Use Passcode',
        });

        if (result.success) {
          await SecureStore.setItemAsync('biometric_enabled', 'true');
          handleNext();
        } else {
          setPasscodeError('Biometric setup failed. You can set it up later in settings.');
        }
      } catch (error) {
        setPasscodeError('Biometric setup error. You can set it up later in settings.');
      }
    };

    const handleSkipBiometric = () => {
      handleNext();
    };

    const renderPasscodeInput = () => {
      const currentPasscode = passcodeStep === 'create' ? passcode : confirmPasscode;
      const inputRefs = passcodeStep === 'create' ? passcodeInputRefs : confirmPasscodeInputRefs;

      return (
        <View style={styles.otpContainer}>
          {currentPasscode.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpInputContainer,
                index === 2 || index === 3 ? styles.otpInputWithDash : null
              ]}
            >
              <TextInput
                ref={(ref) => {
                  if (ref) {
                    inputRefs.current[index] = ref;
                  }
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handlePasscodeChange(text, index)}
                onKeyPress={(e) => handlePasscodeKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
              {digit ? <View style={styles.otpDot} /> : null}
            </View>
          ))}
        </View>
      );
    };

    if (passcodeStep === 'biometric') {
      return (
        <View style={styles.stepContainer}>

          <Text style={styles.stepTitle}>Enable Biometrics</Text>

          <View style={styles.biometricContainer}>
            <View style={styles.biometricContent}>
              <View style={styles.biometricIconsContainer}>
                <Image
                  source={require('../assets/FaceID.png')}
                  style={styles.biometricIcon}
                  resizeMode="contain"
                />
                <Image
                  source={require('../assets/fingerprint.png')}
                  style={styles.biometricIcon}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.biometricDescription}>
                Use biometrics instead of a passcode to log in. It&apos;s more secure and easier.
              </Text>
            </View>

            <View style={styles.biometricButtons}>
              <TouchableOpacity style={styles.biometricPrimaryButton} onPress={handleBiometricSetup}>
                <LinearGradient
                  colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                  locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.biometricButtonGradient}
                >
                  <Text style={styles.biometricPrimaryButtonText}>Enable {biometricType === 'Face ID' ? 'FaceID' : biometricType}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.biometricSecondaryButton} onPress={handleSkipBiometric}>
                <Text style={styles.biometricSecondaryButtonText}>Maybe later</Text>
              </TouchableOpacity>
            </View>
          </View>

          {passcodeError ? (
            <Text style={styles.passcodeError}>{passcodeError}</Text>
          ) : null}
        </View>
      );
    }

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Secure your account</Text>
        <Text style={styles.stepTitle}>
          {passcodeStep === 'create' ? 'Create Passcode' : 'Confirm Passcode'}
        </Text>

        <View style={styles.passcodeContainer}>
          {renderPasscodeInput()}

          <View style={styles.passcodeInputContainer}>
            <Text style={styles.passcodeHint}>
              Type a 6 digit Passcode to secure your account
            </Text>
          </View>

          {passcodeError ? (
            <Text style={styles.passcodeError}>{passcodeError}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  const renderCameraAccessStep = () => {
    const requestCameraPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');

        if (status === 'granted') {
          handleNext();
        } else {
          setPasscodeError('Camera access is required for identity verification');
        }
      } catch (error) {
        setPasscodeError('Failed to request camera permission');
      }
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>It&apos;s a regulation thing we have to do.</Text>
        <Text style={styles.stepTitle}>Camera access is required</Text>

        <View style={styles.cameraAccessContainer}>
          <View style={styles.cameraAccessContent}>
            <Text style={styles.cameraAccessDescription}>
              You&apos;ll need to submit a selfie and a photo of your national ID to be used to verify your identity.
            </Text>

            {/* Camera illustration */}
            <View style={styles.cameraIllustrationContainer}>
              <Image
                source={require('../assets/kyc/camera-access.png')}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.cameraAccessButtonContainer}>
            <TouchableOpacity style={styles.cameraAccessButton} onPress={requestCameraPermission}>
              <LinearGradient
                colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.cameraAccessButtonGradient}
              >
                <Text style={styles.cameraAccessButtonText}>ALLOW ACCESS</Text>
              </LinearGradient>
            </TouchableOpacity>

            {passcodeError ? (
              <Text style={styles.passcodeError}>{passcodeError}</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const renderSelfieStep = () => {
    const takeSelfie = async () => {
      if (cameraRef) {
        try {
          const photo = await cameraRef.takePictureAsync({
            quality: 0.8,
            base64: false,
          });
          setSelfieUri(photo.uri);
          handleNext();
        } catch (error) {
          setPasscodeError('Failed to capture selfie. Please try again.');
        }
      }
    };

    return (
      <View style={styles.selfieContainer}>
        {/* Navigation breadcrumbs */}
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumbText}>Self Portrait</Text>
          <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
          <Text style={styles.breadcrumbTextInactive}>ID Card</Text>
          <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
          <Text style={styles.breadcrumbTextInactive}>Bill</Text>
        </View>

        {/* Camera view */}
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="front"
            ref={(ref) => setCameraRef(ref)}
          >
            {/* Face detection frame overlay */}
            <View style={styles.faceFrameOverlay}>
              <View style={styles.faceFrame} />
            </View>
          </CameraView>
        </View>

        {/* Capture button */}
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takeSelfie}>
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.captureButtonInner}
            />
          </TouchableOpacity>
        </View>

        {passcodeError ? (
          <Text style={styles.passcodeError}>{passcodeError}</Text>
        ) : null}
      </View>
    );
  };

  const renderIdCardCaptureStep = () => {
    const takeIdCardPhoto = async () => {
      if (cameraRef) {
        try {
          const photo = await cameraRef.takePictureAsync({
            quality: 0.8,
            base64: false,
          });
          setIdDocumentUri(photo.uri);
          handleNext();
        } catch (error) {
          setPasscodeError('Failed to capture ID card. Please try again.');
        }
      }
    };

    return (
      <View style={styles.selfieContainer}>
        {/* Navigation breadcrumbs */}
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumbTextInactive}>Self Portrait</Text>
          <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
          <Text style={styles.breadcrumbText}>ID Card</Text>
          <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
          <Text style={styles.breadcrumbTextInactive}>Bill</Text>
        </View>

        {/* Camera view */}
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            ref={(ref) => setCameraRef(ref)}
          >
            {/* Document frame overlay */}
            <View style={styles.faceFrameOverlay}>
              <View style={styles.documentFrame} />
            </View>
          </CameraView>
        </View>

        {/* Capture button */}
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takeIdCardPhoto}>
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.captureButtonInner}
            />
          </TouchableOpacity>
        </View>

        {passcodeError ? (
          <Text style={styles.passcodeError}>{passcodeError}</Text>
        ) : null}
      </View>
    );
  };

  const renderBillCaptureStep = () => {
    const takeBillPhoto = async () => {
      if (cameraRef) {
        try {
          const photo = await cameraRef.takePictureAsync({
            quality: 0.8,
            base64: false,
          });
          setResidenceDocumentUri(photo.uri);
          handleNext();
        } catch (error) {
          setPasscodeError('Failed to capture bill. Please try again.');
        }
      }
    };

    return (
      <View style={styles.selfieContainer}>
        {/* Navigation breadcrumbs */}
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumbTextInactive}>Self Portrait</Text>
          <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
          <Text style={styles.breadcrumbTextInactive}>ID Card</Text>
          <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
          <Text style={styles.breadcrumbText}>Bill</Text>
        </View>

        {/* Camera view */}
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            ref={(ref) => setCameraRef(ref)}
          >
            {/* Document frame overlay */}
            <View style={styles.faceFrameOverlay}>
              <View style={styles.documentFrame} />
            </View>
          </CameraView>
        </View>

        {/* Capture button */}
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takeBillPhoto}>
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.captureButtonInner}
            />
          </TouchableOpacity>
        </View>

        {passcodeError ? (
          <Text style={styles.passcodeError}>{passcodeError}</Text>
        ) : null}
      </View>
    );
  };

  const renderDocumentScanStep = () => {
    const handleFinalize = () => {
      if (!termsAccepted) {
        setPasscodeError('Please accept the Terms & Conditions to continue');
        return;
      }
      setPasscodeError('');
      handleNext();
    };

    const handleMaybeLater = () => {
      // Handle maybe later action - could skip or go back
      setPasscodeError('');
      // For now, just continue to next step
      handleNext();
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.documentScanSubtitle}>You sure determined to come this far!</Text>
        <Text style={styles.documentScanTitle}>Okay, lets wrap{'\n'}this up</Text>

        <View style={styles.documentScanContainer}>
          <Text style={styles.documentScanDescription}>
            We just need you to scan your I.D or passport bio page and share proof of residence with utility.
          </Text>

          {/* Action buttons */}
          <View style={styles.documentScanButtons}>
            <TouchableOpacity style={styles.documentScanPrimaryButton} onPress={handleFinalize}>
              <LinearGradient
                colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.documentScanButtonGradient}
              >
                <Text style={styles.documentScanPrimaryButtonText}>Finalize</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.documentScanSecondaryButton} onPress={handleMaybeLater}>
              <LinearGradient
                colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.documentScanSecondaryButtonGradient}
              >
                <Text style={styles.documentScanSecondaryButtonText}>Maybe later</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.documentScanTermsContainer}>
            <TouchableOpacity
              style={styles.documentScanCheckboxContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
              activeOpacity={0.7}
            >
              <View style={styles.documentScanRadioContainer}>
                <View style={[
                  styles.documentScanRadioOuter,
                  termsAccepted && styles.documentScanRadioOuterSelected
                ]}>
                  {termsAccepted && (
                    <LinearGradient
                      colors={['#8BB4F2', 'rgba(124, 39, 217, 0.887)', 'rgba(222, 82, 208, 0.76)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.documentScanRadioInner}
                    />
                  )}
                </View>
              </View>
              <Text style={styles.documentScanTermsText}>
                By continuing, you agree to Mizan Financial&apos;s Ltd.{' '}
                <Text style={styles.documentScanTermsLink}>Terms & Conditions</Text> and{' '}
                <Text style={styles.documentScanTermsLink}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>
          </View>

          {passcodeError ? (
            <Text style={styles.passcodeError}>{passcodeError}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  const renderDocumentReviewStep = () => {
    const handleSubmit = () => {
      // Handle final submission
      setPasscodeError('');
      handleNext();
    };

    const handleRecapture = (type: 'selfie' | 'id' | 'residence') => {
      // Handle re-capture/re-upload for specific document type
      if (type === 'selfie') {
        setCurrentStep(KYCStep.SELFIE_CAPTURE);
      } else if (type === 'id') {
        setCurrentStep(KYCStep.ID_CARD_CAPTURE);
      } else if (type === 'residence') {
        setCurrentStep(KYCStep.BILL_CAPTURE);
      }
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Review your{'\n'}Documents</Text>

        <View style={styles.documentReviewContainer}>
          {/* Selfie review */}
          <View style={styles.documentReviewItem}>
            <TouchableOpacity onPress={() => handleRecapture('selfie')} style={styles.documentReviewThumbnailContainer}>
              {selfieUri ? (
                <Image source={{ uri: selfieUri }} style={styles.documentReviewSelfie} />
              ) : (
                <View style={styles.documentReviewSelfiePlaceholder}>
                  <View style={styles.documentReviewSelfieIcon} />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.documentReviewContent}>
              <LinearGradient
                colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.documentReviewCheckmark}
              >
                <Text style={styles.documentReviewCheckmarkText}>✓</Text>
              </LinearGradient>
              <Text style={styles.documentReviewLabel}>Snap a selfie</Text>
            </View>
          </View>

          {/* ID document review */}
          <View style={styles.documentReviewItem}>
            <TouchableOpacity onPress={() => handleRecapture('id')} style={styles.documentReviewThumbnailContainer}>
              {idDocumentUri ? (
                <Image source={{ uri: idDocumentUri }} style={styles.documentReviewDocument} />
              ) : (
                <View style={styles.documentReviewDocumentPlaceholder}>
                  <View style={styles.documentReviewIdIcon}>
                    <View style={styles.documentReviewIdIconPerson} />
                    <View style={styles.documentReviewIdIconLine1} />
                    <View style={styles.documentReviewIdIconLine2} />
                    <View style={styles.documentReviewIdIconLine3} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.documentReviewContent}>
              <LinearGradient
                colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.documentReviewCheckmark}
              >
                <Text style={styles.documentReviewCheckmarkText}>✓</Text>
              </LinearGradient>
              <Text style={styles.documentReviewLabel}>Upload your ID</Text>
            </View>
          </View>

          {/* Residence document review */}
          <View style={styles.documentReviewItem}>
            <TouchableOpacity onPress={() => handleRecapture('residence')} style={styles.documentReviewThumbnailContainer}>
              {residenceDocumentUri ? (
                <Image source={{ uri: residenceDocumentUri }} style={styles.documentReviewDocument} />
              ) : (
                <View style={styles.documentReviewDocumentPlaceholder}>
                  <View style={styles.documentReviewBillIcon}>
                    <View style={styles.documentReviewBillIconDoc1} />
                    <View style={styles.documentReviewBillIconDoc2} />
                    <View style={styles.documentReviewBillIconDoc3} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.documentReviewContent}>
              <LinearGradient
                colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.documentReviewCheckmark}
              >
                <Text style={styles.documentReviewCheckmarkText}>✓</Text>
              </LinearGradient>
              <Text style={styles.documentReviewLabel}>Residential address</Text>
            </View>
          </View>

          <Text style={styles.documentReviewInfo}>
            We only ask once — it&apos;s a legal step to keep{'\n'}everything safe & legit.
          </Text>
        </View>

        {/* Submit button positioned at bottom */}
        <View style={styles.documentReviewBottomContainer}>
          <TouchableOpacity style={styles.documentReviewSubmitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.documentReviewSubmitButtonGradient}
            >
              <Text style={styles.documentReviewSubmitButtonText}>Looks good - Submit</Text>
            </LinearGradient>
          </TouchableOpacity>

          {passcodeError ? (
            <Text style={styles.passcodeError}>{passcodeError}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  const renderCardStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.fancyCardSubtitle}>Make it yours, personalize your card</Text>
        <Text style={styles.fancyCardTitle}>Order a fancy card</Text>

        <View style={styles.cardContainer}>
          <Text style={styles.cardInstructions}>Slide to choose</Text>

          {/* Use FlatList to make cards scroll horizontally */}
          <FlatList
            data={[1, 2, 3]} // Dummy data for card options
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <Image
                source={require('../assets/kyc/fancy-card.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            )}
          />

          <Text style={styles.cardQuestion}>
            Would you like to customize your card?
          </Text>

          {/* Add "Yes Please" and "Skip for now" navigation buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: normalize(24), width: '100%', paddingHorizontal: normalize(10) }}>
            <TouchableOpacity disabled style={{ opacity: 0.4 }}>
              <Text style={{ color: '#C7C7C7', fontSize: normalize(18), fontFamily: 'Poppins' }}>Yes please</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentStep(KYCStep.CONGRATULATIONS)}>
              <Text style={{ color: '#A276FF', ...FONTS.semibold(18) }}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCongratulationsStep = () => {
    return (
      <View style={styles.congratulationsContainer}>
        <Text style={styles.congratulationsTitle}>That&apos;s it</Text>

        <View style={styles.congratulationsIconContainer}>
          <View style={styles.congratulationsCheckmarkCircle}>
            <Text style={styles.congratulationsCheckmark}>✓</Text>
          </View>
        </View>

        <Text style={styles.congratulationsSubtitle}>
          That&apos;s it, let&apos;s unlock ethical{'\n'}wealth
        </Text>

        <View style={styles.congratulationsButtonContainer}>
          <TouchableOpacity style={styles.congratulationsSwipeButton} onPress={() => handleNext()}>
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.congratulationsSwipeButtonGradient}
            >
              <View style={styles.congratulationsSwipeContent}>
                <View style={styles.congratulationsArrowCircle}>
                  <ArrowRight size={20} color="#000" />
                </View>
                <Text style={styles.congratulationsSwipeText}>SWIPE TO START</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCompleteStep = () => {
    const handleCompleteSignup = () => {
      console.log('🚀 Completing signup - SIMULATION MODE...');

      if (SIMULATION_MODE) {
        // SIMULATION: Create isolated mock authentication state
        // This completely bypasses Supabase and creates a separate auth state
        console.log('🎭 SIMULATION: Creating isolated mock authentication...');

        clearSignupFlow();
        simulateAuthentication();

        console.log('✅ SIMULATION: Mock auth state created - App should navigate automatically!');
      } else {
        // TODO: Real auth flow implementation
        // When ready for production, implement real Supabase auth here
        console.log('🔐 PRODUCTION MODE: Implement real auth flow here');
        clearSignupFlow();
      }
    };

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationX } = event.nativeEvent;

        // If swiped more than 120px (about half the button width), navigate to Home
        if (translationX > 120) {
          // Animate the button to slide out and fade
          Animated.parallel([
            Animated.timing(buttonOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            }),
            Animated.timing(translateX, {
              toValue: 300, // Slide all the way out
              duration: 200,
              useNativeDriver: true
            })
          ]).start(() => {
            handleCompleteSignup();
          });
        } else {
          // Reset the position with a spring animation
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
            speed: 12
          }).start();
        }
      }
    };

    return (
      <View className="flex-1 flex-col justify-between items-center px-2 py-20">

        <Text className="text-[#1B1C39] text-center" style={{ ...FONTS.semibold(25) }}>That&apos;s it</Text>

        <Image
          source={require('../assets/kyc/high_five.png')}
          className='w-[200px] h-[200px]'
          resizeMode="contain"
        />

        <Text className="text-[#1B1C39] text-[20px] text-center" style={{ fontFamily: 'Poppins' }}>
          That&apos;s it, start moving moolah
        </Text>

        <Animated.View style={[styles.swipeButtonContainer, { opacity: buttonOpacity }]}>
          <TouchableOpacity
            onPress={() => {
              // Fallback tap handler
              Animated.timing(buttonOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
              }).start(() => {
                handleCompleteSignup();
              });
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#5592EF', '#8532E0', '#F053E0']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.swipeButton}
            >
              <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
              >
                <Animated.View
                  style={[
                    styles.swipeContent,
                    { transform: [{ translateX: translateX }] }
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.arrowCircle,
                      { transform: [{ translateX: arrowTranslateX }] }
                    ]}
                  >
                    <ArrowRight size={20} color="#000" />
                  </Animated.View>
                  <Text style={styles.swipeButtonText}>SWIPE TO START</Text>
                </Animated.View>
              </PanGestureHandler>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case KYCStep.FULL_NAME:
        return renderFullNameStep();
      case KYCStep.GENDER:
        return renderGenderStep();
      case KYCStep.INTERESTS:
        return renderInterestsStep();
      case KYCStep.HUSTLE:
        return renderHustleStep();
      case KYCStep.DURATION:
        return renderDurationStep();
      case KYCStep.INCOME:
        return renderIncomeStep();
      case KYCStep.SPENDING:
        return renderSpendingStep();
      case KYCStep.FINANCIAL_EXPOSURE:
        return renderFinancialExposureStep();
      case KYCStep.PLAN:
        return renderPlanStep();
      case KYCStep.PASSCODE:
        return renderPasscodeStep();
      case KYCStep.CAMERA_ACCESS:
        return renderCameraAccessStep();
      case KYCStep.SELFIE_CAPTURE:
        return renderSelfieStep();
      case KYCStep.ID_CARD_CAPTURE:
        return renderIdCardCaptureStep();
      case KYCStep.BILL_CAPTURE:
        return renderBillCaptureStep();
      case KYCStep.DOCUMENT_SCAN:
        return renderDocumentScanStep();
      case KYCStep.DOCUMENT_REVIEW:
        return renderDocumentReviewStep();
      case KYCStep.CARD:
        return renderCardStep();
      case KYCStep.CONGRATULATIONS:
        return renderCongratulationsStep();
      case KYCStep.COMPLETE:
        return renderCompleteStep();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {currentStep !== KYCStep.COMPLETE && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={COLORS.text} />
            </TouchableOpacity>
            {renderProgressBar()}
          </View>

          {renderCurrentStep()}

          {(currentStep < KYCStep.CONGRATULATIONS && currentStep !== KYCStep.FULL_NAME && currentStep !== KYCStep.CARD && currentStep !== KYCStep.FINANCIAL_EXPOSURE && currentStep !== KYCStep.PLAN && currentStep !== KYCStep.PASSCODE && currentStep !== KYCStep.CAMERA_ACCESS && currentStep !== KYCStep.SELFIE_CAPTURE && currentStep !== KYCStep.ID_CARD_CAPTURE && currentStep !== KYCStep.BILL_CAPTURE && currentStep !== KYCStep.DOCUMENT_SCAN && currentStep !== KYCStep.DOCUMENT_REVIEW) && (

            <View style={{
              width: '100%',
              paddingHorizontal: SIZES.padding,
              paddingBottom: Platform.OS === 'ios' ? normalize(40) : normalize(30),
              paddingTop: normalize(20)
            }}>
              <TouchableOpacity
                style={{ width: '100%' }}
                onPress={handleNext}
              >
                <LinearGradient
                  colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                  locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{
                    height: normalize(56),
                    borderRadius: normalize(28),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    ...FONTS.semibold(15),
                    color: COLORS.textWhite,
                    textAlign: 'center'
                  }}>NEXT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {currentStep === KYCStep.COMPLETE && renderCompleteStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: normalize(50),
    paddingBottom: normalize(18),
  },
  backButton: {
    marginRight: normalize(10),
  },
  progressContainer: {
    flex: 1,
    marginLeft: normalize(10),
  },
  progressStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: normalize(5),
  },
  progressStep: {
    width: normalize(35),
    height: normalize(5),
    borderRadius: normalize(2.5),
  },
  progressStepActive: {
    backgroundColor: '#A276FF',
  },
  progressStepInactive: {
    backgroundColor: '#EEEFF5',
  },
  stepContainer: {
    flex: 1,
    paddingBottom: 0,
    paddingHorizontal: normalize(25),
  },
  // Radio option card styles
  cardWrapper: {
    marginBottom: normalize(10),
  },
  radioOptionCard: {
    width: getResponsiveWidth(85), // 85% of screen width instead of fixed 340px
    height: normalize(57),
    borderRadius: normalize(40),
    borderWidth: 1,
    borderColor: 'rgba(222, 222, 222, 0.48)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
    backgroundColor: COLORS.card,
  },
  radioContainer: {
    marginRight: normalize(15),
  },
  radioOuter: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(40),
    borderWidth: 2,
    borderColor: '#BABBD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    // Keep the border visible even when selected
    borderColor: '#BABBD2',
  },
  radioInner: {
    width: normalize(21),
    height: normalize(21),
    borderRadius: normalize(40),
  },
  radioIconContainer: {
    width: normalize(24),
    height: normalize(24),
    marginRight: normalize(15),
  },
  radioTextContainer: {
    flex: 1,
  },
  radioText: {
    ...FONTS.medium(12),
    color: COLORS.text,
  },
  interestsContainer: {
    marginTop: normalize(20),
    alignItems: 'center',
  },
  interestsSubtitle: {
    ...FONTS.body4,
    color: '#969696',
    textAlign: 'center',
    marginTop: normalize(-30),
    marginBottom: normalize(30),
  },
  // Hustle step styles
  hustleContainer: {
    marginTop: normalize(30),
    paddingHorizontal: normalize(20),
  },
  hustleCard: {
    width: '100%',
    paddingVertical: normalize(36),
    borderRadius: normalize(25),
    borderWidth: 1,
    borderColor: 'rgba(222, 222, 222, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(15),
    backgroundColor: COLORS.card,
    paddingHorizontal: normalize(20),
  },

  hustleText: {
    ...FONTS.medium(18),
    color: '#6D6E8A',
    textAlign: 'center',
  },
  hustleTextActive: {
    color: COLORS.text,
  },
  // Income step styles
  incomeContainer: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(20),
  },
  incomeOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  incomeOptionText: {
    ...FONTS.medium(20),
    color: COLORS.text,
    marginLeft: normalize(10),
  },
  // Spending step styles
  spendingContainer: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(10),
    flex: 1,
  },
  categoriesScrollView: {
    flex: 1,
    marginBottom: normalize(20),
  },
  totalAmountContainer: {
    alignItems: 'center',
    marginBottom: normalize(30),
  },
  totalAmountBorder: {
    borderRadius: normalize(25),
    padding: 1,
  },
  totalAmountInner: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(25),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(30),
  },
  totalAmountText: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(25),
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryLabelContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(25),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    borderWidth: 1,
    borderColor: '#DEDEDE7A',
    width: normalize(140), // Responsive width for the category label
  },
  categoryName: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  sliderWrapper: {
    flex: 1,
    height: normalize(40),
    position: 'relative',
    marginHorizontal: normalize(8),
    width: getResponsiveWidth(80), // Responsive width instead of fixed 327px
  },
  slider: {
    width: '100%',
    height: normalize(40),
    zIndex: 1,
  },
  sliderTrackContainer: {
    width: '100%',
    height: normalize(4),
    backgroundColor: 'transparent',
    borderRadius: normalize(2),
    position: 'relative',
    marginTop: normalize(18),
  },
  sliderTrackBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#EEEFF5',
    borderRadius: normalize(2),
  },
  sliderTrackActive: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#6B3BA6',
    borderRadius: normalize(2),
  },
  sliderAbsolute: {
    position: 'absolute',
    width: '100%',
    height: normalize(40),
    top: normalize(-18),
    zIndex: 2,
  },
  sliderThumbContainer: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: normalize(10),
    marginLeft: normalize(-4), // Center the thumb on the track
    zIndex: 2,
  },
  sliderThumbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(10),
  },
  valueContainer: {
    width: normalize(60),
    height: normalize(24),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: '#E0D2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    ...FONTS.medium(13),
    color: '#9A9999',
  },
  customValueInput: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#9A9999',
    width: '100%',
    textAlign: 'center',
    height: '100%',
    paddingVertical: 0,
  },
  fullNameContainer: {
    width: '100%',
    marginTop: 20,
  },
  fullNameInput: {
    width: '100%',
    ...FONTS.medium(18),
  },
  inputHint: {
    ...FONTS.body4,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },

  stepSubtitle: {
    ...FONTS.semibold(14),
    color: '#A276FF',
    marginBottom: normalize(60),
    textAlign: 'center',
    paddingHorizontal: normalize(20),
  },
  fancyCardSubtitle: {
    ...FONTS.semibold(14),
    color: '#A276FF',
    marginVertical: normalize(18),
    textAlign: 'center',
  },

  fancyCardTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: 0,
    textAlign: 'center',
    paddingHorizontal: normalize(30),
    paddingVertical: 0,
  },

  arabicStepTitle: {
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins_400Regular',
    }),
    fontWeight: 400,
    fontSize: normalize(18),
    color: COLORS.text,
    textAlign: 'center'
  },
  stepTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: normalize(30),
    textAlign: 'center',
    paddingHorizontal: normalize(30),
    paddingVertical: normalize(20),
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: normalize(20),
  },
  genderOption: {
    width: getResponsiveWidth(35), // Responsive width instead of fixed 150px
    height: normalize(180),
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  selectedGenderOption: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.4,
    shadowRadius: normalize(25),
    elevation: 20,
  },
  genderIconContainer: {
    width: normalize(80),
    height: normalize(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  genderIcon: {
    width: normalize(60),
    height: normalize(60),
  },
  genderText: {
    ...FONTS.medium(16),
    color: '#BBBBC3',
  },
  selectedGenderText: {
    color: COLORS.text,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(20),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: normalize(15),
    backgroundColor: COLORS.card,
  },
  durationPickerContainer: {
    marginTop: normalize(40),
    height: normalize(250),
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationSelector: {
    alignItems: 'center',
    marginHorizontal: normalize(20),
  },
  durationValue: {
    ...FONTS.semibold(24),
    color: COLORS.text,
  },
  durationLabel: {
    ...FONTS.medium(18),
    color: COLORS.text,
  },
  exposureContainer: {
    alignItems: 'center',
    marginTop: normalize(20),
    width: getResponsiveWidth(80), // Responsive width instead of fixed 327px
  },
  exposureCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  exposureValue: {
    ...FONTS.h1,
    color: COLORS.textWhite,
  },
  portfolioContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  portfolioText: {
    ...FONTS.medium(15),
    color: COLORS.text,
    lineHeight: 19
  },
  financialSlider: {
    width: '100%',
    height: 40,
  },
  sliderHint: {
    ...FONTS.body5,
    color: '#6D6E8A',
    textAlign: 'center',
    marginTop: 70,
  },
  // Financial Exposure Step Styles
  financialExposureMainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
  },
  liquidProgressContainer: {
    marginBottom: normalize(30),
    alignItems: 'center',
  },
  portfolioButtonContainer: {
    marginBottom: normalize(40),
    alignItems: 'center',
  },
  portfolioButton: {
    backgroundColor: COLORS.background,
    borderRadius: normalize(25),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  portfolioButtonText: {
    ...FONTS.medium(14),
    color: COLORS.text,
    textAlign: 'center',
  },
  financialSliderContainer: {
    width: '100%',
    marginBottom: normalize(50),
    paddingHorizontal: normalize(20),
  },
  financialExposureHint: {
    ...FONTS.body5,
    color: '#6D6E8A',
    textAlign: 'center',
    marginBottom: normalize(40),
    lineHeight: normalize(18),
  },
  financialActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: normalize(20),
    marginTop: 'auto',
    paddingBottom: normalize(20),
  },
  skipButton: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
  },
  skipButtonText: {
    ...FONTS.medium(16),
    color: '#C7C7C7',
  },
  fixButton: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
  },
  fixButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.primaryAccent,
  },
  planContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  planGraph: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  planAmount: {
    ...FONTS.body3,
    color: COLORS.text,
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planSelector: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  planPrice: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  planName: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  // Plan Step Styles
  planCarouselContainer: {
    flex: 1,
    marginTop: normalize(20),
  },
  planCarouselContent: {
    paddingHorizontal: normalize(20),
  },
  planCard: {
    width: getResponsiveWidth(85),
    backgroundColor: COLORS.card,
    borderRadius: normalize(15),
    padding: normalize(20),
    marginRight: normalize(20),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedPlanCard: {
    borderColor: COLORS.primaryAccent,
    borderWidth: 2,
  },
  planCardHeader: {
    alignItems: 'center',
    marginBottom: normalize(30),
  },
  planCardTitle: {
    ...FONTS.semibold(24),
    color: COLORS.text,
    textAlign: 'center',
  },
  planGraphContainer: {
    marginBottom: normalize(30),
    alignItems: 'center',
  },
  planCardGraph: {
    width: '100%',
    height: normalize(120),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(15),
  },

  planCardAmount: {
    ...FONTS.semibold(16),
    color: COLORS.text,
    backgroundColor: COLORS.card,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(15),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'absolute',
    top: normalize(10),
    right: normalize(20),
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: normalize(20),
  },
  graphLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  planInfo: {
    alignItems: 'flex-end',
    marginBottom: normalize(20),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: normalize(45),
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    width: 145,
  },
  planCardPrice: {
    ...FONTS.semibold(16),
    color: COLORS.text,
    marginBottom: normalize(5),
  },
  planSliderContainer: {
    marginBottom: normalize(20),
    paddingHorizontal: normalize(10),
  },
  planDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: normalize(18),
  },
  planCTAContainer: {
    paddingHorizontal: normalize(20),
    paddingBottom: Platform.OS === 'ios' ? normalize(40) : normalize(30),
    paddingTop: normalize(20),
  },
  planCTAButton: {
    width: '100%',
  },
  planCTAGradient: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  planCTAText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: normalize(20),
  },
  cardInstructions: {
    ...FONTS.medium(16),
    color: COLORS.textLight,
    marginBottom: normalize(20),
  },
  cardImage: {
    width: getResponsiveWidth(60), // Responsive width instead of fixed 250px
    height: normalize(350),
    marginBottom: normalize(30),
  },
  cardQuestion: {
    ...FONTS.medium(24),
    color: COLORS.text,
    marginBottom: normalize(20),
    marginTop: normalize(50),
    textAlign: 'center',
    width: getResponsiveWidth(85), // Responsive width instead of fixed 340px
  },
  completeLogo: {
    width: normalize(80),
    height: normalize(80),
    marginBottom: normalize(20),
    alignSelf: 'center',
  },
  tickImage: {
    width: normalize(80),
    height: normalize(80),
    marginBottom: normalize(137),
    marginTop: normalize(123),
    alignSelf: 'center',
  },

  arabicLogo: {
    width: normalize(104),
    height: normalize(21.83),
    marginBottom: normalize(137),
    alignSelf: 'center',
  },
  completeTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: normalize(40)
  },
  completeImage: {
    width: normalize(150),
    height: normalize(150),
    marginBottom: normalize(30),
    alignSelf: 'center',
  },
  completeText: {
    ...FONTS.body3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: normalize(50),
  },
  nextButton: {
    marginHorizontal: SIZES.padding,
    marginBottom: normalize(30),
    alignSelf: 'center',
    width: '85%',
  },
  swipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(60),
    borderRadius: normalize(30),
    paddingHorizontal: normalize(10),
    width: '90%',
    overflow: 'hidden',
  },
  swipeButtonText: {
    ...FONTS.semibold(15),
    color: 'white',
    marginLeft: normalize(70),

  },
  arrowCircle: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: normalize(30),
  },
  swipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  // Passcode Step Styles
  passcodeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(40),
  },
  passcodeInputContainer: {
    alignItems: 'center',
    marginBottom: normalize(40),
  },
  passcodeHint: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: normalize(20),
  },
  // OTP Input Styles (reused for passcode)
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: normalize(40),
  },
  otpInputContainer: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInputWithDash: {
    position: 'relative',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: normalize(20),
    color: 'transparent',
  },
  otpDot: {
    position: 'absolute',
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: '#7C27D9',
  },

  passcodeError: {
    ...FONTS.body5,
    color: '#FF4444',
    textAlign: 'center',
    marginTop: normalize(20),
  },
  // Biometric Setup Styles
  biometricContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(60),
    justifyContent: 'space-between',
  },
  biometricContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  biometricIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(25),
    width: normalize(340),
    height: normalize(166),
    marginBottom: normalize(40),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: normalize(30),
  },
  biometricIcon: {
    width: normalize(90),
    height: normalize(90),
  },
  biometricDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: normalize(22),
    marginBottom: normalize(60),
    paddingHorizontal: normalize(20),
  },
  biometricButtons: {
    width: '100%',
    gap: normalize(15),
    paddingBottom: normalize(40),
  },
  biometricPrimaryButton: {
    width: '100%',
  },
  biometricButtonGradient: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  biometricPrimaryButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },
  biometricSecondaryButton: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E1FF',
  },
  biometricSecondaryButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.primaryAccent,
    letterSpacing: 0.5,
  },

  // Camera Access Step Styles
  cameraAccessContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  cameraAccessContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraAccessDescription: {
    ...FONTS.weight('400', 16),
    color: '#6D6E8A',
    textAlign: 'center',
    marginBottom: normalize(40),
    lineHeight: normalize(24),
  },
  cameraIllustrationContainer: {
    marginBottom: normalize(-30),
    marginRight: normalize(-60),
    alignItems: 'flex-end',
  },
  cameraIllustration: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    backgroundColor: '#F6F5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: normalize(417),
    height: normalize(417),
  },
  cameraAccessButtonContainer: {
    width: '100%',
    paddingBottom: normalize(40),
  },
  cameraAccessButton: {
    width: '100%',
    marginBottom: normalize(20),
  },
  cameraAccessButtonGradient: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  cameraAccessButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },

  // Selfie Step Styles
  selfieContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(20),
  },
  breadcrumbText: {
    ...FONTS.medium(14),
    color: COLORS.primaryAccent,
  },
  breadcrumbTextInactive: {
    ...FONTS.medium(14),
    color: '#C7C7C7',
  },
  breadcrumbSeparator: {
    ...FONTS.medium(14),
    color: '#C7C7C7',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: normalize(20),
    borderRadius: normalize(20),
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  faceFrameOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: normalize(292),
    height: normalize(467),
    borderWidth: 3,
    borderColor: COLORS.textWhite,
    borderRadius: normalize(20),
    backgroundColor: 'transparent',
  },
  documentFrame: {
    width: normalize(320),
    height: normalize(200),
    borderWidth: 3,
    borderColor: COLORS.textWhite,
    borderRadius: normalize(15),
    backgroundColor: 'transparent',
  },
  captureButtonContainer: {
    paddingVertical: normalize(30),
    alignItems: 'center',
  },
  captureButton: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    backgroundColor: COLORS.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textWhite,
  },
  captureButtonInner: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
  },

  // Document Scan Step Styles
  documentScanSubtitle: {
    ...FONTS.weight('400', 16),
    color: COLORS.primaryAccent,
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  documentScanTitle: {
    ...FONTS.semibold(28),
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: normalize(40),
    lineHeight: normalize(36),
  },
  documentScanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  documentScanDescription: {
    ...FONTS.weight('400', 16),
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: normalize(60),
    lineHeight: normalize(24),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: normalize(40),
    paddingHorizontal: normalize(10),
  },
  customCheckbox: {
    marginRight: normalize(10),
    marginTop: normalize(2),
  },
  checkboxBox: {
    width: normalize(20),
    height: normalize(20),
    borderWidth: 2,
    borderColor: '#C7C7C7',
    borderRadius: normalize(4),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#7A4BFF',
    borderColor: '#7A4BFF',
  },
  checkboxCheck: {
    color: COLORS.textWhite,
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  termsText: {
    ...FONTS.weight('400', 14),
    color: COLORS.text,
    flex: 1,
    lineHeight: normalize(20),
  },
  termsLink: {
    color: COLORS.primaryAccent,
    textDecorationLine: 'underline',
  },
  documentScanButtons: {
    width: '100%',
    gap: normalize(15),
    marginBottom: normalize(40),
  },
  documentScanPrimaryButton: {
    width: '100%',
  },
  documentScanButtonGradient: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  documentScanPrimaryButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },
  documentScanSecondaryButton: {
    width: '100%',
  },
  documentScanSecondaryButtonGradient: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  documentScanSecondaryButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },
  documentScanTermsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  documentScanCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  documentScanRadioContainer: {
    marginRight: normalize(15),
  },
  documentScanRadioOuter: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(40),
    borderWidth: 2,
    borderColor: '#A4A4A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentScanRadioOuterSelected: {
    borderColor: '#A4A4A4',
  },
  documentScanRadioInner: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(40),
  },
  documentScanTermsText: {
    ...FONTS.weight('400', 12),
    color: '#6D6E8A',
    flex: 1,
    lineHeight: 16,
    textAlign: 'center',
  },
  documentScanTermsLink: {
    ...FONTS.weight('400', 12),
    color: '#6D6E8A',
    textDecorationLine: 'underline',
  },

  // Document Review Step Styles
  documentReviewContainer: {
    flex: 1,
    paddingHorizontal: normalize(20),
    paddingTop: normalize(40),
  },
  documentReviewBottomContainer: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(30),
    paddingTop: normalize(20),
  },
  documentReviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  documentReviewThumbnailContainer: {
    marginRight: normalize(16),
  },
  documentReviewSelfie: {
    width: normalize(150),
    height: normalize(130),
    borderRadius: normalize(15),
    backgroundColor: '#F6F5F8',
  },
  documentReviewSelfiePlaceholder: {
    width: normalize(150),
    height: normalize(130),
    borderRadius: normalize(15),
    backgroundColor: '#F6F5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentReviewSelfieIcon: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: '#E0E0E0',
  },
  documentReviewDocument: {
    width: normalize(150),
    height: normalize(130),
    borderRadius: normalize(15),
    backgroundColor: '#F6F5F8',
  },
  documentReviewDocumentPlaceholder: {
    width: normalize(150),
    height: normalize(130),
    borderRadius: normalize(15),
    backgroundColor: '#F6F5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentReviewIdIcon: {
    width: normalize(50),
    height: normalize(35),
    position: 'relative',
  },
  documentReviewIdIconPerson: {
    position: 'absolute',
    left: normalize(8),
    top: normalize(6),
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    backgroundColor: '#B0BEC5',
  },
  documentReviewIdIconLine1: {
    position: 'absolute',
    left: normalize(25),
    top: normalize(8),
    width: normalize(18),
    height: normalize(2),
    backgroundColor: '#B0BEC5',
  },
  documentReviewIdIconLine2: {
    position: 'absolute',
    left: normalize(25),
    top: normalize(14),
    width: normalize(15),
    height: normalize(2),
    backgroundColor: '#B0BEC5',
  },
  documentReviewIdIconLine3: {
    position: 'absolute',
    left: normalize(25),
    top: normalize(20),
    width: normalize(12),
    height: normalize(2),
    backgroundColor: '#B0BEC5',
  },
  documentReviewBillIcon: {
    width: normalize(40),
    height: normalize(35),
    position: 'relative',
  },
  documentReviewBillIconDoc1: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: normalize(28),
    height: normalize(35),
    backgroundColor: '#B0BEC5',
    borderRadius: normalize(2),
  },
  documentReviewBillIconDoc2: {
    position: 'absolute',
    left: normalize(6),
    top: normalize(-3),
    width: normalize(28),
    height: normalize(35),
    backgroundColor: '#C7C7C7',
    borderRadius: normalize(2),
  },
  documentReviewBillIconDoc3: {
    position: 'absolute',
    left: normalize(12),
    top: normalize(-6),
    width: normalize(28),
    height: normalize(35),
    backgroundColor: '#D0D0D0',
    borderRadius: normalize(2),
  },
  documentReviewContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentReviewCheckmark: {
    width: normalize(24),
    height: normalize(24),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  documentReviewCheckmarkText: {
    color: COLORS.textWhite,
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  documentReviewLabel: {
    ...FONTS.semibold(16),
    color: COLORS.text,
  },
  documentReviewInfo: {
    ...FONTS.weight('400', 14),
    color: COLORS.textLight,
    textAlign: 'center',
    marginVertical: normalize(20),
    lineHeight: normalize(20),
  },
  documentReviewSubmitButton: {
    width: '100%',
  },
  documentReviewSubmitButtonGradient: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  documentReviewSubmitButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },

  // Congratulations Step Styles
  congratulationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(40),
  },
  congratulationsTitle: {
    ...FONTS.semibold(28),
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: normalize(80),
  },
  congratulationsIconContainer: {
    marginBottom: normalize(80),
  },
  congratulationsCheckmarkCircle: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    borderWidth: 4,
    borderColor: COLORS.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratulationsCheckmark: {
    fontSize: normalize(48),
    color: COLORS.primaryAccent,
    fontWeight: 'bold',
  },
  congratulationsSubtitle: {
    ...FONTS.weight('400', 20),
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: normalize(28),
    marginBottom: normalize(80),
  },
  congratulationsButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  congratulationsSwipeButton: {
    width: '100%',
  },
  congratulationsSwipeButtonGradient: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  congratulationsSwipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  congratulationsArrowCircle: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: COLORS.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  congratulationsSwipeText: {
    ...FONTS.semibold(16),
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },
});

export default KYCScreen;
