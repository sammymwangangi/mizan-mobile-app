import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function Promotions() {
  const promotions = [
    {
      id: 1,
      title: 'Special Offers',
      image: 'https://api.a0.dev/assets/image?text=gift%20box%20with%20discount%20tag%20modern%203d&aspect=1:1',
      color: '#E6E6FF',
    },
    {
      id: 2,
      title: 'Ramadhan Plan',
      image: 'https://api.a0.dev/assets/image?text=ramadan%20celebration%20modern%20illustration&aspect=1:1',
      color: '#9370DB',
    },
    {
      id: 3,
      title: 'Free Banking for kids',
      image: 'https://api.a0.dev/assets/image?text=cute%203d%20baby%20with%20piggy%20bank&aspect=1:1',
      color: '#E6E6FF',
    },
    {
      id: 4,
      title: 'Order a Metal Card',
      image: 'https://api.a0.dev/assets/image?text=stack%20of%20credit%20cards%20modern%203d&aspect=1:1',
      color: '#FFE6FF',
    },
    {
      id: 5,
      title: 'StashAway with Round-Ups',
      image: 'https://api.a0.dev/assets/image?text=savings%20box%20with%20coins%20modern%203d&aspect=1:1',
      color: '#FFE6F5',
    },
    {
      id: 6,
      title: 'Smart Budgeting',
      image: 'https://api.a0.dev/assets/image?text=wallet%20with%20coins%20modern%203d&aspect=1:1',
      color: '#E6E6FF',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's Hot?</Text>
      <View style={styles.grid}>
        {promotions.map((promo) => (
          <TouchableOpacity key={promo.id} style={[styles.card, { backgroundColor: promo.color }]}>
            <Image source={{ uri: promo.image }} style={styles.image} />
            <Text style={styles.cardTitle}>{promo.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    height: 160,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
});