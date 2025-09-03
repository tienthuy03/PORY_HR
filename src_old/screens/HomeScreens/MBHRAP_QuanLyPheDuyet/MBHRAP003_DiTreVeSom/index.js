/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from '@react-native-community/netinfo';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DELETE_PDTC} from '../../../../actions/actionType';
//import Modal from 'react-native-modal';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Calender from '../../../../components/Calendes';
import TabBar from '../../../../components/TabBar';
import Text from '../../../../components/Text';
import Icon_back from '../../../../icons/Back';
import Icon_calendar from '../../../../icons/Datev';
import ShowError from '../../../../services/errors';
import CPD from './ChoPheDuyet';
import DPD from './DaPheDuyet';
import KPD from './KhongPheDuyet';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const Tab = createMaterialTopTabNavigator();
const PheDuyetDiTreVeSom = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
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
  });
  const loginReducers = useSelector(state => state.loginReducers);
  const [PDDTVS, setPDDTVS] = useState([]);
  // const PDDTVS = useSelector(state => {
  //   if (state.DataPheDuyetDiTreVeSom.Data !== null) {
  //     if (state.DataPheDuyetDiTreVeSom.Data.results === 'S') {
  //       return state.DataPheDuyetDiTreVeSom.Data.data.data;
  //     } else {
  //       return [];
  //     }
  //   } else {
  //     return [];
  //   }
  // });
  let thr_emp_pk = '';
  let tokenLogin = '';
  let full_name = '';
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    full_name = loginReducers.data.data.full_name;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {}
  const [startDay, setStartDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [endDay, setEndtDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [daySelect, setDateSelect] = useState(
    moment(startDay).format('DD/MM/YYYY'),
  );
  const [] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countCPD, setCountCPD] = useState(0);
  const [countDPD, setCountDPD] = useState(0);
  const [countKPD, setCountKPD] = useState(0);
  const [dates, sendDate] = useState(
    moment(new Date()).format('YYYYMMDD') +
      '-' +
      moment(new Date()).format('YYYYMMDD'),
  );
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const getStateCalendar = async result => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndtDay(result.endingDays);
    setDateSelect(result.daySelecteds);
    sendDate(result.startingDays + '-' + result.endingDays);
  };

  const goBacks = async () => {
    await dispatch({type: DELETE_PDTC});
    await goBack();
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
  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRAP0030100',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: dates.split('-')[0],
          p3_varchar2: dates.split('-')[1],
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
            setPDDTVS(rs.data.data);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        getData();
      } else {
        ShowError('No internet');
      }
    });
  }, [startDay, endDay]);

  useEffect(() => {
    let dataKPDs = [];
    let dataCPDs = [];
    let dataDPDs = [];
    PDDTVS.map(element => {
      if (element.approve_status === '1') {
        dataCPDs.push(element);
      } else if (element.approve_status === '2') {
        dataDPDs.push(element);
      } else if (element.approve_status === '3') {
        dataKPDs.push(element);
      }
    });
    setCountCPD(dataCPDs.length);
    setCountDPD(dataDPDs.length);
    setCountKPD(dataKPDs.length);
  }, [PDDTVS]);
  const handleCallbackRefresh = () => {
    getData();
  };
  function CPDs() {
    return (
      <CPD
        dates={dates}
        dataPD={PDDTVS}
        callbackRefresh={handleCallbackRefresh}
      />
    );
  }

  function DPDs() {
    return (
      <DPD
        dates={dates}
        dataPD={PDDTVS}
        callbackRefresh={handleCallbackRefresh}
      />
    );
  }

  function KPDs() {
    return (
      <KPD
        dates={dates}
        dataPD={PDDTVS}
        callbackRefresh={handleCallbackRefresh}
      />
    );
  }

  const loadTab = useMemo(() => {
    return (
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          labelStyle: {
            fontSize: 12,
          },
          tabStyle: {
            width: 100,
          },
          style: {
            backgroundColor: 'blue',
          },
        }}>
        <Tab.Screen
          name="Chờ duyệt"
          component={CPDs}
          options={{tabBarLabel: countCPD.toString()}}
        />
        <Tab.Screen
          name="Đã duyệt"
          component={DPDs}
          options={{tabBarLabel: countDPD.toString()}}
        />
        <Tab.Screen
          name="Không duyệt"
          component={KPDs}
          options={{tabBarLabel: countKPD.toString()}}
        />
      </Tab.Navigator>
    );
  }, [daySelect, countCPD, countDPD, countKPD]);
  const modal = (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <Button
        nextScreen={() => setModalVisible(false)}
        height={Platform.OS === 'ios' ? 160 : 130}
        backgroundColor={'rgba(0,0,0,0.4)'}
      />
      <View style={styles.formView}>
        <Calender
          getState={getStateCalendar}
          startDayss={startDay}
          endDayss={endDay}
        />
      </View>

      <Button
        nextScreen={() => setModalVisible(false)}
        flex
        backgroundColor={'rgba(0,0,0,0.4)'}
      />
    </Modal>
  );
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <Block
        row
        alignCenter
        justifyContent={'space-between'}
        paddingLeft={15}
        paddingBottom={Platform.OS === 'ios' ? 10 : 15}
        paddingTop={Platform.OS === 'ios' ? 15 : 5}
        marginTop={30}>
        <Button
          padding={10}
          width={40}
          height={40}
          nextScreen={() => goBacks()}>
          <Icon_back color={Color.white} />
        </Button>
        <Text
          width={'40%'}
          numberOfLines={1}
          size={20}
          color={Color.white}
          fontFamily={'Roboto-Bold'}
          marginRight={20}
          textAlign={'center'}>
          Phê duyệt đi trễ về sớm
        </Text>
        <Block backgroundColor={Color.white} width={7} height={29} />
      </Block>
      <Block flex backgroundColor={Color.gray}>
        <Block
          shadow
          margin={10}
          radius={8}
          backgroundColor={'#F5F6FA'}
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
        {/* {modal} */}

        {loadTab}
      </Block>
      {modal}
    </Block>
  );
};

export default PheDuyetDiTreVeSom;
