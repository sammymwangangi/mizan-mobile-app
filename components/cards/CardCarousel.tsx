import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface CardData {
  id: string;
  cardNumber: string;
  validThru: string;
  cardholderName: string;
  type: 'visa' | 'mastercard';
}

interface CardCarouselProps {
  cards: CardData[];
  onCardChange?: (index: number) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Full width minus padding

const CardCarousel: React.FC<CardCarouselProps> = ({ cards, onCardChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

  const renderCard = ({ item, index }: { item: CardData; index: number }) => {
    return (
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#CE72E3', '#8A2BE2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Image
            source={require('../../assets/cards/mizan-card.png')}
            style={styles.cardBackground}
            resizeMode="contain"
          />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Mizan Card</Text>
              <Image
                source={require('../../assets/cards/contactless-icon.png')}
                style={styles.contactlessIcon}
              />
            </View>

            <Text style={styles.cardNumber}>
              •••• •••• •••• {item.cardNumber.slice(-4)}
            </Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>VALID THRU</Text>
                <Text style={styles.cardValue}>{item.validThru}</Text>
              </View>

              <View>
                <Text style={styles.cardLabel}>CARDHOLDER</Text>
                <Text style={styles.cardValue}>{item.cardholderName}</Text>
              </View>

              {item.type === 'visa' ? (
                <Image
                  source={require('../../assets/cards/visa-logo.png')}
                  style={styles.cardTypeIcon}
                />
              ) : (
                <Image
                  source={require('../../assets/cards/mastercard-logo.png')}
                  style={styles.cardTypeIcon}
                />
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const handleCardChange = (index: number) => {
    setActiveIndex(index);
    if (onCardChange) {
      onCardChange(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const contentOffset = event.nativeEvent.contentOffset;
          const viewSize = event.nativeEvent.layoutMeasurement;
          // Calculate the page number by dividing the x offset by the width of the view
          const pageNum = Math.floor(contentOffset.x / viewSize.width);
          handleCardChange(pageNum);
        }}
        contentContainerStyle={styles.scrollViewContent}
      >
        {cards.map((item, index) => (
          <View key={item.id || index.toString()}>
            {renderCard({ item, index })}
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        {cards.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollTo({ x: index * CARD_WIDTH, animated: true });
              }
            }}
          >
            <View
              style={[
                styles.paginationDot,
                index === activeIndex && styles.activePaginationDot,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 0,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CARD_WIDTH,
  },
  card: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
  contactlessIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.textWhite,
  },
  cardNumber: {
    ...FONTS.h2,
    color: COLORS.textWhite,
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    ...FONTS.body5,
    color: COLORS.textWhite,
    opacity: 0.7,
  },
  cardValue: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    marginTop: 4,
  },
  cardTypeIcon: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: COLORS.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default CardCarousel;
