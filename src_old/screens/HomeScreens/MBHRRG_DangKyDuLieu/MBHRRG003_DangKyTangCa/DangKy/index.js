import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import TextInput from '../../../../../components/TextInput';
import TVSButton from '../../../../../components/Tvs/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TVSTime from '../../../../../components/Tvs/TVSTime';
import TVSDate from '../../../../../components/Tvs/TVSDate';
import moment from 'moment';
import sysFetch from '../../../../../services/fetch_v1';
import {APP_VERSION} from '../../../../../config/Pro';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup2';
import Button from '../../../../../components/Button';
import RequestSendNotificationV1 from '../../../../../services/notification/send_v1';

const DangKy = ({
  data,
  dataApprove,
  dataApproveDefault,
  limitRegDt,
  onReload,
}) => {
  // COLOR
  const Color = useSelector(s => s.SystemReducer.theme);
  /* START: CSS */
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
      padding: 10,
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
  /*END: CSS*/

  /*******START: STATE*******/
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [eat1, setEat1] = useState(false);
  const [eat2, setEat2] = useState(false);
  const [timeSlot1Visible, setTimeSlot1Visible] = useState(false);
  const [timeSlot2Visible, setTimeSlot2Visible] = useState(false);

  //PICKER DATE NGÀY LÀM VIỆC
  const [dateNLV, setDateNLV] = useState('dd/mm/yyyy');
  const [nlvDatePickerVisible, setDatePickerNLVVisible] = useState(false);
  const [gtc, setGtc] = useState('');

  // Khung giờ 1
  const [kg1FromTime, setKg1FromTime] = useState('hh:mm');
  const [kg1FromTimePickerVisible, setKg1FromTimePickerVisible] =
    useState(false);
  const [kg1FromDate, setKg1FromDate] = useState('dd/mm/yyyy');
  const [kg1FromDatePickerVisible, setKg1FromDatePickerVisible] =
    useState(false);
  const [kg1ToTime, setKg1ToTime] = useState('hh:mm');
  const [kg1ToTimePickerVisible, setKg1ToTimePickerVisible] = useState(false);
  const [kg1ToDate, setKg1ToDate] = useState('dd/mm/yyyy');
  const [kg1ToDatePickerVisible, setKg1ToDatePickerVisible] = useState(false);

  // Khung giờ 2
  const [kg2FromTime, setKg2FromTime] = useState('hh:mm');
  const [kg2FromTimePickerVisible, setKg2FromTimePickerVisible] =
    useState(false);
  const [kg2FromDate, setKg2FromDate] = useState('dd/mm/yyyy');
  const [kg2FromDatePickerVisible, setKg2FromDatePickerVisible] =
    useState(false);
  const [kg2ToTime, setKg2ToTime] = useState('hh:mm');
  const [kg2ToTimePickerVisible, setKg2ToTimePickerVisible] = useState(false);
  const [kg2ToDate, setKg2ToDate] = useState('dd/mm/yyyy');
  const [kg2ToDatePickerVisible, setKg2ToDatePickerVisible] = useState(false);

  const [load, setLoad] = useState(false);
  /*******END: STATE*******/

  /*START USE SELECTOR */
  const loginReducers = useSelector(state => state.loginReducers);
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  /* END USE SELECTOR */

  let tokenLogin = '';
  let crt_by = '';
  let refreshToken = '';
  let thr_emp_pk = '';
  let limit_reg_dt = '';
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}

  /******* START: NGÀY LÀM VIỆC*******/
  const showDatePickerNLV = () => {
    setDatePickerNLVVisible(true);
  };
  const hideDatePickerNLV = () => {
    setDatePickerNLVVisible(false);
  };
  const handleConfirmDateNLV = val => {
    hideDatePickerNLV();
    setDateNLV(moment(val).format('DD/MM/YYYY'));
  };
  /*******END: NGÀY LÀM VIỆC*******/

  /******* START: Khung giờ 1*******/
  //Time
  const showPickerTimeKG1From = () => {
    setKg1FromTimePickerVisible(true);
  };
  const hidePickerTimeKG1From = () => {
    setKg1FromTimePickerVisible(false);
  };
  const handleConfirmTimeKG1From = time => {
    hidePickerTimeKG1From();
    setKg1FromTime(moment(time).format('HH:mm'));
  };

  const showPickerTimeKG1To = () => {
    setKg1ToTimePickerVisible(true);
  };
  const hidePickerTimeKG1To = () => {
    setKg1ToTimePickerVisible(false);
  };
  const handleConfirmTimeKG1To = time => {
    hidePickerTimeKG1To();
    setKg1ToTime(moment(time).format('HH:mm'));
  };

  //Date
  const showDatePickerDateKG1From = () => {
    setKg1FromDatePickerVisible(true);
  };
  const hideDatePickerKG1From = () => {
    setKg1FromDatePickerVisible(false);
  };
  const handleConfirmDateKG1From = val => {
    hideDatePickerKG1From();
    if (kg1ToDate == 'dd/mm/yyyy') {
      setKg1ToDate(moment(val).format('DD/MM/YYYY'));
    }
    if (moment(val).format('DD/MM/YYYY') > kg1ToDate) {
      setKg1ToDate(moment(val).format('DD/MM/YYYY'));
    }
    setKg1FromDate(moment(val).format('DD/MM/YYYY'));
  };
  const showDatePickerDateKG1To = () => {
    setKg1ToDatePickerVisible(true);
  };
  const hideDatePickerKG1To = () => {
    setKg1ToDatePickerVisible(false);
  };
  const handleConfirmDateKG1To = val => {
    hideDatePickerKG1To();
    if (moment(val).format('YYYYMMDD') < convertDate(kg1FromDate, '/')) {
      dialogError('Ngày đến phải lớn hơn ngày bắt đầu');
    } else {
      setKg1ToDate(moment(val).format('DD/MM/YYYY'));
    }

    if (kg1FromDate == 'dd/mm/yyyy') {
      setKg1FromDate(moment(val).format('DD/MM/YYYY'));
      setKg1ToDate(moment(val).format('DD/MM/YYYY'));
    }
  };
  /*******END: Khung giờ 1*******/

  /******* START: Khung giờ 2*******/
  //Time
  const showPickerTimeKG2From = () => {
    setKg2FromTimePickerVisible(true);
  };
  const hidePickerTimeKG2From = () => {
    setKg2FromTimePickerVisible(false);
  };
  const handleConfirmTimeKG2From = time => {
    hidePickerTimeKG2From();
    setKg2FromTime(moment(time).format('HH:mm'));
  };

  const showPickerTimeKG2To = () => {
    setKg2ToTimePickerVisible(true);
  };
  const hidePickerTimeKG2To = () => {
    setKg2ToTimePickerVisible(false);
  };
  const handleConfirmTimeKG2To = time => {
    hidePickerTimeKG2To();
    setKg2ToTime(moment(time).format('HH:mm'));
  };

  //Date
  const showDatePickerDateKG2From = () => {
    setKg2FromDatePickerVisible(true);
  };
  const hideDatePickerKG2From = () => {
    setKg2FromDatePickerVisible(false);
  };
  const handleConfirmDateKG2From = val => {
    hideDatePickerKG2From();
    if (kg2ToDate == 'dd/mm/yyyy') {
      setKg2ToDate(moment(val).format('DD/MM/YYYY'));
    }
    if (moment(val).format('DD/MM/YYYY') > kg2ToDate) {
      setKg2ToDate(moment(val).format('DD/MM/YYYY'));
    }
    setKg2FromDate(moment(val).format('DD/MM/YYYY'));
  };
  const showDatePickerDateKG2To = () => {
    setKg2ToDatePickerVisible(true);
  };
  const hideDatePickerKG2To = () => {
    setKg2ToDatePickerVisible(false);
  };
  const handleConfirmDateKG2To = val => {
    hideDatePickerKG2To();
    if (moment(val).format('YYYYMMDD') < convertDate(kg2FromDate, '/')) {
      dialogError('Ngày đến phải lớn hơn ngày bắt đầu');
    } else {
      setKg2ToDate(moment(val).format('DD/MM/YYYY'));
    }

    if (kg2FromDate == 'dd/mm/yyyy') {
      setKg2FromDate(moment(val).format('DD/MM/YYYY'));
      setKg2ToDate(moment(val).format('DD/MM/YYYY'));
    }
  };
  /*******END: Khung giờ 2*********/

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
    setCurrentSelectedLevel(approveInfo.filter(x => x.name == level)[0]);
    setCurrentSelectedPerson(
      approveInfo
        .filter(x => x.name == level)[0]
        .arr.filter(y => y.thr_emp_pk == emp_pk)[0],
    );
    // setCurrentSelectedPerson({approve_name: 'Chọn người phê duyệt'});
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
          <Text>Đóng lại</Text>
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
            <Text>Chọn</Text>
          </TVSButton>
        </View>
      </View>
    </TVSControlPopup>
  );

  const convertDate = (datetime, characterSplit) => {
    const year = datetime.split(characterSplit)[2];
    const month = datetime.split(characterSplit)[1];
    const date = datetime.split(characterSplit)[0];
    const datetimeConvert = year + '' + month + '' + date;
    if (datetimeConvert == 'yyyymmdd') {
      return '';
    } else return datetimeConvert;
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRRG003000',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'lst_approve',
          p2_sys: 'lst_approve_default',
          p3_varchar2: 'limit_reg_dt',
          p4_sys: 'lst_note',
          p5_varchar2: 'expanded_yn',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
            limit_reg_dt = rs.data.limit_reg_dt;
            hanleApproveInfo(rs.data.lst_approve);
            let dataSelectApprove = [];
            rs.data.lst_approve_default.forEach(function (item) {
              dataSelectApprove.push({
                approve_role_type: item.approve_role_type,
                thr_emp_pk: item.thr_emp_pk,
                level_name: item.level_name,
                approve_name: item.approve_name,
                approve_level: item.approve_level,
                full_nm: item.full_nm,
              });
            });
            setDataInsertApprove(rs.data.lst_approve_default);
            setDataSelectedApprove(dataSelectApprove);
            setExpanded(rs.data.expanded_yn == 'Y' ? true : false);
          }
        }
      })
      .catch(error => {
        console.log('error getData');
        console.log(error);
      });
  };

  const dialogError = text => {
    Alert.alert(
      'Thông báo',
      text,
      [
        {
          text: 'Thoát',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const validationValue = () => {
    if (dateNLV == '' || dateNLV === 'dd/mm/yyyy') {
      dialogError('Vui lòng chọn ngày làm việc');
      return;
    }

    if (gtc == '') {
      dialogError('Vui lòng chọn giờ tăng ca');
      return;
    } else if (parseInt(gtc) < 0) {
      dialogError('Giờ tăng ca phải là số dương');
      return;
    } else if (isNaN(parseInt(gtc))) {
      dialogError('Giờ tăng ca phải là số');
      return;
    }

    if (timeSlot1Visible == false && timeSlot2Visible == false) {
      dialogError('Vui lòng chọn khung giờ');
      return;
    }

    if (timeSlot1Visible == true) {
      if (kg1FromTime == 'hh:mm' || kg1FromDate == 'dd/mm/yyyy') {
        dialogError('Vui lòng nhập từ thời gian ');
        return;
      }
      if (kg1ToTime == 'hh:mm' || kg1ToDate == 'dd/mm/yyyy') {
        dialogError('Vui lòng nhập đến thời gian ');
        return;
      }
    }

    if (timeSlot2Visible == true) {
      if (kg2FromTime == 'hh:mm' || kg2FromDate == 'dd/mm/yyyy') {
        dialogError('Vui lòng nhập từ thời gian ');
        return;
      }
      if (kg2ToTime == 'hh:mm' || kg2ToDate == 'dd/mm/yyyy') {
        dialogError('Vui lòng nhập đến thời gian ');
        return;
      }
    }

    if (description == '' || description == undefined) {
      dialogError('Vui lòng nhập công việc làm thêm');
      return;
    }
    onSave();
  };

  const onSave = () => {
    let lst_approve_pk = '';
    let lst_role_type = '';
    let kg1_fromdate = '';
    let kg1_todate = '';
    let kg1_fromtime = '';
    let kg1_totime = '';
    let _eat1 = '';
    let _swKG1 = '';
    let kg2_fromdate = '';
    let kg2_todate = '';
    let kg2_fromtime = '';
    let kg2_totime = '';
    let _eat2 = '';
    let _swKG2 = '';

    if (timeSlot1Visible) {
      kg1_fromdate = convertDate(kg1FromDate, '/');
      kg1_todate = convertDate(kg1ToDate, '/');
      kg1_fromtime = convertDate(kg1FromDate, '/') + '' + kg1FromTime;
      kg1_totime = convertDate(kg1ToDate, '/') + '' + kg1ToTime;

      _eat1 = eat1 ? 'Y' : 'N';
      _swKG1 = 'Y';
    } else {
      _swKG1 = 'N';
    }
    if (timeSlot2Visible) {
      kg2_fromdate = convertDate(kg2FromDate, '/');
      kg2_todate = convertDate(kg2ToDate, '/');
      kg2_fromtime = convertDate(kg2FromDate, '/') + '' + kg2FromTime;
      kg2_totime = convertDate(kg2ToDate, '/') + '' + kg2ToTime;
      _eat2 = eat2 ? 'Y' : 'N';
      _swKG2 = 'Y';
    } else {
      _swKG2 = 'N';
    }
    dataInsertApprove.forEach(function (item) {
      lst_approve_pk += item.thr_emp_pk + '|';
      lst_role_type += item.approve_role_type + '|';
    });
    if (dataInsertApprove.length == 0) {
      dialogError('Vui lòng chọn người phê duyệt');
    }

    // console.log({
    //   p1_varchar2: "INSERT",
    //   p2_varchar2: "",
    //   p3_varchar2: thr_emp_pk,
    //   p4_varchar2: convertDate(dateNLV, "/"),
    //   p5_varchar2: gtc,

    //   p6_varchar2: _swKG1,
    //   p7_varchar2: kg1_fromdate,
    //   p8_varchar2: kg1_fromtime,
    //   p9_varchar2: kg1_todate,
    //   p10_varchar2: kg1_totime,
    //   p11_varchar2: _eat1,

    //   p12_varchar2: _swKG2,
    //   p13_varchar2: kg2_fromdate,
    //   p14_varchar2: kg2_fromtime,
    //   p15_varchar2: kg2_todate,
    //   p16_varchar2: kg2_totime,
    //   p17_varchar2: _eat2,

    //   p18_varchar2: description,
    //   p19_varchar2: lst_role_type,
    //   p20_varchar2: lst_approve_pk,
    //   p21_varchar2: dataInsertApprove.length,
    //   p22_varchar2: APP_VERSION,
    //   p23_varchar2: crt_by,
    // });

    sysFetch(
      API,
      {
        pro: 'UPDHRRG003000',
        in_par: {
          p1_varchar2: 'INSERT',
          p2_varchar2: '',
          p3_varchar2: thr_emp_pk,
          p4_varchar2: convertDate(dateNLV, '/'),
          p5_varchar2: gtc,

          p6_varchar2: _swKG1,
          p7_varchar2: kg1_fromdate,
          p8_varchar2: kg1_fromtime,
          p9_varchar2: kg1_todate,
          p10_varchar2: kg1_totime,
          p11_varchar2: _eat1,

          p12_varchar2: _swKG2,
          p13_varchar2: kg2_fromdate,
          p14_varchar2: kg2_fromtime,
          p15_varchar2: kg2_todate,
          p16_varchar2: kg2_totime,
          p17_varchar2: _eat2,

          p18_varchar2: description,
          p19_varchar2: lst_role_type,
          p20_varchar2: lst_approve_pk,
          p21_varchar2: dataInsertApprove.length,
          p22_varchar2: APP_VERSION,
          p23_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: 'flash_result',
          p2_sys: 'noti',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs.results === 'F') {
          let newText = rs.errorData.split('ORA');
          let errors = '';
          try {
            errors = newText[1].trim().split(':')[1];
          } catch (error) {
            errors = 'Lỗi: đăng ký không thành công.';
          }
          dialogError(errors);
        }

        if (rs.results === 'S') {
          dialogError('Đăng ký tăng ca thành công');
          RequestSendNotificationV1(rs.data.noti, API, tokenLogin);
          onReload();
        }
        // if (rs == "Token Expired") {
        //   refreshNewToken("getData");
        // }
        // if (rs != "Token Expired") {
        //   if (rs.results == "S") {
        //     limit_reg_dt = rs.data.limit_reg_dt;
        //     hanleApproveInfo(rs.data.lst_approve);
        //     let dataSelectApprove = [];
        //     rs.data.lst_approve_default.forEach(function (item) {
        //       dataSelectApprove.push({
        //         approve_role_type: item.approve_role_type,
        //         thr_emp_pk: item.thr_emp_pk,
        //         level_name: item.level_name,
        //         approve_name: item.approve_name,
        //         approve_level: item.approve_level,
        //         full_nm: item.full_nm,
        //       });
        //     });
        //     setDataInsertApprove(rs.data.lst_approve_default);
        //     setDataSelectedApprove(dataSelectApprove);
        //     setExpanded(rs.data.expanded_yn == "Y" ? true : false);
        //   }
        // }
      })
      .catch(error => {
        console.log('error getData');
        console.log(error);
      });
  };

  return (
    <>
      <Block
        shadow
        marginTop={10}
        marginLeft={10}
        marginRight={10}
        backgroundColor={Color.white}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'space-between',
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <View style={{flex: 1, marginRight: 10, paddingVertical: 5}}>
                <Text style={{marginBottom: 5}}>Ngày làm việc</Text>
                <TVSDate
                  onPress={() => showDatePickerNLV()}
                  colorText={dateNLV === 'dd/mm/yyyy' ? '#B2B2B2' : null}
                  date={dateNLV}
                  modalVisible={nlvDatePickerVisible}
                  onConfirm={handleConfirmDateNLV}
                  onCancel={hideDatePickerNLV}
                />
              </View>

              <View style={{flex: 0.5, marginLeft: 10, paddingVertical: 5}}>
                <Text style={{marginBottom: 5}}>Giờ tăng ca</Text>
                <View
                  style={{
                    backgroundColor: Color.gray,
                    borderRadius: 6,
                    height: 40,
                    alignItems: 'center',
                    borderColor: Color.white,
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    value={gtc}
                    onChangeText={setGtc}
                    style={{
                      minWidth: 100,
                      padding: 5,
                      textAlign: 'center',
                    }}
                    placeholder={'Nhập số giờ'}
                    keyboardType="default"
                  />
                </View>
              </View>
            </View>
          </View>

          {/*START: Khung giờ 1 */}
          <View
            style={{
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'space-between',
              }}>
              <View
                style={{
                  paddingVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text>Khung giờ 1</Text>
              </View>

              <Switch
                onValueChange={setTimeSlot1Visible}
                value={timeSlot1Visible}></Switch>
            </View>
            {/* Control time slot */}
            {timeSlot1Visible === true ? (
              <View style={{padding: 5}}>
                <View style={{margin: 4}}>
                  <Text>Từ thời gian</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'stretch',
                    }}>
                    <View style={{flex: 0.7, flexDirection: 'row', padding: 4}}>
                      <TVSTime
                        onPress={() => showPickerTimeKG1From()}
                        colorText={kg1FromTime === 'hh:mm' ? '#B2B2B2' : null}
                        time={kg1FromTime}
                        modalVisible={kg1FromTimePickerVisible}
                        onConfirm={handleConfirmTimeKG1From}
                        onCancel={hidePickerTimeKG1From}
                      />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', padding: 4}}>
                      <TVSDate
                        onPress={() => showDatePickerDateKG1From()}
                        colorText={
                          kg1FromDate === 'dd/mm/yyyy' ? '#B2B2B2' : null
                        }
                        date={kg1FromDate}
                        modalVisible={kg1FromDatePickerVisible}
                        onConfirm={handleConfirmDateKG1From}
                        onCancel={hideDatePickerKG1From}
                      />
                    </View>
                  </View>
                </View>

                <View style={{margin: 4}}>
                  <Text>Đến thời gian</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'stretch',
                    }}>
                    <View style={{flex: 0.7, flexDirection: 'row', padding: 4}}>
                      <TVSTime
                        onPress={() => showPickerTimeKG1To()}
                        colorText={kg1ToTime === 'hh:mm' ? '#B2B2B2' : null}
                        time={kg1ToTime}
                        modalVisible={kg1ToTimePickerVisible}
                        onConfirm={handleConfirmTimeKG1To}
                        onCancel={hidePickerTimeKG1To}
                      />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', padding: 4}}>
                      <TVSDate
                        onPress={() => showDatePickerDateKG1To()}
                        colorText={
                          kg1ToDate === 'dd/mm/yyyy' ? '#B2B2B2' : null
                        }
                        date={kg1ToDate}
                        modalVisible={kg1ToDatePickerVisible}
                        onConfirm={handleConfirmDateKG1To}
                        onCancel={hideDatePickerKG1To}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setEat1(!eat1)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                  }}>
                  <Text>
                    <Icon
                      name={eat1 ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={20}
                      color={Color.mainColor}
                    />
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                    }}>
                    {' '}
                    Ăn ca 1
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {/*END: Khung giờ 1 */}

          {/*START: Khung giờ 2 */}
          <View
            style={{
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'space-between',
              }}>
              <View
                style={{
                  paddingVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text>Khung giờ 2</Text>
              </View>

              <Switch
                onValueChange={setTimeSlot2Visible}
                value={timeSlot2Visible}></Switch>
            </View>
            {/* Control time slot */}
            {timeSlot2Visible === true ? (
              <View style={{padding: 5}}>
                <View style={{margin: 4}}>
                  <Text>Từ thời gian</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'stretch',
                    }}>
                    <View style={{flex: 0.7, flexDirection: 'row', padding: 4}}>
                      <TVSTime
                        onPress={() => showPickerTimeKG2From()}
                        colorText={kg2FromTime === 'hh:mm' ? '#B2B2B2' : null}
                        time={kg2FromTime}
                        modalVisible={kg2FromTimePickerVisible}
                        onConfirm={handleConfirmTimeKG2From}
                        onCancel={hidePickerTimeKG2From}
                      />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', padding: 4}}>
                      <TVSDate
                        onPress={() => showDatePickerDateKG2From()}
                        colorText={
                          kg2FromDate === 'dd/mm/yyyy' ? '#B2B2B2' : null
                        }
                        date={kg2FromDate}
                        modalVisible={kg2FromDatePickerVisible}
                        onConfirm={handleConfirmDateKG2From}
                        onCancel={hideDatePickerKG2From}
                      />
                    </View>
                  </View>
                </View>

                <View style={{margin: 4}}>
                  <Text>Đến thời gian</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'stretch',
                    }}>
                    <View style={{flex: 0.7, flexDirection: 'row', padding: 4}}>
                      <TVSTime
                        onPress={() => showPickerTimeKG2To()}
                        colorText={kg2ToTime === 'hh:mm' ? '#B2B2B2' : null}
                        time={kg2ToTime}
                        modalVisible={kg2ToTimePickerVisible}
                        onConfirm={handleConfirmTimeKG2To}
                        onCancel={hidePickerTimeKG2To}
                      />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', padding: 4}}>
                      <TVSDate
                        onPress={() => showDatePickerDateKG2To()}
                        colorText={
                          kg2ToDate === 'dd/mm/yyyy' ? '#B2B2B2' : null
                        }
                        date={kg2ToDate}
                        modalVisible={kg2ToDatePickerVisible}
                        onConfirm={handleConfirmDateKG2To}
                        onCancel={hideDatePickerKG2To}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setEat2(!eat2)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                  }}>
                  <Text>
                    <Icon
                      name={eat2 ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={20}
                      color={Color.mainColor}
                    />
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                    }}>
                    {' '}
                    Ăn ca 2
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {/*END: Khung giờ 2 */}

          <View
            style={{
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{marginBottom: 5}}>Công việc làm thêm</Text>
            </View>

            <View
              style={{
                backgroundColor: Color.gray,
                borderRadius: 6,
                height: 50,
                borderColor: Color.white,
              }}>
              <TextInput
                style={{
                  padding: 10,
                }}
                multiline={true}
                placeholder={'Nhập công việc làm thêm'}
                value={description}
                onChangeText={setDescription}
                flexWrap={'wrap'}
              />
            </View>
          </View>

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
                onPress={validationValue}
                buttonStyle={'3'}
                icon={'check'}
                minWidth={150}>
                <Text>Xác nhận</Text>
              </TVSButton>
            </View>
          </View>
        </ScrollView>
        {modalNPD}
      </Block>
    </>
  );
};

export default DangKy;
