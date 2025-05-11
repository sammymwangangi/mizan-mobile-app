import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';

export default function BalanceCard() {
  const percentage = 67;
  const radius = 35;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - percentage) / 100) * circumference;

  return (
    <View className="bg-white rounded-[20px] p-5 mx-5 -mt-[30px] flex-row items-center shadow-md">
      <View className="items-center">
        <Svg width={100} height={100}>
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#9370DB"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
          />
          <SvgText
            x="50"
            y="50"
            fontSize="16"
            fill="#9370DB"
            textAnchor="middle"
            dy=".3em"
          >
            {`${percentage}%`}
          </SvgText>
        </Svg>
        <Text className="text-xs text-gray-500 mt-[5px]">next milestone</Text>
      </View>
      <View className="flex-1 ml-5">
        <View className="mb-[10px]">
          <Text className="text-sm text-gray-500 mb-1">Bank Balance</Text>
          <Text className="text-2xl font-bold text-gray-800">$2,433.45</Text>
        </View>
        <View className="mb-[10px]">
          <Text className="text-sm text-gray-500 mb-1">Milestone</Text>
          <Text className="text-xl font-semibold text-gray-600">$3,500.00</Text>
        </View>
      </View>
    </View>
  );
}