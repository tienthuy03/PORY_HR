import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useSelector } from 'react-redux';
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
const CameraWithOvalFrame = ({ setNewImage, setIsDurty, setShowCamera }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);
  const Color = useSelector(s => s.SystemReducer.theme);
  let cameraRef = null;

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        Alert.alert('Permission Denied', 'Camera permission is required.');
      }
    } else {
      setHasPermission(true);
    }
  };

  const onFaceDetected = ({ faces }) => {
    if (faces.length) {
      Alert.alert('Thông báo lỗi', 'Không chụp được ảnh.');
    }
  };

  const captureImage = async () => {
    if (cameraRef && isReady) {
      try {
        const options = { quality: 0.7, base64: true };
        const data = await cameraRef.takePictureAsync(options);
        setNewImage('data:image/png;base64,' + data.base64);
        setIsDurty(true);
        setShowCamera(false);
      } catch (error) {
        console.error('Hình ảnh bị lỗi:', error);
        Alert.alert('Thông báo lỗi', 'Không chụp được ảnh.');
      }
    } else {
      Alert.alert('Máy ảnh chưa sẵn sàng', 'Vui lòng đợi cho đến khi máy ảnh sẵn sàng.');
    }
  };

  const toggleCameraType = () => {
    setCameraType(prevType =>
      prevType === RNCamera.Constants.Type.front
        ? RNCamera.Constants.Type.back
        : RNCamera.Constants.Type.front
    );
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View style={styles.containerCamera}>
      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>Camera permission denied</Text>
      ) : (
        <>
          <RNCamera
            // zoom={0.1}
            ref={(ref) => {
              cameraRef = ref;
            }}
            flashMode={RNCamera.Constants.FlashMode.on}
            style={styles.cameraPreview}
            type={cameraType}
            onCameraReady={() => setIsReady(true)}
            onFaceDetected={onFaceDetected}
            captureAudio={false}
          />
          {/* Oval Frame Overlay */}
          <View style={styles.overlay}>
            <View style={styles.transparentBackground}></View>
            <View style={styles.oval}></View>
            <Text style={styles.instructionText}>
              Vui lòng đưa khuôn mặt vào khung hình
            </Text>
          </View>
        </>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity onPress={toggleCameraType} style={styles.capture}>
          <Icon
            name={"camera-flip-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={captureImage} style={styles.capture}>
          <Icon
            name={"camera"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  // Thêm các style tương ứng ở đây
  containerCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraPreview: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oval: {
    width: 320,
    height: 450,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    top: '20%',
    zIndex: 2
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    position: 'absolute',
    bottom: '20%',
    width: '100%',
  },
};

export default CameraWithOvalFrame;
