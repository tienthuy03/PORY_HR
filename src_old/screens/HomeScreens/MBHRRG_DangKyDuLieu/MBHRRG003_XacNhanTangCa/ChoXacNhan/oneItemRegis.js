import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import OneField from '../../../../../components/OneFieldKeyValue';
import TextInput from '../../../../../components/TextInput';
import TVSButton from '../../../../../components/Tvs/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TimeSlot from './timeSlot';
import moment from 'moment';
import sysFetch from '../../../../../services/fetch_v1';
import RequestSendNotification from '../../../../../services/notification/send';
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import {APP_VERSION} from '../../../../../config/Pro';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup2';
import Button from '../../../../../components/Button';
const dialogError = text => {
  Alert.alert(
    'Thông báo',
    text,
    [
      {
        text: 'Thoát',
        onPress: () => console.log('close'),
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
};

const OneItemRegis = ({
  item,
  dataApprove,
  dataApproveDefault,
  limitRegDt,
  onReload,
}) => {
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  let P_THR_EMP_PK = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  const [workTime, setWorkTime] = useState('');
  const [description, setDescription] = useState('');
  //initial state for show timeslot
  const [isShowTimeSlot, setIsShowTimeSlot] = useState(false);

  //time slot state
  const [timeSlot, setTimeSlot] = useState({
    hasData: false,
    dateStart1: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
    dateStart2: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
    dateEnd1: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
    dateEnd2: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
    eat1: false,
    eat2: false,
    timeEnd1: '',
    timeEnd2: '',
    timeStart1: '',
    timeStart2: '',
  });

  //effect changed data
  useEffect(() => {
    console.log('oneItem');
    // onResetCard();
    let dataSelectApprove = [];
    dataApproveDefault.forEach(function (item) {
      dataSelectApprove.push({
        approve_role_type: item.approve_role_type,
        thr_emp_pk: item.thr_emp_pk,
        level_name: item.level_name,
        approve_name: item.approve_name,
        approve_level: item.approve_level,
        full_nm: item.full_nm,
      });
    });
    setDataInsertApprove(dataApproveDefault);
    setDataSelectedApprove(dataSelectApprove);
    hanleApproveInfo(dataApprove);
    // setApproveInfo(dataApprove);
  }, [dataApprove]);

  //when accept timeslot
  const onAcceptTimeSlot = currentData => {
    setTimeSlot(currentData);
    setIsShowTimeSlot(false);
  };

  //reset card
  const onResetCard = () => {
    setCurrentSelectedLevel({
      arr: [],
      name: 'Chọn vai trò phê duyệt',
    });
    setCurrentSelectedPerson({
      approve_name: 'Chọn người phê duyệt',
    });
    setWorkTime('');
    setDescription('');

    setIsShowTimeSlot(false);
    //time slot state
    setTimeSlot({
      hasData: false,
      dateStart1: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
      dateStart2: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
      dateEnd1: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
      dateEnd2: moment(item['0_work_dt'], 'YYYYMMDD').format('DD/MM/YYYY'),
      eat1: false,
      eat2: false,
      timeEnd1: '',
      timeEnd2: '',
      timeStart1: '',
      timeStart2: '',
    });
  };

  //handle set popup time slot hide
  const onHideTimeslot = () => {
    setIsShowTimeSlot(false);
  };

  //handle change time of one card
  const onChangedTime = value => {
    setWorkTime(value);
  };

  //handle add description for one card
  const onChangedDescription = value => {
    setDescription(value);
  };

  //handle on press save button and request to server
  const onSave = () => {
    const ot_tt = item['0_ot_tt'];

    if (!workTime) {
      dialogError('Bạn phải nhập giờ tăng ca xác nhận!');
      return;
    } else if (parseInt(workTime) > 24) {
      dialogError('Bạn phải số giờ tăng ca nhỏ hơn 24!');
      return;
    }

    if (!description) {
      dialogError('Bạn phải nhập mô tả công việc đã làm thêm!');
      return;
    }

    // if (dataApprove.length > 0) {
    //   if (currentSelectedLevel.arr.length === 0) {
    //     Alert.alert('Thông báo', 'Bạn chưa chọn vai trò phê duyệt.', [
    //       {text: 'Đóng'},
    //     ]);
    //     return;
    //   }

    //   if (!currentSelectedPerson.pk) {
    //     Alert.alert('Thông báo', 'Bạn chưa chọn người phê duyệt.', [
    //       {text: 'Đóng'},
    //     ]);
    //     return;
    //   }
    // }

    Alert.alert(
      'Thông báo',
      'Bạn có muốn xác nhận?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Chấp nhận',
          onPress: async () => {
            //request data to server
            onRequestData();
          },
        },
      ],
      {cancelable: false},
    );
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
        if (obj == 'onRequestData') {
          onRequestData();
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
  const onRequestData = () => {
    const ot_tt = item['0_ot_tt'];
    let lst_approve_pk = '';
    let lst_role_type = '';
    dataInsertApprove.forEach(function (item) {
      lst_approve_pk += item.thr_emp_pk + '|';
      lst_role_type += item.approve_role_type + '|';
    });
    console.log({
      p1_varchar2: 'INSERT',
      p2_varchar2: '',
      p3_varchar2: workTime,
      p4_varchar2: description,
      p5_varchar2: timeSlot.timeStart1
        ? moment(timeSlot.dateStart1, 'DD/MM/YYYY').format('YYYYMMDD') +
          '' +
          timeSlot.timeStart1
        : '',
      p6_varchar2: timeSlot.timeEnd1
        ? moment(timeSlot.dateEnd1, 'DD/MM/YYYY').format('YYYYMMDD') +
          '' +
          timeSlot.timeEnd1
        : '',
      p7_varchar2: timeSlot.eat1 ? 'Y' : 'N',
      p8_varchar2: timeSlot.timeStart2
        ? moment(timeSlot.dateStart2, 'DD/MM/YYYY').format('YYYYMMDD') +
          '' +
          timeSlot.timeStart2
        : '',
      p9_varchar2: timeSlot.timeEnd2
        ? moment(timeSlot.dateEnd2, 'DD/MM/YYYY').format('YYYYMMDD') +
          '' +
          timeSlot.timeEnd2
        : '',
      p10_varchar2: timeSlot.eat2 ? 'Y' : 'N',
      p11_varchar2: item['0_work_dt'],
      p12_varchar2: P_THR_EMP_PK,
      p13_varchar2: lst_approve_pk,
      p14_varchar2: lst_role_type,
      p15_varchar2: dataInsertApprove.length,
      p16_varchar2: APP_VERSION,
      p17_varchar2: crt_by,
    });
    // sysFetch(
    //   API,
    //   {
    //     pro: 'UPDHRRE007000',
    //     in_par: {
    //       p1_varchar2: 'INSERT',
    //       p2_varchar2: '',
    //       p3_varchar2: workTime,
    //       p4_varchar2: description,
    //       p5_varchar2: timeSlot.timeStart1
    //         ? moment(timeSlot.dateStart1, 'DD/MM/YYYY').format('YYYYMMDD') +
    //           '' +
    //           timeSlot.timeStart1
    //         : '',
    //       p6_varchar2: timeSlot.timeEnd1
    //         ? moment(timeSlot.dateEnd1, 'DD/MM/YYYY').format('YYYYMMDD') +
    //           '' +
    //           timeSlot.timeEnd1
    //         : '',
    //       p7_varchar2: timeSlot.eat1 ? 'Y' : 'N',
    //       p8_varchar2: timeSlot.timeStart2
    //         ? moment(timeSlot.dateStart2, 'DD/MM/YYYY').format('YYYYMMDD') +
    //           '' +
    //           timeSlot.timeStart2
    //         : '',
    //       p9_varchar2: timeSlot.timeEnd2
    //         ? moment(timeSlot.dateEnd2, 'DD/MM/YYYY').format('YYYYMMDD') +
    //           '' +
    //           timeSlot.timeEnd2
    //         : '',
    //       p10_varchar2: timeSlot.eat2 ? 'Y' : 'N',
    //       p11_varchar2: item['0_work_dt'],
    //       p12_varchar2: P_THR_EMP_PK,
    //       p13_varchar2:
    //         dataApprove.length > 0 ? currentSelectedPerson.level_type : '',
    //       p14_varchar2:
    //         dataApprove.length > 0 ? currentSelectedPerson.thr_emp_pk : '',
    //       p15_varchar2: APP_VERSION,
    //       p16_varchar2: crt_by,
    //     },
    //     out_par: {
    //       p1_varchar2: 'upd_xntc',
    //       p2_sys: 'noti',
    //     },
    //   },
    //   tokenLogin,
    // ).then(res => {
    //   console.log(res);
    //   if (res == 'Token Expired') {
    //     refreshNewToken('onRequestData');
    //   }

    //   if (res != 'Token Expired') {
    //     if (res.results === 'S') {
    //       if (res.data.upd_xntc.toString() === '0') {
    //         Alert.alert(
    //           'Thông báo',
    //           'Xác nhận tăng ca thất bại!',
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
    //       RequestSendNotification(res.data.noti, API, tokenLogin);

    //       Alert.alert(
    //         'Thông báo',
    //         'Xác nhận tăng ca thành công!',
    //         [
    //           {
    //             text: 'Thoát',
    //             onPress: () => {
    //               onReload();
    //             },
    //             style: 'cancel',
    //           },
    //         ],
    //         {cancelable: false},
    //       );
    //     } else if (res.results === 'F') {
    //       var newText = res.errorData.split(':');
    //       let errors = newText[1].trim().split('\n')[0];
    //       dialogError(errors);
    //     }
    //   }
    // });
  };

  const [expanded, setExpanded] = useState(false);

  const [ApproveInfo, setApproveInfo] = useState([]);

  const [modalVisibleNPD, setModalVisibleNPD] = useState(false);
  const [dataSelectedApprove, setDataSelectedApprove] = useState([]);
  const [dataInsertApprove, setDataInsertApprove] = useState([]);
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
  const hanleApproveInfo = dataApprover => {
    console.log(dataApprover);
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    dataApprover.map(x => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map(x => {
      const tempArr = dataApprover.filter(y => {
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

  const onSelectApprover = () => {
    let dataSelectApprove;
    const approve_role_type = currentSelectedPerson.approve_role_type;
    const approve_role_nm = currentSelectedLevel.name;
    const approve_by_pk = currentSelectedPerson.thr_emp_pk;
    const approve_by_name = currentSelectedPerson.approve_name;
    const full_nm = currentSelectedPerson.full_nm;
    const approve_level = currentSelectedPerson.approve_level;
    dataSelectApprove = dataSelectedApprove;
    console.log('approve_role_type ', approve_role_type);
    console.log('approve_role_nm ', approve_role_nm);
    console.log('approve_by_pk ', approve_by_pk);
    console.log('approve_by_name ', approve_by_name);
    console.log('full_nm ', full_nm);
    console.log('approve_level ', approve_level);
    console.log('dataSelectApprove ', dataSelectApprove);
    if (approve_role_type == undefined || approve_by_pk == undefined) {
      Alert.alert(
        'Thông báo',
        'Vui lòng chọn vai trò và người phê duyệt!',
        [
          {
            text: 'Thoát',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
      return;
    } else {
      console.log(approve_level);
      console.log(dataSelectApprove);
      dataSelectApprove = dataSelectApprove.filter(
        item => item.approve_level != approve_level,
      );
      setDataSelectedApprove(dataSelectApprove);
      dataSelectApprove.push({
        approve_role_type: approve_role_type,
        thr_emp_pk: approve_by_pk,
        level_name: approve_role_nm,
        approve_name: approve_by_name,
        full_nm: full_nm,
        approve_level: approve_level,
      });
      setDataSelectedApprove(dataSelectApprove);
      setDataInsertApprove(dataSelectApprove);
      setModalVisibleNPD(false);
    }
  };

  const showPopupSelectApprove = (level, emp_pk) => {
    console.log(level, '|', emp_pk);
    // setCurrentSelectedLevel({arr: [], name: 'Chọn vai trò phê duyệt'});
    console.log('level ', level);
    console.log('approveInfo ', ApproveInfo);
    console.log(
      'filter ',
      ApproveInfo.filter(x => x.name == level),
    );
    setCurrentSelectedLevel(ApproveInfo.filter(x => x.name == level)[0]);
    setCurrentSelectedPerson(
      ApproveInfo.filter(x => x.name == level)[0].arr.filter(
        y => y.thr_emp_pk == emp_pk,
      )[0],
    );
    // setCurrentSelectedPerson({approve_name: 'Chọn người phê duyệt'});
    console.log('show');
    setModalVisibleNPD(true);
  };
  const SelectLevelApprove = ({
    onChangeSelectedPerson,
    currentSelectedLevel,
    onChangeSelectedLevel,
    ApproveInfo,
  }) => {
    const Color = useSelector(s => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 10,
        }}>
        <Block
          style={{
            flexDirection: 'row',
            paddingBottom: 5,
            paddingLeft: 5,
            alignItems: 'center',
          }}>
          <Text color={Color.mainColor}>Vai trò phê duyệt</Text>
          <Text color={Color.red}> *</Text>
        </Block>

        <View
          style={{
            backgroundColor: Color.gray,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 6,
          }}>
          <Button
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}
            // nextScreen={() => setIsShow(!isShow)}
          >
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
            {/* <Icon name={'chevron-down'} color={Color.mainColor} size={24} /> */}
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}>
              {ApproveInfo.map((item, index) => {
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
                      padding: 10,
                      backgroundColor: 'white',
                      marginBottom: 1,
                      borderRadius: 6,
                      alignItems: 'flex-start',
                    }}>
                    <Text flexWrap={'wrap'} paddingLeft={5} paddingRight={5}>
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
          marginBottom: 10,
        }}>
        <Block
          style={{
            flexDirection: 'row',
            paddingBottom: 5,
            paddingLeft: 5,
            alignItems: 'center',
          }}>
          <Text color={Color.mainColor}>Người phê duyệt</Text>
          <Text color={Color.red}> *</Text>
        </Block>

        <View
          style={{
            backgroundColor: Color.gray,
            paddingHorizontal: 10,
            paddingVertical: 5,
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
                    currentSelectedPerson.approve_name ===
                    'Chọn người phê duyệt'
                      ? '#B2B2B2'
                      : null,
                }}>
                {currentSelectedPerson.approve_name}
              </Text>
            </View>
            <Icon name={'chevron-down'} color={Color.mainColor} size={30} />
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}>
              <ScrollView style={{maxHeight: 150}}>
                {currentSelectedLevel.arr.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedPerson(item);
                      }}
                      key={index.toString()}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: 10,
                        backgroundColor: 'white',
                        marginBottom: 1,
                        borderRadius: 6,
                      }}>
                      <Text flexWrap={'wrap'} paddingLeft={5} paddingRight={5}>
                        {item.approve_name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };
  const modalNPD = (
    <TVSControlPopup
      title={'Chọn người phê duyệt'}
      isShow={modalVisibleNPD}
      minHeight={500}
      onHide={() => setModalVisibleNPD(false)}
      onAccept={() => onUpdateApprove()}
      bottom={
        <TVSButton
          onPress={() => setModalVisibleNPD(false)}
          buttonStyle={'3'}
          type={'danger'}
          icon={'close'}>
          Đóng lại
        </TVSButton>
      }>
      <Block>
        <SelectLevelApprove
          onChangeSelectedPerson={onChangeSelectedPerson}
          currentSelectedLevel={currentSelectedLevel}
          ApproveInfo={ApproveInfo}
          onChangeSelectedLevel={onChangeSelectedLevel}
        />
        <SelectApprovePerson
          currentSelectedLevel={currentSelectedLevel}
          currentSelectedPerson={currentSelectedPerson}
          onChangeSelectedPerson={onChangeSelectedPerson}
        />
      </Block>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <TVSButton
            onPress={onSelectApprover}
            type={'primary'}
            icon={'account-edit'}
            buttonStyle={'3'}>
            Chọn
          </TVSButton>
        </View>
      </View>
    </TVSControlPopup>
  );
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
      marginTop: 10,
    },
    titleText: {
      flexDirection: 'row',
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: 'center',
    },
    dropdownlistContainer: {
      paddingVertical: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      flexDirection: 'row',
      backgroundColor: Color.gray,
    },
    dropdownlistChild: {
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: Color.gray,
      borderWidth: 2,
      paddingVertical: 10,
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: Color.tabColor,
    },
    dropdownlistChildHasAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: 'lightgray',
      borderWidth: 2,
      height: 120,
      justifyContent: 'center',
    },
    dropdownlistChildNoAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: 'lightgray',
      borderWidth: 2,
      borderStyle: 'dashed',
      height: 120,
      justifyContent: 'center',
    },
  });
  return (
    <>
      <TimeSlot
        data={timeSlot}
        onAcceptTimeSlot={onAcceptTimeSlot}
        isShow={isShowTimeSlot}
        onHide={onHideTimeslot}
        workDt={item['0_work_dt']}
      />
      <Block shadow flex marginLeft={10} marginRight={10} marginBottom={10}>
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
          {Object.entries(item).map(x => {
            return (
              (x[0].substr(0, 1).toString() === '1' ||
                x[0].substr(0, 1).toString() === '3') && (
                <OneField
                  value={x[1]}
                  keyName={
                    x[0].substring(2, 3).toUpperCase() +
                    x[0].substring(3, x[0].length)
                  }
                />
              )
            );
          })}

          {parseInt(item['0_work_dt']) < parseInt(limitRegDt) ? null : (
            <>
              <Block
                row
                borderBottomWidth={1}
                borderBottomColor={'#F4F6F7'}
                paddingTop={5}
                paddingBottom={5}
                paddingRight={5}
                paddingLeft={5}
                alignCenter
                justifyContent={'space-between'}>
                <Text color={Color.mainColor} flex={1}>
                  Giờ tăng ca xác nhận(NLĐ)
                </Text>
                <Block
                  backgroundColor={Color.gray}
                  radius={6}
                  height={40}
                  alignCenter
                  borderWidth={1}
                  borderColor={Color.white}
                  justifyCenter>
                  <TextInput
                    style={{
                      minWidth: 100,
                      padding: 5,
                      textAlign: 'center',
                    }}
                    placeholder={'Nhập số giờ'}
                    keyboardType="numeric"
                    onChangeText={onChangedTime}
                    value={workTime.toString()}
                  />
                </Block>
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
                  Công việc làm thêm
                </Text>
                <Block
                  flex
                  backgroundColor={Color.gray}
                  borderWidth={1}
                  borderColor={Color.white}
                  padding={5}
                  radius={7}>
                  <TextInput
                    style={{
                      padding: 10,
                    }}
                    multiline={true}
                    placeholder={'Nhập công việc làm thêm'}
                    value={description}
                    onChangeText={onChangedDescription}
                    flexWrap={'wrap'}
                  />
                </Block>
              </Block>
              {/* Control chon nguoi phe duyet */}
              <TouchableOpacity
                style={styles.titleContainer}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setExpanded(!expanded);
                }}>
                <View style={styles.dropdownlistContainer}>
                  <View
                    style={{
                      marginLeft: 5,
                    }}>
                    <Icon
                      name={'account-check-outline'}
                      size={30}
                      color={'#5A94E7'}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 5,
                      justifyContent: 'center',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: Color.mainColor,
                          paddingLeft: 5,
                        }}>
                        Danh sách phê duyệt
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      minWidth: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 5,
                      marginRight: 5,
                    }}>
                    <Text
                      style={{
                        color: 'red',
                        fontWeight: 'bold',
                      }}>
                      {dataInsertApprove.length}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      size={30}
                      color={Color.mainColor}
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {expanded && (
                <ScrollView maxHeight={100} style={{marginBottom: 10}}>
                  {dataInsertApprove.length > 0
                    ? dataInsertApprove.map(item => (
                        <TouchableOpacity
                          onPress={() =>
                            showPopupSelectApprove(
                              item.level_name,
                              item.thr_emp_pk,
                            )
                          }>
                          <View style={styles.dropdownlistChild}>
                            <View
                              style={{
                                flex: 1,
                                marginLeft: 5,
                                justifyContent: 'center',
                              }}>
                              <View>
                                <Text style={{color: Color.mainColor}}>
                                  {item.approve_name}
                                </Text>
                              </View>
                            </View>

                            <View style={{marginRight: 5}}>
                              <Icon
                                size={20}
                                color={Color.mainColor}
                                name={'pencil-outline'}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    : null}
                </ScrollView>
              )}

              {/* Control button */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  marginBottom: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View>
                  <TVSButton
                    buttonStyle={'3'}
                    type={'secondary'}
                    disabled={
                      parseInt(item['0_work_dt']) < parseInt(limitRegDt)
                    }
                    onPress={() => setIsShowTimeSlot(true)}
                    icon={'plus'}
                    minWidth={150}>
                    Thêm khung giờ
                  </TVSButton>
                </View>
                <View>
                  <TVSButton
                    buttonStyle={'3'}
                    disabled={
                      parseInt(item['0_work_dt']) < parseInt(limitRegDt)
                    }
                    onPress={onSave}
                    icon={'check'}
                    minWidth={150}>
                    Xác nhận
                  </TVSButton>
                </View>
              </View>
            </>
          )}
          {item['0_note'].length !== 0 && (
            <Block
              style={{
                flex: 1,
                justifyCenter: 'center',
                padding: 10,
              }}>
              <Text style={{color: 'red'}}>{item['0_note']}</Text>
            </Block>
          )}
        </Block>
      </Block>
      {modalNPD}
    </>
  );
};

export default OneItemRegis;
