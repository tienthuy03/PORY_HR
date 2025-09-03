/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Device from 'react-native-device-info';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import Button from '../../../../../components/Button';
import Calender from '../../../../../components/Calendar/singleCalendar';
import OneField from '../../../../../components/OneFieldKeyValue';
import Text from '../../../../../components/Text';
import TVSButton from '../../../../../components/Tvs/Button';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup';
import GeneralErrorFromDB from '../../../../../services/errors/generalErrorFormDB';
import RequestSendNotification from '../../../../../services/notification/send';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch';
const {width} = Dimensions.get('window');
const ChoXacNhan = ({handleCount, onReload}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const {isLoading} = useSelector(s => s.GlobalLoadingReducer);
  const styles = StyleSheet.create({
    blockApproveInfo: {
      marginTop: 20,
    },
    approveIntoTitle: {
      position: 'absolute',
      top: -20,
      backgroundColor: 'white',
      left: 0,
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
  });
  const DanhSachBoSungCong = useSelector(state =>
    state.HRRE008_BoSungCongReducer.DanhSachBoSungCong.filter(
      x => x['0_pk'] === '',
    ),
  );
  const DanhSachNguoiPheDuyet = useSelector(
    state => state.HRRE008_BoSungCongReducer.DanhSachNguoiPheDuyet,
  );
  const {limit_reg_date} = useSelector(
    state => state.HRRE008_BoSungCongReducer.limitDate,
  );

  const DanhSachLyDo = useSelector(
    state => state.HRRE008_BoSungCongReducer.DanhSachLyDo,
  );

  const thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );

  //API
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  //Token
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  //import sysFetch from '../../../../../services/fetch';
  //sysFetch(API, {}, token).then(rs => { }).catch(error => { })

  //current approve info then process
  // const [approveInfo, setApproveInfo] = useState([]);
  // const [approveDefault, setApproveDefault] = useState([]);
  const RenderOneItem = ({oneItem}) => {
    //current approve info then process
    const dispatch = useDispatch();
    const [approveInfo, setApproveInfo] = useState([]);
    const [approveDefault, setApproveDefault] = useState([]);
    const [isProcess, setIsProcess] = useState(true);

    const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
      arr: [],
      name: 'Chọn vai trò phê duyệt',
    });
    const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
      approve_name: 'Chọn người phê duyệt',
    });

    //handle when approve level changed
    const onChangeSelectedLevel = value => {
      setCurrentSelectedLevel(value);
    };

    //handle when approve person change
    const onChangeSelectedPerson = value => {
      setCurrentSelectedPerson(value);
    };
    useEffect(() => {
      hanleApproveInfo();
    }, []);
    const hanleApproveInfo = () => {
      let arrApproveType = [];
      let arrApproveInfo = [];
      let arrApproveDefault = [];
      DanhSachNguoiPheDuyet.map(x => {
        if (x.tco_org_pk === item['0_org_pk']) {
          if (arrApproveType.indexOf(x.level_name) === -1) {
            arrApproveType.push(x.level_name);
            arrApproveDefault.push(x);
          }
        }
      });
      arrApproveType.map(x => {
        const tempArr = DanhSachNguoiPheDuyet.filter(y => {
          return y.level_name === x && y.tco_org_pk === item['0_org_pk'];
        });
        let default_yn = null;
        let required_yn = false;
        tempArr.map(z => {
          if (z.required_yn === 'Y') {
            required_yn = true;
          }
          if (default_yn === null && z.default_yn === 'Y') {
            default_yn = z;
          }
        });
        if (!required_yn && default_yn !== null) {
          arrApproveDefault = arrApproveDefault.filter(
            item => item.level_type !== default_yn.level_type,
          );
          arrApproveDefault.push(default_yn);
        }

        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
        default_yn = null;
        required_yn = false;
        return;
      });
      setApproveInfo(arrApproveInfo);
      setApproveDefault(arrApproveDefault);
      setIsProcess(false);
    };
    const {item} = oneItem;
    // const [ShowDSNguoiPheDuyet, setShowDSNguoiPheDuyet] = useState(false);
    const [ShowStartDatePicker, setShowStartDatePicker] = useState(false);
    const [ShowEndDatePicker, setShowEndDatePicker] = useState(false);
    const [ShowChonLyDo, setShowChonLyDo] = useState(false);
    const [ShowStarTime, setShowStartTime] = useState(false);
    const [oneDescription, setOneDescription] = useState('');
    const [ShowEndTime, setShowEndTime] = useState(false);
    const [ChonLyDo, setChonLyDo] = useState({code: 0, code_nm: 'Chọn Lý Do'});
    const [oneStartDate, setOneStartDate] = useState(item['0_date_in_xn']);
    const [oneEndDate, setOneEndDate] = useState(item['0_date_out_xn']);
    const [oneStartTime, setOneStartTime] = useState(item['0_time_in_xn']);
    const [oneEndTime, setOneEndTime] = useState(item['0_time_out_xn']);
    const [isShowSelectTimeIn, setIsShowSelectTimeIn] = useState(false);
    const [isShowSelectTimeOut, setIsShowSelectTimeOut] = useState(false);
    const onSelectedStartDate = async result => {
      const selectedDate =
        result.dateString.split('-')[0] +
        result.dateString.split('-')[1] +
        result.dateString.split('-')[2];
      if (selectedDate > oneEndDate) {
        setOneEndDate(selectedDate);
      }
      setOneStartDate(selectedDate);
      setShowStartDatePicker(false);
    };

    const onSelectedEndDate = async result => {
      const selectedDate =
        result.dateString.split('-')[0] +
        result.dateString.split('-')[1] +
        result.dateString.split('-')[2];
      if (selectedDate < oneStartDate) {
        Alert.alert('Thông báo', 'Ngày ra không thể nhỏ hơn ngày vào', [
          {
            text: 'Đóng',
          },
        ]);
        return;
      }
      setOneEndDate(selectedDate);
      setShowEndDatePicker(false);
    };

    const onSelectStartTime = async time => {
      setOneStartTime(time);
      setShowStartTime(false);
    };
    const onSelectEndTime = async time => {
      setOneEndTime(time);
      setShowEndTime(false);
    };

    const onSave = () => {
      if (oneStartTime === '--:--') {
        Alert.alert('Thông báo', 'Bạn chưa chọn giờ vào xác nhận.', [
          {text: 'đóng'},
        ]);
        return;
      }

      if (oneEndTime === '--:--') {
        Alert.alert('Thông báo', 'Bạn chưa chọn giờ ra xác nhận.', [
          {text: 'đóng'},
        ]);
        return;
      }

      if (ChonLyDo.code === 0) {
        Alert.alert('Thông báo', 'Bạn chưa chọn lý do.', [{text: 'đóng'}]);
        return;
      }

      if (approveInfo.length > 0) {
        if (currentSelectedLevel.arr.length === 0) {
          Alert.alert('Thông báo', 'Bạn chưa chọn vai trò phê duyệt.', [
            {text: 'Đóng'},
          ]);
          return;
        }

        if (!currentSelectedPerson.pk) {
          Alert.alert('Thông báo', 'Bạn chưa chọn người phê duyệt.', [
            {text: 'Đóng'},
          ]);
          return;
        }
      }

      Alert.alert('Thông báo', 'Bạn có muốn xác nhận bổ sung công không?', [
        {text: 'Hủy bỏ'},
        {
          text: 'Xác nhận',
          onPress: () => {
            // let param = {
            //   pro: 'UPDHRRE0080101',
            //   in_par: {
            //     p1_varchar2: 'INSERT',
            //     p2_varchar2: '',
            //     p3_varchar2: thr_emp_pk,
            //     p4_varchar2: item['0_work_dt'],
            //     p5_varchar2: oneStartDate,
            //     p6_varchar2: oneStartTime,
            //     p7_varchar2: oneEndDate,
            //     p8_varchar2: oneEndTime,
            //     p9_varchar2: ChonLyDo.code,
            //     p10_varchar2: oneDescription,
            //     p11_varchar2:
            //       approveInfo.length > 0
            //         ? currentSelectedPerson.level_type
            //         : '',
            //     p12_varchar2:
            //       approveInfo.length > 0
            //         ? currentSelectedPerson.thr_emp_pk
            //         : '',
            //   },
            //   out_par: {
            //     p1_varchar2: 'flash_result',
            //     p2_sys: 'noti',
            //   },
            //   token: 'tvs',
            //   machine_id: Device.getUniqueId(),
            // };

            // let axiosConfig = {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // };

            sysFetch(
              API,
              {
                pro: 'UPDHRRE0080101',
                in_par: {
                  p1_varchar2: 'INSERT',
                  p2_varchar2: '',
                  p3_varchar2: thr_emp_pk,
                  p4_varchar2: item['0_work_dt'],
                  p5_varchar2: oneStartDate,
                  p6_varchar2: oneStartTime,
                  p7_varchar2: oneEndDate,
                  p8_varchar2: oneEndTime,
                  p9_varchar2: ChonLyDo.code,
                  p10_varchar2: oneDescription,
                  p11_varchar2:
                    approveInfo.length > 0
                      ? currentSelectedPerson.level_type
                      : '',
                  p12_varchar2:
                    approveInfo.length > 0
                      ? currentSelectedPerson.thr_emp_pk
                      : '',
                },
                out_par: {
                  p1_varchar2: 'flash_result',
                  p2_sys: 'noti',
                },
              },
              tokenLogin,
            )
              .then(rs => {
                if (rs == 'Token Expired') {
                  refreshNewToken('onSave');
                }
                if (rs != 'Token Expired') {
                  if (rs.results === 'S') {
                    if (rs.data.flash_result.toString() === '0') {
                      Alert.alert(
                        'Thông báo',
                        'Xác nhận bổ sung công thất bại!',
                        [
                          {
                            text: 'Đóng',
                          },
                        ],
                        {cancelable: false},
                      );
                      return;
                    }
                    //send notification
                    RequestSendNotification(rs.data.noti, API, tokenLogin);

                    //handle alert when accept regis approve information
                    Alert.alert(
                      'Thông báo',
                      'Xác nhận bổ sung công thành công.',
                      [
                        {
                          text: 'Đóng',
                          onPress: () => {
                            onReload();
                          },
                        },
                      ],
                    );
                  } else {
                    Alert.alert('Thông báo', GeneralErrorFromDB(rs.errorData), [
                      {text: 'Đóng'},
                    ]);
                  }
                }
              })
              .catch(error => {
                console.log(error);
              });

            // axios
            //   .post(API + 'Exec/MOBILE/', param, axiosConfig)
            //   .then(response => {
            //     if (response.data.results === 'S') {
            //       if (response.data.data.flash_result.toString() === '0') {
            //         Alert.alert(
            //           'Thông báo',
            //           'Xác nhận bổ sung công thất bại!',
            //           [
            //             {
            //               text: 'Đóng',
            //             },
            //           ],
            //           {cancelable: false},
            //         );
            //         return;
            //       }
            //       //send notification
            //       RequestSendNotification(response.data.data.noti, API, token);

            //       //handle alert when accept regis approve information
            //       Alert.alert(
            //         'Thông báo',
            //         'Xác nhận bổ sung công thành công.',
            //         [
            //           {
            //             text: 'Đóng',
            //             onPress: () => {
            //               onReload();
            //             },
            //           },
            //         ],
            //       );
            //     } else {
            //       Alert.alert(
            //         'Thông báo',
            //         GeneralErrorFromDB(response.data.errorData),
            //         [{text: 'Đóng'}],
            //       );
            //     }
            //   })
            //   .catch(err => {
            //     let newText = err.split('ORA-');
            //     let errors = '';
            //     try {
            //       errors = newText[1].trim().replace('20009:', '');
            //     } catch (error) {
            //       errors = 'Lỗi: ' + err;
            //     }
            //     Alert.alert('Thông báo', errors, [{text: 'Đóng'}]);
            //   });
          },
        },
      ]);
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
            sysFetch(
              API,
              {
                pro: 'UPDHRRE0080101',
                in_par: {
                  p1_varchar2: 'INSERT',
                  p2_varchar2: '',
                  p3_varchar2: thr_emp_pk,
                  p4_varchar2: item['0_work_dt'],
                  p5_varchar2: oneStartDate,
                  p6_varchar2: oneStartTime,
                  p7_varchar2: oneEndDate,
                  p8_varchar2: oneEndTime,
                  p9_varchar2: ChonLyDo.code,
                  p10_varchar2: oneDescription,
                  p11_varchar2:
                    approveInfo.length > 0
                      ? currentSelectedPerson.level_type
                      : '',
                  p12_varchar2:
                    approveInfo.length > 0
                      ? currentSelectedPerson.thr_emp_pk
                      : '',
                },
                out_par: {
                  p1_varchar2: 'flash_result',
                  p2_sys: 'noti',
                },
              },
              tokenLogin,
            )
              .then(rs => {
                if (rs == 'Token Expired') {
                  refreshNewToken('onSave');
                }
                if (rs != 'Token Expired') {
                  if (rs.results === 'S') {
                    if (rs.data.flash_result.toString() === '0') {
                      Alert.alert(
                        'Thông báo',
                        'Xác nhận bổ sung công thất bại!',
                        [
                          {
                            text: 'Đóng',
                          },
                        ],
                        {cancelable: false},
                      );
                      return;
                    }
                    //send notification
                    RequestSendNotification(rs.data.noti, API, token);

                    //handle alert when accept regis approve information
                    Alert.alert(
                      'Thông báo',
                      'Xác nhận bổ sung công thành công.',
                      [
                        {
                          text: 'Đóng',
                          onPress: () => {
                            onReload();
                          },
                        },
                      ],
                    );
                  } else {
                    Alert.alert('Thông báo', GeneralErrorFromDB(rs.errorData), [
                      {text: 'Đóng'},
                    ]);
                  }
                }
              })
              .catch(error => {
                console.log(error);
              });
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
    return (
      !isProcess && (
        <Block shadow flex marginLeft={10} marginRight={10} marginBottom={10}>
          <SelectTimeIn
            isShowSelectTimeIn={isShowSelectTimeIn}
            onCloseSelectTimeIn={() => {
              setIsShowSelectTimeIn(false);
            }}
            onSelectStartTime={onSelectStartTime}
          />
          <SelectTimeOut
            isShowSelectTimeOut={isShowSelectTimeOut}
            onCloseSelectTimeOut={() => {
              setIsShowSelectTimeOut(false);
            }}
            onSelectEndTime={onSelectEndTime}
          />
          <TVSControlPopup
            isShow={ShowChonLyDo}
            onHide={() => setShowChonLyDo(false)}
            title="Lý do">
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={DanhSachLyDo}
              keyExtractor={(item, index) => index + '' + Math.random()}
              renderItem={i => {
                return (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: Color.inputBackgroundColor,
                      margin: 2,
                    }}
                    onPress={() => {
                      setChonLyDo({
                        code: i.item.code,
                        code_nm: i.item.code_nm,
                      });
                      setShowChonLyDo(false);
                    }}>
                    <Text>{i.item.code_nm.toString()}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </TVSControlPopup>
          <TVSControlPopup
            maxHeight={500}
            isShow={ShowStartDatePicker}
            onHide={() => setShowStartDatePicker(false)}
            title={'Chọn ngày'}>
            <Calender getStateCalendar={onSelectedStartDate} />
          </TVSControlPopup>
          <TVSControlPopup
            isShow={ShowEndDatePicker}
            onHide={() => setShowEndDatePicker(false)}
            title={'Chọn ngày'}
            maxHeight={500}>
            <Calender getStateCalendar={onSelectedEndDate} />
          </TVSControlPopup>

          <DateTimePickerModal
            cancelTextIOS="Hủy bỏ"
            confirmTextIOS="Xác nhận"
            isVisible={ShowStarTime}
            mode="time"
            hideTitleContainerIOS={true}
            // date={new Date()}
            headerTextIOS="Chọn giờ vào"
            locale="vi_VN"
            onConfirm={onSelectStartTime}
            onCancel={() => {
              setShowStartTime(false);
            }}
          />
          <DateTimePickerModal
            cancelTextIOS="Hủy bỏ"
            confirmTextIOS="Xác nhận"
            isVisible={ShowEndTime}
            mode="time"
            hideTitleContainerIOS={true}
            // date={new Date()}
            headerTextIOS="Chọn giờ ra"
            locale="vi_VN"
            onConfirm={onSelectEndTime}
            onCancel={() => {
              setShowEndTime(false);
            }}
          />
          <Block row justifyContent={'space-between'}>
            <Block
              borderTopLeftRadius={6}
              borderTopRightRadius={6}
              backgroundColor={Color.white}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}>
              <Text color={Color.mainColor} size={14}>
                {item['0_label']}
              </Text>
            </Block>

            <Text color={Color.white} size={13} />
          </Block>
          <Block
            backgroundColor={Color.white}
            borderBottomLeftRadius={6}
            borderBottomRightRadius={6}
            borderColor={Color.oneContentBorder}
            borderWidth={1}>
            {Object.entries(item).map((oitem, index) => {
              if (
                oitem[0].substr(0, 1) === '3' ||
                oitem[0].substr(0, 1) === '1'
              ) {
                return (
                  <OneField
                    keyName={
                      oitem[0].charAt(2).toUpperCase() + oitem[0].slice(3)
                    }
                    value={oitem[1]}
                    key={index}
                  />
                );
              }
            })}
            {parseInt(item['0_work_dt']) < parseInt(limit_reg_date) ? null : (
              <>
                <Block
                  row
                  borderBottomWidth={1}
                  borderBottomColor={'#F4F6F7'}
                  paddingLeft={5}
                  paddingRight={5}
                  paddingTop={10}
                  alignCenter
                  paddingBottom={10}
                  justifyContent={'center'}>
                  <Text style={{marginRight: 10}} flex={1}>
                    Giờ vào xác nhận
                  </Text>
                  <View flex={2} style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        //setShowStartTime(true);
                        setIsShowSelectTimeIn(true);
                      }}
                      style={{
                        backgroundColor: Color.gray,
                        borderRadius: 5,
                        flex: 1,
                        padding: 10,
                        textAlign: 'center',
                        marginRight: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        color={Color.grayPlahoder}
                        style={{marginRight: 5}}
                        size={18}
                        name={'clock'}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                        }}>
                        {oneStartTime}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowStartDatePicker(true);
                      }}
                      style={{
                        backgroundColor: Color.gray,
                        borderRadius: 5,
                        flex: 2,
                        padding: 10,
                        textAlign: 'center',
                        marginRight: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        color={Color.grayPlahoder}
                        style={{marginRight: 5}}
                        size={18}
                        name={'calendar'}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                        }}>
                        {oneStartDate.substr(6, 2)}/{oneStartDate.substr(4, 2)}/
                        {oneStartDate.substr(0, 4)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Block>

                <Block
                  row
                  borderBottomWidth={1}
                  borderBottomColor={'#F4F6F7'}
                  paddingLeft={5}
                  paddingRight={5}
                  paddingTop={10}
                  alignCenter
                  paddingBottom={10}
                  justifyContent={'center'}>
                  <Text style={{marginRight: 10}} flex={1}>
                    Giờ ra xác nhận
                  </Text>
                  <View flex={2} style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        //setShowEndTime(true);
                        setIsShowSelectTimeOut(true);
                      }}
                      style={{
                        backgroundColor: Color.gray,
                        borderRadius: 5,
                        flex: 1,
                        padding: 10,
                        textAlign: 'center',
                        marginRight: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        color={Color.grayPlahoder}
                        style={{marginRight: 5}}
                        size={18}
                        name={'clock'}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                        }}>
                        {oneEndTime}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowEndDatePicker(true);
                      }}
                      style={{
                        backgroundColor: Color.gray,
                        borderRadius: 5,
                        flex: 2,
                        padding: 10,
                        textAlign: 'center',
                        marginRight: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        color={Color.grayPlahoder}
                        style={{marginRight: 5}}
                        size={18}
                        name={'calendar'}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                        }}>
                        {oneEndDate.substr(6, 2)}/{oneEndDate.substr(4, 2)}/
                        {oneEndDate.substr(0, 4)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Block>
                <Block
                  row
                  borderBottomWidth={1}
                  borderBottomColor={'#F4F6F7'}
                  paddingLeft={5}
                  paddingRight={5}
                  paddingTop={10}
                  alignCenter
                  paddingBottom={10}
                  justifyContent={'center'}>
                  <Text style={{marginRight: 10}} flex={1}>
                    Lý do
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowChonLyDo(true)}
                    style={{
                      marginRight: 10,
                      marginLeft: 15,
                      backgroundColor: Color.gray,
                      borderRadius: 5,
                      flex: 2,
                      color: Color.grayPlahoder,
                      padding: 10,
                      textAlign: 'center',

                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        flex: 1,
                      }}>
                      {ChonLyDo.code_nm}
                    </Text>
                    <Icon
                      color={Color.grayPlahoder}
                      style={{marginLeft: 5}}
                      size={18}
                      name={'chevron-down'}
                    />
                  </TouchableOpacity>
                </Block>
                <Block
                  borderBottomWidth={1}
                  borderBottomColor={'#F4F6F7'}
                  paddingLeft={5}
                  paddingRight={5}
                  paddingTop={10}
                  paddingBottom={10}>
                  <Text
                    style={{
                      marginRight: 10,
                      marginBottom: 5,
                    }}
                    flex={1}>
                    Ghi chú
                  </Text>
                  <TextInput
                    numberOfLines={2}
                    onChangeText={value => setOneDescription(value)}
                    value={oneDescription}
                    multiline={true}
                    placeholder={'Nhập ghi chú'}
                    style={{
                      borderRadius: 5,
                      paddingBottom: 10,
                      paddingTop: 10,
                      paddingHorizontal: 10,
                      backgroundColor: Color.gray,
                    }}
                  />
                </Block>
              </>
            )}
            {approveInfo.length > 0 ? (
              <Block borderBottomWidth={1} borderBottomColor={'#D9DCE3'}>
                <Block style={styles.blockApproveInfo}>
                  {/* approve info start */}
                  <Block
                    border={1}
                    padding={10}
                    borderColor={Color.gray}
                    radius={6}
                    marginBottom={20}
                    marginLeft={5}
                    marginRight={5}>
                    <Block
                      padding={3}
                      radius={4}
                      height={40}
                      alignCenter
                      row
                      style={styles.approveIntoTitle}>
                      <Text fontWeight={'bold'}>Thông tin người phê duyệt</Text>
                    </Block>
                    <Block>
                      <SelectLevelApprove
                        onChangeSelectedPerson={onChangeSelectedPerson}
                        currentSelectedLevel={currentSelectedLevel}
                        approveInfo={approveInfo}
                        onChangeSelectedLevel={onChangeSelectedLevel}
                      />
                      <SelectApprovePerson
                        currentSelectedLevel={currentSelectedLevel}
                        currentSelectedPerson={currentSelectedPerson}
                        onChangeSelectedPerson={onChangeSelectedPerson}
                      />
                    </Block>
                  </Block>
                  {/* approve info end */}
                </Block>
              </Block>
            ) : null}
            {item['0_note'].length === 0 ? null : (
              <Block
                style={{
                  flex: 1,
                  justifyCenter: 'center',
                  padding: 10,
                }}>
                <Text style={{color: 'red'}}>{item['0_note']}</Text>
              </Block>
            )}
            <Block flex row padding={10} justifyCenter>
              <TVSButton
                disabled={
                  parseInt(item['0_work_dt']) < parseInt(limit_reg_date)
                }
                onPress={onSave}
                icon={'check'}>
                Xác nhận
              </TVSButton>
            </Block>
          </Block>
        </Block>
      )
    );
  };
  return (
    <Block flex backgroundColor={Color.gray}>
      <Block flex>
        <Block marginTop={10} flex>
          {!isLoading && (
            <FlatList
              showsVerticalScrollIndicator={false}
              onRefresh={onReload}
              refreshing={false}
              data={DanhSachBoSungCong}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item => <RenderOneItem oneItem={item} />}
              ListEmptyComponent={() => (
                <Block flex alignCenter justifyCenter marginTop={20}>
                  <Text>Không có dữ liệu !</Text>
                </Block>
              )}
            />
          )}
        </Block>
      </Block>
    </Block>
  );
};

const SelectTimeIn = ({
  isShowSelectTimeIn,
  onCloseSelectTimeIn,
  onSelectStartTime,
}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [ShowMinutes, setShowMinutes] = useState(false);
  const [ShowHours, setShowHours] = useState(false);
  const [Minute, setMinute] = useState('00');
  const [Hour, setHour] = useState('00');
  const [startTime, setStartTime] = useState('hh:mm');
  const dispatch = useDispatch();
  const accept = () => {
    setTime(
      `${Hour === 'hh' ? '00' : Hour}:${Minute === 'mm' ? '00' : Minute}`,
    );
    setStartTime(
      `${Hour === 'hh' ? '00' : Hour}:${Minute === 'mm' ? '00' : Minute}`,
    );
    onCloseSelectTimeIn();
  };
  const setTime = time => {
    setShowMinutes(false);
    setShowHours(false);
    onSelectStartTime(time);
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
    const temp = startTime.toString().split(':');
    setHour(temp[0]);
    setMinute(temp[1]);
  }, [startTime]);

  let maxHeight = 150;

  return (
    <TVSControlPopup
      title="Giờ vào xác nhận"
      isShow={isShowSelectTimeIn}
      onHide={onCloseSelectTimeIn}
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

const SelectTimeOut = ({
  isShowSelectTimeOut,
  onCloseSelectTimeOut,
  onSelectEndTime,
}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [ShowMinutes, setShowMinutes] = useState(false);
  const [ShowHours, setShowHours] = useState(false);
  const [Minute, setMinute] = useState('00');
  const [Hour, setHour] = useState('00');
  const [endTime, setEndTime] = useState('hh:mm');
  const dispatch = useDispatch();
  const accept = () => {
    setTime(
      `${Hour === 'hh' ? '00' : Hour}:${Minute === 'mm' ? '00' : Minute}`,
    );
    setEndTime(
      `${Hour === 'hh' ? '00' : Hour}:${Minute === 'mm' ? '00' : Minute}`,
    );
    onCloseSelectTimeOut();
  };
  const setTime = time => {
    setShowMinutes(false);
    setShowHours(false);
    onSelectEndTime(time);
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
    const temp = endTime.toString().split(':');
    setHour(temp[0]);
    setMinute(temp[1]);
  }, [endTime]);

  let maxHeight = 150;

  return (
    <TVSControlPopup
      title={'Giờ ra xác nhận'}
      isShow={isShowSelectTimeOut}
      onHide={onCloseSelectTimeOut}
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
export default ChoXacNhan;

const SelectLevelApprove = ({
  onChangeSelectedPerson,
  currentSelectedLevel,
  onChangeSelectedLevel,
  approveInfo,
}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [isShow, setIsShow] = useState(false);

  return (
    <View
      style={{
        marginTop: 10,
      }}>
      <Text flexWrap={'wrap'} paddingLeft={5} paddingRight={5}>
        Vai trò phê duyệt <Text style={{color: 'red'}}>*</Text>
      </Text>
      <View
        style={{
          backgroundColor: Color.gray,
          padding: 10,
          marginTop: 5,
          borderBottomColor: Color.inputBackgroundColor,
          borderBottomWidth: 1,
          borderRadius: 6,
        }}>
        <Button
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
          nextScreen={() => setIsShow(!isShow)}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                color:
                  currentSelectedLevel.name === 'Chọn vai trò phê duyệt'
                    ? '#B2B2B2'
                    : null,
              }}>
              {currentSelectedLevel.name}
            </Text>
          </View>
          <Icon
            name={'arrow-down-drop-circle-outline'}
            color={Color.mainColor}
            size={24}
          />
        </Button>
        {isShow && (
          <View
            style={{
              marginTop: 10,
            }}>
            {approveInfo.map((item, index) => {
              if (item.name === currentSelectedLevel.name) {
                return null;
              }

              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsShow(false);
                    onChangeSelectedLevel(item);
                    onChangeSelectedPerson({
                      approve_name: 'Chọn người phê duyệt',
                    });
                  }}
                  key={index.toString()}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: 'white',
                    marginBottom: 5,
                    borderRadius: 6,
                  }}>
                  <Text
                    flex={1}
                    flexWrap={'wrap'}
                    paddingLeft={5}
                    paddingRight={5}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const SelectApprovePerson = ({
  currentSelectedPerson,
  onChangeSelectedPerson,
  currentSelectedLevel,
}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [isShow, setIsShow] = useState(false);

  return (
    <View
      style={{
        marginTop: 10,
      }}>
      <Text flexWrap={'wrap'} paddingLeft={5} paddingRight={5}>
        Người phê duyệt <Text style={{color: 'red'}}>*</Text>
      </Text>
      <View
        style={{
          backgroundColor: Color.gray,
          padding: 10,
          marginTop: 5,
          borderBottomColor: Color.inputBackgroundColor,
          borderBottomWidth: 1,
          borderRadius: 6,
        }}>
        <Button
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
          nextScreen={() => setIsShow(!isShow)}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                color:
                  currentSelectedPerson.approve_name === 'Chọn người phê duyệt'
                    ? '#B2B2B2'
                    : null,
              }}>
              {currentSelectedPerson.approve_name}
            </Text>
          </View>
          <Icon
            name={'arrow-down-drop-circle-outline'}
            color={Color.mainColor}
            size={24}
          />
        </Button>
        {isShow && (
          <View
            style={{
              marginTop: 10,
            }}>
            {currentSelectedLevel.arr.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsShow(false);
                    onChangeSelectedPerson(item);
                  }}
                  key={index.toString()}
                  style={{
                    flexDirection: 'row',
                    justifyContentac: 'center',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: 'white',
                    marginBottom: 5,
                    borderRadius: 6,
                  }}>
                  <Text
                    flex={1}
                    flexWrap={'wrap'}
                    paddingLeft={5}
                    paddingRight={5}>
                    {item.approve_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};
