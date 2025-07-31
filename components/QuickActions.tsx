import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function QuickActions() {
  const actions = [
    { icon: 'card-outline' as const, label: 'Cards', color: '#9370DB' },
    { icon: 'time-outline' as const, label: 'Pay Later', color: '#9370DB' },
    { icon: 'paper-plane-outline' as const, label: 'Send', color: '#9370DB' },
    { icon: 'phone-portrait-outline' as const, label: 'M-Pesa', color: '#9370DB' },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity key={index} style={styles.action}>
          <View style={[styles.iconContainer, { backgroundColor: '#F0E6FF' }]}>
            <Ionicons name={action.icon} size={24} color={action.color} />
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  action: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
});