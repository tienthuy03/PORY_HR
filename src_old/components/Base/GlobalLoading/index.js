import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {ConfigApiURL} from '../../../services/redux/SysConfig/action';
import {fcmService} from '../../../config/FCMService';
import {localNotificationService} from '../../../config/LocalNotificationService';
import {ntGetNotification} from '../../../services/redux/Notification/action';
const GlobalLoading = ({children}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Thông báo', 'Bạn có muốn thoát khỏi ứng dụng không?', [
        {
          text: 'Đóng lại',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'Xác nhận', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    const configIp = async () => {
      const rs = await AsyncStorage.getItem('themeName');
      if (rs) {
        dispatch(ConfigApiURL());
      }
    };
    configIp();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
    function onRegister(token) {
      // console.log('[App] onRegister: ', JSON.stringify(token));
    }

    function onNotification(notify) {
      dispatch(ntGetNotification());
    }

    function onOpenNotification(notify) {
      // alert('Open Notification: ');
    }

    return () => {
      backHandler.remove();
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);
  const isLoading = useSelector(state => state.GlobalLoadingReducer.isLoading);
  return (
    <Modal transparent={true} visible={isLoading}>
      <View
        // duration={300}
        // animation="fadeIn"
        style={{
          flex: 1,
          backgroundColor: 'rgba(00,00,00,.3)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: 100,
            zIndex: 9999,
            backgroundColor: 'white',
            borderRadius: 10,
          }}>
          <ActivityIndicator color={'#143678'} />
          <Text>Đang xử lý</Text>
        </View>
      </View>
    </Modal>
  );
};

export default GlobalLoading;
