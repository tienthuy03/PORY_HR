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
  ScrollView,
  LayoutAnimation,
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
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup2';
import GeneralErrorFromDB from '../../../../../services/errors/generalErrorFormDB';
import RequestSendNotification from '../../../../../services/notification/send_v1';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch_v1';
import {APP_VERSION} from '../../../../../config/Pro';
const {width} = Dimensions.get('window');
const ChoXacNhan = ({
  data,
  dataApprove,
  dataApproveDefault,
  limitRegDt,
  note,
  dataReason,
  onReload,
}) => {
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

  const thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  const crt_by = useSelector(state => state.loginReducers.data.data.crt_by);

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

  const RenderOneItem = ({
    oneItem,
    dataApprove,
    dataApproveDefault,
    limitRegDt,
  }) => {
    //current approve info then process
    const dispatch = useDispatch();
    const [isProcess, setIsProcess] = useState(true);
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
    const [expanded, setExpanded] = useState(false);

    const [approveInfo, setApproveInfo] = useState([]);

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
      console.log('approveInfo ', approveInfo);
      console.log(
        'filter ',
        approveInfo.filter(x => x.name == level),
      );
      setCurrentSelectedLevel(approveInfo.filter(x => x.name == level)[0]);
      setCurrentSelectedPerson(
        approveInfo
          .filter(x => x.name == level)[0]
          .arr.filter(y => y.thr_emp_pk == emp_pk)[0],
      );
      // setCurrentSelectedPerson({approve_name: 'Chọn người phê duyệt'});
      console.log('show');
      setModalVisibleNPD(true);
    };
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
                        <Text
                          flexWrap={'wrap'}
                          paddingLeft={5}
                          paddingRight={5}>
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
            approveInfo={approveInfo}
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

      // if (approveInfo.length > 0) {
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
      let lst_approve_pk = '';
      let lst_role_type = '';
      dataInsertApprove.forEach(function (item) {
        lst_approve_pk += item.thr_emp_pk + '|';
        lst_role_type += item.approve_role_type + '|';
      });
      console.log({
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
        p11_varchar2: lst_approve_pk,
        p12_varchar2: lst_role_type,
        p13_varchar2: dataInsertApprove.length,
        p14_varchar2: APP_VERSION,
        p15_varchar2: crt_by,
      });

      Alert.alert('Thông báo', 'Bạn có muốn xác nhận bổ sung công không?', [
        {text: 'Hủy bỏ'},
        {
          text: 'Xác nhận',
          onPress: () => {
            sysFetch(
              API,
              {
                pro: 'UPDHRRG004000',
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
                  p11_varchar2: lst_role_type,
                  p12_varchar2: lst_approve_pk,
                  p13_varchar2: dataInsertApprove.length,
                  p14_varchar2: APP_VERSION,
                  p15_varchar2: crt_by,
                },
                out_par: {
                  p1_varchar2: 'flash_result',
                  p2_sys: 'noti',
                },
              },
              tokenLogin,
            )
              .then(rs => {
                console.log(rs);
                if (rs == 'Token Expired') {
                  // refreshNewToken('onSave');
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
          },
        },
      ]);
    };

    return (
      // !isProcess && (
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
          title="Lý do"
          bottom={
            <TVSButton
              onPress={() => setShowChonLyDo(false)}
              buttonStyle={'3'}
              type={'danger'}
              icon={'close'}>
              Đóng lại
            </TVSButton>
          }>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={dataReason}
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
          title={'Chọn ngày'}
          bottom={
            <TVSButton
              onPress={() => setShowStartDatePicker(false)}
              buttonStyle={'3'}
              type={'danger'}
              icon={'close'}>
              Đóng lại
            </TVSButton>
          }>
          <Calender getStateCalendar={onSelectedStartDate} />
        </TVSControlPopup>
        <TVSControlPopup
          isShow={ShowEndDatePicker}
          onHide={() => setShowEndDatePicker(false)}
          title={'Chọn ngày'}
          maxHeight={500}
          bottom={
            <TVSButton
              onPress={() => setShowEndDatePicker(false)}
              buttonStyle={'3'}
              type={'danger'}
              icon={'close'}>
              Đóng lại
            </TVSButton>
          }>
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
                  keyName={oitem[0].charAt(2).toUpperCase() + oitem[0].slice(3)}
                  value={oitem[1]}
                  key={index}
                />
              );
            }
          })}
          {parseInt(item['0_work_dt']) < parseInt(limitRegDt) ? null : (
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
                        showPopupSelectApprove(item.level_name, item.thr_emp_pk)
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
              disabled={parseInt(item['0_work_dt']) < parseInt(limitRegDt)}
              onPress={onSave}
              buttonStyle={'3'}
              icon={'check'}>
              Xác nhận
            </TVSButton>
          </Block>
        </Block>
        {modalNPD}
      </Block>
    );
    // );
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
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item => (
                <RenderOneItem
                  oneItem={item}
                  dataApprove={dataApprove}
                  dataApproveDefault={dataApproveDefault}
                  limitRegDt={limitRegDt}
                />
              )}
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
      onAccept={accept}
      bottom={
        <>
          <View>
            <TVSButton
              onPress={() => accept()}
              buttonStyle={'3'}
              // type={'danger'}
              icon={'check'}>
              Xác nhận
            </TVSButton>
          </View>
          <View>
            <TVSButton
              onPress={() => onCloseSelectTimeIn()}
              buttonStyle={'3'}
              type={'danger'}
              icon={'close'}>
              Đóng lại
            </TVSButton>
          </View>
        </>
      }>
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
      onAccept={accept}
      bottom={
        <>
          <View>
            <TVSButton
              onPress={() => accept()}
              buttonStyle={'3'}
              // type={'danger'}
              icon={'check'}>
              Xác nhận
            </TVSButton>
          </View>
          <View>
            <TVSButton
              onPress={() => onCloseSelectTimeOut()}
              buttonStyle={'3'}
              type={'danger'}
              icon={'close'}>
              Đóng lại
            </TVSButton>
          </View>
        </>
      }>
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

// const SelectLevelApprove = ({
//   onChangeSelectedPerson,
//   currentSelectedLevel,
//   onChangeSelectedLevel,
//   approveInfo,
// }) => {
//   const Color = useSelector(s => s.SystemReducer.theme);
//   const [isShow, setIsShow] = useState(false);

//   return (
//     <View
//       style={{
//         marginTop: 10,
//       }}>
//       <Text flexWrap={'wrap'} paddingLeft={5} paddingRight={5}>
//         Vai trò phê duyệt <Text style={{color: 'red'}}>*</Text>
//       </Text>
//       <View
//         style={{
//           backgroundColor: Color.gray,
//           padding: 10,
//           marginTop: 5,
//           borderBottomColor: Color.inputBackgroundColor,
//           borderBottomWidth: 1,
//           borderRadius: 6,
//         }}>
//         <Button
//           style={{
//             alignItems: 'center',
//             flexDirection: 'row',
//           }}
//           nextScreen={() => setIsShow(!isShow)}>
//           <View
//             style={{
//               flex: 1,
//             }}>
//             <Text
//               style={{
//                 color:
//                   currentSelectedLevel.name === 'Chọn vai trò phê duyệt'
//                     ? '#B2B2B2'
//                     : null,
//               }}>
//               {currentSelectedLevel.name}
//             </Text>
//           </View>
//           <Icon
//             name={'arrow-down-drop-circle-outline'}
//             color={Color.mainColor}
//             size={24}
//           />
//         </Button>
//         {isShow && (
//           <View
//             style={{
//               marginTop: 10,
//             }}>
//             {approveInfo.map((item, index) => {
//               if (item.name === currentSelectedLevel.name) {
//                 return null;
//               }

//               return (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setIsShow(false);
//                     onChangeSelectedLevel(item);
//                     onChangeSelectedPerson({
//                       approve_name: 'Chọn người phê duyệt',
//                     });
//                   }}
//                   key={index.toString()}
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     padding: 10,
//                     backgroundColor: 'white',
//                     marginBottom: 5,
//                     borderRadius: 6,
//                   }}>
//                   <Text
//                     flex={1}
//                     flexWrap={'wrap'}
//                     paddingLeft={5}
//                     paddingRight={5}>
//                     {item.name}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const SelectApprovePerson = ({
//   currentSelectedPerson,
//   onChangeSelectedPerson,
//   currentSelectedLevel,
// }) => {
//   const Color = useSelector(s => s.SystemReducer.theme);
//   const [isShow, setIsShow] = useState(false);

//   return (
//     <View
//       style={{
//         marginTop: 10,
//       }}>
//       <Text flexWrap={'wrap'} paddingLeft={5} paddingRight={5}>
//         Người phê duyệt <Text style={{color: 'red'}}>*</Text>
//       </Text>
//       <View
//         style={{
//           backgroundColor: Color.gray,
//           padding: 10,
//           marginTop: 5,
//           borderBottomColor: Color.inputBackgroundColor,
//           borderBottomWidth: 1,
//           borderRadius: 6,
//         }}>
//         <Button
//           style={{
//             alignItems: 'center',
//             flexDirection: 'row',
//           }}
//           nextScreen={() => setIsShow(!isShow)}>
//           <View
//             style={{
//               flex: 1,
//             }}>
//             <Text
//               style={{
//                 color:
//                   currentSelectedPerson.approve_name === 'Chọn người phê duyệt'
//                     ? '#B2B2B2'
//                     : null,
//               }}>
//               {currentSelectedPerson.approve_name}
//             </Text>
//           </View>
//           <Icon
//             name={'arrow-down-drop-circle-outline'}
//             color={Color.mainColor}
//             size={24}
//           />
//         </Button>
//         {isShow && (
//           <View
//             style={{
//               marginTop: 10,
//             }}>
//             {currentSelectedLevel.arr.map((item, index) => {
//               return (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setIsShow(false);
//                     onChangeSelectedPerson(item);
//                   }}
//                   key={index.toString()}
//                   style={{
//                     flexDirection: 'row',
//                     justifyContentac: 'center',
//                     alignItems: 'center',
//                     padding: 10,
//                     backgroundColor: 'white',
//                     marginBottom: 5,
//                     borderRadius: 6,
//                   }}>
//                   <Text
//                     flex={1}
//                     flexWrap={'wrap'}
//                     paddingLeft={5}
//                     paddingRight={5}>
//                     {item.approve_name}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };
