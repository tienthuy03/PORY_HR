import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  View
} from 'react-native';
import RNRestart from 'react-native-restart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAction } from '../../../../actions';
import Block from '../../../../components/Block';
import Text from '../../../../components/Text';
import TVSButton from '../../../../components/Tvs/Button';
import TVSHeader from '../../../../components/Tvs/Header';
import { APP_VERSION } from '../../../../config/Pro';
import ShowError from '../../../../services/errors';
import sysFetch from '../../../../services/fetch_v1';
import sysFetch2 from '../../../../services/fetch_v1/fetch2';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../services/redux/GlobalLoading/action';
import CameraWithOvalFrame from './CameraWithOval';
import createStyles from './styles';

const OptionsImage = {
  maxWidth: 450,
  maxHeight: 600,
  quality: 1,
  // cameraType: 'back',
  cameraType: 'front',
  includeBase64: true,
  mediaType: 'photo',
};
// const url = 'https://tvs-devoff.cognitiveservices.azure.com/face/v1.0/';

const defaultAvatar =
  'data:image/webp;base64,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';
const DangKyKhuonMat = ({ navigation: { goBack } }) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = createStyles(Color);
  const [showCamera, setShowCamera] = useState(false)
  const [NewImage, setNewImage] = useState(defaultAvatar);
  const [IsDurty, setIsDurty] = useState(false);
  const [_, setPersonId] = useState('');
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const currentLangue = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const employee_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  console.log('employee_pk: ', employee_pk);

  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const menu = useSelector(state => state.menuReducer.data.data.menu);
  const information = useSelector(state => state.loginReducers.data.data);

  try {
    menu.filter(x => x.menu_cd === 'MBHRTI002')[0][currentLangue.toLowerCase()];
  } catch (error) {
    Alert.alert('Thông báo', 'Menu MBHRTI002 không tồn tại.', [
      { text: 'Xác nhận', onPress: () => goBack() },
    ]);
  }

  useEffect(() => {
    dispatch(ShowGlobalLoading);
    loadData();
  }, []);

  const loadData = async () => {
    sysFetch(
      API,
      {
        pro: 'SELHRTI002000',
        in_par: {
          p1_varchar2: employee_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'face',
        },
      },
      tokenLogin,
    )
      .then(res => {
        // console.log(res);
        if (res == 'Token Expired') {
          refreshNewToken('loadData', '', '', '');
        }
        if (res != 'Token Expired') {
          if (res.results === 'S') {
            if (res.data.face.length > 0) {
              setNewImage('data:image/png;base64,' + res.data.face[0].image);
              setPersonId(res.data.face[0].azure_person_id);
            }
            dispatch(HideGlobalLoading);
          } else {
            ShowError('fail');
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });

  };

  //custom filed employees
  const EmployeeInfo = ({ value }) => (
    <View style={styles.oneField}>
      <Text>{value}</Text>
    </View>
  );

  //custom avatar
  const Avatar = ({ uri, style }) => (
    <View style={style}>
      <Image style={styles.avatar} source={{ uri: uri }} resizeMode='stretch' />
    </View>
  );

  const onSave = () => {
    if (IsDurty) {
      Alert.alert('Thông báo', 'Bạn có muốn sao lưu không?', [
        { text: 'Không' },
        { text: 'Có', onPress: requestSave },
      ]);
    }
  };
  //insert face to db
  // const insertFaceToDB = async (employee_pk, personId, NewImage) => {
  //   // console.log('param ');
  //   sysFetch2(
  //     API,
  //     {
  //       pro: 'UPDHRTI002000',
  //       in_par: {
  //         p1_varchar2: employee_pk,
  //         p2_varchar2: personId,
  //         p3_varchar2: NewImage.toString().replace(
  //           'data:image/png;base64,',
  //           '',
  //         ),
  //         p4_varchar2: APP_VERSION,
  //         p5_varchar2: crt_by,
  //       },
  //       out_par: { p1_varchar2: 'data' },
  //     },
  //     tokenLogin,
  //   )
  //     .then(rs => {
  //       // console.log(rs);
  //       if (rs.result === 'S') {
  //         Alert.alert('Đăng ký khuôn mặt thành công.');
  //         dispatch(HideGlobalLoading);
  //       } else {
  //         ShowError('fail');
  //         dispatch(HideGlobalLoading);
  //       }
  //     })
  //     .catch(error => {
  //       if (error == 'AxiosError: Request failed with status code 401') {
  //         refreshNewToken('insertFaceToDB', employee_pk, personId, NewImage);
  //       } else {
  //         Alert.alert('Đăng ký khuôn mặt không thành công.');
  //       }
  //     });
  // };


  const insertFaceToDB = async (employee_pk, personId, NewImage) => {
    const formattedImage = NewImage.replace('data:image/png;base64,', ''); // Xử lý định dạng ảnh

    sysFetch2(
      API,
      {
        pro: 'UPDHRTI002000',
        in_par: {
          p1_varchar2: employee_pk, // ID nhân viên
          p2_varchar2: personId || '', // Person ID nếu có, nếu không để trống
          p3_varchar2: formattedImage, // Ảnh đã xử lý
          p4_varchar2: APP_VERSION, // Phiên bản ứng dụng
          p5_varchar2: crt_by, // Người tạo
        },
        out_par: { p1_varchar2: 'data' },
      },
      tokenLogin
    )
      .then(rs => {
        if (rs.result === 'S') {
          Alert.alert('Đăng ký khuôn mặt thành công.');
          dispatch(HideGlobalLoading());
        } else {
          ShowError('Lưu khuôn mặt thất bại.');
          dispatch(HideGlobalLoading());
        }
      })
      .catch(error => {
        if (error === 'AxiosError: Request failed with status code 401') {
          refreshNewToken('insertFaceToDB', employee_pk, personId, NewImage);
        } else {
          Alert.alert('Đăng ký khuôn mặt không thành công.');
        }
      });
  };

  // const requestSave = async () => {
  //   // initPerson();
  //   insertFaceToDB(employee_pk, null, NewImage);
  // };

  const requestSave = async () => {
    if (NewImage) {
      insertFaceToDB(employee_pk, null, NewImage);
    } else {
      Alert.alert('Không có ảnh mới để lưu.');
    }
  };

  console.log('NewImage: ', NewImage);

  const refreshNewToken = (obj, p1, p2, p3) => {
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
        if (obj == 'insertFaceToDB') {
          insertFaceToDB(p1, p2, p3);
        }
        if (obj == 'loadData') {
          loadData();
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
            { cancelable: true },
          );
        }
        console.log(error);
      });
  };

  const onChangeImage = async () => {
    setShowCamera(true)
  };

  const FaceRegistration = ({ onPress, NewImage }) => (
    <View
      style={styles.registerFaceContainer}>
      <View style={styles.avatarViewRF}>
        <Avatar uri={NewImage} style={styles.avatarRF} />
      </View>

      <Text style={styles.btnStatus}>
        Trạng thái: Đang chờ phê duyệt
      </Text>
      <View>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.btnChangeImage}>
            <MaterialCommunityIcons name="camera-front-variant" size={16} />
            Thêm khuôn mặt mới
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {
            menu.filter(x => x.menu_cd === 'MBHRTI002')[0][currentLangue.toLowerCase()]
          }
        </TVSHeader>

        <View style={styles.container}>
          <Text size={16} paddingVertical={12} fontWeight={700}>Thông tin cá nhân</Text>
          <View style={styles.informationContainer}>
            {/* Avatar */}
            <Avatar uri={information.avatar} style={styles.avatarView} />
            <View style={styles.informationContainerRight}>
              <Text>Nhân viên</Text>
              <EmployeeInfo value={information.full_name} />
              <Text>Giới tính</Text>
              <EmployeeInfo value={information.gender === 'F' ? 'Nữ' : 'Nam'} />
            </View>
          </View>

          {/* Đăng ký khuôn mặt */}
          <Text size={16} paddingVertical={12} fontWeight={700}>Đăng ký khuôn mặt</Text>
          <FaceRegistration onPress={onChangeImage} NewImage={NewImage} />

          <View style={styles.footer}>
            <TVSButton icon={'content-save'} onPress={onSave} maxWidth={120}>
              Sao Lưu
            </TVSButton>
          </View>
        </View>

      </Block>
      {showCamera && (
        <Modal>
          <CameraWithOvalFrame
            setNewImage={setNewImage}
            setIsDurty={setIsDurty}
            setShowCamera={setShowCamera}
          />
        </Modal>

      )}
    </>
  );
};

export default DangKyKhuonMat;




// const CameraWithOvalFrame = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [isReady, setIsReady] = useState(false);
//   let cameraRef = null;

//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: 'Camera Permission',
//           message: 'This app needs access to your camera.',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'Allow',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         setHasPermission(true);
//       } else {
//         Alert.alert('Permission Denied', 'Camera permission is required.');
//       }
//     } else {
//       setHasPermission(true);
//     }
//   };
//   const onFaceDetected = ({ faces }) => {
//     if (faces.length) {
//       Alert.alert('Thông báo lỗi', 'Không chụp được ảnh.');
//     }
//   };
//   const captureImage = async () => {
//     if (cameraRef && isReady) {
//       try {
//         const options = { quality: 0.7, base64: true };
//         const data = await cameraRef.takePictureAsync(options);
//         setNewImage('data:image/png;base64,' + data.base64);
//         setIsDurty(true);
//         setShowCamera(false);
//       } catch (error) {
//         console.error('Hình ảnh bị lỗi:', error);
//         Alert.alert('Thông báo lỗi', 'Không chụp được ảnh.');
//       }
//     } else {
//       Alert.alert('Máy ảnh chưa sẵn sàng', 'Vui lòng đợi cho đến khi máy ảnh sẵn sàng.');
//     }
//   };

//   // Toggle between front and back camera
//   const toggleCameraType = () => {
//     setCameraType(prevType =>
//       prevType === RNCamera.Constants.Type.front
//         ? RNCamera.Constants.Type.back
//         : RNCamera.Constants.Type.front
//     );
//   };
//   React.useEffect(() => {
//     requestCameraPermission();
//   }, []);

//   return (
//     <View style={styles.containerCamera}>
//       {hasPermission === null ? (
//         <Text>Requesting camera permission...</Text>
//       ) : hasPermission === false ? (
//         <Text>Camera permission denied</Text>
//       ) : (
//         <>
//           <RNCamera
//             zoom={0.1}
//             ref={(ref) => {
//               cameraRef = ref;
//             }}
//             flashMode={RNCamera.Constants.FlashMode.on}
//             style={styles.cameraPreview}
//             type={cameraType}
//             onCameraReady={() => setIsReady(true)}
//             onFaceDetected={onFaceDetected}
//             captureAudio={false}

//           />
//           {/* Oval Frame Overlay */}
//           <View style={styles.overlay}>
//             <View style={styles.transparentBackground}></View>
//             <View style={styles.oval}></View>
//             <Text style={styles.instructionText}>
//               Vui lòng đưa khuôn mặt vào khung hình
//             </Text>
//           </View>
//         </>
//       )}

//       <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
//         <TouchableOpacity onPress={toggleCameraType} style={styles.capture}>
//           <Icon
//             name={"camera-flip-outline"}
//             size={20}
//             color="black"
//             style={{ marginRight: 4 }}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={captureImage} style={styles.capture}>
//           <Icon
//             name={"camera"}
//             size={20}
//             color="black"
//             style={{ marginRight: 4 }}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

// const onChangeImage = async () => {
// try {
//   if (Platform.OS === 'android') {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       {
//         title: 'Thông báo',
//         message: 'Xin hãy cấp quyền truy cập camera cho ứng dụng.',
//         buttonNegative: 'Hủy bỏ',
//         buttonPositive: 'Xác nhận',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       takePhoto();
//     } else {
//       Alert.alert(
//         'Thông báo',
//         'Xin hãy cấp quyền truy cập camera cho ứng dụng.',
//         [{ text: 'Đóng' }],
//       );
//     }
//   } else {
//     takePhoto();
//   }
// } catch (err) {
//   console.warn(err);
// }
// const takePhoto = () => {
//   launchCamera(OptionsImage, res => {
//     if (res.errorCode == 'camera_unavailable') {
//       ShowError('camera_unavailable');
//     } else if (!res.didCancel) {
//       setNewImage('data:image/png;base64,' + res.assets[0].base64);
//       setIsDurty(true);
//     }
//   });
// };

//Azure Images Upload
// let personId2 = '';

// const initPerson = async () => {
//   console.log("test: ", personId);
//   if (personId.length === 0) {
//     const rsCreate = await createPerson(employee_pk);
//     if (rsCreate.personId) {
//       const rsAddFace = await initFace(rsCreate.personId);
//       if (rsAddFace.persistedFaceId.length > 0) {
//         personId2 = rsCreate.personId;
//         insertFaceToDB(employee_pk, rsCreate.personId, NewImage);
//       }
//     } else {
//       ShowError('fail');
//     }
//   } else {
//     const rsDel = await deletePerson(personId);
//     console.log("rsDel: ", rsDel);

//     const rsCreate = await createPerson(employee_pk);
//     console.log("rsCreate:  ", rsCreate);

//     if (rsCreate.personId) {
//       const rsAddFace = await initFace(rsCreate.personId);
//       console.log(rsAddFace);
//       if (rsAddFace.persistedFaceId.length > 0) {
//         personId2 = rsCreate.personId;
//         insertFaceToDB(employee_pk, rsCreate.personId, NewImage);
//       }
//     } else {
//       ShowError('fail');
//     }
//   }
// };

//create new person to azure
// const createPerson = async pk => {
//   const configCreate = {
//     method: 'POST',
//     url: url + 'largepersongroups/tvs-large-groups/persons',
//     data: {
//       name: pk,
//       userData: pk + ' des',
//     },
//     headers: {
//       'Content-Type': 'application/json',
//       'Ocp-Apim-Subscription-Key': '36776dfe819949979fd58ac13631f21d',
//     },
//   };
//   return await axios(configCreate)
//     .then(async rsPerson => {
//       return rsPerson.data;
//     })
//     .catch(error => { });
// };


// //delete person from azure
// const deletePerson = async delId => {
//   const configCreate = {
//     method: 'DELETE',
//     url: url + 'largepersongroups/tvs-large-groups/persons/' + delId,
//     data: {
//       name: employee_pk,
//       userData: employee_pk + ' des',
//     },
//     headers: {
//       'Content-Type': 'application/json',
//       'Ocp-Apim-Subscription-Key': '36776dfe819949979fd58ac13631f21d',
//     },
//   };
//   return await axios(configCreate)
//     .then(async rsDeletePerson => {
//       return rsDeletePerson.data;
//     })
//     .catch(err => { });
// };

// const initFace = async id => {
//   const data = base64ToArrayBuffer.decode(
//     NewImage.toString().replace('data:image/png;base64,', ''),
//   );
//   const configFace = {
//     method: 'POST',
//     url:
//       url +
//       'largepersongroups/tvs-large-groups/persons/' +
//       id +
//       '/persistedfaces',
//     data,
//     headers: {
//       'Content-Type': 'application/octet-stream',
//       'Ocp-Apim-Subscription-Key': '36776dfe819949979fd58ac13631f21d',
//     },
//   };
//   return await axios(configFace)
//     .then(rsFace => {
//       return rsFace.data;
//     })
//     .catch(err => { });
// };