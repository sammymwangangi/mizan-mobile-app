import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Image, 
  View,
  ImageSourcePropType 
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { ChevronRight } from 'lucide-react-native';

interface QuickFunctionItemProps {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
}

const QuickFunctionItem: React.FC<QuickFunctionItemProps> = ({
  title,
  icon,
  onPress
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <ChevronRight size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  title: {
    ...FONTS.body3,
    color: COLORS.text,
  },
});

export default QuickFunctionItem;
