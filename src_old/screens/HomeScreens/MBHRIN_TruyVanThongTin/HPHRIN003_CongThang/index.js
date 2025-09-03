/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import MonthPicker from 'react-native-month-year-picker';
import {useDispatch, useSelector} from 'react-redux';
import {fetchLanguageAction} from '../../../../actions';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import OneFieldKeyValue from '../../../../components/OneFieldKeyValue';
import TabBar from '../../../../components/TabBar2';
import Text from '../../../../components/Text';
import TVSHeader from '../../../../components/Tvs/Header';
import RenderHightLineHPDQ from '../../../../components/Tvs/RenderHightLineHPDQ';
import {deviceId} from '../../../../constants/index';
import Icon_calendar from '../../../../icons/Datev';
import Icon_next from '../../../../icons/Drop';
import {setHeaderChil2} from '../../../../Language';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../services/redux/GlobalLoading/action';
const Tab = createMaterialTopTabNavigator();
const CongThang = ({navigation: {goBack}}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      margin: 10,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOneRecord1: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: Color.white,
    },
    modalOneRecord2: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: Color.blueB,
    },
    modalOneRecord3: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: Color.backgroundHol,
    },
    modalOneRecord4: {
      flexDirection: 'row',
      padding: 5,
      borderColor: '#ccc',
      backgroundColor: Color.backgroundSun,
    },
    modalOneRecordHeader: {
      flexDirection: 'row',
      padding: 5,
      borderRadius: 5,
      borderColor: '#ccc',
      marginBottom: 5,
      backgroundColor: Color.blueB,
    },
    modalOneCol1: {
      width: '25%',
    },
    modalOneCol2: {
      textAlign: 'center',
      width: '30%',
    },
    modalOneCol3: {
      textAlign: 'center',
      width: '15%',
    },
    modalOneCol4: {
      textAlign: 'center',
      width: '15%',
    },
    modalOneCol5: {
      textAlign: 'center',
      width: '15%',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      width: '100%',
      height: 600,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 50,
    },
    modalTabTitle: {
      flexDirection: 'row',
    },
    modalHeaderView: {
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
      width: '100%',
      paddingBottom: 10,
      marginBottom: 10,
    },
    modalHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Color.mainColor,
    },
    modalBodyView: {
      padding: 5,
      flex: 1,
    },
    modalFooterView: {
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      width: '100%',
      alignItems: 'center',
      paddingTop: 10,
      marginTop: 10,
    },
    modalbtnClose: {
      borderRadius: 10,
      backgroundColor: Color.mainColor,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
    },
    modalbtnText: {
      color: 'white',
    },
  });
  const dispatch = useDispatch();
  const loginReducers = useSelector(state => state.loginReducers);
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const [IsShow, setIsShow] = useState(false);
  let language = '';

  let tokenLogin;
  let emp_pk;
  let userPk;
  let refreshToken;

  const menuReducer = useSelector(state => state.menuReducer);
  let dataMenuMBHRs;
  try {
    dataMenuMBHRs = menuReducer.data.data.menu;
    language = loginReducers.data.data.user_language;
    emp_pk = loginReducers.data.data.thr_emp_pk;
    tokenLogin = loginReducers.data.data.tokenLogin;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [dataDB, setDataDB] = useState([]);
  const [dataDB1, setDataDB1] = useState([]);
  const [sts, setSts] = useState(false);
  // const [date, setDate] = useState(moment(new Date()));
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [show, setShow] = useState(false);
  const showPicker = useCallback(value => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );
  const refreshNewToken = (obj, param1) => {
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
          getData(param1);
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

  const getData = async p_work_mon => {
    dispatch(ShowGlobalLoading);
    setData([]);
    sysFetch(
      API,
      {
        pro: 'SELHRIN0030102',
        in_par: {
          p1_varchar2: emp_pk,
          p2_varchar2: p_work_mon,
        },
        out_par: {
          p1_sys: 'ttct',
          p2_sys: 'ttct_detail',
        },
      },
      tokenLogin,
    )
      .then(res => {
        if (res == 'Token Expired') {
          refreshNewToken('getData', p_work_mon);
        }
        if (res != 'Token Expired') {
          let datass = [];
          let datassDB = [];
          if (res.totalRow > 0) {
            let map = new Map(Object.entries(res.data.ttct[0]));
            let mapDB = new Map(Object.entries(res.data.ttct[1]));
            map.forEach((value, key) => {
              if (key.charAt(0) === '_') {
                datass.push({key, value});
              }
            });
            mapDB.forEach((value, key) => {
              if (key.charAt(0) === '_') {
                datassDB.push({key, value});
              }
            });
            setData(datass);
            setDataDB(datassDB);
            setData1(res.data.ttct_detail.filter(x => x.bucong_yn === '0'));
            setDataDB1(res.data.ttct_detail.filter(x => x.bucong_yn === '1'));
          }
          dispatch(HideGlobalLoading);
        }
      })
      .catch(error => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  useEffect(() => {
    getData(moment(date).format('YYYYMM'));
  }, [date]);

  const fetchItems = () => {
    // const arrT = date.split('-');
    getData(moment(date).format('YYYYMM'));
    dispatch(
      fetchLanguageAction({
        token: tokenLogin,
        machine_id: deviceId,
      }),
    );
  };

  //set language
  const renderItemss = ({item, index}) => {
    let tempStyle = null;
    switch (item.hol_type) {
      case 'SUN':
        tempStyle = styles.modalOneRecord4;
        break;
      case 'HOL':
        tempStyle = styles.modalOneRecord3;
        break;
      default:
        tempStyle = index % 2 ? styles.modalOneRecord1 : styles.modalOneRecord2;
    }
    return (
      <View style={tempStyle}>
        <Text style={styles.modalOneCol1}>{item.date_label}</Text>
        <Text style={styles.modalOneCol2}>
          {item.time_in === '0' ? (
            '--:--'
          ) : (
            <RenderHightLineHPDQ
              stringText={item.time_in}
              color={item.color_timein}
            />
          )}{' '}
          -{' '}
          {item.time_out === '0' ? (
            '--:--'
          ) : (
            <RenderHightLineHPDQ
              stringText={item.time_out}
              color={item.color_timeout}
            />
          )}
        </Text>
        <Text style={styles.modalOneCol3}>{item.wt}</Text>
        <Text style={styles.modalOneCol4}>{item.ot}</Text>
        <Text style={styles.modalOneCol4}>{item.total}</Text>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <OneFieldKeyValue
        keyName={item.key.charAt(1).toUpperCase() + item.key.slice(2)}
        value={item.value}
        key={index}
      />
    );
  };

  const ChuaBu = () => {
    return (
      <Block flex>
        <Block
          paddingRight={10}
          paddingLeft={10}
          margin={10}
          backgroundColor={data.length > 0 ? Color.white : null}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={fetchItems}
            refreshing={false}
            extraData={data}
            ListEmptyComponent={() => (
              <Block alignCenter justifyCenter marginTop={20}>
                <Text>Không có dữ liệu !</Text>
              </Block>
            )}
          />
        </Block>
        {data1.length > 0 ? (
          <>
            <Block
              flex={IsShow ? 1 : 0}
              backgroundColor={Color.white}
              radius={5}
              // margin={10}
              marginRight={10}
              marginLeft={10}
              marginTop={0}
              marginBottom={20}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  setIsShow(!IsShow);
                }}>
                <Text
                  style={{
                    padding: 10,
                    flex: 1,
                    fontWeight: 'bold',
                    color: Color.mainColor,
                    textTransform: 'uppercase',
                  }}>
                  Chi tiết công tháng
                </Text>
                <Icon_next color={Color.titleColor} style={{marginRight: 10}} />
              </TouchableOpacity>
              {IsShow ? (
                <View style={styles.modalBodyView}>
                  <View style={styles.modalOneRecordHeader}>
                    <Text style={styles.modalOneCol1}>Ngày</Text>
                    <Text style={styles.modalOneCol2}>Vào - ra</Text>
                    <Text style={styles.modalOneCol3}>Giờ làm</Text>
                    <Text style={styles.modalOneCol4}>Tăng ca</Text>
                    <Text style={styles.modalOneCol5}>Tổng</Text>
                  </View>
                  <FlatList
                    data={data1}
                    renderItem={renderItemss}
                    keyExtractor={item => item.car_date}
                    ListEmptyComponent={() => (
                      <Block alignCenter justifyCenter marginTop={20}>
                        <Text>Không có dữ liệu !</Text>
                      </Block>
                    )}
                  />
                </View>
              ) : null}
            </Block>
          </>
        ) : null}
      </Block>
    );
  };

  const DaBu = () => {
    return (
      <Block flex>
        <Block
          paddingRight={10}
          paddingLeft={10}
          margin={10}
          backgroundColor={dataDB.length > 0 ? Color.white : null}>
          <FlatList
            data={dataDB}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={fetchItems}
            refreshing={false}
            extraData={dataDB}
            ListEmptyComponent={() => (
              <Block alignCenter justifyCenter marginTop={20}>
                <Text>Không có dữ liệu !</Text>
              </Block>
            )}
          />
        </Block>
        {data1.length > 0 ? (
          <>
            <Block
              flex={IsShow ? 1 : 0}
              backgroundColor={Color.white}
              radius={5}
              marginRight={10}
              marginLeft={10}
              marginTop={0}
              marginBottom={20}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  setIsShow(!IsShow);
                }}>
                <Text
                  style={{
                    padding: 10,
                    flex: 1,
                    fontWeight: 'bold',
                    color: Color.mainColor,
                    textTransform: 'uppercase',
                  }}>
                  Chi tiết công tháng
                </Text>
                <Icon_next color={Color.titleColor} style={{marginRight: 10}} />
              </TouchableOpacity>
              {IsShow ? (
                <View style={styles.modalBodyView}>
                  <View style={styles.modalOneRecordHeader}>
                    <Text style={styles.modalOneCol1}>Ngày</Text>
                    <Text style={styles.modalOneCol2}>Vào - ra</Text>
                    <Text style={styles.modalOneCol3}>Giờ làm</Text>
                    <Text style={styles.modalOneCol4}>Tăng ca</Text>
                    <Text style={styles.modalOneCol5}>Tổng</Text>
                  </View>
                  <FlatList
                    data={dataDB1}
                    renderItem={renderItemss}
                    keyExtractor={item => item.car_date}
                    ListEmptyComponent={() => (
                      <Block alignCenter justifyCenter marginTop={20}>
                        <Text>Không có dữ liệu !</Text>
                      </Block>
                    )}
                  />
                </View>
              ) : null}
            </Block>
          </>
        ) : null}
      </Block>
    );
  };
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <Modal visible={sts} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalHeaderView}
            activeOpacity={0.7}
            onPress={() => {
              setIsShow(!IsShow);
            }}>
            <Text style={styles.modalHeaderText}>CHI TIẾT CÔNG THÁNG</Text>
          </TouchableOpacity>
          <View style={styles.modalBodyView}>
            <View style={styles.modalOneRecordHeader}>
              <Text style={styles.modalOneCol1}>Ngày</Text>
              <Text style={styles.modalOneCol2}>Vào - ra</Text>
              <Text style={styles.modalOneCol3}>Giờ làm</Text>
              <Text style={styles.modalOneCol4}>Tăng ca</Text>
              <Text style={styles.modalOneCol5}>Tổng</Text>
            </View>
            <FlatList
              data={data1}
              renderItem={renderItemss}
              keyExtractor={item => item.car_date}
            />
          </View>
          <View style={styles.modalFooterView}>
            <TouchableOpacity
              style={styles.modalbtnClose}
              onPress={() => {
                setSts(!sts);
              }}>
              <Text style={styles.modalbtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          'HPHRIN003',
          dataMenuMBHRs.filter(x => x.menu_cd === 'HPHRIN003')[0].p_pk,
        )}
      </TVSHeader>

      <Block backgroundColor={Color.gray} flex>
        <Block shadow margin={10} radius={8} backgroundColor={Color.gray}>
          <Button
            nextScreen={() => setShow(true)}
            row
            alignCenter
            padding={10}
            justifyContent={'space-between'}>
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text
              size={14}
              paddingRight={20}
              center
              color={Color.mainColor}
              flex
              paddingLeft={10}
              height={60}>
              Tháng {moment(date).format('MM-YYYY')}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date(date)}
            okButton="Chọn"
            cancelButton="Huỷ"
            enableAutoDarkMode={Platform.OS === 'ios' ? true : false}
          />
        )}
        <Tab.Navigator tabBar={props => <TabBar {...props} />}>
          <Tab.Screen
            name="Chưa bù công"
            children={props => <ChuaBu {...props} />}
          />
          <Tab.Screen
            name="Đã bù công"
            children={props => <DaBu {...props} />}
          />
        </Tab.Navigator>
      </Block>
    </Block>
  );
};

export default CongThang;
