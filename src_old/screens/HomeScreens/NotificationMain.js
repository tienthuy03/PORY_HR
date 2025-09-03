/* eslint-disable react-hooks/exhaustive-deps */
import {useIsFocused} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState} from 'react';
import {AppState, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../components/Block';
import TabBar from '../../components/TabBar';
import Text from '../../components/Text';
import {
  ntGetNotification,
  ntResetCountNotiTab,
} from '../../services/redux/Notification/action';
import SystemNoti from '../HomeScreens/Tab_Notification/SystemNoti';
import UserNoti from '../HomeScreens/Tab_Notification/UserNoti';
const Tab = createMaterialTopTabNavigator();

const NotificationMain = () => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const isFocused = useIsFocused();
  const [valueNoti, setValueNoti] = useState('Thông báo');
  let language = '';
  const {notification, notificationGen, notificationSys} = useSelector(
    state => state.NotificationReducer,
  );

  let dataLanguage;
  try {
    dataLanguage = state.languageReducer.data.data.language;
    language =
      state.loginReducers.data.data.user_language == undefined
        ? 'VIE'
        : state.loginReducers.data.data.user_language;
  } catch (error) {
    //
  }

  useEffect(() => {
    if (dataLanguage !== undefined) {
      dataLanguage.filter(item => {
        var lowerLanguage = language.toLowerCase();
        if (item.field_name === 'notification') {
          setValueNoti(item[lowerLanguage]);
        }
      });
    }
  }, [dataLanguage, language]);

  useEffect(() => {
    AppState.addEventListener('change', currentAppState => {
      if (currentAppState === 'active') {
        console.log('currentAppState ', currentAppState);
        dispatch(ntGetNotification());
      }
    });
    dispatch(ntGetNotification());
  }, []);
  useEffect(() => {
    if (isFocused) {
      dispatch(ntResetCountNotiTab());
    }
  }, [isFocused]);
  return (
    <Block flex backgroundColor={Color.gray}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <Block row marginTop={55} alignCenter>
        <Block backgroundColor={Color.mainColor} width={7} height={29} />
        <Text
          size={26}
          color={Color.mainColor}
          fontFamily={'Roboto-Bold'}
          paddingLeft={20}
          textAlign={'center'}>
          {valueNoti}
        </Text>
      </Block>
      <Block flex backgroundColor={Color.gray} paddingTop={10}>
        <SystemNoti />
        {/* <Tab.Navigator tabBar={props => <TabBar {...props} />}>
          <Tab.Screen
            name="Thông báo chung"
            // options={{
            //   tabBarLabel: notificationGen
            //     .filter(x => x.read_yn === 'N')
            //     .length.toString(),
            // }}
            component={UserNoti}
          />
          <Tab.Screen
            name="Hệ thống"
            // options={{
            //   tabBarLabel: notificationSys
            //     .filter(x => x.read_yn === 'N')
            //     .length.toString(),
            // }}
            component={SystemNoti}
          />
        </Tab.Navigator> */}
      </Block>
    </Block>
  );
};

export default NotificationMain;
