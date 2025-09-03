/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './src/screens/SystemScreens/LoginScreen';
import ForgotPass from './src/screens/SystemScreens/ForgotPassword';
import RegisterAccount from './src/screens/SystemScreens/RegisterAccount';
import Index from './src/screens/HomeScreens/index';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
//import store from './src/store';
import {Provider} from 'react-redux';
import TVTT from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/TVTT';
import MBHRIN001 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN001_CaNhan';
import MBHRIN002 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN002_NgayCong';
import MBHRIN003 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN003_CongThang';
import MBHRIN004 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN004_LuongThang';
import MBHRIN005 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN005_NgayNghi';
import MBHRIN006 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN006_XepLoai';
import MBHRIN007 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN007_LichSuChamCong';
import MBHRIN008 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN008_ViPhamChamCong';
import HPHRIN003 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/HPHRIN003_CongThang';
import MBHRIN010 from './src/screens/HomeScreens/MBHRIN_TruyVanThongTin/MBHRIN010_TienThuong';

import DKDL from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/index';
import MBHRRE007 from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/MBHRRE007_XacNhanTangCa';
import MBHRRE001 from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/MBHRRE001_Vang';
import MBHRRE004 from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/MBHRRE004_DiTreVeSom';
import MBHRRE005 from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/MBHRRE005_RaCong';
import MBHRRE006 from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/MBHRRE006_CongTac';
import MBHRRE008 from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/MBHRRE008_BoSungCong';
import MBHRRE011 from './src/screens/HomeScreens/MBHRRE_DangKyDuLieu/MBHRRE011_DeNghiTangCa';

import PDDL from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/index';
import MBHRAP001 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP001_Vang';
import MBHRAP101 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP101_Vang';
import MBHRAP002 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP002_TangCa';
import MBHRAP003 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP003_DiTreVeSom';
import MBHRAP004 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP004_RaCong';
import MBHRAP005 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP005_DiCongTac';
// import MBHRAP006 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP006_ChuyenDoiCaLamViec';
import MBHRAP008 from './src/screens/HomeScreens/MBHRAP_QuanLyPheDuyet/MBHRAP008_BoSungCong';

import CCKM from './src/screens/HomeScreens/FCCKM_MBHRTI/index';
import MBHRTI001 from './src/screens/HomeScreens/MBHRTI_ChamCongKhuonMat/MBHRTI001_ChamCong';
import MBHRTI002 from './src/screens/HomeScreens/MBHRTI_ChamCongKhuonMat/MBHRTI002_DangKyKhuonMat';
import MBHRTI003 from './src/screens/HomeScreens/MBHRTI_ChamCongKhuonMat/MBHRTI003_DuLieuChamCong';
import MBHRTI004 from './src/screens/HomeScreens/MBHRTI_ChamCongKhuonMat/MBHRTI004_DangKyKhuonMatFe';
import MBHRTI005 from './src/screens/HomeScreens/MBHRTI_ChamCongKhuonMat/MBHRTI005_DangKyKhuonMatHIK';

import BDTK from './src/screens/HomeScreens/FBDTK_MBHRTK/index';
import MBHRTK002 from './src/screens/HomeScreens/FBDTK_MBHRTK/MBHRTK002_ThongKeLuong/MBHRTK002';
import MBHRTK001 from './src/screens/HomeScreens/FBDTK_MBHRTK/MBHRTK001_ThongKeNhanLuc';
import MBHRTK003 from './src/screens/HomeScreens/FBDTK_MBHRTK/MBHRTK003_BieuDoHopDong/BDHD_MBHRTK003';
import MBHRTK004 from './src/screens/HomeScreens/FBDTK_MBHRTK/MBHRTK004_BieuDoLaoDong/TKTQ_MBHRTK004';

import MBHRMN006 from './src/screens/HomeScreens/FQLDL_MBHRMN/MBHRMN006_DiemDanh';

import SecurityMethod from './src/screens/HomeScreens/SecurityMethod';
import QLDT from './src/screens/HomeScreens/FQLDT_MBHRDT/index';

import QLDL from './src/screens/HomeScreens/FQLDL_MBHRMN/index';

import CheckLogin from './src/screens/SystemScreens/CheckLogin';
import UpdatePass from './src/screens/SystemScreens/UpdatePass';

import ConfigThemeScreen from './src/screens/SystemScreens/ConfigTheme';

import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware} from 'redux';
import allReducers from './src/reducers';
import rootSaga from './src/sagas/rootSaga';
import {fcmService} from './src/config/FCMService';
//import {localNotificationService} from './src/config/LocalNotificationService';
import {localNotificationService} from './src/config/LocalNotificationService';

import {GlobalLoading, Popup} from './src/components/Base';
import NotificationAlert from './src/components/NotificationAlert';
import SysConfig from './src/screens/SystemScreens/SysConfig';
import TestScreenComponent from './src/tvs-libraries/test';
import {SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const sagaMiddleware = createSagaMiddleware();
let store = createStore(allReducers, applyMiddleware(sagaMiddleware));
const Stack = createStackNavigator();
const App = () => {
  const [visible, setVisible] = useState(false);
  const [content, setNotiContent] = useState('');
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  const hasNoti = notiContent => {
    setNotiContent('Bạn có 1 ' + notiContent);
    setTimeout(() => {
      setVisible(false);
    }, 3000);
    setVisible(true);
  };
  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
    function onRegister(token) {}

    function onNotification(notify) {
      hasNoti(notify.body);
      // const options = {
      //   soundName: 'default',
      //   playSound: true,
      // };
      // localNotificationService.showNotification(
      //   0,
      //   notify.title,
      //   notify.body,
      //   notify,
      //   options,
      // );
    }

    function onOpenNotification(notify) {}

    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NotificationAlert visible={visible} content={content} />
        <GlobalLoading />
        <Popup />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="ConfigThemeScreen"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name="ConfigThemeScreen"
              component={ConfigThemeScreen}
            />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgotPass" component={ForgotPass} />
            <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
            <Stack.Screen name="CheckLogin" component={CheckLogin} />
            <Stack.Screen name="UpdatePass" component={UpdatePass} />
            <Stack.Screen name="SysConfig" component={SysConfig} />
            {/* <Stack.Screen name="Question" component={Question} /> */}
            <Stack.Screen
              name="Index"
              component={Index}
              options={{
                gestureEnabled: false,
              }}
            />

            <Stack.Screen name="MBHRIN" component={TVTT} />
            <Stack.Screen name="MBHRIN001" component={MBHRIN001} />
            <Stack.Screen name="MBHRIN002" component={MBHRIN002} />
            <Stack.Screen name="MBHRIN003" component={MBHRIN003} />
            <Stack.Screen name="MBHRIN004" component={MBHRIN004} />
            <Stack.Screen name="MBHRIN005" component={MBHRIN005} />
            <Stack.Screen name="MBHRIN007" component={MBHRIN007} />
            <Stack.Screen name="MBHRIN006" component={MBHRIN006} />
            <Stack.Screen name="MBHRIN008" component={MBHRIN008} />
            <Stack.Screen name="HPHRIN003" component={HPHRIN003} />
            <Stack.Screen name="MBHRIN010" component={MBHRIN010} />

            <Stack.Screen name="MBHRRE" component={DKDL} />
            <Stack.Screen name="MBHRRE007" component={MBHRRE007} />
            <Stack.Screen name="MBHRRE001" component={MBHRRE001} />
            <Stack.Screen name="MBHRRE004" component={MBHRRE004} />
            <Stack.Screen name="MBHRRE005" component={MBHRRE005} />
            <Stack.Screen name="MBHRRE006" component={MBHRRE006} />
            <Stack.Screen name="MBHRRE008" component={MBHRRE008} />
            <Stack.Screen name="MBHRRE011" component={MBHRRE011} />

            <Stack.Screen name="MBHRAP" component={PDDL} />
            <Stack.Screen name="MBHRAP001" component={MBHRAP001} />
            <Stack.Screen name="MBHRAP002" component={MBHRAP002} />
            <Stack.Screen name="MBHRAP003" component={MBHRAP003} />
            <Stack.Screen name="MBHRAP004" component={MBHRAP004} />
            <Stack.Screen name="MBHRAP005" component={MBHRAP005} />
            {/* <Stack.Screen name="MBHRAP006" component={MBHRAP006} /> */}
            <Stack.Screen name="MBHRAP008" component={MBHRAP008} />
            <Stack.Screen name="MBHRAP101" component={MBHRAP101} />

            <Stack.Screen name="MBHRTI" component={CCKM} />
            <Stack.Screen name="MBHRTI001" component={MBHRTI001} />
            <Stack.Screen name="MBHRTI002" component={MBHRTI002} />
            <Stack.Screen name="MBHRTI003" component={MBHRTI003} />
            <Stack.Screen name="MBHRTI004" component={MBHRTI004} />
            <Stack.Screen name="MBHRTI005" component={MBHRTI005} />

            <Stack.Screen name="MBHRTK" component={BDTK} />
            <Stack.Screen name="MBHRTK002" component={MBHRTK002} />
            <Stack.Screen name="MBHRTK001" component={MBHRTK001} />
            <Stack.Screen name="MBHRTK003" component={MBHRTK003} />
            <Stack.Screen name="MBHRTK004" component={MBHRTK004} />

            <Stack.Screen name="MBHRDT" component={QLDT} />
            <Stack.Screen name="MBHRMN" component={QLDL} />
            <Stack.Screen name="MBHRMN005" component={MBHRMN006} />

            <Stack.Screen name="SecurityMethod" component={SecurityMethod} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};
sagaMiddleware.run(rootSaga);
// Register background handler

export default App;
