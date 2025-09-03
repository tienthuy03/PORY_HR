import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TextInput,
  View,
  LayoutAnimation,
  Image,
} from 'react-native';
import axios from 'axios';
import {FlatList} from 'react-native-gesture-handler';
import {default as Icon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import Button from '../../../../../components/Button';
import Load from '../../../../../components/Loading';
import Text from '../../../../../components/Text';
import TVSButton from '../../../../../components/Tvs/Button';
import TVSList from '../../../../../components/Tvs/TVSList';
import TVSDate from '../../../../../components/Tvs/TVSDate';
import TVSTime from '../../../../../components/Tvs/TVSTime';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup2';
import ShowError from '../../../../../services/errors';
import RequestSendNotification from '../../../../../services/notification/send';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch_v1';
import sysFetch2 from '../../../../../services/fetch_v1/fetch2';
import {APP_VERSION} from '../../../../../config/Pro';

export default function DK({onCallbackReload}) {
  //get status isLoading
  const [expanded, setExpanded] = useState(false);
  const {isLoading} = useSelector(state => state.GlobalLoadingReducer);

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
    titleContainerTime: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: 'row',
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleTextTime: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: 'center',
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

  const dispatch = useDispatch();
  const loginReducers = useSelector(state => state.loginReducers);

  const API = useSelector(state => state.SysConfigReducer.API_URL);

  const [note, setNote] = useState([]);
  //Ly do
  const [modalVisibleLyDo, setModalVisibleLyDo] = useState(false);
  const [dataLyDo, setDataLyDo] = useState([]);
  const [lydo_val, setLyDo_val] = useState('Chọn lý do ra cổng');
  const [lydo_pk, setLyDo_pk] = useState('');
  const [colorLyDo, setColorLyDo] = useState('#B2B2B2');
  //Ve viec
  const [modalVisibleVeViec, setModalVisibleVeViec] = useState(false);
  const [dataVeViec, setDataVeViec] = useState([]);
  const [veviec_val, setVeViec_val] = useState('Chọn về việc');
  const [veviec_pk, setVeViec_pk] = useState('');
  const [colorVeViec, setColorVeViec] = useState('#B2B2B2');

  let thr_emp_pk = '';
  let tokenLogin = '';
  let limit_reg_dt;
  let hide_time = 'N';
  let send_mail = 'N';
  let userPk;
  let refreshToken;
  let crt_by = '';
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}
  const [load, setLoad] = useState(false);

  const [fromDate, setFromDate] = useState('dd/mm/yyyy');
  const [toDate, setToDate] = useState('dd/mm/yyyy');
  const [fromTime, setFromTime] = useState('hh:mm');
  const [toTime, setToTime] = useState('hh:mm');
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [fromTimePickerVisible, setFromTimePicker] = useState(false);
  const [toTimePickerVisible, setToTimePickerVisible] = useState(false);
  const [loaivang_val, setLoaivang_val] = useState('Chọn loại vắng');
  const [loaivang_pk, setLoaivang_pk] = useState('');
  const [description, setDescription] = useState('');

  const [colorFrom, setColorFrom] = useState('#B2B2B2');
  const [colorTo, setColorTo] = useState('#B2B2B2');
  const [colorFromTime, setColorFromTime] = useState('#B2B2B2');
  const [colorToTime, setColorToTime] = useState('#B2B2B2');
  const [colorLoai, setColorLoai] = useState('#B2B2B2');

  const [switchValue, setSwitchValue] = useState(false);
  // const [switchValueTime, setSwitchValueTime] = useState(false);

  const [colorFromTime2, setColorFromTime2] = useState('#B2B2B2');
  const [fromTime2, setFromTime2] = useState('hh:mm');
  const [fromTime2PickerVisible, setFromTime2PickerVisivle] = useState(false);
  const [colorToTime2, setColorToTime2] = useState('#B2B2B2');
  const [toTime2, setToTime2] = useState('hh:mm');
  const [toTime2PickerVisible, setToTime2PickerVisivle] = useState(false);
  const [colorFrom2, setColorFrom2] = useState('#B2B2B2');
  const [fromDate2, setFromDate2] = useState('dd/mm/yyyy');
  const [fromDate2PickerVisible, setFromDate2PickerVisible] = useState(false);
  const [colorTo2, setColorTo2] = useState('#B2B2B2');
  const [toDate2, setToDate2] = useState('dd/mm/yyyy');
  const [toDate2PickerVisible, setToDate2PickerVisible] = useState(false);
  useEffect(() => {
    console.log('effet');
    getData('', '');
  }, []);
  const toggleSwitch = value => {
    setSwitchValue(value);
  };

  //Ngay lam viec
  const showDatePickerFrom = () => {
    setFromDatePickerVisible(true);
  };

  const hidePickerFromDate = () => {
    setFromDatePickerVisible(false);
  };

  const handleConfirmFromDate = val => {
    hidePickerFromDate();
    if (parseInt(limit_reg_dt) > parseInt(moment(val).format('YYYYMMDD'))) {
      Alert.alert(
        'Thông báo',
        `Dữ liệu đăng ký vắng không được trước ngày ${moment(
          moment(limit_reg_dt, 'YYYYMMDD'),
        ).format('DD/MM/YYYY')}`,
        [{text: 'Đóng'}],
      );
      return;
    }
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
    setColorFrom(null);
    getData(moment(val).format('YYYYMMDD'), '');
  };
  //Tu gio
  const showPickerFromTime = () => {
    setFromTimePicker(true);
  };

  const hidePickerFromTime = () => {
    setFromTimePicker(false);
  };

  const handleConfirmFromTime = time => {
    hidePickerFromTime();
    setFromTime(moment(time).format('HH:mm'));
    setColorFromTime(null);
  };

  //Tu gio
  const showPickerFromTime2 = () => {
    setFromTime2PickerVisivle(true);
  };

  const hidePickerFromTime2 = () => {
    setFromTime2PickerVisivle(false);
  };

  const handleConfirmFromTime2 = time => {
    hidePickerFromTime2();
    setFromTime2(moment(time).format('HH:mm'));
    setColorFromTime2(null);
  };

  //Den gio
  const showPickerToTime2 = () => {
    setToTime2PickerVisivle(true);
  };

  const hidePickerToTime2 = () => {
    setToTime2PickerVisivle(false);
  };

  const handleConfirmToTime2 = time => {
    hidePickerToTime2();
    setToTime2(moment(time).format('HH:mm'));
    setColorToTime2(null);
  };
  //Từ ngày
  const showDatePickerFrom2 = () => {
    setFromDate2PickerVisible(true);
  };
  const hidePickerFromDate2 = () => {
    setFromDate2PickerVisible(false);
  };
  const handleConfirmFromDate2 = val => {
    hidePickerFromDate2();
    // if (
    //   moment(val).format('YYYYMMDD') <
    //   moment(moment(fromDate, 'DD/MM/YYYY')).format('YYYYMMDD')
    // ) {
    //   Alert.alert(
    //     'Thông báo',
    //     'Ngày kết thúc không được nhỏ hơn ngày bắt đầu.',
    //     [
    //       {
    //         text: 'Đóng',
    //       },
    //     ],
    //   );
    //   return;
    // }
    setFromDate2(moment(val).format('DD/MM/YYYY'));
    setColorFrom2(null);
  };
  //Đến ngày
  const showDatePickerTo2 = () => {
    setToDate2PickerVisible(true);
  };
  const hidePickerToDate2 = () => {
    setToDate2PickerVisible(false);
  };
  const handleConfirmToDate2 = val => {
    hidePickerToDate2();
    // if (
    //   moment(val).format('YYYYMMDD') <
    //   moment(moment(fromDate, 'DD/MM/YYYY')).format('YYYYMMDD')
    // ) {
    //   Alert.alert(
    //     'Thông báo',
    //     'Ngày kết thúc không được nhỏ hơn ngày bắt đầu.',
    //     [
    //       {
    //         text: 'Đóng',
    //       },
    //     ],
    //   );
    //   return;
    // }
    setToDate2(moment(val).format('DD/MM/YYYY'));
    setColorTo2(null);
  };
  //Den ngay
  const showDatePickerTo = () => {
    setToDatePickerVisible(true);
  };

  const hidePickerToDate = () => {
    setToDatePickerVisible(false);
  };

  const handleConfirmToDate = val => {
    hidePickerToDate();
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
  //Den gio
  const showPickerToTime = () => {
    setToTimePickerVisible(true);
  };

  const hidePickerToTime = () => {
    setToTimePickerVisible(false);
  };

  const handleConfirmToTime = time => {
    hidePickerToTime();
    setToTime(moment(time).format('HH:mm'));
    setColorToTime(null);
  };

  const dialogError = text => {
    Alert.alert(
      'Thông báo',
      text,
      [
        {
          text: 'Thoát',
          onPress: () => {
            setLoad(false);
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const validate = () => {
    if (lydo_pk === '') {
      dialogError('Vui lòng chọn lý do ra cổng');
      return;
    }

    if (veviec_pk === '') {
      dialogError('Vui lòng chọn về việc');
      return;
    }

    if (fromDate === 'dd/mm/yyyy') {
      dialogError('Vui lòng chọn Ngày làm việc.');
      return;
    }

    if (switchValue) {
      if (toDate == 'dd/mm/yyyy') {
        dialogError('Vui lòng chọn Ngày kết thúc.');
        return;
      }
    }

    Alert.alert(
      'Đăng kí vắng',
      'Bạn có muốn đăng ký không?',
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
                onSave();
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
        // if (obj == 'updateExperience') {
        //   updateExperience();
        // }
        // if (obj == 'getData') {
        //   getData();
        // }
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

  const getStateLyDo = result => {
    setLyDo_val(result.code_nm);
    setLyDo_pk(result.code);
    setModalVisibleLyDo(false);
    setColorLyDo(null);
  };
  const getStateVeViec = result => {
    setVeViec_val(result.code_nm);
    setVeViec_pk(result.code);
    setModalVisibleVeViec(false);
    setColorVeViec(null);
  };

  const getData = (fromDT, toDT) => {
    sysFetch(
      API,
      {
        pro: 'SELHRRE013000',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: fromDT,
          p3_varchar2: toDT,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'lst_lydo',
          p2_sys: 'lst_veviec',
          p3_sys: 'lst_approve',
          p4_sys: 'lst_approve_default',
          p5_varchar2: 'limit_reg_dt',
          p6_sys: 'lst_note',
          p7_varchar2: 'expanded_yn',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log(rs);
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
            setDataLyDo(rs.data.lst_lydo);
            setDataVeViec(rs.data.lst_veviec);
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
            setNote(rs.data.lst_note);
          }
        }
      })
      .catch(error => {
        console.log('error getData');
        console.log(error);
      });
  };
  const onResetForm = () => {
    setFromTime('hh:mm');
    setToTime('hh:mm');
    setFromTime2('hh:mm');
    setToTime2('hh:mm');
    setFromDate('dd/mm/yyyy');
    setToDate('dd/mm/yyyy');
    setFromDate2('dd/mm/yyyy');
    setToDate2('dd/mm/yyyy');
    setLoaivang_val('Chọn loại vắng');
    setLoaivang_pk('');
    setDescription('');
    setCurrentSelectedLevel({arr: [], name: 'Chọn vai trò phê duyệt'});
    setCurrentSelectedPerson({approve_name: 'Chọn người phê duyệt'});
    setColorFrom('#B2B2B2');
    setColorTo('#B2B2B2');
    setColorFrom2('#B2B2B2');
    setColorTo2('#B2B2B2');
    setColorFromTime('#B2B2B2');
    setColorToTime('#B2B2B2');
    setColorFromTime2('#B2B2B2');
    setColorToTime2('#B2B2B2');
    setColorLoai('#B2B2B2');
    setDataInsertApprove([]);
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
  const onSave = () => {
    let lst_approve_pk = '';
    let lst_role_type = '';
    if (dataInsertApprove.length == 0) {
      dialogNoti('Vui lòng chọn người phê duyệt');
    } else {
      let p_action = 'INSERT';
      let fromDt = '';
      let toDt = '';
      let fromDtTm = '';
      let fromTm = '';
      let toDtTm = '';
      let toTm = '';

      console.log('switchValue ', switchValue);
      if (!switchValue) {
        fromDt = moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD');
        toDt = moment(toDate, 'DD/MM/YYYY').format('YYYYMMDD');
        fromDtTm =
          fromDate2 == 'dd/mm/yyyy'
            ? moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD')
            : moment(fromDate2, 'DD/MM/YYYY').format('YYYYMMDD');
        fromTm = fromTime2 === 'hh:mm' ? '' : fromTime2;
        toDtTm =
          toDate2 == 'dd/mm/yyyy'
            ? moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD')
            : moment(toDate2, 'DD/MM/YYYY').format('YYYYMMDD');
        toTm = toTime2 === 'hh:mm' ? '' : toTime2;
      } else {
        fromDt = moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD');
        toDt = moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD');
        fromDtTm = moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD');
        fromTm = fromTime === 'hh:mm' ? '' : fromTime;
        toDtTm = moment(fromDate, 'DD/MM/YYYY').format('YYYYMMDD');
        toTm = toTime === 'hh:mm' ? '' : toTime;
      }
      // console.log('fromTime ', fromTime);
      // console.log('toTime ', toTime);
      console.log({
        fromDt: fromDt,
        toDt: toDt,
        fromDtTm: fromDtTm,
        fromTm: fromTm,
        toDtTm: toDtTm,
        toTm: toTm,
      });
      console.log('dataInsertApprove ', dataInsertApprove);
      dataInsertApprove.forEach(function (item) {
        lst_approve_pk += item.thr_emp_pk + '|';
        lst_role_type += item.approve_role_type + '|';
      });
      console.log('lst_approve_pk ', lst_approve_pk);
      console.log('lst_role_type ', lst_role_type);

      //       p_action            varchar2,
      //     p_reg_outwork_pk    varchar2,
      //     p_thr_emp_pk        varchar2,
      //     p_reason_type       varchar2,
      //     p_out_type          varchar2,
      //     p_from_date         varchar2,
      //     p_to_date           varchar2,
      //     p_start_time        varchar2,
      //     p_start_date        varchar2,
      //     p_end_time          varchar2,
      //     p_end_date          varchar2,
      //     p_description       varchar2,

      // --    p_role_type         varchar2,
      // --    p_approve_pk        varchar2,
      //     p_lst_approve_pk    varchar2,
      //     p_lst_role_type     varchar2,
      //     p_count             number,

      //     p_version           varchar2,
      //     p_crt_by            varchar2,

      console.log({
        p1_varchar2: p_action,
        p2_varchar2: '',
        p3_varchar2: thr_emp_pk,
        p4_varchar2: lydo_pk,
        p5_varchar2: veviec_pk,
        p6_varchar2: fromDt,
        p7_varchar2: toDt,
        p8_varchar2: fromTm,
        p9_varchar2: fromDtTm,
        p10_varchar2: toTm,
        p11_varchar2: toDtTm,
        p12_varchar2: description,
        p13_varchar2: lst_approve_pk,
        p14_varchar2: lst_role_type,
        p15_varchar2: dataInsertApprove.length,
        p16_varchar2: APP_VERSION,
        p17_varchar2: crt_by,
      });

      sysFetch(
        API,
        {
          pro: 'UPDHRRE013000',
          in_par: {
            p1_varchar2: p_action,
            p2_varchar2: '',
            p3_varchar2: thr_emp_pk,
            p4_varchar2: lydo_pk,
            p5_varchar2: veviec_pk,
            p6_varchar2: fromDt,
            p7_varchar2: toDt,
            p8_varchar2: fromTm,
            p9_varchar2: fromDtTm,
            p10_varchar2: toTm,
            p11_varchar2: toDtTm,
            p12_varchar2: description,
            p13_varchar2: lst_approve_pk,
            p14_varchar2: lst_role_type,
            p15_varchar2: dataInsertApprove.length,
            p16_varchar2: APP_VERSION,
            p17_varchar2: crt_by,
          },
          out_par: {
            p1_varchar2: 'status',
            p2_sys: 'lst_noti',
            // p3_sys: 'lst_send_mail',
          },
        },
        tokenLogin,
      )
        .then(rs => {
          // if (rs == 'Token Expired') {
          //   refreshNewToken('onSave');
          // }
          // if (rs != 'Token Expired') {
          console.log('rs save ', rs);
          if (rs.results == 'F') {
            // let newText = rs.errorData.split('ORA');
            let errors = '';
            try {
              errors = rs.errorData.split('ORA')[1].trim().split(':')[1];
            } catch (error) {
              errors = 'Lỗi: đăng ký không thành công.';
            }
            dialogNoti(errors);
            // Alert.alert(
            //   'Thông báo',
            //   errors,
            //   [
            //     {
            //       text: 'Thoát',
            //       onPress: () => {},
            //       style: 'cancel',
            //     },
            //   ],
            //   {cancelable: false},
            // );
          }
          // if (rs.result === 'S') {
          //   Alert.alert(
          //     'Thông báo',
          //     'Đăng ký vắng thành công',
          //     [
          //       {
          //         text: 'Đóng',
          //       },
          //     ],
          //     {cancelable: false},
          //   );

          //   //send notification
          //   RequestSendNotification(rs.data, API, tokenLogin);
          // } else if (rs.result === 'F') {
          //   let newText = rs.content.split('ORA');
          //   let errors = '';
          //   try {
          //     errors = newText[1].trim().split(':')[1];
          //   } catch (error) {
          //     errors = 'Lỗi: đăng ký không thành công.';
          //   }

          //   Alert.alert(
          //     'Thông báo',
          //     errors,
          //     [
          //       {
          //         text: 'Thoát',
          //         onPress: () => {},
          //         style: 'cancel',
          //       },
          //     ],
          //     {cancelable: false},
          //   );
          // }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const modalLyDo = (
    <TVSControlPopup
      title={'Chọn lý do ra cổng'}
      isShow={modalVisibleLyDo}
      onHide={() => setModalVisibleLyDo(false)}
      bottom={
        <TVSButton
          type={'danger'}
          icon={'close'}
          buttonStyle={'3'}
          onPress={() => setModalVisibleLyDo(false)}>
          Đóng lại
        </TVSButton>
      }>
      <FlatList
        data={dataLyDo}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateLyDo(item);
              }}
              style={{
                backgroundColor: '#F3F6F9',
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}>
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  const modalVeViec = (
    <TVSControlPopup
      title={'Chọn về việc'}
      isShow={modalVisibleVeViec}
      onHide={() => setModalVisibleVeViec(false)}
      bottom={
        <TVSButton
          type={'danger'}
          icon={'close'}
          buttonStyle={'3'}
          onPress={() => setModalVisibleVeViec(false)}>
          Đóng lại
        </TVSButton>
      }>
      <FlatList
        data={dataVeViec}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateVeViec(item);
              }}
              style={{
                backgroundColor: '#F3F6F9',
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}>
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );
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

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Lý do ra cổng</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    onPress={() => setModalVisibleLyDo(true)}
                    colorText={colorLyDo}
                    code_nm={lydo_val}
                  />
                </Block>
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Về việc</Text>
                    <Text color={Color.red}> *</Text>
                  </Block>
                  <TVSList
                    onPress={() => setModalVisibleVeViec(true)}
                    colorText={colorVeViec}
                    code_nm={veviec_val}
                  />
                </Block>

                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text style={{flex: 1}} color={Color.mainColor}>
                      Đăng ký nhiều ngày
                    </Text>
                    <Switch
                      style={{marginRight: 10}}
                      onValueChange={toggleSwitch}
                      value={switchValue}
                    />
                  </Block>
                </Block>
                <Block
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <Block style={styles.titleContainer}>
                    <Block style={styles.titleText}>
                      <Text color={Color.mainColor}>
                        {switchValue ? 'Từ ngày' : 'Ngày làm việc'}
                      </Text>
                      <Text color={Color.red}> *</Text>
                    </Block>
                    <TVSDate
                      onPress={() => showDatePickerFrom()}
                      colorText={colorFrom}
                      date={fromDate}
                      modalVisible={fromDatePickerVisible}
                      onConfirm={handleConfirmFromDate}
                      onCancel={hidePickerFromDate}
                    />
                  </Block>
                  {switchValue ? (
                    <Block
                      style={{
                        flexDirection: 'column',
                        marginBottom: 10,
                      }}>
                      <Block
                        style={{
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            paddingLeft: 10,
                            color: Color.mainColor,
                          }}></Text>
                      </Block>
                      <Block
                        style={{
                          alignItems: 'center',
                          marginLeft: 10,
                          marginRight: 10,
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <Text>...</Text>
                      </Block>
                    </Block>
                  ) : null}
                  {switchValue ? (
                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Đến ngày</Text>
                        <Text color={Color.red}> *</Text>
                      </Block>
                      <TVSDate
                        onPress={() => showDatePickerTo()}
                        colorText={colorTo}
                        date={toDate}
                        modalVisible={toDatePickerVisible}
                        onConfirm={handleConfirmToDate}
                        onCancel={hidePickerToDate}
                      />
                    </Block>
                  ) : null}
                </Block>
                {/* Control time */}
                {!switchValue && (
                  <>
                    <Block
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <Block style={styles.titleContainerTime}>
                        <Block style={styles.titleTextTime}>
                          <Text color={Color.mainColor}>Từ thời gian</Text>
                          <Text color={Color.red}> *</Text>
                        </Block>
                        <Block style={{flex: 3, flexDirection: 'row'}}>
                          <View style={{flex: 2, marginLeft: 5}}>
                            <TVSTime
                              onPress={() => showPickerFromTime2()}
                              colorText={colorFromTime2}
                              time={fromTime2}
                              modalVisible={fromTime2PickerVisible}
                              onConfirm={handleConfirmFromTime2}
                              onCancel={hidePickerFromTime2}
                            />
                          </View>
                          <View style={{flex: 3, marginLeft: 5}}>
                            <TVSDate
                              onPress={() => showDatePickerFrom2()}
                              colorText={colorFrom2}
                              date={fromDate2}
                              modalVisible={fromDate2PickerVisible}
                              onConfirm={handleConfirmFromDate2}
                              onCancel={hidePickerFromDate2}
                            />
                          </View>
                        </Block>
                      </Block>
                    </Block>
                    <Block
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <Block style={styles.titleContainerTime}>
                        <Block style={styles.titleTextTime}>
                          <Text color={Color.mainColor}>Đến thời gian</Text>
                          <Text color={Color.red}> *</Text>
                        </Block>
                        <Block style={{flex: 3, flexDirection: 'row'}}>
                          <View style={{flex: 2, marginLeft: 5}}>
                            <TVSTime
                              onPress={() => showPickerToTime2()}
                              colorText={colorToTime2}
                              time={toTime2}
                              modalVisible={toTime2PickerVisible}
                              onConfirm={handleConfirmToTime2}
                              onCancel={hidePickerToTime2}
                            />
                          </View>
                          <View style={{flex: 3, marginLeft: 5}}>
                            <TVSDate
                              onPress={() => showDatePickerTo2()}
                              colorText={colorTo2}
                              date={toDate2}
                              modalVisible={toDate2PickerVisible}
                              onConfirm={handleConfirmToDate2}
                              onCancel={hidePickerToDate2}
                            />
                          </View>
                        </Block>
                      </Block>
                    </Block>
                  </>
                )}
                {switchValue && (
                  <Block
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Từ giờ</Text>
                      </Block>
                      <TVSTime
                        onPress={() => showPickerFromTime()}
                        colorText={colorFromTime}
                        time={fromTime}
                        modalVisible={fromTimePickerVisible}
                        onConfirm={handleConfirmFromTime}
                        onCancel={hidePickerFromTime}
                      />
                    </Block>

                    <Block
                      style={{
                        flexDirection: 'column',
                        marginBottom: 10,
                      }}>
                      <Block
                        style={{
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            paddingLeft: 10,
                            color: Color.mainColor,
                          }}></Text>
                      </Block>
                      <Block
                        style={{
                          alignItems: 'center',
                          marginLeft: 10,
                          marginRight: 10,
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <Text>...</Text>
                      </Block>
                    </Block>

                    <Block style={styles.titleContainer}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Đến giờ</Text>
                      </Block>
                      <TVSTime
                        onPress={() => showPickerToTime()}
                        colorText={colorToTime}
                        time={toTime}
                        modalVisible={toTimePickerVisible}
                        onConfirm={handleConfirmToTime}
                        onCancel={hidePickerToTime}
                      />
                    </Block>
                  </Block>
                )}
                {/* Control Text Area */}
                <Block style={styles.titleContainer}>
                  <Block style={styles.titleText}>
                    <Text color={Color.mainColor}>Ghi chú</Text>
                  </Block>
                  <Block
                    style={{
                      backgroundColor: Color.gray,
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      borderRadius: 6,
                      minHeight: 50,
                    }}>
                    <TextInput
                      multiline={true}
                      placeholder={'Nhập ghi chú'}
                      value={description}
                      onChangeText={text => setDescription(text)}
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

                {note.length > 0 ? (
                  <Block
                    style={{
                      flex: 1,
                      marginHorizontal: 10,
                      // marginBottom: 10,
                    }}>
                    {note.map(item => (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 12,
                        }}
                        fontStyle={'italic'}>
                        {item.note}
                      </Text>
                    ))}
                  </Block>
                ) : null}
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
                      onPress={onResetForm}
                      buttonStyle={'3'}
                      type={'secondary'}
                      icon={'sync'}
                      minWidth={150}>
                      Đăng ký mới
                    </TVSButton>
                  </View>
                  <View>
                    <TVSButton
                      onPress={validate}
                      icon={'content-save'}
                      buttonStyle={'3'}
                      minWidth={150}>
                      Sao lưu
                    </TVSButton>
                  </View>
                </View>
              </Block>
              {modalLyDo}
              {modalVeViec}
              {modalNPD}
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>
    </Block>
  );
}
