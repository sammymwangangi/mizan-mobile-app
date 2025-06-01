# Responsive Styling Guide for React Native

This guide outlines the best practices for creating responsive designs in your React Native app that work across all device sizes.

## 1. Core Principles

### Use Relative Units Instead of Fixed Pixels
```typescript
// ❌ Bad - Fixed pixels
const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 200,
    padding: 20,
  },
});

// ✅ Good - Relative units
const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: getResponsiveHeight(25), // 25% of screen height
    padding: SIZES.padding, // Uses responsive padding
  },
});
```

### Use Flexbox for Dynamic Layouts
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: { flex: 0.2 },
  content: { flex: 0.6 },
  footer: { flex: 0.2 },
});
```

## 2. Available Responsive Utilities

### From `utils/index.ts`:
- `normalize(size)` - Scales size based on screen dimensions
- `getResponsiveWidth(percentage)` - Returns percentage of screen width
- `getResponsiveHeight(percentage)` - Returns percentage of screen height
- `getResponsivePadding(base)` - Returns device-appropriate padding
- `isTablet()` - Checks if device is tablet
- `isSmallPhone()` - Checks if device is small phone
- `getDeviceType()` - Returns 'small' | 'medium' | 'large' | 'tablet'

### From `constants/theme.ts`:
- `SIZES.responsiveWidth(percentage)` - Same as getResponsiveWidth
- `SIZES.responsiveHeight(percentage)` - Same as getResponsiveHeight
- `SIZES.responsivePadding(base)` - Same as getResponsivePadding
- All SIZES values are already responsive (using normalize)

## 3. Common Responsive Patterns

### Responsive Cards
```typescript
const styles = StyleSheet.create({
  card: {
    width: getResponsiveWidth(90), // 90% of screen width
    padding: getResponsivePadding(20),
    borderRadius: normalize(15),
    marginBottom: normalize(20),
  },
});
```

### Responsive Grid
```typescript
const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: isTablet() ? '23%' : '48%', // 4 cols on tablet, 2 on phone
    aspectRatio: 1,
    marginBottom: normalize(10),
  },
});
```

### Device-Specific Styling
```typescript
const getDeviceSpecificStyle = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'tablet':
      return { fontSize: normalize(18), padding: normalize(30) };
    case 'large':
      return { fontSize: normalize(16), padding: normalize(25) };
    case 'medium':
      return { fontSize: normalize(14), padding: normalize(20) };
    case 'small':
      return { fontSize: normalize(12), padding: normalize(15) };
    default:
      return { fontSize: normalize(14), padding: normalize(20) };
  }
};
```

### Responsive Images
```typescript
const styles = StyleSheet.create({
  image: {
    width: getResponsiveWidth(80), // 80% of screen width
    height: getResponsiveWidth(80) * 0.6, // Maintain aspect ratio
    borderRadius: normalize(10),
  },
});
```

## 4. Font Responsiveness

All fonts in the FONTS object are already responsive. Use them like this:

```typescript
const styles = StyleSheet.create({
  title: {
    ...FONTS.h1, // Already responsive
  },
  subtitle: {
    ...FONTS.semibold(normalize(16)), // Custom responsive size
  },
});
```

## 5. Layout Responsiveness

### Responsive Containers
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding, // Responsive padding
  },
  content: {
    width: '100%',
    maxWidth: isTablet() ? 600 : '100%', // Max width on tablets
    alignSelf: 'center',
  },
});
```

### Responsive Spacing
```typescript
const styles = StyleSheet.create({
  section: {
    marginBottom: normalize(20),
    paddingHorizontal: getResponsivePadding(16),
  },
});
```

## 6. Best Practices

1. **Always use responsive utilities** for sizes, padding, and margins
2. **Test on multiple device sizes** during development
3. **Use percentage-based widths** for flexible layouts
4. **Implement device-specific logic** when needed
5. **Maintain aspect ratios** for images and media
6. **Use flexbox** for dynamic layouts
7. **Consider tablet-specific layouts** for better UX

## 7. Common Breakpoints

- **Small phones**: < 375px width
- **Medium phones**: 375px - 413px width  
- **Large phones**: 414px - 767px width
- **Tablets**: ≥ 768px width

## 8. Example Implementation

See `components/ResponsiveExample.tsx` for a complete example of responsive design patterns.

## 9. Testing Responsiveness

Test your app on:
- iPhone SE (small)
- iPhone 12/13 (medium)
- iPhone 12/13 Pro Max (large)
- iPad (tablet)

Use the device simulator or physical devices to ensure your layouts work across all sizes.
