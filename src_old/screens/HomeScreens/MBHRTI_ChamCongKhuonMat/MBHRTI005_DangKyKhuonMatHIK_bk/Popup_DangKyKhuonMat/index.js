import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  ScrollView,
  PermissionsAndroid,
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
// import ImagePicker from 'react-native-image-picker';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup';
import TVSSelect from '../../../../../components/Tvs/Select';
import Button from '../../../../../components/Button';
import Block from '../../../../../components/Block';
import ShowError from '../../../../../services/errors';
// import {
//   HideGlobalLoading,
//   ShowGlobalLoading,
// } from '../../../../services/redux/GlobalLoading/action';
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
    backgroundColor: Color.inputBackgroundColor,
    padding: 10,
    borderRadius: 10,
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
  field: {
    fontSize: 15,
    color: '#527a7a',
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  top: {
    flex: 1,
    backgroundColor: Color.mainColor,
  },
  bottom: {
    flex: 1,
    backgroundColor: Color.mainColor,
  },
  mainContent: {
    padding: 10,
    borderRadius: 5,
    width: 400,
    backgroundColor: Color.white,
  },
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
  body: {},
  oneFieldQues: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F3F6F9',
    // marginBottom: 5,
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
    backgroundColor: Color.mainColor,
    borderRadius: 5,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
    margin: 5,
  },
  btnUpload: {
    backgroundColor: Color.green,
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
    borderRadius: 5,
    backgroundColor: Color.inputBackgroundColor,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textErr: {
    color: 'red',
    textAlign: 'right',
  },
  checkbox: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.mainColor,
  },
  viewCheckbox: {
    margin: 10,
    height: 30,
    width: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.mainColor,
  },
});

const TVSControlPopupRegisterFace = ({
  isShow,
  onHide,
  children,
  title,
  maxHeight = 550,
  minHeight,
  backgroundColor = 'white',
  arrayWS,
  arrayAG,
  arrayMachine,
  empInfo,
}) => {
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  const [image, setImage] = useState(empInfo.image);
  const [proccess, setProccess] = useState('0');
  const [groupInfo, setGroupInfo] = useState(
    arrayAG.filter(x => x.code == empInfo.group_pk),
  );
  const [arrMachine, setArrMachine] = useState(arrayMachine);
  const tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );

  const OptionsImage = {
    maxWidth: 450,
    maxHeight: 600,
    quality: 1,
    cameraType: 'back',
    includeBase64: true,
    mediaType: 'photo',
    presentationStyle: 'fullScreen',
  };
  const onChangeImage = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Thông báo',
            message: 'Xin hãy cấp quyền truy cập camera cho ứng dụng.',
            buttonNegative: 'Hủy bỏ',
            buttonPositive: 'Xác nhận',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Lựa chọn',
            '',
            [
              {
                text: 'Chụp ảnh',
                onPress: () => {
                  onTakePhoto('camera');
                },
              },
              {
                text: 'Chọn hình từ thư viện',
                onPress: () => {
                  onTakePhoto('library');
                },
              },
            ],
            {cancelable: true},
          );
        } else {
          Alert.alert(
            'Thông báo',
            'Xin hãy cấp quyền truy cập camera cho ứng dụng.',
            [{text: 'Đóng'}],
          );
        }
      } else {
        //onTakePhoto();
        Alert.alert(
          'Lựa chọn',
          '',
          [
            {
              text: 'Chụp ảnh',
              onPress: () => {
                onTakePhoto('camera');
              },
            },
            {
              text: 'Chọn hình từ thư viện',
              onPress: () => {
                onTakePhoto('library');
              },
            },
          ],
          {cancelable: true},
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const onTakePhoto = type => {
    if (type == 'camera') {
      launchCamera(OptionsImage, res => {
        if (!res.didCancel) {
          setImage(res.assets[0].base64);
          onSave(res.assets[0].base64);
        }
      });
    } else if (type == 'library') {
      launchImageLibrary(OptionsImage, res => {
        if (res.didCancel) {
        } else {
          setImage(res.assets[0].base64);
          onSave(res.assets[0].base64);
        }
      });
    }
  };

  const onRegister = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
        'content-type': 'application/json',
      },
    };
    const apiFunction = 'Face/RegisterUser';

    setProccess('1');
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // if (machineInfo.length > 0) {
        setProccess('1');
        let flag = '0';
        Alert.alert(
          'Đăng ký khuôn mặt',
          'Bạn có muốn đăng ký không?',
          [
            {
              text: 'Hủy bỏ',
              onPress: () => {
                console.log('Cancel Pressed');
                setProccess('0');
              },
              style: 'cancel',
            },
            {
              text: 'Xác nhận',
              onPress: () => {
                if (groupInfo.length > 0) {
                  groupInfo.map(function (item) {
                    if (
                      arrMachine.filter(x => x.parrent_pk == item.code).length >
                      0
                    ) {
                      arrMachine
                        .filter(x => x.parrent_pk == item.code)
                        .map(function (x) {
                          const params = JSON.stringify({
                            MachineIp: x.code_nm,
                            Password: x.password,
                            empId: empInfo.emp_id,
                            name: empInfo.full_name,
                            hasPhoto: empInfo.hasphoto,
                            gender: empInfo.gender,
                            bornTime: empInfo.borntime,
                            FDID: empInfo.fdid,
                          });
                          let urlPost = '';
                          urlPost = x.url_ws + apiFunction;
                          axios
                            .post(
                              urlPost,
                              params,
                              {
                                headers: {
                                  'content-type': 'application/json',
                                },
                              },
                              axiosConfig,
                            )
                            .then(res => {
                              setProccess('2');
                              arrMachine.map(obj =>
                                obj.code === x.code
                                  ? {...obj, status: 'Hoàn thành'}
                                  : obj,
                              );
                              flag = '1';
                            })
                            .catch(err => {
                              setProccess('3');
                              arrMachine.map(obj =>
                                obj.code === x.code
                                  ? {...obj, status: 'Thất bại'}
                                  : obj,
                              );
                              console.log('err ', err);
                            });
                        });
                    } else {
                      setProccess('3');
                    }
                  });
                } else {
                  setProccess('3');
                }
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        setProccess('3');
        ShowError('No internet');
      }
    });
  };
  const onSave = imageBase64 => {
    setProccess('0');
    Alert.alert(
      'Thông báo',
      'Bạn có muốn sao lưu?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                sysFetch2(
                  API,
                  {
                    pro: 'UPDHRTI0050100',
                    in_par: {
                      p1_varchar2: 'UPDATE',
                      p2_varchar2: empInfo.pk, //thr_emp_pk
                      p3_varchar2: imageBase64, //image
                    },
                    out_par: {
                      p1_varchar2: 'message',
                    },
                  },
                  tokenLogin,
                )
                  .then(rs => {
                    if (rs.result === 'S') {
                      Alert.alert('Thông báo', 'Cập nhật hình ảnh thành công');
                    } else {
                      Alert.alert(
                        'Thông báo',
                        'Cập nhật hình ảnh thất bại. ' + rs.errorData,
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert(
                      'Thông báo',
                      'Cập nhật hình ảnh thất bại. ' + error,
                    );
                  });
              } else {
                ShowError('No internet');
              }
            });
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
        <HideArea onHide={onHide} />
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
            <TouchableOpacity onPress={onHide}>
              <Icon size={20} color={Color.mainColor} name={'close'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
              maxHeight,
              minHeight,
            }}>
            <View style={styles.body}>
              <View style={styles.viewInfo}>
                <View>
                  <Text style={styles.fullName}>{empInfo.full_name}</Text>
                  <Text style={styles.field}>
                    Mã nhân viên: {empInfo.emp_id}
                  </Text>
                  <Text style={styles.field}>
                    Mã chấm công: {empInfo.id_num}
                  </Text>
                </View>
              </View>
              <View style={styles.viewPicture}>
                <TouchableOpacity onPress={onChangeImage}>
                  <Image
                    style={styles.picture}
                    source={{
                      uri:
                        image.length > 0
                          ? 'data:image/png;base64,' + image
                          : defaultAvatar,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {/* <View>
                <Text>Server</Text>
                <Button
                  nextScreen={() => setModalServerVisible(true)}
                  row
                  style={{
                    padding: 8,
                    // marginTop: 5,
                    backgroundColor: Color.gray,
                    justifyContent: 'center',
                    borderRadius: 8,
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.16,
                    shadowRadius: 6,
                    elevation: 3,
                  }}>
                  <Block flex justifyCenter>
                    <Text
                      numberOfLines={1}
                      size={16}
                      style={{color: Color.mainColor}}>
                      {labelServer}
                    </Text>
                  </Block>
                  <Block justifyCenter>
                    <Icon
                      name={'arrow-down-drop-circle-outline'}
                      color={Color.mainColor}
                      size={24}
                    />
                  </Block>
                </Button>
                {/* {modalServer}
                <TVSSelect
                  isShow={isShowServer}
                  data={arrServer}
                  onSelected={item => {
                    setIsShowServer(false);
                    setCurrentServer(item);
                  }}
                />
              </View> */}
              <View
                style={{
                  paddingTop: 10,
                  zIndex: 2,
                }}>
                <Text>Nhóm máy chấm công</Text>
              </View>
              <View
                style={{
                  backgroundColor: Color.inputBackgroundColor,
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}
                paddingVertical={10}
                marginTop={5}>
                <ScrollView maxHeight={55} minHeight={20}>
                  {groupInfo.length > 0 ? (
                    <View>
                      <Text style={{paddingBottom: 5}}>
                        {groupInfo[0].code_nm}
                      </Text>
                      {arrMachine
                        .filter(x => x.parrent_pk == groupInfo[0].code)
                        .map(item => (
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{paddingLeft: 10, flex: 2}}>
                              {item.machine_name}
                            </Text>
                            <Text style={{flex: 1}}>{item.status}</Text>
                          </View>
                        ))}
                    </View>
                  ) : null}
                </ScrollView>
              </View>
            </View>
            {proccess == '0' ? (
              <View marginTop={5} alignItems={'center'}>
                <Text> </Text>
              </View>
            ) : (
              <View marginTop={5} alignItems={'center'}>
                {proccess == '1' ? (
                  <Text style={{color: 'goldenrod'}}>Đang xử lý</Text>
                ) : null}
                {proccess == '2' ? (
                  <Text style={{color: 'green'}}>Hoàn thành</Text>
                ) : null}
                {proccess == '3' ? (
                  <Text style={{color: 'red'}}>Tải lên thất bại</Text>
                ) : null}
              </View>
            )}
          </View>

          <View
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              backgroundColor: 'rgba(00,00,00,.03)',
              justifyContent: 'center',
            }}>
            {/* <TVSButton
              icon={'content-save'}
              type={'primary'}
              buttonStyle={'2'}
              onPress={() => {
                onSave();
              }}>
              Sao lưu
            </TVSButton> */}
            <TVSButton
              icon={'upload'}
              type={'success'}
              buttonStyle={'2'}
              onPress={() => {
                onRegister();
                // onCheckAG();
                // onTest();
              }}>
              Tải lên
            </TVSButton>
            <TVSButton
              type={'danger'}
              buttonStyle={'2'}
              icon={'close'}
              onPress={onHide}>
              Đóng lại
            </TVSButton>
          </View>
        </AMT.View>
        <HideArea onHide={onHide} />
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

export default TVSControlPopupRegisterFace;
