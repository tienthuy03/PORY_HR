import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert, Platform, StyleSheet, View} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import TVSButton from '../../../../components/Tvs/Button';
import TVSHeader from '../../../../components/Tvs/Header';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import ListLSVPCC from '../../../../utils/ListLSVPCC';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const ViPhamChamCong = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const mainMenu = useSelector(state => state.menuReducer.data.data.menu);
  const language = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const styles = StyleSheet.create({
    pContent: {
      backgroundColor: 'white',
      width: '100%',
      borderRadius: 20,
    },
    pContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(00,00,00,.3)',
      zIndex: 90,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    containerDxn: {
      paddingTop: 10,
      backgroundColor: Color.gray,
      flex: 1,
    },
    container: {
      margin: 10,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
  const [dataVpcc, setDataVpcc] = useState([]);
  let thr_emp_pk;
  let tokenLogin;
  let userPk;
  let refreshToken;

  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    console.log(error);
  }

  const [showStartMonth, setShowStartMonth] = useState(false);
  const [showEndMonth, setShowEndMonth] = useState(false);
  const [startMonth, setStartMonth] = useState(
    moment(new Date()).format('MM/YYYY'),
  );
  const [endMonth, setEndMonth] = useState(
    moment(new Date()).format('MM/YYYY'),
  );
  const [startMonthTemp, setStartMonthTemp] = useState(
    moment(new Date()).format('MM/YYYY'),
  );
  const [endMonthTemp, setEndMonthTemp] = useState(
    moment(new Date()).format('MM/YYYY'),
  );

  const [modalVisible, setModalVisible] = useState(false);

  const onValueChange = () => {
    setStartMonthTemp(startMonth);
    setEndMonthTemp(endMonth);
    setModalVisible(!modalVisible);
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
        pro: 'SELHRIN0080100',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: startMonth.split('/')[1] + '' + startMonth.split('/')[0],
          p3_varchar2: endMonth.split('/')[1] + '' + endMonth.split('/')[0],
        },
        out_par: {
          p1_sys: 'vpcc',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          setDataVpcc(rs.data.vpcc);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, [modalVisible]);

  const PopupDatePicker = () => {
    return (
      <>
        {modalVisible ? (
          <View style={styles.pContainer}>
            <View style={styles.pContent}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  backgroundColor: 'rgba(00,00,00,.03)',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}>
                <Text
                  color={Color.mainColor}
                  fontWeight={'bold'}
                  style={{
                    textTransform: 'uppercase',
                  }}
                  size={15}
                  marginBottom={5}>
                  Chọn tháng
                </Text>
              </View>
              <View
                style={{
                  padding: 20,
                }}>
                <Text>Từ tháng</Text>
                <Button
                  nextScreen={() => {
                    setShowStartMonth(true);
                  }}
                  row
                  backgroundColor={Color.blueB}
                  marginBottom={10}
                  padding={10}
                  radius={6}
                  marginTop={5}>
                  <Icon_calendar />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>Tháng {startMonthTemp}</Text>
                  </View>
                </Button>
                <Text>Đến tháng</Text>
                <Button
                  nextScreen={() => {
                    setShowEndMonth(true);
                  }}
                  row
                  backgroundColor={Color.blueB}
                  marginBottom={10}
                  padding={10}
                  radius={6}
                  marginTop={5}>
                  <Icon_calendar />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>Tháng {endMonthTemp}</Text>
                  </View>
                </Button>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  backgroundColor: 'rgba(00,00,00,.03)',
                  justifyContent: 'center',
                }}>
                <TVSButton
                  type={'danger'}
                  icon={'close'}
                  onPress={() => setModalVisible(false)}>
                  Đóng lại
                </TVSButton>
                <TVSButton
                  icon={'check'}
                  onPress={async () => {
                    if (showEndMonth || showStartMonth) {
                    } else {
                      const tempEM = parseInt(
                        endMonthTemp.split('/')[1] + endMonthTemp.split('/')[0],
                      );
                      const tempSM = parseInt(
                        startMonthTemp.split('/')[1] +
                          startMonthTemp.split('/')[0],
                      );
                      if (tempEM < tempSM) {
                        Alert.alert(
                          'Thông báo',
                          'Tháng bắt đầu phải nhỏ hơn hoặc bằng tháng kết thúc.',
                          [{text: 'Đóng'}],
                        );
                      } else {
                        await setEndMonth(endMonthTemp);
                        await setStartMonth(startMonthTemp);
                        await getData();
                        await setModalVisible(false);
                      }
                    }
                  }}>
                  Xác nhận
                </TVSButton>
              </View>
            </View>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      {showStartMonth && (
        <MonthPicker
          onChange={async (value, newStartDate) => {
            setShowStartMonth(false);
            setStartMonthTemp(moment(newStartDate).format('MM/YYYY'));
          }}
          value={
            new Date(startMonthTemp.split('/')[1], startMonthTemp.split('/')[0])
          }
          minimumDate={new Date(2014, 12)}
          maximumDate={new Date(2030, 12)}
          enableAutoDarkMode={Platform.OS === 'ios' ? true : false}
        />
      )}
      {showEndMonth && (
        <MonthPicker
          onChange={(value, newEndDate) => {
            setShowEndMonth(false);
            setEndMonthTemp(moment(newEndDate).format('MM/YYYY'));
          }}
          value={
            new Date(endMonthTemp.split('/')[1], endMonthTemp.split('/')[0])
          }
          minimumDate={new Date(2014, 12)}
          maximumDate={new Date(2030, 12)}
          enableAutoDarkMode={Platform.OS === 'ios' ? true : false}
        />
      )}
      <PopupDatePicker />
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          mainMenu,
          'MBHRIN008',
          mainMenu.filter(x => x.menu_cd === 'MBHRIN008')[0].p_pk,
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray}>
        <Block margin={10} radius={8} backgroundColor={Color.white}>
          <Button
            nextScreen={() => onValueChange()}
            row
            alignCenter
            padding={10}
            justifyContent={'space-between'}>
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text
              paddingRight={20}
              size={14}
              center
              color={Color.mainColor}
              flex
              paddingLeft={10}
              height={60}>
              {startMonth} - {endMonth}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
      </Block>
      <Block flex backgroundColor={Color.gray}>
        <Block flex>
          <Block flex>
            <ListLSVPCC datas={dataVpcc} onReload={getData} />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default ViPhamChamCong;
