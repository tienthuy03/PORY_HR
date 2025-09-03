import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import {setHeaderChil2} from '../../../../Language';
import {
  HRRE005DSNgayBatDau,
  HRRE005DSNgayKetThuc,
  HRRE005LoadDataRaCong,
  HRRE005SelectedVeViec,
  HRRE005SetDescription,
  HRRE005SetEndTime,
  HRRE005SetLyDoRaCong,
  HRRE005SetStartTime,
  HRRE005SetWorkDate,
  HRRE005ShowPopupVeViec,
} from '../../../../services/redux/HRRE005_RaCong/action';
import DKRC from './DangKy/DKRC';
import PopupApprove from './DangKy/Popup';
import PopupReason from './DangKy/PopupReason';
import DS from './DanhSach/DS';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const DangKyRaCong = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const menuReducer = useSelector(state => state.menuReducer);
  const loginReducers = useSelector(state => state.loginReducers);
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
        pro: 'SELHRRE0050101',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(new Date()).format('YYYYMM01'),
          p3_varchar2: moment(new Date()).format('YYYYMMDD'),
        },
        out_par: {
          p1_sys: 'data',
          p2_sys: 'approve_data',
          p3_sys: 'type',
          p4_sys: 'approve_person',
          p5_sys: 'veviec',
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
          dispatch(
            HRRE005SetStartTime({
              isShow: false,
              time: 'hh:mm',
            }),
          );
          dispatch(
            HRRE005SetEndTime({
              isShow: false,
              time: 'hh:mm',
            }),
          );
          dispatch(
            HRRE005SetLyDoRaCong({code: '0', code_nm: 'Chọn lý do ra cổng.'}),
          );
          dispatch(
            HRRE005SelectedVeViec({
              code: '0',
              code_nm: 'Chọn về việc',
            }),
          );
          dispatch(HRRE005SetDescription(''));
          dispatch(HRRE005SetWorkDate('dd/mm/yyyy'));
          dispatch(HRRE005DSNgayBatDau(moment(new Date()).format('YYYYMM01')));
          dispatch(HRRE005DSNgayKetThuc(moment(new Date()).format('YYYYMMDD')));
          dispatch(HRRE005LoadDataRaCong());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <PopupReason />
      <PopupVeViec />
      <PopupSelectTimeIn />
      <PopupSelectTimeOut />
      <PopupApprove type={1} />
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {setHeaderChil2(
            loginReducers.data.data.user_language,
            menuReducer.data.data.menu,
            'MBHRRE005',
            menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRRE005')[0]
              .p_pk,
          )}
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <TVSTab
            scrollEnabled={false}
            fullTab={true}
            data={[
              {
                id: 0,
                name: 'Đăng ký',
                screen: <DKRC />,
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

//popup ve viec
const PopupVeViec = () => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const {dataVeViec, ShowPopupVeViec} = useSelector(
    state => state.HRRE005_RaCongReducer,
  );
  const dispatch = useDispatch();
  const closePopup = () => {
    dispatch(HRRE005ShowPopupVeViec(false));
  };
  const stylevv = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 888,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    oneFieldQues: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#F3F6F9',
      marginBottom: 5,
    },
    content: {
      width: 300,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
    },
    textHeader: {
      fontSize: 20,
      color: Color.mainColor,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      marginTop: 10,
      paddingTop: 10,
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnClose: {
      backgroundColor: Color.btnForeign,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnOk: {
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnCloseText: {
      color: 'white',
    },
    input: {
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    oneField: {
      marginBottom: 10,
    },
    textErr: {
      color: 'red',
      textAlign: 'right',
    },
  });

  const renderItem = ({item}) => {
    const onSelect = () => {
      dispatch(HRRE005SelectedVeViec(item));
      closePopup();
    };
    return (
      <TouchableOpacity
        style={stylevv.oneFieldQues}
        activeOpacity={0.7}
        onPress={onSelect}>
        <Text>{item.code_nm}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TVSControlPopup
      title="Về việc"
      onHide={closePopup}
      isShow={ShowPopupVeViec}>
      <FlatList
        data={dataVeViec}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </TVSControlPopup>
  );
};

const PopupSelectTimeIn = () => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [ShowMinutes, setShowMinutes] = useState(false);
  const [ShowHours, setShowHours] = useState(false);
  const [Minute, setMinute] = useState('00');
  const [Hour, setHour] = useState('00');
  const {startTime, endTime} = useSelector(
    state => state.HRRE005_RaCongReducer,
  );
  const dispatch = useDispatch();
  const closePopup = () => {
    setTime(startTime.time);
  };
  const accept = () => {
    setTime(
      `${Hour === 'hh' ? '00' : Hour}:${Minute === 'mm' ? '00' : Minute}`,
    );
  };
  const setTime = time => {
    dispatch(HRRE005SetStartTime({time, isShow: false}));
    setShowMinutes(false);
    setShowHours(false);
  };
  const stylet = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 888,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    oneFieldQues: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#F3F6F9',
      marginBottom: 5,
    },
    content: {
      width: 300,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
    },
    textHeader: {
      fontSize: 20,
      color: Color.mainColor,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      marginTop: 10,
      paddingTop: 10,
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnClose: {
      backgroundColor: Color.btnForeign,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnOk: {
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnCloseText: {
      color: 'white',
    },
    input: {
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    oneField: {
      marginBottom: 10,
    },
    textErr: {
      color: 'red',
      textAlign: 'right',
    },
  });

  useEffect(() => {
    const temp = startTime.time.toString().split(':');
    setHour(temp[0]);
    setMinute(temp[1]);
  }, [startTime]);

  let maxHeight = 150;

  return (
    <TVSControlPopup
      isShow={startTime.isShow}
      title={'Từ giờ'}
      onHide={closePopup}
      onAccept={accept}>
      <View style={stylet.body}>
        {!ShowMinutes && !ShowHours ? (
          <>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: Color.inputBackgroundColor,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 5,
                }}
                onPress={() => {
                  setShowHours(true);
                }}>
                <Text>{Hour}</Text>
              </TouchableOpacity>
              <View>
                <Text>:</Text>
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: Color.inputBackgroundColor,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }}
                onPress={() => {
                  setShowMinutes(true);
                }}>
                <Text>{Minute}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        <View style={{maxHeight}}>
          {ShowMinutes ? (
            <>
              <View style={{marginBottom: 10}}>
                <Text>Chọn phút</Text>
              </View>
              <FlatList
                data={['00', '15', '30', '45']}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Color.inputBackgroundColor,
                        marginBottom: 1,
                      }}
                      onPress={() => {
                        setMinute(item.toString());
                        setShowMinutes(false);
                      }}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </>
          ) : null}
          {ShowHours ? (
            <>
              <View style={{marginBottom: 10}}>
                <Text>Chọn giờ</Text>
              </View>
              <FlatList
                data={[...Array(24).keys()]}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Color.inputBackgroundColor,
                        marginBottom: 1,
                      }}
                      onPress={() => {
                        setHour(
                          item < 10 ? '0' + item.toString() : item.toString(),
                        );
                        setShowHours(false);
                      }}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </>
          ) : null}
        </View>
      </View>
    </TVSControlPopup>
  );
};

const PopupSelectTimeOut = () => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [ShowMinutes, setShowMinutes] = useState(false);
  const [ShowHours, setShowHours] = useState(false);
  const [Minute, setMinute] = useState('00');
  const [Hour, setHour] = useState('00');
  const {endTime} = useSelector(state => state.HRRE005_RaCongReducer);
  const dispatch = useDispatch();
  const closePopup = () => {
    setTime(endTime.time);
  };
  const accept = () => {
    setTime(
      `${Hour === 'hh' ? '00' : Hour}:${Minute === 'mm' ? '00' : Minute}`,
    );
  };
  const setTime = time => {
    dispatch(HRRE005SetEndTime({time, isShow: false}));
    setShowMinutes(false);
    setShowHours(false);
  };
  const stylet = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 888,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    oneFieldQues: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#F3F6F9',
      marginBottom: 5,
    },
    content: {
      width: 300,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
    },
    textHeader: {
      fontSize: 20,
      color: Color.mainColor,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      marginTop: 10,
      paddingTop: 10,
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnClose: {
      backgroundColor: Color.btnForeign,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnOk: {
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnCloseText: {
      color: 'white',
    },
    input: {
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    oneField: {
      marginBottom: 10,
    },
    textErr: {
      color: 'red',
      textAlign: 'right',
    },
  });

  useEffect(() => {
    const temp = endTime.time.toString().split(':');
    setHour(temp[0]);
    setMinute(temp[1]);
  }, [endTime]);

  let maxHeight = 150;

  return (
    <TVSControlPopup
      title={'Đến giờ'}
      isShow={endTime.isShow}
      onHide={closePopup}
      onAccept={accept}>
      <View style={stylet.body}>
        {!ShowMinutes && !ShowHours ? (
          <>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: Color.inputBackgroundColor,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 5,
                }}
                onPress={() => {
                  setShowHours(true);
                }}>
                <Text>{Hour}</Text>
              </TouchableOpacity>
              <View>
                <Text>:</Text>
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: Color.inputBackgroundColor,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }}
                onPress={() => {
                  setShowMinutes(true);
                }}>
                <Text>{Minute}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        <View style={{maxHeight}}>
          {ShowMinutes ? (
            <>
              <View style={{marginBottom: 10}}>
                <Text>Chọn phút</Text>
              </View>
              <FlatList
                data={['00', '15', '30', '45']}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Color.inputBackgroundColor,
                        marginBottom: 1,
                      }}
                      onPress={() => {
                        setMinute(item.toString());
                        setShowMinutes(false);
                      }}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </>
          ) : null}
          {ShowHours ? (
            <>
              <View style={{marginBottom: 10}}>
                <Text>Chọn giờ</Text>
              </View>
              <FlatList
                data={[...Array(24).keys()]}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Color.inputBackgroundColor,
                        marginBottom: 1,
                      }}
                      onPress={() => {
                        setHour(
                          item < 10 ? '0' + item.toString() : item.toString(),
                        );
                        setShowHours(false);
                      }}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </>
          ) : null}
        </View>
      </View>
    </TVSControlPopup>
  );
};
export default DangKyRaCong;
