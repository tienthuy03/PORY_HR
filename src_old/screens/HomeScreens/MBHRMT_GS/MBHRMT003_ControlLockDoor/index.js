import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TVSHeader from '../../../../components/Tvs/Header';
import {setHeaderChil2} from '../../../../Language';
import Block from '../../../../components/Block';
import OneItem from '../OneItem';
import sysFetch from '../../../../services/fetch_v1';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../services/redux/GlobalLoading/action';
import {
  screenHeight,
  screenWidth,
} from 'react-native-calendars/src/expandableCalendar/commons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {APP_VERSION} from '../../../../config/Pro';
import Button from '../../../../components/Button';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = 'requestTimeout';
const MBHRMT003_ControlLockDoor = ({navigation: {goBack}}) => {
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const loginReducers = useSelector(state => state.loginReducers);
  const menuReducer = useSelector(state => state.menuReducer);
  const Color = useSelector(s => s.SystemReducer.theme);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  let thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  let full_name = useSelector(state => state.loginReducers.data.data.full_name);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let dataMenuMBHRs;
  let language;
  try {
    language = loginReducers.data.data.user_language;
    dataMenuMBHRs = menuReducer.data.data.menu;
  } catch (error) {
    console.log(error);
  }
  const styles = StyleSheet.create({
    fieldsetTitle: {
      position: 'absolute',
      top: -12,
      backgroundColor: Color.white,
      left: 10,
    },
    oneItem: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 10,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    labelDt: {
      color: Color.mainColor,
      fontWeight: 'bold',
      marginBottom: 5,
    },
  });

  const [modalVisibleLock, setModalVisibleLock] = useState(false);
  const [dataLock, setDataLock] = useState([]);
  const [selectedLock, setSelectedLock] = useState([]);
  const [selectedLockNM, setSelectedLockNM] = useState('--Chọn khoá cửa--');
  const [flagLoading, setFlagLoading] = useState('');
  const [adminUBIO, setAdminUBIO] = useState([]);
  const [dataMachine, setDataMachine] = useState([]);
  const [dataLog, setDataLog] = useState([]);

  const CheckConnect = (pk, ip) => {
    console.log(pk, '|', ip);

    OnUpdateArray(pk, '0');
    let ipCheck = 'http://' + ip + '';
    // setTimeout(reject.bind(null, timeout_err), timeout);
    fetch(ipCheck)
      .then(response => {
        console.log('response ', response);
        if (response.status === 200) {
          OnUpdateArray(pk, 'S');
          console.log('success');
        } else {
          OnUpdateArray(pk, 'F');
          console.warn('error');
        }
      })
      .catch(error => {
        // OnUpdateArray(pk, 'F');
        console.log('network error catch: ' + error);
      });
    setTimeout(function () {
      OnUpdateArray(pk, 'F');
    }, 3000);

    let timeout = 3000;
    let timeout_err = {
      ok: false,
      status: 408,
    };
    return new Promise(function (resolve, reject) {
      fetch(ipCheck)
        .then(response => {
          console.log('response ', response);
          if (response.status === 200) {
            OnUpdateArray(pk, 'S');
            console.log('success');
          } else {
            OnUpdateArray(pk, 'F');
            console.warn('error');
          }
        })
        .catch(() => {
          alert('timeout.');
        });
      setTimeout(reject.bind(null, timeout_err), timeout);
    });
  };

  useEffect(() => {
    getData();
  }, []);
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       console.log('This will run every second!');
  //       console.log(dataMachine.length);
  //       if (dataMachine.length > 0) {
  //         dataMachine.forEach(function (item) {
  //           CheckConnect(item.pk, item.machine_ip);
  //         });
  //       }
  //     }, 20000);
  //     return () => clearInterval(interval);
  //   }, []);
  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRMT003000',
        in_par: {
          p1_varchar2: userPk,
          p2_varchar2: thr_emp_pk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'lst_machine',
          p2_sys: 'lst_admin_ubio',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData', '', '');
        }
        if (rs != 'Token Expired') {
          console.log(rs.data.lst_machine);
          console.log(rs.data.lst_admin_ubio);
          setDataLock(rs.data.lst_machine);
          setAdminUBIO(rs.data.lst_admin_ubio[0]);
          getDataLog();
          //   if (rs.results == 'S') {
          //     // hanleApproveInfo(rs.data.ds_nguoipheduyet);
          //     setdataPhongBan(rs.data.lst_org);
          //     setDataOT(rs.data.lst_time_ot);
          //   }
        }
      })
      .catch(error => {
        console.log('error getData');
        console.log(error);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: Color.gray,
          padding: 10,
          borderRadius: 10,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <View>
            <Text
              style={{
                color: Color.mainColor,
                marginBottom: 5,
              }}>
              {item.action_type}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text>{item.full_nm}</Text>
            </View>
            <View>
              <Text>{item.crt_dt}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const OnUpdateArray = (itemPk, status) => {
    console.log(itemPk, status);
    let newLst = [...dataMachine];
    newLst = newLst.map(obj => {
      if (obj.pk === itemPk) {
        {
          return {...obj, status: status};
        }
      } else {
        return obj;
      }
    });
    setDataMachine(newLst);
  };

  const modalLock = (
    <TVSControlPopup
      title={'Chọn khoá'}
      isShow={modalVisibleLock}
      onHide={() => setModalVisibleLock(false)}>
      <FlatList
        data={dataLock}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateLock(item);
              }}
              style={{
                backgroundColor: '#F3F6F9',
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}>
              <Text>{item.lock_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  const getStateLock = result => {
    console.log(result);
    setSelectedLock(result);
    setSelectedLockNM(result.lock_nm);
    setModalVisibleLock(false);
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${tokenLogin}`,
      'content-type': 'application/json',
    },
  };
  const OnControl = obj => {
    console.log(obj);
    console.log(selectedLock);
    console.log(adminUBIO);
    setFlagLoading(obj);
    if (selectedLock.length == 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn khoá cửa', [{text: 'Đóng'}]);
      setFlagLoading('');
    } else {
      let param = '';
      param =
        '{"param":{"TerminalID":"' +
        selectedLock.ubio_terminal_id +
        '","Option":"' +
        obj +
        '","AdminID":"' +
        adminUBIO.admin_id +
        '","Password":"' +
        adminUBIO.password +
        '"}}';

      let urlPost = '';
      urlPost = selectedLock.ubio_url_service + '/' + 'ControlDoor';
      console.log(urlPost);
      axios
        .post(
          urlPost,
          param,
          {
            headers: {
              'content-type': 'application/json',
            },
          },
          axiosConfig,
        )
        .then(res => {
          console.log('res UBIO ', JSON.parse(res.data.d).Result.ResultCode);
          if (JSON.parse(res.data.d).Result.ResultCode == 0) {
            OnSaveLog(obj, selectedLock.pk);
          }
        })
        .catch(err => {
          console.log('err UBio ', err);
          setFlagLoading('');
        });
    }
  };
  const OnSaveLog = (action_type, lockPk) => {
    sysFetch(
      API,
      {
        pro: 'UPDHRMT003000',
        in_par: {
          p1_varchar2: 'UPDATE',
          p2_varchar2: thr_emp_pk,
          p3_varchar2: action_type,
          p4_varchar2: lockPk,
          p5_varchar2: APP_VERSION,
          p6_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: 'message',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log(rs);
        getDataLog();
        setFlagLoading('');
        // if (rs.results === 'S') {
        //   Alert.alert('Thông báo', 'Cập nhật số thẻ thành công');
        //   empInfo.card_num = currentCardNo;
        // } else {
        //   Alert.alert(
        //     'Thông báo',
        //     'Cập nhật số thẻ thất bại. ' + rs.errorData,
        //   );
        // }
      })
      .catch(error => {
        console.log(error);
        setFlagLoading('');
      });
  };
  const getDataLog = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRMT003001',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData', '', '');
        }
        if (rs != 'Token Expired') {
          console.log(rs.data.data);
          setDataLog(rs.data.data);
          // setDataLock(rs.data.lst_machine);
          // setAdminUBIO(rs.data.lst_admin_ubio[0]);
          //   if (rs.results == 'S') {
          //     // hanleApproveInfo(rs.data.ds_nguoipheduyet);
          //     setdataPhongBan(rs.data.lst_org);
          //     setDataOT(rs.data.lst_time_ot);
          //   }
        }
      })
      .catch(error => {
        console.log('error getData');
        console.log(error);
      });
  };
  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {setHeaderChil2(
            language,
            dataMenuMBHRs,
            'MBHRMT003',
            dataMenuMBHRs.filter(x => x.menu_cd === 'MBHRMT003')[0].p_pk,
          )}
        </TVSHeader>
        <Block flex backgroundColor={Color.gray}>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              backgroundColor: 'white',
              marginHorizontal: 10,
              marginVertical: 10,
              borderRadius: 8,
            }}>
            <View
              style={{
                marginHorizontal: 5,
              }}>
              <View
                border={1}
                paddingVertical={10}
                borderColor={Color.gray}
                radius={6}
                borderWidth={1.5}
                borderRadius={8}
                style={{marginHorizontal: 5, marginTop: 20}}>
                <View row style={styles.fieldsetTitle}>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        // showPopupSelectApprove();
                      }}>
                      <Text style={{color: Color.mainColor}}>
                        Thiết bị khoá
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: Color.gray,
                    padding: 10,
                    borderRadius: 6,
                    marginHorizontal: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisibleLock(true)}
                    style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center'}}>
                      <Text color={'black'}>{selectedLockNM}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end', flex: 1}}>
                      <Icon
                        color={Color.mainColor}
                        name={'chevron-down'}
                        size={24}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        OnControl('0');
                      }}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginVertical: 5,
                        marginHorizontal: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: '#E7F2FE',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                      }}>
                      <View style={{paddingHorizontal: 5}}>
                        <Icon name={'lock-reset'} color={'#5A94E7'} size={20} />
                      </View>
                      <View style={{paddingHorizontal: 5}}>
                        <Text style={{color: '#5A94E7'}}>
                          Mở khoá và tự đóng
                        </Text>
                      </View>
                      {flagLoading == '0' ? (
                        <ActivityIndicator color="gray" />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        OnControl('1');
                      }}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginVertical: 5,
                        marginLeft: 10,
                        marginRight: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: '#E7F2FE',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                      }}>
                      <View style={{paddingHorizontal: 0}}>
                        <Icon
                          name={'lock-open-outline'}
                          color={'#5A94E7'}
                          size={20}
                        />
                      </View>
                      <View style={{paddingHorizontal: 5}}>
                        <Text style={{color: '#5A94E7'}}>Luôn mở</Text>
                      </View>
                      {flagLoading == '1' ? (
                        <ActivityIndicator color="gray" />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        OnControl('2');
                      }}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginVertical: 5,
                        marginRight: 10,
                        marginLeft: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: '#E7F2FE',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                      }}>
                      <View style={{paddingHorizontal: 5}}>
                        <Icon
                          name={'lock-outline'}
                          color={'#F64E60'}
                          size={20}
                        />
                      </View>
                      <View style={{paddingHorizontal: 5}}>
                        <Text style={{color: '#F64E60'}}>Luôn đóng</Text>
                      </View>
                      {flagLoading == '2' ? (
                        <ActivityIndicator color="gray" />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {modalLock}
            <View style={{flex: 1}}>
              <View
                style={{
                  marginHorizontal: 5,
                  borderRadius: 8,
                  flex: 1,
                }}>
                <View
                  border={1}
                  paddingVertical={10}
                  borderColor={Color.gray}
                  radius={6}
                  borderWidth={1.5}
                  borderRadius={8}
                  style={{
                    marginHorizontal: 5,
                    marginTop: 20,
                    flex: 1,
                    marginBottom: 10,
                  }}>
                  <View row style={styles.fieldsetTitle}>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          // showPopupSelectApprove();
                        }}>
                        <Text style={{color: Color.mainColor}}>
                          Thông tin mở / đóng khoá
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{marginTop: 5}}>
                    <FlatList
                      data={dataLog}
                      refreshing={false}
                      onRefresh={() => {
                        getDataLog();
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={renderItem}
                      onEndReachedThreshold={0.5}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Block>
      </Block>
    </>
  );
};
export default MBHRMT003_ControlLockDoor;
