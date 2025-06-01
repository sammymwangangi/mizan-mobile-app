import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

const steps = [
  { key: 'selfie', label: 'Self Portrait', facing: 'front' as CameraType },
  { key: 'id', label: 'I.D Card', facing: 'back' as CameraType },
  { key: 'bill', label: 'Bill', facing: 'back' as CameraType },
];

type PhotosType = { selfie: string | null; id: string | null; bill: string | null };
type RootStackParamList = {
    Capture: undefined;
    ReviewPhotos: { photos: PhotosType };
  };

type CaptureScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Capture'>;

const CaptureScreen: React.FC = () => {
  const navigation = useNavigation<CaptureScreenNavigationProp>();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<PhotosType>({ selfie: null, id: null, bill: null });
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerStep}>We need your permission to use the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.captureButton}>
          <Text style={styles.headerActive}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      const newPhotos = { ...photos, [steps[step].key]: photo.uri };
      setPhotos(newPhotos);
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        navigation.navigate('ReviewPhotos', { photos: newPhotos });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerStep}>
          <Text style={step === 0 ? styles.headerActive : styles.headerInactive}>Self Portrait</Text>
          <Text style={styles.headerInactive}> {'>'} </Text>
          <Text style={step === 1 ? styles.headerActive : styles.headerInactive}>I.D Card</Text>
          <Text style={styles.headerInactive}> {'>'} </Text>
          <Text style={step === 2 ? styles.headerActive : styles.headerInactive}>Bill</Text>
        </Text>
      </View>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={steps[step].facing}
        />
        <View style={styles.frameOverlay} pointerEvents="none">
          <View style={styles.frameCornerTopLeft} />
          <View style={styles.frameCornerTopRight} />
          <View style={styles.frameCornerBottomLeft} />
          <View style={styles.frameCornerBottomRight} />
        </View>
      </View>
      <TouchableOpacity style={styles.captureButtonContainer} onPress={handleCapture}>
        <LinearGradient
          colors={["#A16AE8", "#F3D1FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.captureButton}
        />
      </TouchableOpacity>
    </View>
  );
};

const frameSize = width * 0.8;
const frameBorder = 3;
const cornerLength = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingLeft: 24,
  },
  headerStep: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D6E8A',
  },
  headerActive: {
    color: '#222',
    fontWeight: 'bold',
  },
  headerInactive: {
    color: '#B3A6E8',
  },
  cameraContainer: {
    width: frameSize,
    height: frameSize * 1.2,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  frameOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  frameCornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: cornerLength,
    height: frameBorder,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
  },
  frameCornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: cornerLength,
    height: frameBorder,
    backgroundColor: '#fff',
    borderTopRightRadius: 8,
  },
  frameCornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: cornerLength,
    height: frameBorder,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
  },
  frameCornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: cornerLength,
    height: frameBorder,
    backgroundColor: '#fff',
    borderBottomRightRadius: 8,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 6,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CaptureScreen;
