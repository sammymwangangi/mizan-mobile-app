import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import CardCarousel from '../components/cards/CardCarousel';
import CardActionButton from '../components/cards/CardActionButton';
import QuickFunctionItem from '../components/cards/QuickFunctionItem';
import PaymentCard from 'components/PaymentCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type CardsDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardsDashboard'>;

const { width } = Dimensions.get('window');

const CardsDashboardScreen = () => {
  const navigation = useNavigation<CardsDashboardScreenNavigationProp>();
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Mock data for cards
  const cards = [
    {
      id: '1',
      number: '**** **** **** 4242',
      validity: '12/25',
      cardholderName: 'ROBIN HABIBI',
      brand: 'visa' as const,
    },
    {
      id: '2',
      number: '**** **** **** 5353',
      validity: '10/26',
      cardholderName: 'ROBIN HABIBI',
      brand: 'mastercard' as const,
    },
  ];

  // Card actions
  const cardActions = [
    {
      id: '1',
      title: 'Top Up',
      icon: require('../assets/cards/top-up-card.png'),
      onPress: () => console.log('Top Up pressed'),
    },
    {
      id: '2',
      title: 'Link Card',
      icon: require('../assets/cards/link-card.png'),
      onPress: () => navigation.navigate('CardLinking'),
    },
    {
      id: '3',
      title: 'Dispose Card',
      icon: require('../assets/cards/dispose-card.png'),
      onPress: () => console.log('Dispose Card pressed'),
    },
    {
      id: '4',
      title: 'Renew',
      icon: require('../assets/cards/renew-card.png'),
      onPress: () => console.log('Renew pressed'),
    },
  ];

  // Quick functions
  const quickFunctions = [
    {
      id: '1',
      title: 'Change Pincode',
      icon: require('../assets/cards/change-pincode-icon.png'),
      onPress: () => console.log('Change Pincode pressed'),
    },
    {
      id: '2',
      title: 'Freeze Card',
      icon: require('../assets/cards/freeze-card-icon.png'),
      onPress: () => console.log('Freeze Card pressed'),
    },
    {
      id: '3',
      title: 'Download Statement',
      icon: require('../assets/cards/download-statement-icon.png'),
      onPress: () => console.log('Download Statement pressed'),
    },
    {
      id: '4',
      title: 'Card Controls',
      icon: require('../assets/cards/card-controls-icon.png'),
      onPress: () => console.log('Card Controls pressed'),
    },
  ];

  // Handle card scroll
  const handleCardScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveCardIndex(index);
  };

  // Reference to the ScrollView
  const cardsScrollViewRef = React.useRef<ScrollView>(null);

  // Function to handle pagination dot clicks
  const handlePaginationDotPress = (index: number) => {
    setActiveCardIndex(index);
    // Calculate the x position to scroll to (card width + margin)
    const cardWidth = 320;
    const cardMargin = 19;
    const xOffset = index * (cardWidth + cardMargin);

    // Scroll to the selected card
    cardsScrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mizan Cards</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card Carousel */}
          {/* <CardCarousel cards={cards} /> */}
          <FlatList
            ref={flatListRef}
            data={cards}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleCardScroll}
            renderItem={({ item, index }) => (
              <PaymentCard
                cardNumber={item.number}
                validity={item.validity}
                brand={item.brand}
                isActive={index === activeCardIndex}
              />
            )}
          />

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.paginationDotContainer}
                onPress={() => handlePaginationDotPress(index)}
              >
                {index === activeCardIndex ? (
                  <LinearGradient
                    colors={['#CE72E3', '#8A2BE2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.paginationDot, styles.activePaginationDot]}
                  />
                ) : (
                  <View style={styles.paginationDot} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Card Actions */}
          <View style={styles.actionsContainer}>
            {cardActions.map((action) => (
              <CardActionButton
                key={action.id}
                title={action.title}
                icon={action.icon}
                onPress={action.onPress}
              />
            ))}
          </View>

          {/* Quick Functions */}
          <View style={styles.quickFunctionsContainer}>
            <Text style={styles.sectionTitle}>Quick Functions</Text>

            {quickFunctions.map((function_) => (
              <QuickFunctionItem
                key={function_.id}
                title={function_.title}
                icon={function_.icon}
                onPress={function_.onPress}
              />
            ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  quickFunctionsContainer: {
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.semibold(20),
    color: COLORS.text,
    marginBottom: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  paginationDotContainer: {
    marginHorizontal: 5,
    padding: 5, // Add padding for better touch target
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E6E6FF',
  },
  activePaginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default CardsDashboardScreen;
