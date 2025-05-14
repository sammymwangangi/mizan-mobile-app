import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Button from '../components/Button';
import { ArrowLeft, ArrowRight, Clock, Wrench, BarChart2, TrendingUp, Umbrella, HelpCircle } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Input from '../components/Input';
import DurationPicker from '../components/DurationPicker';

type KYCScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'KYC'>;

// RadioOptionCard component for the interests step
interface RadioOptionCardProps {
  text: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}

const RadioOptionCard: React.FC<RadioOptionCardProps> = ({ text, icon, selected, onPress }) => {
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
              {icon}
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
        {icon}
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
  DURATION,
  FINANCIAL_EXPOSURE,
  PLAN,
  CARD,
  CONGRATULATIONS,
  COMPLETE
}

const KYCScreen: React.FC = () => {
  const navigation = useNavigation<KYCScreenNavigationProp>();
  const [currentStep, setCurrentStep] = useState<KYCStep>(KYCStep.FULL_NAME);
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  // Options for the "what gets you most excited" step
  const interestOptions = [
    { id: 'budget', text: 'Create a budget i can stick to', icon: 'clock' },
    { id: 'debts', text: 'Crushing my debts with confidence', icon: 'tool' },
    { id: 'stocks', text: 'Get a piece of the stock markets', icon: 'bar-chart-2' },
    { id: 'credit', text: 'Improve my credit score', icon: 'trending-up' },
    { id: 'savings', text: 'Save spare change for a rainy day', icon: 'umbrella' },
    { id: 'unsure', text: 'Not sure really.', icon: 'help-circle' },
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['budget']);

  const [duration, setDuration] = useState({ years: 3, months: 6 });
  const [financialExposure, setFinancialExposure] = useState(78);
  const [selectedPlan, setSelectedPlan] = useState('Premium Ethics');
  const [customizeCard, setCustomizeCard] = useState(false);

  // Animation values for the swipe button
  const translateX = useRef(new Animated.Value(0)).current;
  const arrowTranslateX = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentStep === KYCStep.CONGRATULATIONS) {
      // Navigate to complete step after 2 seconds
      const timer = setTimeout(() => {
        setCurrentStep(KYCStep.COMPLETE);
      }, 2000);

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

  const handleNext = () => {
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
      navigation.replace('Home');
    }
  };

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
    const totalSteps = KYCStep.COMPLETE;
    const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;
    // hide progress bar on congratulations step
    if (currentStep === KYCStep.CONGRATULATIONS) {
      return null;
    }

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    );
  };

  const renderFullNameStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>While we review your documents, lets get to know you more</Text>
        <Text style={styles.stepTitle}>Lets start by getting to know your full legal name</Text>

        <View style={styles.fullNameContainer}>
          <Input
            value={fullName}
            onChangeText={setFullName}
            placeholder="Habibi Robin"
            error={fullNameError}
            containerStyle={styles.fullNameInput}
          />
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <LinearGradient
            colors={['#5592EF', '#8532E0', '#F053E0']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientNextButton}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGenderStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>And what&apos;s your gender?</Text>

        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === 'male' && styles.selectedGenderOption,
            ]}
            onPress={() => setGender('male')}
          >
            <View style={styles.genderIconContainer}>
              <Image
                source={require('../assets/kyc/male.png')}
                style={styles.genderIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={[
              styles.genderText,
              gender === 'male' && styles.selectedGenderText,
            ]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === 'female' && styles.selectedGenderOption,
            ]}
            onPress={() => setGender('female')}
          >
            <View style={styles.genderIconContainer}>
              <Image
                source={require('../assets/kyc/female.png')}
                style={styles.genderIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={[
              styles.genderText,
              gender === 'female' && styles.selectedGenderText,
            ]}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderInterestsStep = () => {
    // Function to select a single interest (radio button behavior)
    const toggleInterest = (id: string) => {
      // Set only the selected interest (radio button behavior)
      setSelectedInterests([id]);
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
        <Text style={styles.interestsSubtitle}>(Select one option)</Text>

        <View style={styles.interestsContainer}>
          {interestOptions.map((option) => (
            <RadioOptionCard
              key={option.id}
              text={option.text}
              icon={getIconComponent(option.icon)}
              selected={selectedInterests.includes(option.id)}
              onPress={() => toggleInterest(option.id)}
            />
          ))}
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
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>we need to work on this</Text>
        <Text style={styles.stepTitle}>Your financial exposure</Text>

        <View style={styles.exposureContainer}>
          <View style={styles.exposureCircle}>
            <Text style={styles.exposureValue}>{financialExposure}%</Text>
          </View>

          <View style={styles.portfolioContainer}>
            <Text style={styles.portfolioText}>Moderate Portfolio</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={financialExposure}
            onValueChange={setFinancialExposure}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.border}
            thumbTintColor={COLORS.primary}
          />

          <Text style={styles.sliderHint}>
            By sliding you will notice that your financial exposure becomes less severe.
          </Text>
        </View>
      </View>
    );
  };

  const renderPlanStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Get a one month&apos;s free on any plan</Text>
        <Text style={styles.stepTitle}>Slide to choose a plan</Text>

        <View style={styles.planContainer}>
          <View style={styles.planGraph}>
            {/* Graph visualization would go here */}
            <Text style={styles.planAmount}>$500</Text>
          </View>

          <View style={styles.planSelector}>
            <Text style={styles.planPrice}>$3 p.m</Text>
            <Text style={styles.planName}>{selectedPlan}</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={50}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.border}
            thumbTintColor={COLORS.primary}
          />

          <Text style={styles.sliderHint}>
            Use this tool to see how round-ups and depositing money each month can impact the long term value of your account.
          </Text>
        </View>
      </View>
    );
  };

  const renderCardStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>Make it yours, personalize your card</Text>
        <Text style={styles.stepTitle}>Order a fancy card</Text>

        <View style={styles.cardContainer}>
          <Text style={styles.cardInstructions}>Slide to choose</Text>

          <Image
            source={require('../assets/kyc/fancy-card.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />

          <Text style={styles.cardQuestion}>
            Would you like to customize your card?
          </Text>
        </View>
      </View>
    );
  };

  const renderCongratulationsStep = () => {
    return (
      <View className="relative flex-1 flex-col justify-start items-center gap-[137px] px-10">
        <Image
          source={require('../assets/kyc/arabic-logo.png')}
          className="w-[104px] h-[21.83px]"
          resizeMode="contain"
        />
        <Text className="text-[25px] font-semibold text-[#1B1C39] text-center">Congratulations</Text>
        <Image
          source={require('../assets/kyc/tick.png')}
          className="w-20 h-20"
          resizeMode="contain"
        />
        <Text className="text-lg text-[#1B1C39] text-center">
          Great job Habibi, your account is being setup, sabr In Shaa Allah
        </Text>
        <Image
          source={require('../assets/kyc/congratulation-pattern.png')}
          className="absolute bottom-0 right-0 w-[195px] h-[195px]"
          resizeMode="contain"
        />
      </View>
    );
  };

  const renderCompleteStep = () => {
    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationX } = event.nativeEvent;

        // If swiped more than 120px (about half the button width), navigate to Home
        if (translationX > 120) {
          // Animate the button to slide out
          Animated.timing(buttonOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }).start(() => {
            navigation.replace('Home');
          });
        } else {
          // Reset the position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5
          }).start();
        }
      }
    };

    return (
      <View className="flex-1 flex-col justify-between items-center px-2 py-20">
        <Image
          source={require('../assets/kyc/arabic-logo.png')}
          className="w-[104px] h-[21.83px]"
          resizeMode="contain"
        />

        <Text className="text-[25px] font-semibold text-[#1B1C39] text-center">That&apos;s it</Text>

        <Image
          source={require('../assets/kyc/high_five.png')}
          className='w-[200px] h-[200px]'
          resizeMode="contain"
        />

        <Text className="text-[#1B1C39] text-[20px] text-center">
          That&apos;s it, start moving moolah
        </Text>

        <Animated.View style={[styles.swipeButtonContainer, { opacity: buttonOpacity }]}>
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
      case KYCStep.DURATION:
        return renderDurationStep();
      case KYCStep.FINANCIAL_EXPOSURE:
        return renderFinancialExposureStep();
      case KYCStep.PLAN:
        return renderPlanStep();
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

          {(currentStep < KYCStep.CONGRATULATIONS && currentStep !== KYCStep.FULL_NAME) && (
            <Button
              title="NEXT"
              onPress={handleNext}
              gradient={true}
              style={styles.nextButton}
            />
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    padding: SIZES.padding,
  },
  // Radio option card styles
  cardWrapper: {
    marginBottom: 10,
  },
  radioOptionCard: {
    width: 340,
    height: 57,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(222, 222, 222, 0.48)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: COLORS.card,
  },
  radioContainer: {
    marginRight: 15,
  },
  radioOuter: {
    width: 35,
    height: 35,
    borderRadius: 40,
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
    width: 21,
    height: 21,
    borderRadius: 40,
  },
  radioIconContainer: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  radioTextContainer: {
    flex: 1,
  },
  radioText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: '#1B1C39',
  },
  interestsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  interestsSubtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: -30,
    marginBottom: 30,
  },
  fullNameContainer: {
    width: '100%',
    marginTop: 20,
  },
  fullNameInput: {
    width: '100%',
  },
  spacer: {
    flex: 1,
  },
  nextButtonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  gradientNextButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  stepSubtitle: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  arabicStepTitle: {
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins_400Regular',
    }),
    fontWeight: 400,
    fontSize: 18,
    color: '#1B1C39',
    textAlign: 'center'
  },
  stepTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  genderOption: {
    width: 150,
    height: 180,
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
  },
  genderIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  genderIcon: {
    width: 60,
    height: 60,
  },
  genderText: {
    ...FONTS.h3,
    color: COLORS.textLight,
  },
  selectedGenderText: {
    color: COLORS.primary,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 15,
    backgroundColor: COLORS.card,
  },
  durationPickerContainer: {
    marginTop: 40,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationSelector: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  durationValue: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  durationLabel: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  exposureContainer: {
    alignItems: 'center',
    marginTop: 20,
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
    ...FONTS.body3,
    color: COLORS.text,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderHint: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 20,
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
  cardContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  cardInstructions: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  cardImage: {
    width: 250,
    height: 350,
    marginBottom: 30,
  },
  cardQuestion: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 20,
  },
  completeLogo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    alignSelf: 'center',
  },
  tickImage: {
    width: 80,
    height: 80,
    marginBottom: 137,
    marginTop: 123,
    alignSelf: 'center',
  },

  arabicLogo: {
    width: 104,
    height: 21.83,
    marginBottom: 137,
    alignSelf: 'center',
  },
  completeTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40
  },
  completeImage: {
    width: 150,
    height: 150,
    marginBottom: 30,
    alignSelf: 'center',
  },
  completeText: {
    ...FONTS.body3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 50,
  },
  nextButton: {
    marginHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  swipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 10,
    width: '90%',
    overflow: 'hidden',
  },
  swipeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
    marginLeft: 20,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  swipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
});

export default KYCScreen;
