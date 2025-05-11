import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header() {
  return (
    <LinearGradient
      colors={['#8A2BE2', '#9370DB']}
      style={styles.headerContainer}
    >
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=professional%20headshot%20profile%20picture&aspect=1:1' }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.nameText}>Robin Hobibi</Text>
            <Text style={styles.planText}>Your plan : Ethics Basic</Text>
          </View>
        </View>
        <Ionicons name="notifications-outline" size={24} color="white" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  nameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 2,
  },
  planText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
});