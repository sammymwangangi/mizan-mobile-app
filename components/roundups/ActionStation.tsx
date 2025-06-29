import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Plus, Zap, TrendingUp, ArrowDownToLine } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { normalize } from '../../utils';

interface Props {
  onAddFunds?: () => void;
  onBoost?: () => void;
  onInvest?: () => void;
  onWithdraw?: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  gradient?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
  gradient = false,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  if (gradient) {
    return (
      <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
        <LinearGradient
          colors={COLORS.mizanGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          {icon}
        </LinearGradient>
        <Text style={styles.actionLabel}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
      <View style={styles.regularButton}>
        {icon}
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const ActionStation: React.FC<Props> = ({
  onAddFunds,
  onBoost,
  onInvest,
  onWithdraw,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Action Station</Text>
      
      <View style={styles.actionsGrid}>
        <ActionButton
          icon={<Plus size={24} color={COLORS.textWhite} />}
          label="Add funds"
          onPress={onAddFunds}
          gradient
        />
        
        <ActionButton
          icon={<Zap size={24} color={COLORS.primary} />}
          label="Boost"
          onPress={onBoost}
        />
        
        <ActionButton
          icon={<TrendingUp size={24} color={COLORS.primary} />}
          label="Invest"
          onPress={onInvest}
        />
        
        <ActionButton
          icon={<ArrowDownToLine size={24} color={COLORS.primary} />}
          label="Withdraw"
          onPress={onWithdraw}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(20),
    padding: normalize(20),
    marginBottom: normalize(16),
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: normalize(20) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(40),
    elevation: 5,
  },
  title: {
    ...FONTS.semibold(18),
    color: COLORS.text,
    marginBottom: normalize(20),
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  gradientButton: {
    width: normalize(65),
    height: normalize(56),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  regularButton: {
    width: normalize(65),
    height: normalize(56),
    borderRadius: normalize(10),
    backgroundColor: '#F6F5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  actionLabel: {
    ...FONTS.medium(12),
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default ActionStation;
