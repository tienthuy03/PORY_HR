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
} from 'react-native';
import Device from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import TVSHeader from '../../../../components/Tvs/Header';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../services/redux/GlobalLoading/action';
import {
  HRTI004ChonPhongBan,
  HRTI004LoadDanhSachMayChamCongS,
  HRTI004LoadDanhSachNhanVien,
  HRTI004LoaiDangKy,
  HRTI004SetCheckAll,
  HRTI004ShowPopupDangKyKhuonMat,
  HRTI004ShowPopupMayChamCong,
} from '../../../../services/redux/HRTI004_DangKyKhuonMatFe/action';
import OneEmployee from './OneEmployee';
import PopupDangKyKhuonMatFe from './Popup_DangKyKhuonMat';
import PopupMayChamCong from './Popup_MayChamCong';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
const DangKyKhuonMatFe = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
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
      flexDirection: 'row',
      borderTopColor: Color.inputBackgroundColor,
      borderTopWidth: 1,
      position: 'absolute',
      zIndex: 100,
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
      marginBottom: 50,
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
      borderColor: Color.mainColor,
      backgroundColor: Color.mainColor,
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
  const [DaCoHinh, setDaCoHinh] = useState(true);
  const [ChuaCoHinh, setChuaCoHinh] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const {OnRefresh} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  const menu = useSelector(state => state.menuReducer.data.data.menu);

  let dsNhanVien = useSelector(state => {
    const temp = [];
    state.HRTI004_DangKyKhuonMatFeReducer.DanhSachNhanVien.map(x => {
      if (DaCoHinh && x.image.length > 0) {
        temp.push(x);
      }
      if (ChuaCoHinh && x.image.length === 0) {
        temp.push(x);
      }
    });
    return temp;
  });
  const currentLangue = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const {ChonPhongBan} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  const {CheckAll} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  const {DanhSachPhongBan} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  const {LoaiDangKy} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  let {DanhSachMayChamCong} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  let {ChonNhanVien} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  useEffect(() => {
    dispatch(HRTI004SetCheckAll(false));
    dispatch(HRTI004LoadDanhSachNhanVien({rf: false}));
  }, []);
  const renderItem = ({item}) => {
    return (
      <OneEmployee
        item={item}
        keyExtractor={item.emp_id + '1'}
        onCheck={onCheck}
      />
    );
  };
  const onRegisterEmployee = async () => {
    let registerArr = dsNhanVien.filter(x => x.is_registed === 'Y');
    if (registerArr.length > 0) {
      DanhSachMayChamCong.map(item => {
        item.is_selected = false;
      });
      dispatch(HRTI004LoaiDangKy(1));
      dispatch(HRTI004LoadDanhSachMayChamCongS(DanhSachMayChamCong));
      dispatch(HRTI004ShowPopupMayChamCong(true));
    }
  };

  const onCheck = (emp_id, value) => {
    dsNhanVien.filter(e => e.emp_id === emp_id)[0].is_registed = value;
  };
  const onRefreshData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRTI0040100',
        in_par: {
          p1_varchar2: userPk,
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('onRefreshData', null);
        }
        if (rs != 'Token Expired') {
          dispatch(HRTI004LoadDanhSachNhanVien({rf: true}));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const onSelect = item => {
    sysFetch(
      API,
      {
        pro: 'SELHRTI0040100',
        in_par: {
          p1_varchar2: userPk,
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('onSelect', item);
        }
        if (rs != 'Token Expired') {
          dispatch(HRTI004ChonPhongBan(item));
          dispatch(HRTI004LoadDanhSachNhanVien({rf: false}));
          setModalVisible(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const refreshNewToken = (obj, p1) => {
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
        if (obj == 'onRegister') {
          onRegister();
        }
        if (obj == 'onRefreshData') {
          onRefreshData();
        }
        if (obj == 'onSelect') {
          onSelect(p1);
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

  const onRegister = async () => {
    dispatch(ShowGlobalLoading);
    dispatch(HRTI004ShowPopupMayChamCong(false));
    dsNhanVien.map(x => (x.network_status = undefined));
    if (LoaiDangKy === 1) {
      if (
        DanhSachMayChamCong.filter(item => item.is_selected === true).length > 0
      ) {
        if (dsNhanVien.filter(x => x.is_registed === 'Y').length > 0) {
          let registerArr = dsNhanVien.filter(x => x.is_registed === 'Y');
          let arrMCC = DanhSachMayChamCong.filter(
            item => item.is_selected === true,
          );
          await Promise.all(
            arrMCC.map(async itemMachine => {
              await Promise.all(
                registerArr.map(async item => {
                  await axios({
                    method: 'get',
                    url:
                      itemMachine.api_address +
                      'api/FE500/RegisterEmployee?password=' +
                      itemMachine.password +
                      '&ip=' +
                      itemMachine.ip +
                      ':' +
                      itemMachine.port +
                      '&empId=' +
                      item.id_num +
                      '&empName=' +
                      item.full_name,
                  })
                    .then(async _rs => {
                      await axios({
                        method: 'post',
                        url:
                          itemMachine.api_address +
                          'api/FE500/RegisterFace?ip=' +
                          itemMachine.ip +
                          ':' +
                          (itemMachine.port === null
                            ? '8090'
                            : itemMachine.port) +
                          '&password=' +
                          itemMachine.password +
                          '&personId=' +
                          item.id_num +
                          '&faceId=' +
                          item.id_num +
                          'p1',
                        data: {
                          image: item.image,
                        },
                      })
                        .then(async rs_rg => {
                          if (rs_rg.data.code === 'LAN_SUS-0') {
                            dsNhanVien.filter(
                              x => x.full_name === item.full_name,
                            )[0].network_status = 'Đăng ký thành công.';
                          } else {
                            await axios({
                              method: 'post',
                              url:
                                itemMachine.api_address +
                                'api/FE500/UpdateFace?ip=' +
                                itemMachine.ip +
                                ':' +
                                (itemMachine.port === null
                                  ? '8090'
                                  : itemMachine.port) +
                                '&password=' +
                                itemMachine.password +
                                '&personId=' +
                                item.id_num +
                                '&faceId=' +
                                item.id_num +
                                'p1',
                              data: {
                                image: item.image,
                              },
                            })
                              .then(rs_up => {
                                if (rs_up.data.result.code === 'LAN_SUS-0') {
                                  dsNhanVien.filter(
                                    x => x.full_name === item.full_name,
                                  )[0].network_status = 'Đăng ký thành công.';
                                } else {
                                  dsNhanVien.filter(
                                    x => x.full_name === item.full_name,
                                  )[0].network_status =
                                    'Đăng ký không thành công.';
                                }
                              })
                              .catch(_err => {
                                dsNhanVien.filter(
                                  x => x.full_name === item.full_name,
                                )[0].network_status =
                                  'Đăng ký không thành công.';
                              });
                          }
                        })
                        .catch(() => {
                          dsNhanVien.filter(
                            x => x.full_name === item.full_name,
                          )[0].network_status = 'Đăng ký không thành công.';
                        });
                    })
                    .catch(() => {
                      dsNhanVien.filter(
                        x => x.full_name === item.full_name,
                      )[0].network_status = 'Đăng ký không thành công.';
                    });
                }),
              );
            }),
          );
          await dispatch(HideGlobalLoading);
          await Alert.alert('Thông báo', 'Tải lên hoàn tất.', [
            {
              text: 'Đóng',
              onPress: () => {
                dispatch(HRTI004ShowPopupMayChamCong(false));
              },
            },
          ]);
        } else {
          Alert.alert('Thông báo', 'Hãy chọn máy nhân viên.', [{text: 'Đóng'}]);
        }
      } else {
        Alert.alert('Thông báo', 'Hãy chọn máy chấm công.', [{text: 'Đóng'}]);
      }
    } else if (LoaiDangKy === 2) {
      const param = {
        pro: 'UPDHRTI0040100',
        in_par: {
          p1_varchar2: ChonNhanVien.id_num,
          p2_varchar2: ChonNhanVien.newImage,
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
        .then(_rs => {})
        .catch(err => {
          if (err == 'AxiosError: Request failed with status code 401') {
            refreshNewToken('onRegister', null);
          }
          console.log(err);
        });
      if (
        DanhSachMayChamCong.filter(item => item.is_selected === true).length > 0
      ) {
        await Promise.all(
          DanhSachMayChamCong.filter(item => item.is_selected === true).map(
            async item => {
              axios({
                method: 'post',
                url:
                  item.api_address +
                  'api/FE500/RegisterFace?ip=' +
                  item.ip +
                  ':' +
                  (item.port === null ? '8090' : item.port) +
                  '&password=' +
                  item.password +
                  '&personId=' +
                  ChonNhanVien.id_num +
                  '&faceId=' +
                  ChonNhanVien.id_num +
                  'p1',
                data: {
                  image: ChonNhanVien.newImage,
                },
              })
                .then(rs => {
                  if (rs.data.code === 'LAN_SUS-0') {
                    Alert.alert('Thông báo', 'Đăng ký thành công.', [
                      {text: 'Đóng'},
                    ]);
                  } else {
                    axios({
                      method: 'post',
                      url:
                        item.api_address +
                        'api/FE500/UpdateFace?ip=' +
                        item.ip +
                        ':' +
                        (item.port === null ? '8090' : item.port) +
                        '&password=' +
                        item.password +
                        '&personId=' +
                        ChonNhanVien.id_num +
                        '&faceId=' +
                        ChonNhanVien.id_num +
                        'p1',
                      data: {
                        image: ChonNhanVien.newImage,
                      },
                    })
                      .then(rs => {
                        if (rs.data.result.code === 'LAN_SUS-0') {
                          Alert.alert('Thông báo', 'Đăng ký thành công.', [
                            {
                              text: 'Đóng',
                              onPress: () => {
                                dispatch(
                                  HRTI004LoadDanhSachNhanVien({rf: false}),
                                );
                                dispatch(HRTI004ShowPopupDangKyKhuonMat(false));
                              },
                            },
                          ]);
                        } else {
                          Alert.alert(
                            'Thông báo',
                            'Lỗi hình ảnh xin thử lại.\n' + rs.data.result.msg,
                            [{text: 'Đóng'}],
                          );
                        }
                      })
                      .catch(err => {
                        Alert.alert('Thông báo', err, [{text: 'Đóng'}]);
                      });
                  }
                })
                .catch(err => console.log(err));
            },
          ),
        );
        await dispatch(HideGlobalLoading);
      } else {
        dispatch(ShowGlobalLoading);
        Alert.alert('Thông báo', 'Hãy chọn máy chấm công.', [{text: 'Đóng'}]);
      }
    }
  };
  const renderPhongBan = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.oneFieldQues}
        activeOpacity={0.7}
        onPress={() => onSelect(item)}>
        <Text>{item.code_nm}</Text>
      </TouchableOpacity>
    );
  };
  const modal = (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <Button
        nextScreen={() => setModalVisible(false)}
        height={Platform.OS === 'ios' ? 160 : 130}
        backgroundColor={'rgba(0,0,0,0.4)'}
        flex
      />
      <View style={styles.formView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.textHeader}>CHỌN PHÒNG BAN</Text>
          </View>
          <View style={styles.body}>
            <FlatList
              data={DanhSachPhongBan}
              renderItem={renderPhongBan}
              keyExtractor={item => item.code.toString()}
            />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnOk}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Button
        nextScreen={() => setModalVisible(false)}
        flex
        backgroundColor={'rgba(0,0,0,0.4)'}
      />
    </Modal>
  );

  return (
    <>
      <PopupMayChamCong onRegister={onRegister} />
      <PopupDangKyKhuonMatFe />
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {
            menu.filter(x => x.menu_cd === 'MBHRTI004')[0][
              currentLangue.toLowerCase()
            ]
          }
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <Block backgroundColor="#fff" padding={5} margin={5} radius={5}>
            <Block
              column
              backgroundColor="#F3F6F9"
              radius={5}
              alignCenter
              marginBottom={5}
              justifyCenter
              height={40}>
              <Button
                nextScreen={() => setModalVisible(true)}
                row
                height={40}
                paddingLeft={20}
                alignCenter
                justifyCenter>
                <Text
                  paddingRight={10}
                  color={Color.mainColor}
                  flex
                  size={14}
                  paddingLeft={10}>
                  {ChonPhongBan.code_nm}
                </Text>
                <Text marginRight={10} />
              </Button>
            </Block>
            <Block
              column
              radius={5}
              alignCenter
              // justifyCenter
              height={40}
              flexDirection={'row'}>
              <Button
                flex
                nextScreen={() => {
                  if (ChuaCoHinh) {
                    setDaCoHinh(!DaCoHinh);
                  }
                }}
                row
                height={40}
                paddingLeft={20}
                alignCenter>
                <View style={DaCoHinh ? styles.CheckBoxE : styles.CheckBoxD}>
                  {DaCoHinh ? (
                    <MaterialCommunityIcons
                      name={'check'}
                      color={DaCoHinh ? Color.white : Color.mainColor}
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
                paddingLeft={20}
                alignCenter>
                <View style={ChuaCoHinh ? styles.CheckBoxE : styles.CheckBoxD}>
                  {ChuaCoHinh ? (
                    <MaterialCommunityIcons
                      name={'check'}
                      color={ChuaCoHinh ? Color.white : Color.mainColor}
                    />
                  ) : null}
                </View>
                <Text style={{marginLeft: 10}}>Chưa có hình</Text>
              </Button>
            </Block>
          </Block>
          {
            // isLoading ? null :
            dsNhanVien.length > 0 ? (
              <FlatList
                style={styles.flastList}
                onRefresh={onRefreshData}
                refreshing={OnRefresh}
                data={dsNhanVien}
                renderItem={renderItem}
                keyExtractor={item => item.no.toString()}
              />
            ) : null
          }
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.btnRegister}
              onPress={onRegisterEmployee}>
              <Text color={Color.white}>
                <MaterialCommunityIcons size={16} name="account-plus" /> Đăng ký
                nhân viên
              </Text>
            </TouchableOpacity>
            <View style={styles.viewRegisterAll}>
              <Text>Chọn tất cả</Text>
              <TouchableOpacity
                style={styles.viewCheckboxAll}
                onPress={() => dispatch(HRTI004SetCheckAll(!CheckAll))}>
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
          </View>
        </Block>
        {modal}
      </Block>
    </>
  );
};

export default DangKyKhuonMatFe;
