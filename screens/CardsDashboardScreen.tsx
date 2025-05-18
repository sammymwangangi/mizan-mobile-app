import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import CardCarousel from '../components/cards/CardCarousel';
import CardActionButton from '../components/cards/CardActionButton';
import QuickFunctionItem from '../components/cards/QuickFunctionItem';

type CardsDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardsDashboard'>;

const CardsDashboardScreen = () => {
  const navigation = useNavigation<CardsDashboardScreenNavigationProp>();

  // Mock data for cards
  const cards = [
    {
      id: '1',
      cardNumber: '4242 4242 4242 4242',
      validThru: '12/25',
      cardholderName: 'ROBIN HABIBI',
      type: 'visa' as const,
    },
    {
      id: '2',
      cardNumber: '5353 5353 5353 5353',
      validThru: '10/26',
      cardholderName: 'ROBIN HABIBI',
      type: 'mastercard' as const,
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

  return (
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
        <CardCarousel cards={cards} />
        
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
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 16,
  },
});

export default CardsDashboardScreen;
