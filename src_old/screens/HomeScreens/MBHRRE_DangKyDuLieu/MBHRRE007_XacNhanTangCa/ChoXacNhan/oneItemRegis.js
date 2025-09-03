import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import OneField from '../../../../../components/OneFieldKeyValue';
import TextInput from '../../../../../components/TextInput';
import TVSButton from '../../../../../components/Tvs/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectLevelApprove from './selectApproveLevel';
import SelectApprovePerson from './selectApprovePerson';
import TimeSlot from './timeSlot';
import moment from 'moment';
import sysFetch from '../../../../../services/fetch_v1';
import RequestSendNotification from '../../../../../services/notification/send';
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import {APP_VERSION} from '../../../../../config/Pro';
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

const OneItemRegis = ({item, approveInfo, limit_reg_date, onReload}) => {
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  let P_FULL_NAME = useSelector(
    state => state.loginReducers.data.data.full_name,
  );
  let P_THR_EMP_PK = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  //current approve info then process
  const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
    arr: [],
    name: 'Chọn vai trò phê duyệt',
  });
  const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
    approve_name: 'Chọn người phê duyệt',
  });
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
    onResetCard();
  }, [approveInfo]);

  //when accept timeslot
  const onAcceptTimeSlot = currentData => {
    setTimeSlot(currentData);
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

  //handle when approve level changed
  const onChangeSelectedLevel = value => {
    setCurrentSelectedLevel(value);
  };

  //handle when approve person change
  const onChangeSelectedPerson = value => {
    setCurrentSelectedPerson(value);
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
    // const hTemp = workTime.toString().replace(',', '.').split('.');
    // if (hTemp[1] === undefined) {
    //   hTemp[1] = '0';
    // }
    // if (
    //   hTemp.length > 2 ||
    //   hTemp[0].length > 2 ||
    //   hTemp[0] > 24 ||
    //   hTemp[0] < 0 ||
    //   hTemp[1].length > 2
    // ) {
    //   dialogError('Nhập giờ tăng ca xác nhận chưa đúng. Vui lòng thử lại');
    //   return;
    // }

    // if (
    //   hTemp[1].toString() !== '00' &&
    //   hTemp[1].toString() !== '0' &&
    //   hTemp[1].toString() !== '25' &&
    //   hTemp[1].toString() !== '50' &&
    //   hTemp[1].toString() !== '5' &&
    //   hTemp[1].toString() !== '75'
    // ) {
    //   dialogError('Vui lòng nhập thời gian theo mốc 00, 25, 50, 75');
    //   return;
    // }

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
    sysFetch(
      API,
      {
        // pro: 'UPDHRRE0070101',
        pro: 'UPDHRRE007000',
        in_par: {
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
          p13_varchar2:
            approveInfo.length > 0 ? currentSelectedPerson.level_type : '',
          p14_varchar2:
            approveInfo.length > 0 ? currentSelectedPerson.thr_emp_pk : '',
          p15_varchar2: APP_VERSION,
          p16_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: 'upd_xntc',
          p2_sys: 'noti',
        },
      },
      tokenLogin,
    ).then(res => {
      console.log(res);
      if (res == 'Token Expired') {
        refreshNewToken('onRequestData');
      }

      if (res != 'Token Expired') {
        if (res.results === 'S') {
          if (res.data.upd_xntc.toString() === '0') {
            Alert.alert(
              'Thông báo',
              'Xác nhận tăng ca thất bại!',
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
          RequestSendNotification(res.data.noti, API, tokenLogin);

          Alert.alert(
            'Thông báo',
            'Xác nhận tăng ca thành công!',
            [
              {
                text: 'Thoát',
                onPress: () => {
                  onReload();
                },
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        } else if (res.results === 'F') {
          var newText = res.errorData.split(':');
          let errors = newText[1].trim().split('\n')[0];
          dialogError(errors);
        }
        //  else {
        //   dialogError('Đăng ký thất bại!');
        // }
      }
    });
  };
  const Color = useSelector(s => s.SystemReducer.theme);
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

          {parseInt(item['0_work_dt']) < parseInt(limit_reg_date) ? null : (
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
              {approveInfo.length > 0 ? (
                <Block borderBottomWidth={1} borderBottomColor={'#F4F6F7'}>
                  <Block style={{marginTop: 20}}>
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
                        style={{
                          position: 'absolute',
                          top: -20,
                          backgroundColor: 'white',
                          left: 0,
                        }}>
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
                          orgPk={item['0_org_pk']}
                        />
                        <SelectApprovePerson
                          currentSelectedLevel={currentSelectedLevel}
                          currentSelectedPerson={currentSelectedPerson}
                          onChangeSelectedPerson={onChangeSelectedPerson}
                          orgPk={item['0_org_pk']}
                        />
                      </Block>
                    </Block>
                    {/* approve info end */}
                  </Block>
                </Block>
              ) : null}
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
          <Block justifyCenter alignCenter flex row padding={10}>
            <TVSButton
              disabled={parseInt(item['0_work_dt']) < parseInt(limit_reg_date)}
              onPress={() => setIsShowTimeSlot(true)}
              icon={'plus'}
              type={'secondary'}>
              Thêm khung giờ
            </TVSButton>
            <TVSButton
              disabled={parseInt(item['0_work_dt']) < parseInt(limit_reg_date)}
              onPress={onSave}
              icon={'check'}>
              Xác nhận
            </TVSButton>
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default OneItemRegis;
