import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  PermissionsAndroid,
  Dimensions,
  FlatList,
} from 'react-native';
import {Color} from '../../../../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as AMT from 'react-native-animatable';
import TVSButton from '../../../../../components/Tvs/Button';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = 'requestTimeout';
import NetInfo from '@react-native-community/netinfo';
import sysFetch from '../../../../../services/fetch';
import sysFetch2 from '../../../../../services/fetch/fetch2';
import ShowError from '../../../../../services/errors';
import {updateUserAction} from '../../../../../actions';
import Button from '../../../../../components/Button';
import RNRestart from 'react-native-restart';
import {APP_VERSION} from '../../../../../config/Pro';
const defaultAvatar =
  'data:image/png;base64,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';

const styles = StyleSheet.create({
  btnChupAnhTouch: {
    padding: 10,
    borderColor: Color.btnMain,
    borderWidth: 1,
    backgroundColor: Color.inputBackgroundColor,
    borderRadius: 5,
    marginTop: 10,
  },
  btnChupAnhText: {
    color: Color.mainColor,
  },
  viewInfo: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  viewPicture: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  picture: {
    width: 180,
    borderRadius: 10,
    borderColor: Color.grayPlahoder,
    borderWidth: 1,
    resizeMode: 'contain',
    height: 240,
  },
  label: {
    fontSize: 15,
  },
  field: {
    fontSize: 15,
    paddingLeft: 10,
  },
  body: {},
  CheckBoxE: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.primaryButton2,
    backgroundColor: Color.primaryButton2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CheckBoxD: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.mainColor,
  },
});

const TVSControlPopupMachine = ({
  isShow,
  onHide,
  flag,
  children,
  title,
  maxHeight = Dimensions.get('screen').height,
  minHeight,
  onSelect,
  backgroundColor = 'white',
}) => {
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  let [dataMachine, setDataMachine] = useState([]);

  useEffect(() => {
    console.log('popup machine');
    onLoadData();
  }, [flag]);

  const onLoadData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRTI0054100',
        in_par: {
          p1_varchar2: userPk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    ).then(rs => {
      if (rs == 'Token Expired') {
        refreshNewToken('onLoadData');
      }
      if (rs != 'Token Expired') {
        setDataMachine(rs.data.data);
      }
    });
  };
  const CheckMachine = item => {
    let newArr = [...dataMachine];
    let flagChk = item.sel_yn == 'Y' ? 'N' : 'Y';
    newArr.forEach(function (dataItem) {
      if (dataItem.pk == item.pk) {
        dataItem.sel_yn = flagChk;
      }
    });
    setDataMachine(newArr);
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
  const onConfirmSelectMachine = () => {
    let arrData = [];
    dataMachine.forEach(function (item) {
      if (item.sel_yn == 'Y') {
        arrData.push(item);
      }
    });
    Alert.alert(
      'Thông báo',
      'Bạn có muốn đăng ký xuống máy chấm công không?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => {
            console.log('Cancel Pressed');
          },
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            onSelect(arrData);
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(00,00,00,.1)',
        }}>
        <HideArea onHide={() => onHide()} />
        <AMT.View
          duration={300}
          animation={'fadeInUp'}
          style={{
            marginHorizontal: 10,
            backgroundColor: backgroundColor,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
          }}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
              backgroundColor: 'rgba(00,00,00,.03)',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}>
            <PopupTitle>{title}</PopupTitle>
            <TouchableOpacity onPress={() => onHide()}>
              <Icon size={20} color={Color.mainColor} name={'close'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingTop: 10,
              paddingLeft: 20,
              paddingRight: 20,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
              maxHeight,
              minHeight,
            }}>
            <View>
              <View
                style={{
                  paddingTop: 10,
                  zIndex: 2,
                }}>
                <Text>Máy chấm công</Text>
              </View>
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 3,
                  borderColor: Color.inputBackgroundColor,
                  flexDirection: 'row',
                  maxHeight: Dimensions.get('screen').height / 1.6,
                  minHeight: Dimensions.get('screen').height / 1.6,
                  marginTop: 5,
                }}>
                {dataMachine.length > 0 ? (
                  <FlatList
                    refreshing={false}
                    data={dataMachine}
                    renderItem={({item}) => {
                      return (
                        <View flexDirection={'row'} marginBottom={10}>
                          <Button
                            nextScreen={() => {
                              CheckMachine(item);
                            }}
                            row
                            paddingLeft={5}
                            alignCenter>
                            <View
                              style={
                                item.sel_yn == 'Y'
                                  ? styles.CheckBoxE
                                  : styles.CheckBoxD
                              }>
                              {item.sel_yn == 'Y' ? (
                                <Icon
                                  name={'check'}
                                  color={Color.mainColor}
                                  size={25}
                                />
                              ) : null}
                            </View>
                          </Button>
                          <View
                            style={{
                              paddingLeft: 10,
                              alignSelf: 'center',
                              flex: 2,
                            }}>
                            <Text>{item.machine_nm}</Text>
                          </View>
                          <View
                            style={{
                              paddingLeft: 10,
                              alignSelf: 'center',
                              flex: 1,
                            }}></View>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : null}
              </View>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              backgroundColor: 'rgba(00,00,00,.03)',
              justifyContent: 'center',
            }}>
            <TVSButton
              icon={'check'}
              type={'primary'}
              buttonStyle={'2'}
              onPress={() => {
                onConfirmSelectMachine();
              }}>
              Xác nhận
            </TVSButton>
            <TVSButton
              type={'danger'}
              buttonStyle={'2'}
              icon={'close'}
              onPress={() => onHide()}>
              Đóng lại
            </TVSButton>
          </View>
        </AMT.View>
        <HideArea onHide={() => onHide()} />
      </View>
    </Modal>
  );
};
const PopupTitle = ({children}) => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: Color.mainColor,
        }}>
        {children}
      </Text>
    </View>
  );
};
const HideArea = ({onHide}) => {
  return <TouchableOpacity style={{flex: 1}} onPress={onHide} />;
};

export default TVSControlPopupMachine;
