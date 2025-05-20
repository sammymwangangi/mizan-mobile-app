import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, FONT_FAMILY, getFontFamily } from '../constants/theme';

const FontExample = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Weight Examples</Text>
        
        {/* Method 1: Using FONT_FAMILY directly */}
        <Text style={styles.methodTitle}>Method 1: Using FONT_FAMILY directly</Text>
        <Text style={{ fontFamily: FONT_FAMILY.regular, fontSize: 16 }}>
          Regular (400) - FONT_FAMILY.regular
        </Text>
        <Text style={{ fontFamily: FONT_FAMILY.medium, fontSize: 16 }}>
          Medium (500) - FONT_FAMILY.medium
        </Text>
        <Text style={{ fontFamily: FONT_FAMILY.semibold, fontSize: 16 }}>
          Semibold (600) - FONT_FAMILY.semibold
        </Text>
        <Text style={{ fontFamily: FONT_FAMILY.bold, fontSize: 16 }}>
          Bold (700) - FONT_FAMILY.bold
        </Text>
        <Text style={{ fontFamily: FONT_FAMILY.black, fontSize: 16 }}>
          Black (900) - FONT_FAMILY.black
        </Text>
        
        {/* Method 2: Using getFontFamily function */}
        <Text style={styles.methodTitle}>Method 2: Using getFontFamily function</Text>
        <Text style={{ fontFamily: getFontFamily('400'), fontSize: 16 }}>
          Regular (400) - getFontFamily('400')
        </Text>
        <Text style={{ fontFamily: getFontFamily('500'), fontSize: 16 }}>
          Medium (500) - getFontFamily('500')
        </Text>
        <Text style={{ fontFamily: getFontFamily('600'), fontSize: 16 }}>
          Semibold (600) - getFontFamily('600')
        </Text>
        <Text style={{ fontFamily: getFontFamily('700'), fontSize: 16 }}>
          Bold (700) - getFontFamily('700')
        </Text>
        <Text style={{ fontFamily: getFontFamily('900'), fontSize: 16 }}>
          Black (900) - getFontFamily('900')
        </Text>
        
        {/* Method 3: Using FONTS.weight helper */}
        <Text style={styles.methodTitle}>Method 3: Using FONTS.weight helper</Text>
        <Text style={{ ...FONTS.weight('400', 16) }}>
          Regular (400) - FONTS.weight('400', 16)
        </Text>
        <Text style={{ ...FONTS.weight('500', 16) }}>
          Medium (500) - FONTS.weight('500', 16)
        </Text>
        <Text style={{ ...FONTS.weight('600', 16) }}>
          Semibold (600) - FONTS.weight('600', 16)
        </Text>
        <Text style={{ ...FONTS.weight('700', 16) }}>
          Bold (700) - FONTS.weight('700', 16)
        </Text>
        <Text style={{ ...FONTS.weight('900', 16) }}>
          Black (900) - FONTS.weight('900', 16)
        </Text>
        
        {/* Method 4: Using FONTS convenience methods */}
        <Text style={styles.methodTitle}>Method 4: Using FONTS convenience methods</Text>
        <Text style={{ ...FONTS.medium(16) }}>
          Medium (500) - FONTS.medium(16)
        </Text>
        <Text style={{ ...FONTS.semibold(16) }}>
          Semibold (600) - FONTS.semibold(16)
        </Text>
        <Text style={{ ...FONTS.bold(16) }}>
          Bold (700) - FONTS.bold(16)
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Using with Predefined Styles</Text>
        
        {/* Using with predefined styles */}
        <Text style={styles.methodTitle}>Base styles</Text>
        <Text style={{ ...FONTS.body3 }}>
          Regular body3 - FONTS.body3
        </Text>
        <Text style={{ ...FONTS.h3 }}>
          Bold h3 - FONTS.h3
        </Text>
        
        <Text style={styles.methodTitle}>With weight helpers</Text>
        <Text style={{ ...FONTS.weight('600', 'body3') }}>
          Semibold body3 - FONTS.weight('600', 'body3')
        </Text>
        <Text style={{ ...FONTS.semibold('body3') }}>
          Semibold body3 - FONTS.semibold('body3')
        </Text>
        <Text style={{ ...FONTS.medium('h3') }}>
          Medium h3 - FONTS.medium('h3')
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: 15,
    color: COLORS.primary,
  },
  methodTitle: {
    ...FONTS.semibold('body4'),
    marginTop: 20,
    marginBottom: 10,
    color: COLORS.textDark,
  },
});

export default FontExample;
