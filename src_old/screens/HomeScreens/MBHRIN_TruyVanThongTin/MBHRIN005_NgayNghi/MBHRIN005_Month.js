/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Platform, StyleSheet, View} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import OneField from '../../../../components/OneFieldKeyValue';
import Text from '../../../../components/Text';
import TVSButton from '../../../../components/Tvs/Button';
import Icon_calendar from '../../../../icons/Datev';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
const MBHRIN005_Month = () => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    pContent: {
      backgroundColor: 'white',
      width: '100%',
      borderRadius: 20,
    },
    pContainer: {
      paddingHorizontal: 10,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(00,00,00,.3)',
      zIndex: 90,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  const [loadData, setLoadData] = useState(false);
  const [startMonth, setStartMonth] = useState(
    moment(new Date()).format('01/YYYY'),
  );
  const [endMonth, setEndMonth] = useState(
    moment(new Date()).format('MM/YYYY'),
  );
  const [startMonthTemp, setStartMonthTemp] = useState(
    moment(new Date()).format('01/YYYY'),
  );
  const [endMonthTemp, setEndMonthTemp] = useState(
    moment(new Date()).format('MM/YYYY'),
  );
  const [showStartMonth, setShowStartMonth] = useState(false);
  const [showEndMonth, setShowEndMonth] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const loginReducers = useSelector(state => state.loginReducers);
  let thr_emp_pk = '';
  let tokenLogin = '';
  let userPk;
  let refreshToken;

  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {}

  //handle Change date
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
        if (obj == 'getMonthData') {
          getMonthData();
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
  //get data of month
  const getMonthData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRIN0051100',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: startMonth.split('/')[1] + '' + startMonth.split('/')[0],
          p3_varchar2: endMonth.split('/')[1] + '' + endMonth.split('/')[0],
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getMonthData');
        }
        if (rs != 'Token Expired') {
          console.log(rs);
          if (rs.results === 'S') {
            setData(rs.data.data);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getMonthData();
  }, [loadData]);

  //create modal
  const PopupDatePicker = ({setLoadData}) => {
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
                          endMonthTemp.split('/')[1] +
                            endMonthTemp.split('/')[0],
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
                          setEndMonth(endMonthTemp);
                          setStartMonth(startMonthTemp);
                          setModalVisible(false);
                          setLoadData(!loadData);
                        }
                      }
                    }}>
                    Xác nhận
                  </TVSButton>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <>
      {showStartMonth && (
        <MonthPicker
          onChange={(value, newStartDate) => {
            setShowStartMonth(false);
            if (newStartDate) {
              setStartMonthTemp(moment(newStartDate).format('MM/YYYY'));
            }
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
            if (newEndDate) {
              setEndMonthTemp(moment(newEndDate).format('MM/YYYY'));
            }
          }}
          value={
            new Date(endMonthTemp.split('/')[1], endMonthTemp.split('/')[0])
          }
          minimumDate={new Date(2014, 12)}
          maximumDate={new Date(2030, 12)}
          enableAutoDarkMode={Platform.OS === 'ios' ? true : false}
        />
      )}
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
      <PopupDatePicker setLoadData={setLoadData} />
      <Block flex>
        <FlatList
          onRefresh={() => setLoadData(!loadData)}
          refreshing={false}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => <RenderItem item={item} />}
          extraData={data}
          ListEmptyComponent={() => (
            <Block alignCenter justifyCenter marginTop={20}>
              <Text>Không có dữ liệu !</Text>
            </Block>
          )}
        />
      </Block>
    </>
  );
};
const RenderItem = ({item}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {marginTop: 5, marginRight: 10, marginLeft: 10},
    pContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(00,00,00,.3)',
      zIndex: 999,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pContent: {
      width: 300,
      height: 400,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    pOneItem: {
      padding: 10,
      backgroundColor: Color.inputBackgroundColor,
      marginBottom: 5,
      borderRadius: 10,
    },
  });
  const currentItem = item.txtvalue.split('|');
  const label = currentItem[0];
  currentItem.map((j, index) => {
    console.log(j.split(':'));
    console.log(j.split(':')[1]);
  });
  return (
    <View style={styles.container}>
      {label ? (
        <Block row justifyContent={'space-between'}>
          <Block
            borderTopLeftRadius={6}
            borderTopRightRadius={6}
            backgroundColor={Color.white}
            height={35}
            borderColor={Color.oneContentBorder}
            borderWidth={1}
            borderBottomColor={'white'}
            alignCenter
            justifyCenter
            paddingLeft={10}
            paddingRight={10}>
            <Text color={Color.mainColor} size={14}>
              {label}
            </Text>
          </Block>
          <Text color={Color.white} size={13} />
        </Block>
      ) : null}
      <Block
        backgroundColor={Color.white}
        borderBottomLeftRadius={6}
        borderBottomRightRadius={6}
        borderColor={Color.oneContentBorder}
        borderWidth={1}
        paddingBottom={5}>
        {currentItem.map((j, index) => {
          const tempItem = j.split(':');
          return (
            <>
              {tempItem[0].trim() === 'Tháng' ? null : (
                <OneField
                  keyName={tempItem[0].trim()}
                  value={tempItem[1].trim()}
                  key={index.toString()}
                />
              )}
            </>
          );
        })}
      </Block>
    </View>
  );
};
export default MBHRIN005_Month;
