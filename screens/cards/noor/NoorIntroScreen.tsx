import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { NOOR_BENEFITS, BARAKAH_BLUE } from '../../../constants/noor';
import NoorCardPreview from '../../../components/cards/noor/NoorCardPreview';
import { COLORS, FONTS, SIZES } from 'constants/theme';
import { normalize } from '../../../utils';
import * as Haptics from 'expo-haptics';


type NoorIntroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NoorIntro'>;
type NoorIntroRouteProp = RouteProp<RootStackParamList, 'NoorIntro'>;

const NoorIntroScreen: React.FC = () => {
    const navigation = useNavigation<NoorIntroNavigationProp>();
    const route = useRoute<NoorIntroRouteProp>();
    const { planId } = route.params;

    const handleCreateCard = () => {
        Haptics.selectionAsync();
        navigation.navigate('NoorStudio', { planId });
    };

    return (
        <View className="flex-1 bg-[#F1F3F5]">
            {/* Header */}
            <View className="px-5 pt-12 pb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ ...FONTS.semibold(14), color: BARAKAH_BLUE }}>&lt;Back</Text>
                </TouchableOpacity>
                <Text style={{ ...FONTS.semibold(32), color: '#1B1C39', marginTop: 12 }}>Start with Noor</Text>
                <Text style={{ ...FONTS.medium(12), color: '#6D6E8A', marginTop: 4 }}>
                    Plant a little light in your finances and watch it grow.
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Main card container */}
                <View style={styles.heroCard}>
                    <View style={styles.heroHeaderRow}>
                        <Image source={require('../../../assets/cards/claim/cloud-icon.png')} style={styles.cloudIcon} />
                        <Text style={styles.heroHeaderText}>Smart Virtual Card</Text>
                    </View>
                    {/* Credit card image (already rotated) */}
                </View>
                <Image
                    source={require('../../../assets/cards/claim/claim-noor.png')}
                    style={styles.noorImage}
                    resizeMode="contain"
                />

                {/* Benefits Section */}
                <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(60) }}>
                    {/* Benefits Section */}
                    <Text style={styles.sectionTitle}>Your Noor Card Benefits</Text>
                    <View style={{ marginTop: normalize(8), marginLeft: normalize(20) }}>
                        {NOOR_BENEFITS.map((b, i) => (
                            <View key={i} style={styles.benefitRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.benefitText}>{b}</Text>
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
            {/* CTA Button */}
            <View style={styles.ctaContainer}>
                <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={handleCreateCard}>
                    <Text style={styles.ctaText}>Create My Noor Card</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const HERO_HEIGHT = normalize(216);

const styles = StyleSheet.create({
    scrollContent: { paddingHorizontal: SIZES.padding, paddingBottom: normalize(20) },
    sectionTitle: { ...FONTS.semibold(16), color: '#000000', marginTop: normalize(18) },
    benefitsIntro: { ...FONTS.body4, color: '#1B1C39', marginTop: normalize(36) },
    benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: normalize(8) },
    bullet: { width: normalize(6), height: normalize(6), borderRadius: 3, backgroundColor: '#787878', marginTop: normalize(8), marginRight: normalize(10) },
    benefitText: { ...FONTS.body4, color: '#787878', flex: 1 },

    heroCard: {
        height: HERO_HEIGHT,
        backgroundColor: '#E5E5E5',
        borderRadius: normalize(13),
        marginTop: normalize(16),
        paddingHorizontal: normalize(10),
        paddingTop: normalize(27),
        overflow: 'hidden',
    },
    heroHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: normalize(10) },
    cloudIcon: { width: normalize(36), height: normalize(34.83) },
    heroHeaderText: { ...FONTS.semibold(16), color: '#ABACBE' },
    noorImage: {
        position: 'absolute',
        width: 420,
        height: 380,
        left: -normalize(20),
        top: -normalize(40),
    },

    ctaContainer: { paddingHorizontal: SIZES.padding, paddingBottom: normalize(30) },
    ctaButton: { height: normalize(55), borderRadius: normalize(25), backgroundColor: '#A276FF', alignItems: 'center', justifyContent: 'center' },
    ctaText: { ...FONTS.semibold(16), color: COLORS.textWhite },
});

export default NoorIntroScreen;
