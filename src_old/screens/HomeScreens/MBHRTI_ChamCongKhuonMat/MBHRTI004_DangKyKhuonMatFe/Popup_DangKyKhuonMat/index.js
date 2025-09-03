/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Device from 'react-native-device-info';
import {launchCamera} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  HRTI004ChonNhanVien,
  HRTI004LoadDanhSachNhanVien,
  HRTI004LoaiDangKy,
  HRTI004ShowPopupDangKyKhuonMat,
  HRTI004ShowPopupMayChamCong,
} from '../../../../../services/redux/HRTI004_DangKyKhuonMatFe/action';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';

const defaultAvatar =
  'data:image/png;base64,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';
const OptionsImage = {
  maxWidth: 450,
  maxHeight: 600,
  quality: 1,
  cameraType: 'front',
  includeBase64: true,
  mediaType: 'photo',
};
const PopupDangKyKhuonMatFe = ({onRegister}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
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
  });
  const [NewImage, setNewImage] = useState('');
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const {ShowPopupDangKyKhuonMat} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  let {ChonNhanVien} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  useEffect(() => {
    setNewImage(ChonNhanVien.image);
  }, [ShowPopupDangKyKhuonMat]);
  const onToggle = () => {
    dispatch(HRTI004ShowPopupDangKyKhuonMat(false));
    setNewImage('');
  };
  const onTakePhoto = () => {
    launchCamera(OptionsImage, async res => {
      if (!res.didCancel) {
        await setNewImage(res.assets[0].base64);
      }
    });
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
        if (obj == 'onSave') {
          onSave();
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
  const onSave = async () => {
    if (defaultAvatar !== NewImage && NewImage.length > 0) {
      const param = {
        pro: 'UPDHRTI0040100',
        in_par: {
          p1_varchar2: ChonNhanVien.id_num,
          p2_varchar2: NewImage,
        },
        out_par: {},
        token: 'tvs',
        machine_id: Device.getUniqueId(),
      };
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
        },
      };
      await axios
        .post(API + 'ExecV2/MOBILE', param, axiosConfig)
        .then(rs => {
          if (rs.data.result === 'S') {
            Alert.alert(
              'Thông báo',
              'Sao lưu thành công!',
              [
                {
                  text: 'Xác nhận',
                  onPress: () => {
                    dispatch(HRTI004LoadDanhSachNhanVien({rf: false}));
                    dispatch(HRTI004ShowPopupDangKyKhuonMat(false));
                  },
                },
              ],
              {cancelable: true},
            );
          } else {
            Alert.alert(
              'Thông báo',
              'Sao lưu thất bại! \n ' + rs.data.content,
              [
                {
                  text: 'Xác nhận',
                },
              ],
              {cancelable: true},
            );
          }
        })
        .catch(err => {
          if (err == 'AxiosError: Request failed with status code 401') {
            refreshNewToken('onSave');
          }
          console.log(err);
        });
    }
  };

  const onUpload = () => {
    if (defaultAvatar !== NewImage && NewImage.length > 0) {
      dispatch(HRTI004LoaiDangKy(2));
      dispatch(HRTI004ShowPopupMayChamCong(true));
      dispatch(HRTI004ChonNhanVien({...ChonNhanVien, newImage: NewImage}));
    }
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
          onTakePhoto();
        } else {
          Alert.alert(
            'Thông báo',
            'Xin hãy cấp quyền truy cập camera cho ứng dụng.',
            [{text: 'Đóng'}],
          );
        }
      } else {
        onTakePhoto();
      }
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <>
      {ShowPopupDangKyKhuonMat ? (
        <View style={styles.container}>
          <TouchableOpacity style={styles.top} onPress={onToggle} />
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.textHeader}>ĐĂNG KÝ KHUÔN MẶT</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.viewInfo}>
                <View>
                  <Text style={styles.fullName}>{ChonNhanVien.full_name}</Text>
                  <Text style={styles.field}>
                    Mã nhân viên: {ChonNhanVien.emp_id}
                  </Text>
                  <Text style={styles.field}>
                    Mã chấm công: {ChonNhanVien.id_num}
                  </Text>
                </View>
              </View>
              <View style={styles.viewPicture}>
                {NewImage === undefined ? null : (
                  <Image
                    style={styles.picture}
                    source={{
                      uri:
                        NewImage.length > 0
                          ? 'data:image/png;base64,' + NewImage
                          : defaultAvatar,
                    }}
                  />
                )}
                <TouchableOpacity
                  style={styles.btnChupAnhTouch}
                  onPress={onChangeImage}>
                  <Text style={styles.btnChupAnhText}>
                    <MaterialCommunityIcons
                      name={'face-recognition'}
                      size={18}
                    />{' '}
                    Chụp hình
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.btnClose} onPress={onToggle}>
                <Text style={styles.btnCloseText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOk} onPress={onSave}>
                <Text style={styles.btnCloseText}>Sao lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnUpload} onPress={onUpload}>
                <Text style={styles.btnCloseText}>Tải lên</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.bottom} />
        </View>
      ) : null}
    </>
  );
};

export default PopupDangKyKhuonMatFe;
