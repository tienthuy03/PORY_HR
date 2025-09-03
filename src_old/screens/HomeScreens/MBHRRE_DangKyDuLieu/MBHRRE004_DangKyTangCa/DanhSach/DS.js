import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, Modal, Platform, StyleSheet, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import Button from '../../../../../components/Button';
import Calender from '../../../../../components/Calendes';
import Text from '../../../../../components/Text';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup';
import Icon_time from '../../../../../icons/Datev';
import {
  HRRE004DSNgayBatDau,
  HRRE004DSNgayKetThuc,
  HRRE004LoadDataTangCa,
} from '../../../../../services/redux/HRRE004_TangCa/action';
import OneItem from './OneItem';
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch';

const DS = () => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const data = useSelector(state => state.HRRE004_TangCaReducer.DataTangCa);
  //variable
  const currentDateData = moment(new Date()).format('YYYYMMDD');
  const currentDateDisp =
    moment(new Date()).format('01/MM/YYYY') +
    ' - ' +
    moment(new Date()).format('DD/MM/YYYY');
  //hook modalsCalendarVisible
  const [modalsCalendarVisible, setModalsCalendarVisible] = useState(false);
  //hook dateSelectTypeData
  const [dateSelectTypeData, setDateSelectTypeData] = useState(
    currentDateData + '-' + currentDateData,
  );
  //hook startDate
  const [startDate, setStartDate] = useState();
  //hook endDate
  const [endDate, setEndDate] = useState();
  //hook dateSelect
  const [dateSelect, setDateSelect] = useState(currentDateDisp);
  //function to close modal calendar
  const onCloseModalsCalendar = () => {
    setModalsCalendarVisible(true);
  };
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );

  const refreshNewToken = obj => {
    axios
      .post(API + 'User/RefreshToken/', {
        token: tokenLogin,
        userPk: userPk,
        refreshToken: refreshToken,
      })
      .then(response => {
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.token,
            key: 'tokenLogin',
          }),
        );
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.refreshToken,
            key: 'refreshToken',
          }),
        );
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;
      })
      .catch(error => {
        if (error == 'AxiosError: Request failed with status code 400') {
          Alert.alert(
            'Thông báo',
            'Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống',
            [
              {
                text: 'Đóng',
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            {cancelable: true},
          );
        }
        console.log(error);
      });
  };
  const getData = (startDt, endDt, daySelect) => {
    sysFetch(
      API,
      {
        pro: 'SELHRRE0040100',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: startDt,
          p3_varchar2: endDt,
        },
        out_par: {
          p1_sys: 'data',
          p2_sys: 'approve_data',
          p4_sys: 'approve_person',
          p6_varchar2: 'note',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          dispatch(HRRE004DSNgayBatDau(startDt));
          dispatch(HRRE004DSNgayKetThuc(endDt));
          dispatch(HRRE004LoadDataTangCa());
          setModalsCalendarVisible(false);
          setStartDate(startDt);
          setEndDate(endDt);
          setDateSelect(daySelect);
          setDateSelectTypeData(startDt + '-' + endDt);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  //function when you selected date
  const getStateCalendar = result => {
    getData(result.startingDays, result.endingDays, result.daySelecteds);
  };
  const onRedload = () => {
    getData(startDate, endDate, dateSelect);
    dispatch(HRRE004LoadDataTangCa());
  };
  //Child Components
  const ModalsCalendar = () => {
    return (
      <TVSControlPopup
        maxHeight={500}
        onHide={() => setModalsCalendarVisible(false)}
        isShow={modalsCalendarVisible}
        title={'Chọn ngày'}>
        <Calender
          getState={getStateCalendar}
          startDayss={startDate}
          endDayss={endDate}
        />
      </TVSControlPopup>
    );
  };

  const renderNoData = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text fontFamily={'Roboto-Medium'}>Không có dữ liệu !</Text>
      </Block>
    );
  };
  return (
    <Block paddingTop={10} backgroundColor={Color.gray} flex>
      <Block
        height={40}
        radius={8}
        flexDirection={'row'}
        //justifyCenter={'center'}
        backgroundColor={Color.gray}>
        <Block
          flex={1}
          shadow
          height={40}
          marginLeft={10}
          marginRight={10}
          radius={8}
          backgroundColor={Color.gray}>
          <Button
            nextScreen={onCloseModalsCalendar}
            height={40}
            row
            alignCenter
            justifyContent={'space-between'}>
            <Icon_time style={{marginLeft: 20}} />
            <Text center color={Color.mainColor} flex size={14} height={40}>
              Ngày {dateSelect}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
      </Block>
      <Block flex>
        <Block marginTop={5} flex>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={onRedload}
            refreshing={false}
            data={data}
            keyExtractor={item => item.pk.toString()}
            renderItem={item => <OneItem item={item} />}
            ListEmptyComponent={renderNoData}
          />
        </Block>
      </Block>
      <ModalsCalendar />
    </Block>
  );
};

export default DS;
