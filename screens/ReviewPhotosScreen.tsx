import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const reviewItems = [
  { key: 'selfie', label: 'Self Portrait' },
  { key: 'id', label: 'Passport /ID Card' },
  { key: 'bill', label: 'Residential Address', icon: require('../assets/kyc/location-icon.png') },
];

type ReviewPhotosRouteParams = {
  photos: Record<string, string>;
};

type RootStackParamList = {
  ReviewPhotos: ReviewPhotosRouteParams;
  KYC: undefined;
};

type ReviewPhotosScreenNavigationProp = NavigationProp<RootStackParamList, 'ReviewPhotos'>;

const ReviewPhotosScreen = () => {
  const navigation = useNavigation<ReviewPhotosScreenNavigationProp>();
  const route = useRoute<RouteProp<{ params: ReviewPhotosRouteParams }, 'params'>>();
  const { photos } = route.params || {};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.topText}>You&apos;ll only do this once , promise!</Text>
      <Text style={styles.title}>Review your{''}photos</Text>
      <View style={styles.listContainer}>
        {reviewItems.map((item, idx) => (
          <View key={item.key} style={styles.listItem}>
            <View style={styles.imageWrapper}>
              {item.key !== 'bill' ? (
                photos && photos[item.key] ? (
                  <Image source={{ uri: photos[item.key] }} style={styles.photo} />
                ) : (
                  <View style={[styles.photo, { backgroundColor: '#eee' }]} />
                )
              ) : (
                <Image source={item.icon} style={styles.photo} />
              )}
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.infoText}>
        Mizan is required by the Kenyan law to collect the above details.
      </Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('KYC')}> 
        <LinearGradient
          colors={["#F3D1FF", "#E3E6FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>NEXT</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },
  backArrow: {
    fontSize: 28,
    color: '#222',
  },
  topText: {
    color: '#A16AE8',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    marginTop: 10,
    marginBottom: 20,
    width: '90%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 16,
    marginBottom: 16,
    padding: 10,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#fff',
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#A16AE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkMark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#6D6E8A',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  buttonContainer: {
    width: '90%',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#B3A6E8',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default ReviewPhotosScreen;
