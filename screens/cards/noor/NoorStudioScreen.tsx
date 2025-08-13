import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import NoorCardPreview from '../../../components/cards/noor/NoorCardPreview';
import { NOOR_COLORS, NOOR_SHAMS_UPGRADE, NOOR_ANALYTICS, BARAKAH_BLUE, type NoorColor, BARAKAH_PURPLE } from '../../../constants/noor';
import { AnimatedSwatch } from '../../../components/shared/AnimatedComponents';
import { FONTS } from 'constants/theme';

type NoorStudioNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NoorStudio'>;
type NoorStudioRouteProp = RouteProp<RootStackParamList, 'NoorStudio'>;


const angleToPoints = (angleDeg: number) => {
    const angle = (angleDeg % 360) * (Math.PI / 180);
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return { x1: 0.5 - x / 2, y1: 0.5 - y / 2, x2: 0.5 + x / 2, y2: 0.5 + y / 2 };
};

const NoorStudioScreen: React.FC = () => {
    const navigation = useNavigation<NoorStudioNavigationProp>();
    const route = useRoute<NoorStudioRouteProp>();
    const { planId } = route.params;

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [playSheen, setPlaySheen] = useState(false);
    const mountedRef = useRef(true);

    React.useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const selectedColorObj = useMemo(() => NOOR_COLORS.find((c) => c.id === selectedColor) || null, [selectedColor]);

    const handleColorSelect = (colorId: string) => {
        if (colorId === selectedColor) return; // do not retrigger sheen when selecting same
        if (!mountedRef.current) return;
        setSelectedColor(colorId);
        setPlaySheen(true);

        // Analytics (placeholder)
        try {
            console.log(NOOR_ANALYTICS.EVENT_COLOUR_CHOSEN, { colour: colorId });
        } catch { }
    };

    const handleNext = () => {
        if (!selectedColor) return;
        Haptics.selectionAsync();
        navigation.navigate('NoorAddress', { planId, selectedColor });
    };

    const Swatch: React.FC<{ color: NoorColor }> = ({ color }) => (
        <AnimatedSwatch onPress={() => handleColorSelect(color.id)} style={{ margin: 8 }}>
            {selectedColor === color.id ? (
                <View
                    className="w-[59px] h-[59px] rounded-full items-center justify-center"
                    style={{ borderWidth: 2, borderColor: '#6B4EFF', borderRadius: 29.5, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 }}
                >
                    <View className="w-[55px] h-[55px] rounded-full bg-white items-center justify-center" style={{ borderRadius: 27.5 }}>
                        {color.gradient ? (
                            <LinearGradient
                                colors={color.gradient.stops.map((s) => s.color) as any}
                                start={{ x: angleToPoints(color.gradient.angle).x1, y: angleToPoints(color.gradient.angle).y1 }}
                                end={{ x: angleToPoints(color.gradient.angle).x2, y: angleToPoints(color.gradient.angle).y2 }}
                                className="w-[45px] h-[45px] rounded-full"
                                style={{ borderRadius: 45 }}
                            />
                        ) : (
                            <View className="w-[45px] h-[45px] rounded-full" style={{ backgroundColor: color.value, borderRadius: 45 }} />
                        )}
                    </View>
                </View>
            ) : (
                color.gradient ? (
                    <LinearGradient
                        colors={color.gradient.stops.map((s) => s.color) as any}
                        start={{ x: angleToPoints(color.gradient.angle).x1, y: angleToPoints(color.gradient.angle).y1 }}
                        end={{ x: angleToPoints(color.gradient.angle).x2, y: angleToPoints(color.gradient.angle).y2 }}
                        className="w-[45px] h-[45px] rounded-full"
                        style={{ borderRadius: 45 }}
                    />
                ) : (
                    <View className="w-[45px] h-[45px] rounded-full" style={{ backgroundColor: color.value }} />
                )
            )}
        </AnimatedSwatch>
    );

    return (
        <View className="flex-1 bg-[#F1F3F5]">
            {/* Header */}
            <View className="px-5 pt-12 pb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ ...FONTS.semibold(14), color: BARAKAH_BLUE }}>Back</Text>
                </TouchableOpacity>
                <Text style={{ ...FONTS.bold(26), color: '#0F172A', marginTop: 12 }}>Noor Card Studio</Text>
                <Text style={{ ...FONTS.medium(12), color: '#64748B', marginTop: 4 }}>
                    Step 1 / 3 - Pick a shade that reflects your niyyah (intention).
                </Text>
            </View>

            {/* Card preview section */}
            <View className="px-5">
                <View className="items-center justify-center rounded-2xl">
                    <NoorCardPreview
                        color={selectedColorObj}
                        playSheen={playSheen}
                        onSheenEnd={() => setPlaySheen(false)}
                        expiryText="Exp 12/2026"
                    />
                </View>
            </View>
            <ScrollView>
                {/* Colors section */}
                <View className="mt-5 rounded-t-3xl bg-white px-5 pt-5">
                    <Text style={{ ...FONTS.semibold(16), color: '#0F172A', marginBottom: 16 }}>Colours</Text>
                    <View className="flex-row flex-wrap">
                        {NOOR_COLORS.map((c) => (
                            <Swatch
                                key={c.id}
                                color={c}
                            />
                        ))}
                    </View>

                    {/* Shams Gold upgrade (disabled) */}
                    <View className="mt-4 opacity-50">
                        <Text style={{ ...FONTS.semibold(16), color: '#0F172A', marginBottom: 12 }}>
                            Upgrade to Shams Gold
                        </Text>
                        <View className="flex-row items-center">
                            {/* Gold */}
                            <View className="items-center mr-8">
                                <AnimatedSwatch onPress={() => { }}>
                                    <View className="w-[45px] h-[45px]" style={{ borderRadius: 45 }}>
                                        <LinearGradient
                                            colors={NOOR_SHAMS_UPGRADE.gold.gradient.stops.map((s) => s.color) as any}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="w-[45px] h-[45px]"
                                            style={{ borderRadius: 45 }}
                                        />
                                    </View>
                                </AnimatedSwatch>
                                <Text className="text-xs text-[#334155] mt-2">Gold</Text>
                            </View>

                            {/* Other metal options */}
                            <View className="items-center mr-8">
                                <AnimatedSwatch onPress={() => { }}>
                                    <View className="w-[45px] h-[45px] rounded-full">
                                        <LinearGradient
                                            colors={NOOR_SHAMS_UPGRADE.gunmetal.gradient.stops.map((s) => s.color) as [import('react-native').ColorValue, import('react-native').ColorValue, ...import('react-native').ColorValue[]]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="w-[45px] h-[45px] rounded-full"
                                            style={{ borderRadius: 45 }}
                                        />
                                    </View>
                                </AnimatedSwatch>
                                <Text className="text-xs text-[#334155] mt-2">Gunmetal</Text>
                            </View>

                            <View className="items-center">
                                <AnimatedSwatch onPress={() => { }}>
                                    <View
                                        className="w-[45px] h-[45px] rounded-full"
                                        style={{ backgroundColor: NOOR_SHAMS_UPGRADE.nimbus.value }}
                                    />
                                </AnimatedSwatch>
                                <Text className="text-xs text-[#334155] mt-2">Nimbus</Text>
                            </View>
                        </View>

                        {/* Price pill under Gold */}
                        <View className="mt-3">
                            <View className="self-start px-2 py-1 bg-[#0F172A] rounded-full">
                                <Text className="text-white text-[10px]">Metal $9.99</Text>
                            </View>
                        </View>
                    </View>

                    {/* CTA section */}
                    <View className="py-6">
                        <TouchableOpacity disabled={!selectedColor} activeOpacity={0.9} onPress={handleNext}>
                            <LinearGradient
                                colors={selectedColor ? [BARAKAH_PURPLE, '#9F7AFF'] : ['#E5E7EB', '#E5E7EB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className={`h-[55px] items-center justify-center ${!selectedColor ? 'opacity-60' : ''}`}
                                style={{ borderRadius: 40 }}
                            >
                                <Text style={{ ...FONTS.semibold(16), color: 'white' }}>
                                    Choose Card
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default NoorStudioScreen;
