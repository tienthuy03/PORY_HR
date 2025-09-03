/* eslint-disable react-hooks/exhaustive-deps */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DELETE_XNTC} from '../../../../actions/actionType';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Calender from '../../../../components/Calendes';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import Icon_back from '../../../../icons/Back';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import {
  HRRE008EndDate,
  HRRE008LoadData,
  HRRE008StartDate,
} from '../../../../services/redux/HRRE008_BoSungCong/action';
import CXN from './ChoXacNhan';
import DXN from './DaXacNhan';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const {width} = Dimensions.get('screen');

const Tab = createMaterialTopTabNavigator();
const BoSungCong = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);

  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 15,
      marginBottom: Platform.OS === 'ios' ? 5 : 15,
      paddingTop: Platform.OS === 'ios' ? 20 : 10,
      marginTop: 30,
    },
    containerDxn: {
      paddingTop: 10,
      backgroundColor: Color.gray,
      flex: 1,
    },
    modalView: {
      flex: 1,
      justifyContent: 'center',
    },
    modalBackground: {
      flex: 1,
    },
    modalBackgroundContent: {
      flex: 1,
    },
    formView: {
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    header: {
      position: 'absolute',
      width: width,
      height: 100,
      backgroundColor: Color.mainColor,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    },
  });
  const menuReducer = useSelector(state => state.menuReducer);
  const loginReducers = useSelector(state => state.loginReducers);
  const {DanhSachBoSungCong} = useSelector(
    state => state.HRRE008_BoSungCongReducer,
  );
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  let thr_emp_pks = '';
  let tokenLogin = '';
  let fullnames = '';
  let org_pks = '';
  let dataBsc = [];
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    org_pks = loginReducers.data.data.org_pk;
    //dataBsc = HRRE008BoSungCongReducer.DanhSachBoSungCong;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }
  const [startDay, setStartDay] = useState(
    moment(new Date()).format('YYYY-MM-01'),
  );
  const [endDay, setEndtDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format('01/MM/YYYY') +
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
    getData(result.startingDays, result.endingDays);
  };
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
  const getData = (startDt, endDt) => {
    sysFetch(
      API,
      {
        pro: 'SELHRRE0080101',
        in_par: {
          p1_varchar2: thr_emp_pks,
          p2_varchar2: startDt,
          p3_varchar2: endDt,
        },
        out_par: {
          p1_sys: 'data',
          p2_sys: 'status',
          p3_sys: 'approve',
          p4_sys: 'reason',
          p5_varchar2: 'limit_reg_date',
          p6_varchar2: 'note',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData', startDt, endDt);
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
            dispatch(HRRE008StartDate(startDt));
            dispatch(HRRE008EndDate(endDt));
            dispatch(HRRE008LoadData());
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const modal = (
    <TVSControlPopup
      onHide={() => setModalVisible(false)}
      isShow={isModalVisible}
      title={'Chọn ngày'}
      maxHeight={500}>
      <Calender
        getState={getStateCalendar}
        startDayss={startDay}
        endDayss={endDay}
      />
    </TVSControlPopup>
  );

  useEffect(() => {
    getData(
      moment(new Date()).format('YYYYMM01'),
      moment(new Date()).format('YYYYMMDD'),
    );
    // dispatch(HRRE008EndDate(moment(new Date()).format('YYYYMMDD')));
    // dispatch(HRRE008StartDate(moment(new Date()).format('YYYYMM01')));
    // dispatch(HRRE008LoadData());
  }, []);

  useEffect(() => {
    setCountCXN(DanhSachBoSungCong.filter(x => x['0_pk'] === '').length);
    setCountDXN(DanhSachBoSungCong.filter(x => x['0_pk'] !== '').length);
  }, [DanhSachBoSungCong]);

  return (
    <View style={{flex: 1, backgroundColor: Color.mainColor}}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          'MBHRRE008',
          menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRRE008')[0]
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
              screen: <CXN onReload={() => dispatch(HRRE008LoadData())} />,
            },
            {
              id: 1,
              name: 'Đã xác nhận',
              count: countDXN.toString(),
              screen: <DXN onReload={() => dispatch(HRRE008LoadData())} />,
            },
          ]}
        />
      </Block>
      {modal}
    </View>
  );
};

export default BoSungCong;
