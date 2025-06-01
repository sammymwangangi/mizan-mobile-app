import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { 
  normalize, 
  getResponsiveWidth, 
  getResponsiveHeight, 
  getResponsivePadding,
  isTablet,
  isSmallPhone,
  getDeviceType 
} from '../utils';

const ResponsiveExample = () => {
  const deviceType = getDeviceType();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Responsive Design Examples</Text>
        <Text style={styles.deviceInfo}>Device Type: {deviceType}</Text>
        
        {/* Responsive Card */}
        <View style={styles.responsiveCard}>
          <Text style={styles.cardTitle}>Responsive Card</Text>
          <Text style={styles.cardText}>
            This card adapts to different screen sizes using percentage-based widths
            and responsive padding.
          </Text>
        </View>

        {/* Responsive Grid */}
        <Text style={styles.methodTitle}>Responsive Grid</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Item 1</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Item 2</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Item 3</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Item 4</Text>
          </View>
        </View>

        {/* Device-specific styling */}
        <View style={[styles.deviceSpecificContainer, getDeviceSpecificStyle()]}>
          <Text style={styles.deviceText}>
            Device-specific styling: This container changes based on device type
          </Text>
        </View>

        {/* Responsive Image */}
        <View style={styles.imageContainer}>
          <View style={styles.responsiveImage}>
            <Text style={styles.imagePlaceholder}>Responsive Image Placeholder</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Helper function for device-specific styling
const getDeviceSpecificStyle = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'tablet':
      return {
        backgroundColor: '#E3F2FD',
        padding: getResponsivePadding(30),
      };
    case 'large':
      return {
        backgroundColor: '#F3E5F5',
        padding: getResponsivePadding(25),
      };
    case 'medium':
      return {
        backgroundColor: '#E8F5E8',
        padding: getResponsivePadding(20),
      };
    case 'small':
      return {
        backgroundColor: '#FFF3E0',
        padding: getResponsivePadding(15),
      };
    default:
      return {
        backgroundColor: COLORS.card,
        padding: SIZES.padding,
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h2,
    marginBottom: normalize(15),
    color: COLORS.primary,
    textAlign: 'center',
  },
  deviceInfo: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: normalize(20),
  },
  methodTitle: {
    ...FONTS.semibold('body3'),
    marginTop: normalize(25),
    marginBottom: normalize(15),
    color: COLORS.textDark,
  },
  
  // Responsive Card Example
  responsiveCard: {
    width: getResponsiveWidth(90), // 90% of screen width
    backgroundColor: COLORS.card,
    borderRadius: normalize(15),
    padding: getResponsivePadding(20),
    marginBottom: normalize(20),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...FONTS.semibold('h4'),
    marginBottom: normalize(10),
    color: COLORS.text,
  },
  cardText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    lineHeight: normalize(20),
  },

  // Responsive Grid Example
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: normalize(20),
  },
  gridItem: {
    width: isTablet() ? '23%' : '48%', // 4 columns on tablet, 2 on phone
    aspectRatio: 1,
    backgroundColor: COLORS.primary,
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  gridText: {
    ...FONTS.medium('body5'),
    color: COLORS.textWhite,
  },

  // Device-specific Container
  deviceSpecificContainer: {
    borderRadius: normalize(12),
    marginBottom: normalize(20),
  },
  deviceText: {
    ...FONTS.body4,
    color: COLORS.text,
    textAlign: 'center',
  },

  // Responsive Image Example
  imageContainer: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  responsiveImage: {
    width: getResponsiveWidth(80), // 80% of screen width
    height: getResponsiveHeight(25), // 25% of screen height
    backgroundColor: COLORS.border,
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default ResponsiveExample;
