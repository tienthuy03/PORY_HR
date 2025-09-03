import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Block from '../../../components/Block';
import TabBar from '../../../components/TabBar';
import Text from '../../../components/Text';
import BieuDoLuong from './BieuDoLuong';
import moment from "moment";
import HoatDong from './HoatDong';
import TVSTab from '../../../components/Tvs/Tab'
// import {Color} from '../../../colors/color';
import ThongKe from './ThongKe';
import CongTyNoti from './NotificationTab'
const Tab = createMaterialTopTabNavigator();
const Dashboard = ({ navigation }) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const [Dashboard, setDashboard] = useState('Bảng tin');
  let language = '';
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
        if (item.field_name === 'dashboard') {
          setDashboard(item[lowerLanguage]);
        }
      });
    }
  }, [dataLanguage, language]);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-01")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf("month").format("YYYY-MM-DD")
  );

  const onCallbackSetDate = (sDate, eDate) => {
    setStartDate(sDate);
    setEndDate(eDate);
  };

  return (
    <Block flex backgroundColor={Color.gray}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <Block row marginTop={55} alignCenter marginBottom={10}>
        <Block backgroundColor={Color.mainColor} width={7} height={29} />
        <Text
          size={26}
          color={Color.mainColor}
          fontFamily={'Roboto-Bold'}
          paddingLeft={20}
          textAlign={'center'}>
          {Dashboard}
        </Text>
      </Block>
      <Block flex flexDirection={'column'}>
        <Block flex backgroundColor={Color.gray}>
          <TVSTab
            fullTab
            scrollEnabled={false}
            data={[
              {
                id: 0,
                name: 'Cá nhân',
                count: null,
                screen: <ThongKe />
              },
              {
                id: 1,
                name: 'Công ty',
                count: null,
                screen: <CongTyNoti
                  onCallbackSetDate={onCallbackSetDate}
                  startDate={startDate}
                  endDate={endDate}
                />
              },
            ]}
          />
        </Block>
      </Block>
    </Block>
  );
};

export default Dashboard;
