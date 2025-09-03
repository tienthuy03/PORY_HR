import NetInfo from '@react-native-community/netinfo';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Calender from '../../../../components/Calendes';
import Text from '../../../../components/Text';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import ShowError from '../../../../services/errors';
import List_MBHRIN005 from '../../../../utils/ListTTNN(MBHRIN005)';
import TabBar from '../../../../components/TabBar2';
import MBHRIN005_Month from './MBHRIN005_Month';
import MBHRIN005_Year from './MBHRIN005_Year';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
const Tab = createMaterialTopTabNavigator();
const NgayNghi = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const menuReducer = useSelector(state => state.menuReducer);
  const loginReducers = useSelector(state => state.loginReducers);
  let thr_emp_pk;
  let tokenLogin;
  let fullname;
  let language;
  let dataMenuMBHRs;
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
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
    moment(new Date()).format('DD/MM/YYYY'),
  );
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getStateCalendar = async result => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndtDay(result.endingDays);
    setDateSelect(result.daySelecteds);
    await getData(
      moment(result.startingDays).format('YYYYMMDD'),
      moment(result.endingDays).format('YYYYMMDD'),
    );
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
        pro: 'SELHRIN0050100',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(startDay).format('YYYYMMDD'),
          p3_varchar2: moment(endDay).format('YYYYMMDD'),
          p4_varchar2: 'ALL',
          p5_varchar2: 'ALL',
          p6_varchar2: fullname,
        },
        out_par: {
          p1_sys: 'ttnn',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken();
        }
        if (rs != 'Token Expired') {
          setData(rs.data.ttnn);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        getData();
      } else {
        ShowError('No internet');
      }
    });
  }, [startDay, endDay]);

  //create modal
  const modal = (
    <TVSControlPopup
      maxHeight={500}
      isShow={modalVisible}
      title={'Chọn ngày'}
      onHide={() => setModalVisible(false)}>
      <Calender
        getState={getStateCalendar}
        startDayss={startDay}
        endDayss={endDay}
      />
    </TVSControlPopup>
  );
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          'MBHRIN005',
          dataMenuMBHRs.filter(x => x.menu_cd === 'MBHRIN005')[0].p_pk,
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Tab.Navigator tabBar={props => <TabBar {...props} />}>
          <Tab.Screen
            name="Ngày"
            children={props => (
              <>
                <Block margin={10} radius={8} backgroundColor={Color.white}>
                  <Button
                    nextScreen={() => setModalVisible(true)}
                    row
                    alignCenter
                    padding={10}
                    justifyContent={'space-between'}>
                    <Icon_calendar color={Color.mainColor} marginLeft={20} />
                    <Text
                      paddingRight={20}
                      center
                      size={14}
                      color={Color.mainColor}
                      flex
                      paddingLeft={10}
                      height={60}>
                      Ngày {daySelect}
                    </Text>
                    <Text marginRight={10} />
                  </Button>
                </Block>
                {modal}
                <Block flex>
                  <Block flex>
                    <List_MBHRIN005 datas={data} onReload={getData} />
                  </Block>
                </Block>
              </>
            )}
          />
          <Tab.Screen name="Tháng" children={props => <MBHRIN005_Month />} />
          <Tab.Screen name="Năm" children={props => <MBHRIN005_Year />} />
        </Tab.Navigator>
      </Block>
    </Block>
  );
};

export default NgayNghi;
