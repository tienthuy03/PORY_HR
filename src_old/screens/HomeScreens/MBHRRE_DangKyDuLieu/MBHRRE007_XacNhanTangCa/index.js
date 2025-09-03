/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchXntcAction, fetchXntcSuccessAction} from '../../../../actions';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Calender from '../../../../components/Calendes';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import {deviceId} from '../../../../constants/index';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import ShowError from '../../../../services/errors';
import CXN from './ChoXacNhan';
import DXN from './DaXacNhan';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
import {APP_VERSION} from '../../../../config/Pro';
const {width} = Dimensions.get('screen');

const XacNhanTangCa = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const menuReducer = useSelector(state => state.menuReducer);
  const loginReducers = useSelector(state => state.loginReducers);
  const xntcReducer = useSelector(state => state.xntcReducer);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  let thr_emp_pks = '';
  let tokenLogin = '';
  let fullnames = '';
  let org_pks = '';
  let dataXntc = [];
  let userPk;
  let refreshToken;
  let crt_by = loginReducers.data.data.crt_by;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    org_pks = loginReducers.data.data.org_pk;
    dataXntc = xntcReducer.data.data.xntc;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }

  const [startDay, setStartDay] = useState(
    moment(new Date()).format('YYYY-MM') + '-01',
  );
  const [endDay, setEndtDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [daySelect, setDateSelect] = useState(
    '01' +
      moment(new Date()).format('/MM/YYYY') +
      ' - ' +
      moment(new Date()).format('DD/MM/YYYY'),
  );
  const [countCXN, setCountCXN] = useState(0);
  const [countDXN, setCountDXN] = useState(0);

  const [dates, sendDate] = useState('');

  const getStateCalendar = async result => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndtDay(result.endingDays);
    setDateSelect(result.daySelecteds);
    sendDate(result.startingDays + '-' + result.endingDays);

    await getData(result.startingDays, result.endingDays);
  };

  const getData = async (fromdate, todate) => {
    console.log(crt_by);
    console.log(thr_emp_pks);
    sysFetch(
      API,
      {
        pro: 'SELHRRE0070101',
        in_par: {
          p1_varchar2: thr_emp_pks,
          p2_varchar2: moment(fromdate).format('YYYYMMDD'),
          p3_varchar2: moment(todate).format('YYYYMMDD'),
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'xntc',
          p2_sys: 'approve_data',
          p3_sys: 'thongtinnguoipheduyet',
          p4_varchar2: 'limit_reg_date',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log('rs ', rs);
        if (rs == 'Token Expired') {
          refreshNewToken('getData', fromdate, todate);
        }
        if (rs != 'Token Expired') {
          dispatch(fetchXntcSuccessAction(null));
          dispatch(
            fetchXntcAction({
              token: tokenLogin,
              machine_id: deviceId,
              user_pk: thr_emp_pks,
              p_fromdate: moment(fromdate).format('YYYYMMDD'),
              p_todate: moment(todate).format('YYYYMMDD'),
              version: APP_VERSION,
              crt_by: crt_by,
            }),
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const modal = (
    <TVSControlPopup
      isShow={isModalVisible}
      maxHeight={500}
      title={'Chọn ngày'}
      onHide={() => setModalVisible(false)}>
      <Calender
        getState={getStateCalendar}
        startDayss={startDay}
        endDayss={endDay}
      />
    </TVSControlPopup>
  );
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        getData(startDay, endDay);
      } else {
        ShowError('No internet');
      }
    });
  }, [startDay, endDay]);

  useEffect(() => {
    let dataDaXN = [];
    let dataChoXN = [];
    dataXntc.map(element => {
      if (element['0_pk'] !== '') {
        //daXN++;
        dataDaXN.push(element);
      } else {
        //choXN++;
        dataChoXN.push(element);
      }
    });
    setCountCXN(dataChoXN.length);
    setCountDXN(dataDaXN.length);
  }, [dataXntc]);
  const refreshNewToken = (obj, p1, p2) => {
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
        if (obj == 'getData') {
          getData(p1, p2);
        }
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
  return (
    <View style={{flex: 1, backgroundColor: Color.backgroundColor}}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          'MBHRRE007',
          menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRRE007')[0]
            .p_pk,
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <Block
          margin={10}
          radius={8}
          backgroundColor={Color.white}
          padding={10}>
          <Button
            nextScreen={() => toggleModal()}
            row
            paddingLeft={20}
            alignCenter
            justifyContent={'space-between'}>
            <Icon_calendar color={Color.mainColor} />
            <Text
              paddingRight={10}
              center
              color={Color.mainColor}
              flex
              size={14}
              paddingLeft={10}>
              Ngày {daySelect}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        <TVSTab
          fullTab={true}
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: 'Chờ xác nhận',
              count: countCXN.toString(),
              screen: (
                <CXN
                  data={dataXntc.filter(x => x['0_pk'] === '')}
                  onReload={() => getData(startDay, endDay)}
                />
              ),
            },
            {
              id: 1,
              name: 'Đã xác nhận',
              count: countDXN.toString(),
              screen: (
                <DXN
                  data={dataXntc.filter(x => x['0_pk'] !== '')}
                  onReload={() => getData(startDay, endDay)}
                />
              ),
            },
          ]}
        />
      </Block>
      {modal}
    </View>
  );
};

export default XacNhanTangCa;
