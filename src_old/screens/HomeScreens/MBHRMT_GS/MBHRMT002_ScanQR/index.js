/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TVSHeader from '../../../../components/Tvs/Header';
import Block from '../../../../components/Block';
import sysFetch from '../../../../services/fetch_v1';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import TVSButton from '../../../../components/Tvs/Button';
import QRCodeScanner from 'react-native-qrcode-scanner';

import TVSFieldSet from '../../../../components/Tvs/TVSFieldSet';
import TVSTextInput from '../../../../components/Tvs/TVSTextInput';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup2';
import moment from 'moment';
import {min} from 'lodash';
import TVSList2 from '../../../../components/Tvs/TVSList2';

const MBHRMT002_ScanQR = ({navigation: {goBack}}) => {
  //Start: Orientation
  const [orientation, setOrientation] = useState('UNKNOW');
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get('window').height,
  );
  const isPortrait = () => {
    const dim = Dimensions.get('screen');
    setScreenWidth(dim.width);
    setScreenHeight(dim.height);
    return dim.height >= dim.width;
  };
  const isLandscape = () => {
    const dim = Dimensions.get('screen');
    setScreenWidth(dim.width);
    setScreenHeight(dim.height);
    return dim.width >= dim.height;
  };
  Dimensions.addEventListener('change', () => {
    checkOrientation();
  });
  const checkOrientation = () => {
    if (isPortrait()) {
      setOrientation('PORTRAIT');
    } else if (isLandscape()) {
      setOrientation('LANDSCAPE');
    } else {
      setOrientation('UNKNOW');
    }
  };
  useEffect(() => {
    checkOrientation();
  }, [orientation]);
  //End: Orientation

  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const currentLangue = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const menu = useSelector(state => state.menuReducer.data.data.menu);
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

  const [dsDataScan, setDsDataScan] = useState([]);
  const [visibleCamera, setVisibleCamera] = useState(true);
  useEffect(() => {
    console.log('EFFECT');
    getConfigCamera();
  }, []);

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
        if (obj == 'getOneItem') {
          getOneItem(param1);
        }
        if (obj == 'getConfigCamera') {
          getConfigCamera();
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

  const [cameraType, setCameraType] = useState('back');
  const [timeOut, setTimeOut] = useState();
  const onSuccess = e => {
    console.log('log e: ', e.data);
    getOneItem(e.data);
    try {
    } catch (error) {
      Alert.alert('Thông báo', 'Quét mã thất bại. Xin thử lại.');
    }
  };

  //Start control select list
  const [dataSelect, setDataSelect] = useState([]);
  const [selectName, setSelectName] = useState('Chọn');
  const [selectPK, setSelectPK] = useState('');
  const onChangeSelect = result => {
    setSelectName(result.code_nm);
    setSelectPK(result.code);
    console.log(result);
  };

  //End control select list
  const onChangeCameraType = () => {
    console.log('click');
    switch (cameraType) {
      case 'front':
        setCameraType('back');
        break;
      case 'back':
        setCameraType('front');
        break;
      default:
        console.log('out case');
    }
  };
  const [noneAvatar, setNoneAvatar] = useState(
    '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',
  );
  const getConfigCamera = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRMT002000',
        in_par: {
          p1_varchar2: thr_emp_pk,
        },
        out_par: {
          p1_sys: 'config',
          p2_sys: 'info',
        },
      },
      tokenLogin,
    )
      .then(res => {
        if (res == 'Token Expired') {
          refreshNewToken('getConfigCamera');
        }
        if (res != 'Token Expired') {
          setDataSelect(res.data.info);
          setCameraType(res.data.config[0].cam_type);
          setTimeOut(res.data.config[0].time_out);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const getOneItem = pk => {
    sysFetch(
      API,
      {
        pro: 'SELHRMT002001',
        in_par: {
          p1_varchar2: pk,
        },
        out_par: {
          p1_sys: 'image',
          p2_sys: 'detail',
        },
      },
      tokenLogin,
    )
      .then(res => {
        if (res == 'Token Expired') {
          refreshNewToken('getOneItem', pk);
        }
        if (res != 'Token Expired') {
          let newArr = []; // copying the old datas array
          newArr.unshift({
            pk: pk,
            data_image: res.data.image,
            detail: res.data.detail,
          }); // replace e.target.value with whatever you want to change it to
          setDsDataScan(newArr);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {
            menu.filter(x => x.menu_cd === 'MBHRMT002')[0][
              currentLangue.toLowerCase()
            ]
          }
        </TVSHeader>
        <Block flex backgroundColor={Color.gray}>
          <Block
            style={{
              height: screenHeight,
              width: screenWidth,
            }}>
            {visibleCamera ? (
              <Block>
                <QRCodeScanner
                  reactivate={true}
                  reactivateTimeout={timeOut}
                  cameraType={cameraType}
                  onRead={e => onSuccess(e)}
                  showMarker={true}
                  markerStyle={{
                    position: 'relative',
                    top:
                      orientation == 'PORTRAIT'
                        ? Platform.OS == 'ios'
                          ? -100
                          : -screenHeight - screenHeight / 4
                        : 20,
                    left:
                      orientation == 'PORTRAIT'
                        ? 0
                        : Platform.OS == 'ios'
                        ? 0
                        : 0,
                    width: 200,
                    height: 150,
                    borderCurve: 'continuous',
                    borderStyle: 'dashed',
                    borderRadius: 10,
                    borderWidth: 3,
                    gap: 10,
                    z: 999,
                  }}
                  // customMarker={customMarker}
                  cameraStyle={{
                    top: Platform.OS === 'ios' ? 0 : 22,
                    left: 0,
                    height: screenHeight / 2,
                  }}
                />
              </Block>
            ) : null}
            <Block
              style={{
                width:
                  orientation == 'PORTRAIT'
                    ? screenWidth
                    : screenWidth / 2 - 30,
                height: screenHeight,
                flexDirection: 'column',
                position: 'absolute',
                top:
                  orientation == 'PORTRAIT'
                    ? visibleCamera
                      ? screenHeight / 4
                      : 0
                    : 0,
                left: visibleCamera
                  ? orientation == 'PORTRAIT'
                    ? 0
                    : screenWidth / 2.15
                  : 0,
                padding: 10,
                backgroundColor: 'white',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <Block
                style={{
                  width:
                    orientation == 'PORTRAIT'
                      ? '100%'
                      : visibleCamera
                      ? screenWidth / 2
                      : '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TVSButton
                  type={'danger'}
                  buttonStyle={'3'}
                  onPress={() => {
                    setVisibleCamera(!visibleCamera);
                  }}>
                  {visibleCamera ? 'Đóng camera' : 'Mở camera'}
                </TVSButton>
                {visibleCamera ? (
                  <TVSButton
                    buttonStyle={'3'}
                    onPress={() => {
                      onChangeCameraType();
                    }}>
                    Đổi camera
                  </TVSButton>
                ) : null}
              </Block>

              {/* <Block
                style={{width: '100%', flexDirection: 'row', marginTop: 10}}>
                {/* <View
                  style={{
                    flex: 1,
                  }}>
                  <TVSFieldSet
                    hasIcon={true}
                    icon={'information'}
                    label={'Thông tin xe'}
                    onPress={() => setModalTTX(!modalTTX)}>
                    {dataCar.map(item => (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: 10,
                        }}>
                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                          <Text>{item.title}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <Text>{item.value}</Text>
                        </View>
                      </View>
                    ))}
                  </TVSFieldSet>
                </View> 

                
                      </Block> */}

              <TVSList2
                required={true}
                label={'Chọn xe tuyến'}
                dataItem={dataSelect}
                code={selectPK}
                code_nm={selectName}
                onChangeSelect={val => onChangeSelect(val)}
              />

              <TVSFieldSet label={'Thông tin xác thực'}>
                {dsDataScan.map(item => (
                  <ScrollView>
                    <View
                      style={{
                        width: '100%',
                        flexDirection:
                          orientation === 'PORTRAIT' ? 'column' : 'row',
                        alignItems:
                          orientation === 'PORTRAIT' ? 'center' : 'center',
                        paddingHorizontal: 10,
                      }}>
                      <Image
                        style={{
                          width: orientation === 'PORTRAIT' ? 130 : 70,
                          height: orientation === 'PORTRAIT' ? 130 : 70,
                          borderRadius: 100,
                          backgroundColor: 'red',
                        }}
                        source={{
                          uri:
                            item.data_image[0].image.length == 0
                              ? 'data:image/png;base64, ' + noneAvatar
                              : 'data:image/png;base64, ' +
                                item.data_image[0].image,
                        }}
                      />

                      <View
                        style={{
                          marginLeft: 5,
                          flex: orientation === 'PORTRAIT' ? 0 : 1,
                          alignItems:
                            orientation === 'PORTRAIT'
                              ? 'center'
                              : 'flex-start',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: orientation === 'POTRAIT' ? 22 : 18,
                          }}>
                          {item.detail[0].full_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: orientation === 'POTRAIT' ? 20 : 18,
                          }}>
                          {item.detail[0].org_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: orientation === 'POTRAIT' ? 22 : 18,
                          }}>
                          {item.detail[0].emp_id}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: orientation === 'PORTRAIT' ? 0 : 1,
                          alignItems: 'flex-end',
                          justtifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 14}}>
                          {moment(new Date()).format('DD-MM-YYYY hh:mm')}
                        </Text>
                        <View
                          style={{
                            padding: 4,
                            borderRadius: 10,
                            borderColor: item.detail[0].color,
                            borderWidth: 1,
                          }}>
                          <Text
                            style={{
                              color: item.detail[0].color,
                              fontWeight: 'bold',
                              fontSize: orientation === 'POTRAIT' ? 22 : 18,
                            }}>
                            {item.detail[0].status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                ))}
              </TVSFieldSet>

              {/* </ScrollView> */}
            </Block>
          </Block>
        </Block>
      </Block>
    </>
  );
};
export default MBHRMT002_ScanQR;
