/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {default as Icon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import Button from '../../../../../components/Button';
import Calender from '../../../../../components/Calendar/singleCalendar';
import Text from '../../../../../components/Text';
import TVSButton from '../../../../../components/Tvs/Button';
import IconDate from '../../../../../icons/Datev';
import IconTime from '../../../../../icons/Time';
import GeneralErrorFromDB from '../../../../../services/errors/generalErrorFormDB';
import RequestSendNotification from '../../../../../services/notification/send';
import {
  HRRE006LoadDataCongTac,
  HRRE006SetDescription,
  HRRE006SetEndTime,
  HRRE006SetStartTime,
  HRRE006SetWorkDate,
} from '../../../../../services/redux/HRRE006_CongTac/action';
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch';

const DK_MBHRRE006 = ({currentTab}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
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
  const {startTime, endTime, description, DanhSachNguoiPheDuyet, limitDate} =
    useSelector(state => state.HRRE006_CongTacReducer);

  const loginReducers = useSelector(state => state.loginReducers);
  let tokenLogin = '';
  let full_name = '';
  let thr_emp_pk = '';
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    full_name = loginReducers.data.data.full_name;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    console.log('error Công tác -> Đăng ký');
    console.log(error);
  }

  const [switchValue, setSwitchValue] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [fromDate, setFromDate] = useState('dd/mm/yyyy');
  const [toDate, setToDate] = useState('dd/mm/yyyy');

  const [approveInfo, setApproveInfo] = useState([]);

  const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
    arr: [],
    name: 'Chọn vai trò phê duyệt',
  });
  const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
    approve_name: 'Chọn người phê duyệt',
  });

  const [colorFrom, setColorFrom] = useState('#B2B2B2');
  const [colorTo, setColorTo] = useState('#B2B2B2');

  //datetime start
  const [ShowStartDatePicker, setShowStartDatePicker] = useState(false);
  const [ShowEndDatePicker, setShowEndDatePicker] = useState(false);

  const [oneStartDate, setOneStartDate] = useState('yyyymmdd');
  const [oneEndDate, setOneEndDate] = useState('yyyymmdd');

  const [workPlace, setWorkPlace] = useState('');
  const [workContent, setWorkContent] = useState('');

  //reset tab
  useEffect(() => {
    if (currentTab === 0) {
      onResetForm();
    }
  }, [currentTab]);
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
    if (oneStartDate === 'yyyymmdd') {
      setOneStartDate(selectedDate);
    } else {
      if (selectedDate < oneStartDate) {
        Alert.alert(
          'Thông báo',
          'Ngày kết thúc không thể nhỏ hơn ngày bắt đầu',
          [
            {
              text: 'Đóng',
            },
          ],
        );
        return;
      }
    }

    setOneEndDate(selectedDate);
    setShowEndDatePicker(false);
  };

  //datetime end

  const toggleSwitch = value => {
    setSwitchValue(value);
  };

  const showDatePickerStart = () => {
    setStartDatePickerVisible(true);
  };
  const hideDatePickerStart = () => {
    setStartDatePickerVisible(false);
  };
  const handleConfirmStart = val => {
    hideDatePickerStart();

    if (toDate !== 'dd/mm/yyyy') {
      if (
        moment(val).format('YYYYMMDD') >
        moment(moment(toDate, 'DD/MM/YYYY')).format('YYYYMMDD')
      ) {
        setToDate(moment(val).format('DD/MM/YYYY'));
        setColorTo(null);
      }
    } else {
      setToDate(moment(val).format('DD/MM/YYYY'));
      setColorTo(null);
    }
    setFromDate(moment(val).format('DD/MM/YYYY'));
    setOneStartDate(moment(val).format('YYYYMMDD'));
    setOneEndDate(moment(val).format('YYYYMMDD'));
    setColorFrom(null);
  };
  const showDatePickerEnd = () => {
    setEndDatePickerVisible(true);
  };
  const hideDatePickerEnd = () => {
    setEndDatePickerVisible(false);
  };
  const handleConfirmEnd = val => {
    hideDatePickerEnd();
    if (
      moment(val).format('YYYYMMDD') <
      moment(moment(fromDate, 'DD/MM/YYYY')).format('YYYYMMDD')
    ) {
      Alert.alert(
        'Thông báo',
        'Ngày kết thúc không được nhỏ hơn ngày bắt đầu.',
        [
          {
            text: 'Đóng',
          },
        ],
      );
      return;
    }
    setToDate(moment(val).format('DD/MM/YYYY'));
    setColorTo(null);
  };
  useEffect(() => {
    try {
      hanleApproveInfo();
    } catch (error) {}
  }, [DanhSachNguoiPheDuyet]);

  const hanleApproveInfo = () => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    DanhSachNguoiPheDuyet.map(x => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map(x => {
      const tempArr = DanhSachNguoiPheDuyet.filter(y => {
        return y.level_name === x;
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
          item => item.approve_role_type !== default_yn.approve_role_type,
        );
        arrApproveDefault.push(default_yn);
      }

      if (tempArr[0].required_yn === 'Y') {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      } else {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      }
      default_yn = null;
      required_yn = false;
      return;
    });
    setApproveInfo(arrApproveInfo);
    setApproveDefault(arrApproveDefault);
  };

  //handle when approve person change
  const onChangeSelectedPerson = value => {
    setCurrentSelectedPerson(value);
  };
  //handle when approve level changed
  const onChangeSelectedLevel = value => {
    setCurrentSelectedLevel(value);
  };
  const dialogError = text => {
    Alert.alert(
      'Thông báo',
      text,
      [
        {
          text: 'Đóng',
          onPress: () => console.log('Exit'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  const onResetForm = () => {
    setSwitchValue(false);
    setEndDatePickerVisible(false);
    setFromDate('dd/mm/yyyy');
    setToDate('dd/mm/yyyy');
    setWorkContent('');
    setWorkPlace('');
    setCurrentSelectedLevel({arr: [], name: 'Chọn vai trò phê duyệt'});
    setCurrentSelectedPerson({approve_name: 'Chọn người phê duyệt'});

    //
    setOneStartDate('yyyymmdd');
    setOneEndDate('yyyymmdd');

    dispatch(HRRE006SetWorkDate('dd/mm/yyyy'));
    dispatch(HRRE006SetDescription(''));
    dispatch(
      HRRE006SetStartTime({
        time: 'hh:mm',
        isShow: false,
      }),
    );
    dispatch(
      HRRE006SetEndTime({
        time: 'hh:mm',
        isShow: false,
      }),
    );
  };
  const dialogNoti = text => {
    Alert.alert(
      'Thông báo',
      text,
      [
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  const hanleNewApproveInfo = arr => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    arr.map(x => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map(x => {
      const tempArr = arr.filter(y => {
        return y.level_name === x;
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
          item => item.approve_role_type !== default_yn.approve_role_type,
        );
        arrApproveDefault.push(default_yn);
      }

      if (tempArr[0].required_yn === 'Y') {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      } else {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      }
      default_yn = null;
      required_yn = false;
      return;
    });
    setApproveInfo(arrApproveInfo);
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
        if (obj == 'postData') {
          postData();
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
  const postData = () => {
    const p_thr_emp_pk = thr_emp_pk;
    const p_from_date = moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD');
    const p_to_date = switchValue
      ? moment(toDate, 'DD/MM/YYYY').format('YYYYMMDD')
      : moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD');
    let p_start_time = startTime.time === 'hh:mm' ? '' : startTime.time;
    let p_end_time = endTime.time === 'hh:mm' ? '' : endTime.time;

    const p_description = description;
    const p_crt_by = full_name;
    const p_start_date = oneStartDate;
    // const p_end_date = moment(toDate, 'DD/MM/YYYY').format('YYYYMMDD');
    const p_end_date = oneEndDate;

    NetInfo.fetch().then(() => {
      sysFetch(
        API,
        {
          pro: 'UPDHRRE0060100',
          in_par: {
            p1_varchar2: 'INSERT',
            p2_varchar2: '', //p_table_pk
            p3_varchar2: p_thr_emp_pk,
            p4_varchar: workPlace, //work place
            p5_varchar2: workContent, //work content
            p6_varchar2: p_from_date,
            p7_varchar2: p_to_date,
            p8_varchar2: p_start_time,
            p9_varchar2: p_start_date,
            p10_varchar2: p_end_time,
            p11_varchar2: p_end_date,
            p12_varchar2: p_description,
            p13_varchar2: p_crt_by,
            p14_varchar2:
              approveInfo.length > 0 ? currentSelectedPerson.pk : '',
          },
          out_par: {
            p1_varchar2: 'status',
            p2_sys: 'noti',
            p3_sys: 'new_approve_list',
          },
        },
        tokenLogin,
      )
        .then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('postData');
          }
          if (rs != 'Token Expired') {
            if (rs.results === 'S') {
              if (rs.data.status.toString() === '2') {
                //handle changed new info
                hanleNewApproveInfo(rs.data.new_approve_list);
                setCurrentSelectedLevel({
                  arr: [],
                  name: 'Chọn vai trò phê duyệt',
                });
                setCurrentSelectedPerson({
                  approve_name: 'Chọn người phê duyệt',
                });
                Alert.alert(
                  'Thông báo',
                  `Vui lòng chọn lại thông tin người phê duyệt mới. Ngày đăng ký dữ liệu thuộc bộ phận khác`,
                  [
                    {
                      text: 'Đóng',
                    },
                  ],
                  {cancelable: false},
                );
                return;
              } else if (rs.data.status.toString() === '0') {
                Alert.alert(
                  'Thông báo',
                  'Đăng ký vắng thất bại!',
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

              dispatch(HRRE006LoadDataCongTac());
              dialogNoti('Đăng ký thành công!');
            } else if (rs.results === 'F') {
              dialogNoti(GeneralErrorFromDB(rs.errorData));
            } else {
              dialogNoti('Đăng ký thất bại!');
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };
  const validate = () => {
    if (fromDate === 'dd/mm/yyyy') {
      dialogError('Vui lòng chọn Ngày làm việc.');
      return;
    }
    if (switchValue === true) {
      if (toDate === 'dd/mm/yyyy') {
        dialogError('Vui lòng chọn ngày kết thúc.');
        return;
      }
    }

    // if (workPlace.length === 0) {
    //   Alert.alert('Thông báo', 'Vui lòng nhập nơi công tác.', [{text: 'Đóng'}]);
    //   return;
    // }

    if (workContent.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung công tác.', [
        {text: 'Đóng'},
      ]);
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

    Alert.alert(
      'Thông báo',
      'Bạn có muốn đăng ký công tác không?',
      [
        {
          text: 'Đóng',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            postData();
          },
        },
      ],
      {cancelable: false},
    );
  };

  //render view
  return (
    <Block paddingTop={10} backgroundColor={Color.gray} flex>
      <Block flex marginLeft={10} marginRight={10} marginBottom={0}>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <KeyboardAvoidingView
              style={{
                backgroundColor: 'white',
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
              keyboardVerticalOffset={Platform.select({
                ios: 130,
                android: 100,
              })}>
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <Block row justifyCenter alignCenter paddingTop={10}>
                  <Text
                    flex
                    paddingLeft={10}
                    height={60}
                    color={Color.mainColor}
                    fontFamily={'Roboto-Medium'}>
                    Đăng ký nhiều ngày
                  </Text>
                  <Switch
                    style={{marginRight: 10}}
                    onValueChange={toggleSwitch}
                    value={switchValue}
                  />
                </Block>

                <Block
                  padding={5}
                  height={70}
                  row
                  justifyContent={'space-between'}>
                  <Button nextScreen={showDatePickerStart} column flex>
                    <Block row marginBottom={4}>
                      <Text paddingLeft={5} color={Color.mainColor}>
                        {switchValue ? 'Từ ngày' : 'Ngày'}
                      </Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <Block
                      radius={6}
                      backgroundColor={Color.gray}
                      row
                      justifyContent={'space-between'}
                      alignCenter
                      padding={8}>
                      <Text
                        color={fromDate === 'dd/mm/yyyy' ? '#b2b2b2' : null}>
                        {fromDate}
                      </Text>
                      <IconDate />
                    </Block>
                  </Button>
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={startDatePickerVisible}
                    mode="date"
                    hideTitleContainerIOS={true}
                    date={
                      fromDate !== 'dd/mm/yyyy'
                        ? new Date(moment(fromDate, 'DD/MM/YYYY'))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmStart}
                    onCancel={hideDatePickerStart}
                  />
                  {switchValue ? (
                    <Block
                      alignCenter
                      justifyCenter
                      paddingTop={20}
                      width={20}
                      marginLeft={5}
                      marginRight={5}>
                      <Text>...</Text>
                    </Block>
                  ) : null}
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={endDatePickerVisible}
                    hideTitleContainerIOS={false}
                    mode="date"
                    date={
                      toDate !== 'dd/mm/yyyy'
                        ? new Date(moment(toDate, 'DD/MM/YYYY'))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmEnd}
                    onCancel={hideDatePickerEnd}
                  />
                  {switchValue ? (
                    <Button nextScreen={() => showDatePickerEnd()} column flex>
                      <Block row marginBottom={4}>
                        <Text
                          paddingLeft={10}
                          paddingTop={2}
                          color={Color.mainColor}>
                          Đến ngày
                        </Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <Block
                        backgroundColor={Color.gray}
                        radius={6}
                        row
                        justifyContent={'space-between'}
                        alignCenter
                        padding={8}>
                        <Text
                          color={toDate === 'dd/mm/yyyy' ? '#b2b2b2' : null}>
                          {toDate}
                        </Text>
                        <IconDate />
                      </Block>
                    </Button>
                  ) : null}
                </Block>
                {switchValue ? (
                  <Block
                    padding={5}
                    alignCenter
                    height={70}
                    row
                    justifyContent={'space-between'}>
                    <Button
                      nextScreen={() => {
                        dispatch(
                          HRRE006SetStartTime({
                            ...startTime,
                            isShow: true,
                          }),
                        );
                      }}
                      column
                      flex>
                      <Block row marginBottom={4}>
                        <Text
                          paddingLeft={5}
                          paddingTop={2}
                          color={Color.mainColor}>
                          Từ thời gian
                          {switchValue ? '' : <Text color={Color.red}> *</Text>}
                        </Text>
                      </Block>

                      <Block
                        backgroundColor={Color.gray}
                        radius={8}
                        row
                        justifyContent={'space-between'}
                        padding={10}>
                        <Text
                          color={startTime.time === 'hh:mm' ? '#b2b2b2' : ''}>
                          {startTime.time}
                        </Text>
                        <IconTime />
                      </Block>
                    </Button>
                    <Block
                      alignCenter
                      justifyCenter
                      paddingTop={20}
                      width={20}
                      margin={5}>
                      <Text>...</Text>
                    </Block>
                    <Button
                      nextScreen={() => {
                        dispatch(
                          HRRE006SetEndTime({
                            ...endTime,
                            isShow: true,
                          }),
                        );
                      }}
                      column
                      flex>
                      <Block row marginBottom={4}>
                        <Text
                          paddingLeft={5}
                          paddingTop={2}
                          color={Color.mainColor}>
                          Đến thời gian
                          {switchValue ? '' : <Text color={Color.red}> *</Text>}
                        </Text>
                      </Block>

                      <Block
                        backgroundColor={Color.gray}
                        radius={8}
                        row
                        justifyContent={'space-between'}
                        padding={10}>
                        <Text color={endTime.time === 'hh:mm' ? '#b2b2b2' : ''}>
                          {endTime.time}
                        </Text>
                        <IconTime />
                      </Block>
                    </Button>
                  </Block>
                ) : (
                  <>
                    {/* if selected one day  - start */}
                    <Block
                      row
                      borderBottomWidth={1}
                      borderBottomColor={'#F4F6F7'}
                      alignCenter
                      padding={5}
                      justifyContent={'center'}>
                      <Text
                        style={{marginRight: 10, color: Color.primaryColor}}
                        flex={1}>
                        Từ thời gian <Text style={{color: 'red'}}>*</Text>
                      </Text>
                      <View flex={2} style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(
                              HRRE006SetStartTime({
                                ...startTime,
                                isShow: true,
                              }),
                            );
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
                            color={startTime.time === 'hh:mm' ? '#b2b2b2' : ''}>
                            {startTime.time}
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
                              color:
                                oneStartDate === 'yyyymmdd'
                                  ? '#b2b2b2'
                                  : 'black',
                            }}>
                            {oneStartDate.substr(6, 2)}/
                            {oneStartDate.substr(4, 2)}/
                            {oneStartDate.substr(0, 4)}
                          </Text>
                          <Modal
                            animationType="fade"
                            transparent={true}
                            visible={ShowStartDatePicker}>
                            <Button
                              nextScreen={() => setShowStartDatePicker(false)}
                              height={Platform.OS === 'ios' ? 160 : 130}
                              backgroundColor={'rgba(0,0,0,0.4)'}
                            />
                            <View
                              style={{
                                padding: 10,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                              }}>
                              <Calender
                                getStateCalendar={onSelectedStartDate}
                              />
                            </View>
                            <Button
                              nextScreen={() => setShowStartDatePicker(false)}
                              flex
                              backgroundColor={'rgba(0,0,0,0.4)'}
                            />
                          </Modal>
                        </TouchableOpacity>
                      </View>
                    </Block>

                    <Block
                      row
                      borderBottomWidth={1}
                      borderBottomColor={'#F4F6F7'}
                      alignCenter
                      padding={5}
                      justifyContent={'center'}>
                      <Text
                        style={{marginRight: 10, color: Color.primaryColor}}
                        flex={1}>
                        Đến thời gian <Text style={{color: 'red'}}>*</Text>
                      </Text>
                      <View flex={2} style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(
                              HRRE006SetEndTime({
                                ...endTime,
                                isShow: true,
                              }),
                            );
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
                            color={endTime.time === 'hh:mm' ? '#b2b2b2' : ''}>
                            {endTime.time}
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
                              color:
                                oneEndDate === 'yyyymmdd' ? '#b2b2b2' : 'black',
                            }}>
                            {oneEndDate.substr(6, 2)}/{oneEndDate.substr(4, 2)}/
                            {oneEndDate.substr(0, 4)}
                          </Text>
                          <Modal
                            animationType="fade"
                            transparent={true}
                            visible={ShowEndDatePicker}>
                            <Button
                              nextScreen={() => setShowEndDatePicker(false)}
                              height={Platform.OS === 'ios' ? 160 : 130}
                              backgroundColor={'rgba(0,0,0,0.4)'}
                            />
                            <View
                              style={{
                                padding: 10,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                              }}>
                              <Calender getStateCalendar={onSelectedEndDate} />
                            </View>
                            <Button
                              nextScreen={() => setShowEndDatePicker(false)}
                              flex
                              backgroundColor={'rgba(0,0,0,0.4)'}
                            />
                          </Modal>
                        </TouchableOpacity>
                      </View>
                    </Block>
                    {/* if selected one day  - end*/}
                  </>
                )}
                {/* Nơi công tác */}
                <Block row justifyCenter alignCenter paddingTop={10}>
                  <Text
                    flex
                    paddingLeft={10}
                    height={60}
                    color={Color.mainColor}>
                    Nơi công tác
                  </Text>
                </Block>
                <Block
                  backgroundColor={Color.gray}
                  margin={5}
                  radius={7}
                  padding={10}>
                  <TextInput
                    placeholder={'Nhập nơi công tác'}
                    value={workPlace}
                    onChangeText={text => setWorkPlace(text)}
                  />
                </Block>
                {/* Nội dung */}
                <Block row justifyCenter alignCenter paddingTop={10}>
                  <Text
                    flex
                    paddingLeft={10}
                    height={60}
                    color={Color.mainColor}>
                    Nội dung <Text style={{color: 'red'}}>*</Text>
                  </Text>
                </Block>
                <View
                  style={{
                    backgroundColor: Color.gray,
                    marginHorizontal: 5,
                    borderRadius: 7,
                    marginTop: 5,
                    padding: 10,
                    minHeight: 60,
                  }}>
                  <TextInput
                    multiline={true}
                    placeholder={'Nhập nội dung'}
                    value={workContent}
                    onChangeText={text => setWorkContent(text)}
                  />
                </View>
                {/* ghi chu */}
                <Block row justifyCenter alignCenter paddingTop={10}>
                  <Text
                    flex
                    paddingLeft={10}
                    height={60}
                    color={Color.mainColor}>
                    Ghi chú
                  </Text>
                </Block>
                <View
                  style={{
                    backgroundColor: Color.gray,
                    marginHorizontal: 5,
                    borderRadius: 7,
                    marginTop: 5,
                    padding: 10,
                  }}>
                  <TextInput
                    placeholder={'Nhập ghi chú'}
                    value={description}
                    onChangeText={text => dispatch(HRRE006SetDescription(text))}
                  />
                </View>
                {/* approve info start */}
                {approveInfo.length > 0 ? (
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
                        <Text color={Color.mainColor} fontWeight={'bold'}>
                          Thông tin người phê duyệt
                        </Text>
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
                ) : null}
                {limitDate.note ? (
                  <Block style={{paddingHorizontal: 10}}>
                    <Text style={{color: 'red', fontSize: 12}}>
                      {limitDate.note}
                    </Text>
                  </Block>
                ) : null}
                {/* approve info end */}
                <Block
                  marginBottom={Platform.OS === 'ios' ? 12 : 10}
                  flexDirection={'row'}
                  alignCenter
                  justifyCenter>
                  <TVSButton
                    icon={'sync'}
                    type={'secondary'}
                    onPress={onResetForm}>
                    Đăng ký mới
                  </TVSButton>
                  <TVSButton icon={'content-save'} onPress={validate}>
                    Sao lưu
                  </TVSButton>
                </Block>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </Block>
      </Block>
    </Block>
  );
};
export default DK_MBHRRE006;

// control listbox vai tro phe duyet
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
      <Text
        color={Color.mainColor}
        flexWrap={'wrap'}
        paddingLeft={5}
        paddingRight={5}>
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
// control listbox nguoi phe duyet
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
      <Text
        color={Color.mainColor}
        flexWrap={'wrap'}
        paddingLeft={5}
        paddingRight={5}>
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
