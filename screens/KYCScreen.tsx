import { useEffect, useState, useRef } from 'react';
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

type KYCScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'KYC'>;

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
  // PLAN,
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
  const [value, setValue] = useState<number>(78);

  // Options for the "what gets you most excited" step
  const interestOptions = [
    { id: 'budget', text: 'Create a budget i can stick to', icon: 'clock', image: require('../assets/interests/budget.png'), },
    { id: 'debts', text: 'Crushing my debts with confidence', icon: 'tool', image: require('../assets/interests/crush-debts.png') },
    { id: 'stocks', text: 'Get a piece of the stock markets', icon: 'bar-chart-2', image: require('../assets/interests/stock.png') },
    { id: 'credit', text: 'Improve my credit score', icon: 'trending-up', image: require('../assets/interests/credit-score.png') },
    { id: 'savings', text: 'Save spare change for a rainy day', icon: 'umbrella', image: require('../assets/interests/save.png') },
    { id: 'unsure', text: 'Not sure really.', icon: 'help-circle', image: require('../assets/interests/help-circle.png') },
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['budget']);

  // Hustle options for the "By the way, whats your hustle?" step
  const hustleOptions = [
    { id: 'employed', text: 'Employed - On a 8 to 5 grind' },
    { id: 'freelancing', text: 'Freelancing - Doing what I love' },
    { id: 'business', text: 'Business - Chasing the mullah' },
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
  const [customizeCard, setCustomizeCard] = useState(false);

  // Animation values for the swipe button
  const translateX = useRef(new Animated.Value(0)).current;
  const arrowTranslateX = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const flatListRef = useRef<FlatList>(null);
  const handleSkip = () => {
    navigation.replace('Congratulations');
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
      navigation.replace('Home', {});
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
                height: normalize(56),
                borderRadius: normalize(28),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{
                ...FONTS.semibold(15),
                color: COLORS.textWhite,
              }}>NEXT</Text>
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
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepSubtitle}>we need to work on this</Text>
        <Text style={styles.stepTitle}>Your financial exposure</Text>

        <View style={styles.container}>
          <LiquidProgressCircle value={value} size={220} />

          <View style={styles.exposureContainer}>

            <View style={{
              flexDirection: 'row',
              width: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: normalize(40),
            }}>
              <LinearGradient
                colors={['#4B99DE', '#6B3BA6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: normalize(20),
                  right: normalize(20),
                  height: normalize(64),
                  borderRadius: normalize(45),
                  padding: 1.5, // Border width
                  zIndex: 2,
                  width: normalize(177),
                  transform: [{ translateY: normalize(-64) / 2 }],
                  shadowColor: '#6943AF', shadowOffset: { width: 0, height: normalize(2) }, shadowOpacity: 0.5, shadowRadius: normalize(4), elevation: 20
                }}
              >

                <View style={{
                  flex: 1,
                  backgroundColor: COLORS.background,
                  borderRadius: normalize(45),
                  flexDirection: 'row',
                  overflow: 'hidden',
                  width: normalize(174),
                }}>
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>

                    <Text style={styles.portfolioText}>Moderate Portfolio</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.sliderWrapper}>
              <View style={styles.sliderTrackContainer}>
                <View style={styles.sliderTrackBackground} />
                <View
                  style={[
                    styles.sliderTrackActive,
                    { width: `${(value / 100) * 100}%` }
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

              <View
                style={[
                  styles.sliderThumbContainer,
                  { left: `${(value / 100) * 100}%` }
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

            <Text style={styles.sliderHint}>
              By sliding you will notice that your financial exposure becomes less severe.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // const renderPlanStep = () => {
  //   return (
  //     <View style={styles.stepContainer}>
  //       <Text style={styles.stepSubtitle}>Get a one month&apos;s free on any plan</Text>
  //       <Text style={styles.stepTitle}>Slide to choose a plan</Text>

  //       <View style={styles.planContainer}>
  //         <View style={styles.planGraph}>
  //           {/* Graph visualization would go here */}
  //           <Text style={styles.planAmount}>$500</Text>
  //         </View>

  //         <View style={styles.planSelector}>
  //           <Text style={styles.planPrice}>$3 p.m</Text>
  //           <Text style={styles.planName}>{selectedPlan}</Text>
  //         </View>

  //         <Slider
  //           style={styles.financialSlider}
  //           minimumValue={0}
  //           maximumValue={100}
  //           value={50}
  //           minimumTrackTintColor={COLORS.primary}
  //           maximumTrackTintColor={COLORS.border}
  //           thumbTintColor={COLORS.primary}
  //         />

  //         <Text style={styles.sliderHint}>
  //           Use this tool to see how round-ups and depositing money each month can impact the long term value of your account.
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

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
      <View className="relative flex-1 flex-col justify-start items-center gap-[137px] px-10">
        <ConfettiCannon count={120} origin={{ x: 200, y: 0 }} fadeOut={true} explosionSpeed={350} fallSpeed={3000} />
        <Text className="text-[#1B1C39] text-center" style={{ ...FONTS.semibold(25) }}>Congratulations</Text>
        <Image
          source={require('../assets/kyc/tick.png')}
          className="w-20 h-20"
          resizeMode="contain"
        />
        <Text className="text-[#1B1C39] text-center" style={{ fontFamily: 'Poppins' }}>
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
            navigation.replace('Home', {});
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
      // case KYCStep.PLAN:
      //   return renderPlanStep();
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

          {(currentStep < KYCStep.CONGRATULATIONS && currentStep !== KYCStep.FULL_NAME && currentStep !== KYCStep.CARD) && (

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
});

export default KYCScreen;
