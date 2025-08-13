import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import NoorCardPreview from '../../../components/cards/noor/NoorCardPreview';
import { BARAKAH_BLUE, BARAKAH_PURPLE, VALIDATION, NOOR_COLORS } from '../../../constants/noor';
import { FONTS } from 'constants/theme';
import { MOCK_PLACES } from '../qamar/mockPlaces';

type NoorAddressNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NoorAddress'>;
type NoorAddressRouteProp = RouteProp<RootStackParamList, 'NoorAddress'>;

interface AddressForm {
    address: string;
}

const NoorAddressScreen: React.FC = () => {
    const navigation = useNavigation<NoorAddressNavigationProp>();

    const route = useRoute<NoorAddressRouteProp>();
    const { planId, selectedColor } = route.params;
    const [address, setAddress] = useState<AddressForm>({ address: '' });
    const [error, setError] = useState<string>('');
    const scrollRef = useRef<ScrollView | null>(null);
    const addressInputRef = useRef<TextInput | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [isValid, setIsValid] = useState(false);

    const validateForm = (value: string) => {
        const trimmed = value.trim();
        const hasMinLength = trimmed.length >= VALIDATION.MIN_ADDRESS_LENGTH;
        setIsValid(hasMinLength);
        setError(hasMinLength ? '' : `Please enter at least ${VALIDATION.MIN_ADDRESS_LENGTH} characters`);
        return hasMinLength;
    };

    const updateAddress = (value: string) => {
        setAddress({ address: value });
        validateForm(value);
        // update suggestions when typing
        const q = value.trim().toLowerCase();
        if (q.length >= 3) {
            const results = MOCK_PLACES.filter((p) => p.toLowerCase().includes(q)).slice(0, 6);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const handleNext = () => {
        if (!isValid) {
            Alert.alert('Incomplete Address', 'Please fill in all required fields');
            return;
        }

        Haptics.selectionAsync();
        // Track analytics
        // PostHog.capture(NOOR_ANALYTICS.CARD_STEP_VIEW, { step: 'address', plan: 'noor' });

        navigation.navigate('NoorReview', {
            planId,
            selectedColor,
            deliveryAddress: address
        });
    };

    const handleGooglePlaces = () => {
        // Google Places autocomplete (KE + GCC)
        Alert.alert('Address Search', 'Google Places integration would be implemented here for Kenya and GCC countries');
    };

    const handleSubmitEditing = () => {
        if (isValid) {
            handleNext();
        }
    };

    return (
        <View className="flex-1 bg-[#F1F3F5]">
            {/* Header */}
            <View className="px-5 pt-12 pb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ ...FONTS.semibold(14), color: '#6B4EFF' }}>Back</Text>
                </TouchableOpacity>
                <Text style={{ ...FONTS.bold(26), color: '#0F172A', marginTop: 12 }}>Name your card</Text>
                <Text style={{ ...FONTS.medium(12), color: '#64748B', marginTop: 4 }}>
                    Step 2 / 3 - Set your niyyah, your way
                </Text>
            </View>

            {/* Content */}
            <ScrollView ref={scrollRef} className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* Card Preview */}
                <View className="items-end" style={{marginTop: 140, paddingRight: 20}}>
                    {/* <NoorCardPreview
                        color={(NOOR_COLORS.find(c => c.id === selectedColor) || null)}
                        playSheen={true}
                        expiryText="Exp 12/2026"
                    /> */}
                    <Text style={{ ...FONTS.medium(12), color: '#6D6E8A', marginTop: 12 }}>0/20 characters</Text>
                </View>

                {/* Address Input (single field + mock suggestions) */}
                <View>
                    <LinearGradient
                        colors={['#A276FF', '#F053E0']}
                        start={{ x: 0, y: 0.25 }}
                        end={{ x: 1, y: 0.75 }}
                        style={{
                            borderRadius: 40,
                            padding: 1,
                            shadowColor: '#6943AF',
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.1,
                            shadowRadius: 40,
                            elevation: 5,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'white',
                                height: 55,
                                borderRadius: 39,
                                justifyContent: 'center',
                                borderWidth: address.address.length > 0 ? 1 : 0,
                                borderColor: isValid ? '#16A34A' : '#EF4444',
                            }}
                        >
                            <TextInput
                                ref={addressInputRef}
                                value={address.address}
                                onChangeText={updateAddress}
                                placeholder="Type the name of your card"
                                placeholderTextColor="#6B7280"
                                style={{ paddingHorizontal: 20, color: '#0F172A', fontSize: 14 }}
                                autoCapitalize="words"
                                returnKeyType="done"
                                onSubmitEditing={() => validateForm(address.address)}
                            />
                        </View>
                    </LinearGradient>
                    <Text style={{ ...FONTS.medium(12), color: '#9CA3AF', marginTop: 6 }}>((i.e.Auto-Sadaqa, Utilities, Shopping))</Text>

                    {/* Validation error */}
                    {!!error && (
                        <Text style={{ ...FONTS.medium(12), color: '#EF4444', marginTop: 6 }}>{error}</Text>
                    )}

                    {/* Suggestions dropdown (mock) */}
                    {suggestions.length > 0 && (
                        <View style={{ backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E4E7EC', marginTop: 8, overflow: 'hidden' }}>
                            {suggestions.map((s, idx) => (
                                <TouchableOpacity
                                    key={`${s}-${idx}`}
                                    onPress={() => { setAddress({ address: s }); setSuggestions([]); setIsValid(true); setError(''); }}
                                    style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                                >
                                    <Text style={{ ...FONTS.medium(14), color: '#334155' }}>{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* CTA Button */}
            <View className="px-5 pb-8">
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!isValid}
                    activeOpacity={0.9}
                    className="w-full"
                >
                    <LinearGradient
                        colors={isValid ? [BARAKAH_PURPLE, '#9F7AFF'] : ['#E5E7EB', '#E5E7EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className={`h-[55px] items-center justify-center ${!isValid ? 'opacity-60' : ''}`}
                        style={{ borderRadius: 40 }}
                    >
                        <Text style={{ ...FONTS.semibold(16), color: 'white' }}>
                            Continue
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default NoorAddressScreen;
