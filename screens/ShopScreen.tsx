import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Search, Sliders, ShoppingBag, Home, Bell, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';

type ShopScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Shop'>;

// Sample product data
const products = [
  {
    id: '1',
    name: 'Apple iPhone 13 Pro 128gb Blue',
    price: 199.45,
    image: require('../assets/shop/Product1.png'),
    description: 'At non risus, sagittis feugiat',
  },
  {
    id: '2',
    name: 'Macbook Pro 16" M1 Max space gray',
    price: 199.45,
    image: require('../assets/shop/Product2.png'),
    description: 'At non risus, sagittis feugiat',
  },
  {
    id: '3',
    name: 'Apple iPhone 13 Pro 128gb Blue',
    price: 199.45,
    image: require('../assets/shop/Product3.png'),
    description: 'At non risus, sagittis feugiat',
  },
  {
    id: '4',
    name: 'Macbook Pro 16" M1 Max space gray',
    price: 199.45,
    image: require('../assets/shop/Product4.png'),
    description: 'At non risus, sagittis feugiat',
  },
];

// Categories
const categories = ['All category', 'Electronics', 'Clothing', 'Home', 'Beauty'];

const ShopScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ShopScreenNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState('All category');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Add to cart function
  const addToCart = (productId: string) => {
    if (!cartItems.includes(productId)) {
      setCartItems([...cartItems, productId]);
    }
  };

  // Navigate to checkout
  const goToCheckout = () => {
    navigation.navigate('Checkout');
  };

  // Render product item
  const renderProductItem = ({ item }: { item: typeof products[0] }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => addToCart(item.id)}
    >
      <Image source={item.image} style={styles.productImage} resizeMode="contain" />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#D155FF" />

      {/* Header with gradient background */}
      <LinearGradient
        colors={['#D155FF', '#8F00E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 16 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={COLORS.textWhite} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>shop</Text>
            <Text style={styles.headerSubtitle}>Frame 40</Text>
          </View>

          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>All category</Text>
            <ChevronDown size={16} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#A9A9A9" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#A9A9A9"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Sliders size={20} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#AAAAAA" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.activeNavBackground}>
            <ShoppingBag size={24} color="#D155FF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Bell size={24} color="#AAAAAA" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <User size={24} color="#AAAAAA" />
        </TouchableOpacity>
      </View>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={goToCheckout}
        >
          <LinearGradient
            colors={['#D155FF', '#8F00E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cartButtonGradient}
          >
            <ShoppingBag size={24} color={COLORS.textWhite} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginLeft: -40, // To align with the left edge
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 24,
    textTransform: 'lowercase',
  },
  headerSubtitle: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(143, 0, 224, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    ...FONTS.body4,
    color: COLORS.textWhite,
    marginRight: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.textWhite,
    ...FONTS.body4,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productGrid: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  productCard: {
    width: '50%',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  productImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    paddingVertical: 8,
  },
  productName: {
    ...FONTS.body4,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 4,
    fontSize: 14,
  },
  productDescription: {
    ...FONTS.body5,
    color: '#888888',
    marginBottom: 4,
    fontSize: 12,
  },
  productPrice: {
    ...FONTS.h4,
    color: '#D155FF',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
  },
  activeNavItem: {
    position: 'relative',
  },
  activeNavBackground: {
    backgroundColor: 'rgba(209, 85, 255, 0.1)',
    borderRadius: 20,
    padding: 8,
  },
  cartButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  cartButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    ...FONTS.body5,
    color: '#D155FF',
    fontWeight: 'bold',
  },
});

export default ShopScreen;
