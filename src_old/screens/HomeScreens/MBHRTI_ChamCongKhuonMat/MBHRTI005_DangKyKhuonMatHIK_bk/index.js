/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import Device from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import TVSSelect from '../../../../components/Tvs/Select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import TVSHeader from '../../../../components/Tvs/Header';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../services/redux/GlobalLoading/action';
import {HRTI005SetCheckAll} from '../../../../services/redux/HRTI005_DangKyKhuonMatHIK/action';
import sysFetch from '../../../../services/fetch';
import OneEmployee from './OneEmployee';
import IconDate from '../../../../icons/Datev';
import {ScrollView} from 'react-native-gesture-handler';
import TVSControlPopupRegisterFace from './Popup_DangKyKhuonMat';
const DangKyKhuonMatHIK = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);

  const menu = useSelector(state => state.menuReducer.data.data.menu);

  const currentLangue = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const employee_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  const tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const Color = useSelector(s => s.SystemReducer.theme);
  const [arrStatus, setArrStatus] = useState([]);
  const [arrPos, setArrPos] = useState([]);
  const [arrDate, setArrDate] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [fromDate, setFromDate] = useState('dd/mm/yyyy');
  const [toDate, setToDate] = useState('dd/mm/yyyy');
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [DaCoHinh, setDaCoHinh] = useState(true);
  const [ChuaCoHinh, setChuaCoHinh] = useState(true);
  const [dsNhanVien, setDsNhanVien] = useState([]);
  const [arrWS, setArrWS] = useState([]);
  const [arrAG, setArrAG] = useState([]);
  const [arrMachine, setArrMachine] = useState([]);
  //current data
  const [selectedCurrentEmployee, setSelectedCurrentEmployee] = useState('');
  const [selectedCurrentSearch, setSelectedCurrentSearch] = useState('');

  const [currentStatus, setCurrentStatus] = useState({
    code: 'A',
    code_nm: 'Làm việc',
  });
  const [currentPos, setCurrentPos] = useState({
    code: '',
    code_nm: 'Chọn chức vụ',
  });
  const [currentDate, setCurrentDate] = useState({
    code: '',
    code_nm: 'Chọn loại ngày',
  });
  // const [checkAll, setCheckAll] = useState(false);
  const {CheckAll} = useSelector(
    state => state.HRTI005_DangKyKhuonMatHIKReducer,
  );

  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    formView: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomView: {
      alignItems: 'center',
      width: '100%',
      paddingBottom: 20,
      paddingTop: 5,
      flexDirection: 'row',
      borderTopColor: Color.inputBackgroundColor,
      borderTopWidth: 1,
      position: 'absolute',
      zIndex: 20,
      backgroundColor: Color.white,
      bottom: 0,
    },
    btnRegister: {
      marginRight: 10,
      marginLeft: 10,
      padding: 10,
      height: 40,
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewRegisterAll: {
      borderRadius: 5,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    flastList: {
      marginBottom: 80,
      zIndex: 1,
    },
    body: {
      height: 300,
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
    checkboxAll: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Color.mainColor,
    },
    viewCheckboxAll: {
      margin: 10,
      height: 30,
      width: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
    CheckBoxE: {
      width: 30,
      height: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    CheckBoxD: {
      width: 30,
      height: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
  });

  useEffect(() => {
    sysFetch(
      API,
      {
        pro: 'SELHRTI0050100',
        in_par: {
          p1_varchar2: employee_pk,
        },
        out_par: {
          p1_sys: 'org',
          p2_sys: 'pos',
          p3_sys: 'date',
          p4_sys: 'status',
          p5_sys: 'ws',
          p6_sys: 'ag',
          p7_sys: 'machine',
        },
      },
      tokenLogin,
    ).then(rs => {
      if (rs.results === 'S') {
        setArrStatus(rs.data.status);
        setArrPos(rs.data.pos);
        setArrDate(rs.data.date);
        setArrWS(rs.data.ws);
        setArrAG(rs.data.ag);
        setArrMachine(rs.data.machine);

        setDataOrg(rs.data.org);
        setLabelOrg(rs.data.org[0].code_nm);
        setValueOrg(rs.data.org[0].code);
      }
    });
    dispatch(HRTI005SetCheckAll(false));
  }, []);

  //current data
  const onFilter = () => {
    onSetHideAll();
    onRequestToServer2();
  };
  const onShowModal = () => {
    onSetHideAll();
    setModalVisible(true);
  };
  const onHideModalFilter = () => {
    onSetHideAll();
    setModalVisible(false);
  };
  const onSetHideAll = () => {
    setIsShowDate(false);
    setIsShowPos(false);
    setIsShowStatus(false);
  };
  const onRequestToServer = () => {
    setDsNhanVien([]);
    const characterSplit = '/';
    try {
      if (valueOrg === 0) {
        return Alert.alert('Thông báo', 'Vui lòng chọn phòng ban.', [
          {text: 'Đóng'},
        ]);
      } else if (valueOrg !== 0) {
        // setIsLoading(true);
        dispatch(ShowGlobalLoading);
        sysFetch(
          API,
          {
            pro: 'SELHRTI0051100',
            in_par: {
              p1_varchar2: valueOrg,
              p2_varchar2: selectedCurrentEmployee,
              p3_varchar2: 'ALL',
              p4_varchar2: 'ALL',
              p5_varchar2: 'ALL',
              p6_varchar2: '',
              p7_varchar2: '',
              p8_varchar2: 'ALL',
            },
            out_par: {
              p1_sys: 'data',
            },
          },
          tokenLogin,
        ).then(rs => {
          setDsNhanVien(rs.data.data);
          dispatch(HideGlobalLoading);
          // setIsLoading(false);
        });
      }
    } catch (error) {
      // setIsLoading(false);
      console.log(error);
      dispatch(HideGlobalLoading);
    }
  };
  const convertDate = (characterSplit, datetime) => {
    const year = datetime.split(characterSplit)[2];
    const month = datetime.split(characterSplit)[1];
    const date = datetime.split(characterSplit)[0];
    const datetimeConvert = year + '' + month + '' + date;
    if (datetimeConvert == 'yyyymmdd') {
      return '';
    } else return datetimeConvert;
  };
  const onRequestToServer2 = () => {
    setDsNhanVien([]);

    const characterSplit = '/';
    let flag_img = 'ALL';
    if (DaCoHinh && ChuaCoHinh) {
      flag_img = 'ALL';
    } else if (DaCoHinh && !ChuaCoHinh) {
      flag_img = 'Y';
    } else if (!DaCoHinh && ChuaCoHinh) {
      flag_img = 'N';
    }

    try {
      dispatch(ShowGlobalLoading);
      sysFetch(
        API,
        {
          pro: 'SELHRTI0051100',
          in_par: {
            p1_varchar2: valueOrg,
            p2_varchar2: selectedCurrentEmployee,
            p3_varchar2: currentPos.code == null ? 'ALL' : currentPos.code,
            p4_varchar2:
              currentStatus.code == null ? 'ALL' : currentStatus.code,
            p5_varchar2: currentDate.code == null ? 'ALL' : currentDate.code,
            p6_varchar2: convertDate(characterSplit, fromDate),
            p7_varchar2: convertDate(characterSplit, toDate),
            p8_varchar2: flag_img,
          },
          out_par: {
            p1_sys: 'data',
          },
        },
        tokenLogin,
      ).then(rs => {
        setDsNhanVien(rs.data.data);
        dispatch(HideGlobalLoading);
      });
    } catch (error) {
      console.log(error);
      dispatch(HideGlobalLoading);
    }
  };
  const renderItem = ({item}) => {
    return (
      <OneEmployee
        item={item}
        keyExtractor={item.emp_id + '1'}
        onCheck={onCheck}
        arrWS={arrWS}
        arrAG={arrAG}
        arrMachine={arrMachine}
        groupPk={item.group_pk}
      />
    );
  };
  const onCheck = (emp_id, value) => {
    dsNhanVien.filter(e => e.emp_id === emp_id)[0].is_registed = value;
  };
  const [isShowPos, setIsShowPos] = useState(false);
  const [isShowStatus, setIsShowStatus] = useState(false);
  const [isShowDate, setIsShowDate] = useState(false);
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
      }
    } else {
      setToDate(moment(val).format('DD/MM/YYYY'));
    }
    setFromDate(moment(val).format('DD/MM/YYYY'));
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
  };
  const handleHideOnSelect = () => {
    setIsShowPos(false);
    setIsShowStatus(false);
    setIsShowDate(false);
  };
  const modalFilter = (
    <TVSControlPopup
      title={'Tìm kiếm nâng cao'}
      isShow={modalVisible}
      minHeight={400}
      onHide={() => onHideModalFilter()}
      onAccept={() => onFilter()}>
      <View>
        <View zIndex={3}>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text>Chức vụ</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsShowPos(!isShowPos);
                setIsShowDate(false);
                setIsShowStatus(false);
              }}
              style={{
                padding: 10,
                marginTop: 5,
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
              <Text
                style={{
                  color: Color.mainColor,
                }}>
                {currentPos.code_nm}
              </Text>
            </TouchableOpacity>
          </View>
          <TVSSelect
            isShow={isShowPos}
            data={arrPos}
            onSelected={item => {
              setIsShowPos(false);
              setCurrentPos(item);
            }}
          />
        </View>
        <View
          style={{
            zIndex: 2,
          }}>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text>Trạng thái</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsShowStatus(!isShowStatus);
                setIsShowDate(false);
              }}
              style={{
                padding: 10,
                marginTop: 5,
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
              <Text
                style={{
                  color: Color.mainColor,
                }}>
                {currentStatus.code_nm}
              </Text>
            </TouchableOpacity>
          </View>
          <TVSSelect
            isShow={isShowStatus}
            data={arrStatus}
            onSelected={item => {
              setIsShowStatus(false);
              setCurrentStatus(item);
            }}
          />
        </View>

        <View
          style={{
            zIndex: 1,
          }}>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text>Loại ngày</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsShowDate(!isShowDate);
              }}
              style={{
                padding: 10,
                marginTop: 5,
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
              <Text
                style={{
                  color: Color.mainColor,
                }}>
                {currentDate.code_nm}
              </Text>
            </TouchableOpacity>
          </View>
          <TVSSelect
            isShow={isShowDate}
            data={arrDate}
            onSelected={item => {
              setIsShowDate(false);
              setCurrentDate(item);
              if (item.code == 'ALL') {
                setFromDate('dd/mm/yyyy');
                setToDate('dd/mm/yyyy');
              }
            }}
          />
        </View>

        <View style={{zIndex: 0}}>
          <Block row justifyContent={'space-between'}>
            <Button nextScreen={showDatePickerStart} column flex>
              <Block row marginBottom={4}>
                <Text>Từ ngày</Text>
              </Block>
              <Block
                row
                justifyContent={'space-between'}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 8,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.16,
                  shadowRadius: 6,
                  elevation: 3,
                }}>
                <Text style={{color: Color.mainColor}}>{fromDate}</Text>
                <IconDate />
              </Block>
            </Button>
            <DateTimePickerModal
              cancelTextIOS="Hủy bỏ"
              confirmTextIOS="Xác nhận"
              isVisible={startDatePickerVisible}
              mode="date"
              hideTitleContainerIOS={false}
              date={
                fromDate !== 'dd/mm/yyyy'
                  ? new Date(moment(fromDate, 'DD/MM/YYYY'))
                  : new Date()
              }
              locale="vi_VN"
              onConfirm={handleConfirmStart}
              onCancel={hideDatePickerStart}
            />
            <Block
              alignCenter
              justifyCenter
              paddingTop={20}
              width={20}
              marginLeft={5}
              marginRight={5}>
              <Text>...</Text>
            </Block>
            <Button nextScreen={() => showDatePickerEnd()} column flex>
              <Block row marginBottom={4}>
                <Text>Đến ngày</Text>
              </Block>
              <Block
                row
                justifyContent={'space-between'}
                alignCenter
                style={{
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 8,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.16,
                  shadowRadius: 6,
                  elevation: 3,
                  color: Color.mainColor,
                }}>
                <Text style={{color: Color.mainColor}}>{toDate}</Text>
                <IconDate />
              </Block>
            </Button>
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
          </Block>
        </View>
        <View zIndex={-1} flexDirection={'row'}>
          <Button
            flex
            nextScreen={() => {
              if (ChuaCoHinh) {
                setDaCoHinh(!DaCoHinh);
              }
            }}
            row
            height={40}
            paddingLeft={5}
            paddingTop={10}
            alignCenter>
            <View style={DaCoHinh ? styles.CheckBoxE : styles.CheckBoxD}>
              {DaCoHinh ? (
                <MaterialCommunityIcons
                  name={'check'}
                  color={DaCoHinh ? Color.mainColor : Color.white}
                />
              ) : null}
            </View>
            <Text style={{marginLeft: 10}}>Đã có hình</Text>
          </Button>
          <Button
            flex
            nextScreen={() => {
              if (DaCoHinh) {
                setChuaCoHinh(!ChuaCoHinh);
              }
            }}
            row
            height={40}
            paddingLeft={30}
            paddingTop={10}
            alignCenter>
            <View style={ChuaCoHinh ? styles.CheckBoxE : styles.CheckBoxD}>
              {ChuaCoHinh ? (
                <MaterialCommunityIcons
                  name={'check'}
                  color={ChuaCoHinh ? Color.mainColor : Color.white}
                />
              ) : null}
            </View>
            <Text style={{marginLeft: 10}}>Chưa có hình</Text>
          </Button>
        </View>
        <View
          style={{
            zIndex: -2,
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}></View>
      </View>
    </TVSControlPopup>
  );

  const [dataOrg, setDataOrg] = useState([]);
  const [dataOrgFilter, setDataOrgFilter] = useState([]);
  const [valueOrg, setValueOrg] = useState('');
  const [labelOrg, setLabelOrg] = useState('Chọn phòng ban');
  const [modalOrgVisible, setModalOrgVisible] = useState(false);
  const getStateOrg = async result => {
    setTimeout(() => {
      setLabelOrg(result.code_nm);
      setValueOrg(result.code);
      setModalOrgVisible(false);
    }, 100);
  };
  const modalOrg = (
    <TVSControlPopup
      title={'CHỌN PHÒNG BAN'}
      maxHeight={400}
      isShow={modalOrgVisible}
      onHide={() => setModalOrgVisible(false)}>
      <View
        style={{
          flex: 0,
          marginBottom: 10,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <TextInput
            onChangeText={newText => {
              onChangeOrgFilter(newText);
            }}
            style={{
              padding: 10,
              marginTop: 5,
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
            }}
          />
        </View>
      </View>
      <FlatList
        data={dataOrgFilter}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateOrg(item);
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

  const onChangeOrgFilter = textFilter => {
    let oldArray = dataOrg;
    let newArray = [];
    newArray = oldArray.filter(item =>
      item.code_nm.toLowerCase().includes(textFilter.toLowerCase()),
    );
    setDataOrgFilter(newArray);
  };

  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {
            menu.filter(x => x.menu_cd === 'MBHRTI005')[0][
              currentLangue.toLowerCase()
            ]
          }
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <Block
            backgroundColor="#fff"
            padding={5}
            margin={5}
            radius={5}
            zIndex={20}>
            <View
              zIndex={20}
              style={{
                marginVertical: 5,
                marginHorizontal: 10,
                marginBottom: 0,
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text>Phòng ban</Text>
                  <Button
                    nextScreen={() => {
                      setDataOrgFilter(dataOrg);
                      setModalOrgVisible(true);
                    }}
                    row
                    style={{
                      padding: 8,
                      marginTop: 5,
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
                        style={{
                          color: valueOrg === '' ? '#B2B2B2' : null,
                        }}>
                        {labelOrg}
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
                </View>
                <View
                  style={{
                    justifyContent: 'flex-end',
                    marginLeft: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => onShowModal()}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: Color.gray,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}>
                    <Icon
                      name={isFilter ? 'filter-outline' : 'filter'}
                      color={Color.mainColor}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flex: 0,
                  marginTop: 5,
                  marginBottom: 10,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text>Nhân viên</Text>
                  <TextInput
                    onChangeText={newText =>
                      setSelectedCurrentEmployee(newText)
                    }
                    style={{
                      padding: 10,
                      marginTop: 5,
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
                    }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'flex-end',
                    marginLeft: 10,
                  }}>
                  <TouchableOpacity onPress={() => onRequestToServer()}>
                    <LinearGradient
                      colors={['#01acec', '#2E86C1']}
                      style={{
                        backgroundColor: 'red',
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        padding: 10,
                        backgroundColor: Color.gray,
                      }}>
                      <Icon name={'account-search'} size={20} color={'white'} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Block>
          <ScrollView maxHeight={550}>
            {dsNhanVien.length > 0
              ? dsNhanVien.map(item => (
                  <OneEmployee
                    item={item}
                    // keyExtractor={item.emp_id + '1'}
                    onCheck={onCheck}
                    arrWS={arrWS}
                    arrAG={arrAG}
                    arrMachine={arrMachine}
                    groupPk={item.group_pk}
                  />
                ))
              : // <FlatList
                //   style={styles.flastList}
                //   // onRefresh={onRefreshData}
                //   // refreshing={OnRefresh}
                //   data={dsNhanVien}
                //   renderItem={renderItem}
                //   keyExtractor={item => item.no.toString()}
                // />
                null}
          </ScrollView>
          {/* <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.btnRegister}
              onPress={() => onTest()}>
              <Text color={Color.white}>
                <MaterialCommunityIcons size={16} name="account-plus" /> Đăng ký
                nhân viên
              </Text>
            </TouchableOpacity>
            <View style={styles.viewRegisterAll}>
              <Text>Chọn tất cả</Text>
              <TouchableOpacity
                style={styles.viewCheckboxAll}
                onPress={() => onCheckAll()}>
                {CheckAll ? (
                  <View style={styles.checkboxAll}>
                    <MaterialCommunityIcons
                      name={'check'}
                      color={Color.white}
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          </View> */}
        </Block>
        {modalOrg}
        {modalFilter}
      </Block>
    </>
  );
};
export default DangKyKhuonMatHIK;
