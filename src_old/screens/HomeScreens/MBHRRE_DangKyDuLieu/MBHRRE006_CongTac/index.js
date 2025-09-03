import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import {setHeaderChil2} from '../../../../Language';
import {
  HRRE006DSNgayBatDau,
  HRRE006DSNgayKetThuc,
  HRRE006LoadDataCongTac,
  HRRE006SetDescription,
  HRRE006SetEndTime,
  HRRE006SetStartTime,
  HRRE006SetWorkDate,
} from '../../../../services/redux/HRRE006_CongTac/action';
import DK from './DangKy/DK';
import DS from './DanhSach/DS';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const DangKyCongTac = ({navigation}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const menuReducer = useSelector(state => state.menuReducer);
  const loginReducers = useSelector(state => state.loginReducers);
  const [currentTab, setCurrentTab] = useState(0);
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
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRRE0060100',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(new Date()).format('YYYYMM01'),
          p3_varchar2: moment(new Date()).format('YYYYMMDD'),
        },
        out_par: {
          p1_sys: 'data',
          p2_sys: 'approve_data',
          p3_sys: 'approve_person',
          p4_varchar2: 'note',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          dispatch(
            HRRE006SetStartTime({
              isShow: false,
              time: 'hh:mm',
            }),
          );
          dispatch(
            HRRE006SetEndTime({
              isShow: false,
              time: 'hh:mm',
            }),
          );
          dispatch(HRRE006SetDescription(''));
          dispatch(HRRE006SetWorkDate('dd/mm/yyyy'));
          dispatch(HRRE006DSNgayBatDau(moment(new Date()).format('YYYYMM01')));
          dispatch(HRRE006DSNgayKetThuc(moment(new Date()).format('YYYYMMDD')));
          dispatch(HRRE006LoadDataCongTac());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
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
        if (obj == 'getData') {
          getData();
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
    <>
      <PopupSelectTimeIn />
      <PopupSelectTimeOut />
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={() => navigation.goBack()}>
          {setHeaderChil2(
            loginReducers.data.data.user_language,
            menuReducer.data.data.menu,
            'MBHRRE006',
            menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRRE006')[0]
              .p_pk,
          )}
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <TVSTab
            scrollEnabled={false}
            fullTab={true}
            onChangeTab={index => {
              setCurrentTab(index);
            }}
            data={[
              {
                id: 0,
                name: 'Đăng ký',
                screen: <DK currentTab={currentTab} />,
                count: null,
              },
              {
                id: 1,
                name: 'Đã đăng ký',
                screen: <DS />,
                count: null,
              },
            ]}
          />
        </Block>
      </Block>
    </>
  );
};

const PopupSelectTimeIn = () => {
  const {startTime} = useSelector(state => state.HRRE006_CongTacReducer);

  const dispatch = useDispatch();
  const accept = value => {
    dispatch(
      HRRE006SetStartTime({time: moment(value).format('HH:mm'), isShow: false}),
    );
  };

  return (
    <DateTimePicker
      isVisible={startTime.isShow}
      mode="time"
      onConfirm={accept}
      onCancel={() => {
        dispatch(HRRE006SetStartTime({...startTime, isShow: false}));
      }}
      headerTextIOS="Chọn giờ"
      confirmTextIOS="Xác nhận"
      cancelTextIOS="Huỷ bỏ"
      locale={'vi_VN'}
      date={
        startTime.time === 'hh:mm'
          ? new Date()
          : new Date(moment(startTime.time, 'HH:mm'))
      }
    />
  );
};

const PopupSelectTimeOut = () => {
  const {endTime} = useSelector(state => state.HRRE006_CongTacReducer);

  const dispatch = useDispatch();
  const accept = value => {
    dispatch(
      HRRE006SetEndTime({time: moment(value).format('HH:mm'), isShow: false}),
    );
  };

  return (
    <DateTimePicker
      isVisible={endTime.isShow}
      mode="time"
      onConfirm={accept}
      headerTextIOS="Chọn giờ"
      confirmTextIOS="Xác nhận"
      cancelTextIOS="Huỷ bỏ"
      locale={'vi_VN'}
      onCancel={() => {
        dispatch(HRRE006SetStartTime({...endTime, isShow: false}));
      }}
      date={
        endTime.time === 'hh:mm'
          ? new Date()
          : new Date(moment(endTime.time, 'HH:mm'))
      }
    />
  );
};
export default DangKyCongTac;
