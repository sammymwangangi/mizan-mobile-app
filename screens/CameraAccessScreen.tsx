import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

const CameraAccessScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    type RootStackParamList = {
        Capture: undefined;
      };

    const requestPermissions = async () => {
        setLoading(true);
        setError('');
        try {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
            if (cameraStatus === 'granted' && mediaStatus === 'granted') {
                navigation.navigate('Capture');
            } else {
                setError('Permissions are required to continue.');
            }
        } catch (e) {
            setError('Something went wrong.');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backArrow}>{'<'}</Text>
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg} />
                <View style={styles.progressBarFg} />
            </View>
            <Text style={styles.topText}>Its a regulation thing we have to do.</Text>
            <Text style={styles.title}>Camera access is required</Text>
            <Text style={styles.subtitle}>
                You’ll need to submit a selfie and a photo of your national I.D to be used to verify your identity.
            </Text>
            <Image source={require('../assets/kyc/camera-access.png')} style={styles.illustration} resizeMode="contain" />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={requestPermissions}
                disabled={loading}
            >
                <LinearGradient
                    colors={["#F3D1FF", "#E3E6FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>ALLOW ACCESS</Text>
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
    progressBarContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    progressBarBg: {
        width: 120,
        height: 4,
        backgroundColor: '#E3E6FF',
        borderRadius: 2,
        marginRight: 4,
    },
    progressBarFg: {
        width: 30,
        height: 4,
        backgroundColor: '#A16AE8',
        borderRadius: 2,
    },
    topText: {
        color: '#A16AE8',
        fontWeight: '600',
        fontSize: 14,
        marginTop: 40,
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
    subtitle: {
        color: '#6D6E8A',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 30,
    },
    illustration: {
        width: 180,
        height: 180,
        marginVertical: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    buttonContainer: {
        width: '90%',
        marginTop: 20,
        borderRadius: 30,
        overflow: 'hidden',
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

export default CameraAccessScreen;
