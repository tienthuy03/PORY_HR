import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  PermissionsAndroid,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSSelect from '../../../../components/Tvs/Select';
import Person from '../../../../icons/Person';
import sysFetch from '../../../../services/fetch';
import * as ANT from 'react-native-animatable';
import Skeleton from 'react-native-skeleton-placeholder';
import Button from '../../../../components/Button';
import TVSButton from '../../../../components/Tvs/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Block from '../../../../components/Block';
import moment from 'moment';
import {launchCamera} from 'react-native-image-picker';
import sysFetch2 from '../../../../services/fetch/fetch2';
import IconDate from '../../../../icons/Datev';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import {setHeaderChil2} from '../../../../Language';
const MBHRMN001_NhanVien = ({navigation: {goBack, navigate}}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const currentLangue = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const menu = useSelector(state => state.menuReducer.data.data.menu);
  const employee_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  let language = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  let dataMenuMBHRs = useSelector(state => state.menuReducer.data.data.menu);
  //initial default data
  const [dataPb, setDataPb] = useState([]);
  const [valuePb, setValuePb] = useState('');
  const [labelPb, setLabelPb] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [dataPos, setDataPos] = useState([]);
  const [valuePos, setValuePos] = useState('');
  const [labelPos, setLabelPos] = useState('');
  const [dataStatus, setDataStatus] = useState([]);
  const [valueStatus, setValueStatus] = useState('');
  const [labelStatus, setLabelStatus] = useState('');
  const [dataDateType, setDataDateType] = useState([]);
  const [valueDateType, setValueDateType] = useState('');
  const [labelDateType, setLabelDateType] = useState('');

  const [data, setData] = useState([]);
  const [arrOrg, setArrOrg] = useState([]);
  const [arrStatus, setArrStatus] = useState([]);
  const [arrPos, setArrPos] = useState([]);
  const [arrDate, setArrDate] = useState([]);
  const [isShowSelectionOrg, setIsShowSelectionOrg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [hideAllSelect, setHideAllSelect] = useState(false);
  const [fromDate, setFromDate] = useState('dd/mm/yyyy');
  const [toDate, setToDate] = useState('dd/mm/yyyy');
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  //current data
  const [selectedCurrentEmployee, setSelectedCurrentEmployee] = useState('');
  const [selectedCurrentOrg, setSelectedCurrentOrg] = useState([]);
  const [selectedCurrentStatus, setSelectedCurrentStatus] = useState([]);
  const [selectedCurrentPos, setSelectedCurrentPos] = useState([]);
  const [selectedCurrentDate, setSelectedCurrentDate] = useState([]);
  useEffect(() => {
    onLoadFirst();
  }, []);
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
        if (obj == 'onLoadFirst') {
          onLoadFirst();
        }
        if (obj == 'onRequestToServer') {
          onRequestToServer();
        }
        if (obj == 'onRequestToServer2') {
          onRequestToServer2();
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
  const onLoadFirst = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRMN0010100',
        in_par: {
          p1_varchar2: employee_pk,
        },
        out_par: {
          p1_sys: 'org',
          p2_sys: 'pos',
          p3_sys: 'date',
          p4_sys: 'status',
        },
      },
      tokenLogin,
    ).then(rs => {
      if (rs == 'Token Expired') {
        refreshNewToken('onLoadFirst');
      }
      if (rs != 'Token Expired') {
        if (rs.results === 'S') {
          setDataPb(rs.data.org);
          setLabelPb(rs.data.org[0].code_nm);
          setValuePb(rs.data.org[0].code);
          setDataPos(rs.data.pos);
          setLabelPos(rs.data.pos[0].code_nm);
          setValuePos(rs.data.pos[0].code);
          setDataStatus(rs.data.status);
          setLabelStatus(rs.data.status[0].code_nm);
          setValueStatus(rs.data.status[0].code);
          setDataDateType(rs.data.date);
          setLabelDateType(rs.data.date[0].code_nm);
          setValueDateType(rs.data.date[0].code);

          setArrOrg(rs.data.org);
          setSelectedCurrentOrg(rs.data.org[0]);
          setArrStatus(rs.data.status);
          setSelectedCurrentStatus(rs.data.status[0]);
          setArrPos(rs.data.pos);
          setSelectedCurrentPos(rs.data.pos[0]);
          setArrDate(rs.data.date);
          setSelectedCurrentDate(rs.data.date[0]);
        }
      }
    });
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
  const onRequestToServer = () => {
    const characterSplit = '/';
    try {
      if (selectedCurrentOrg.code !== 0) {
        //if Platform = 'IOS' -> use param control dropdown list | 'ANDROID' -> use param control popup
        setIsLoading(true);
        sysFetch(
          API,
          {
            pro: 'SELHRMN0011100',
            in_par: {
              p1_varchar2:
                Platform.OS === 'ios' ? selectedCurrentOrg.code : valuePb,
              p2_varchar2:
                Platform.OS === 'ios' ? selectedCurrentPos.code : valuePos, //pos type
              p3_varchar2:
                Platform.OS === 'ios'
                  ? selectedCurrentDate.code
                  : valueDateType, //date type
              p4_varchar2: convertDate(characterSplit, fromDate), //from date
              p5_varchar2: convertDate(characterSplit, toDate), //to date
              p6_varchar2:
                Platform.OS === 'ios'
                  ? selectedCurrentStatus.code
                  : valueStatus, //status
              p7_varchar2: selectedCurrentEmployee, //employee
            },
            out_par: {
              p1_sys: 'data',
            },
          },
          tokenLogin,
        ).then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('onRequestToServer');
          }
          if (rs != 'Token Expired') {
            if (rs.results === 'S') {
              setData(rs.data.data);
            }
            setIsLoading(false);
          }
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onRequestToServer2 = () => {
    try {
      if (selectedCurrentOrg.code !== 0) {
        //if Platform = 'IOS' -> use param control dropdown list | 'ANDROID' -> use param control popup
        setIsLoading(true);
        sysFetch(
          API,
          {
            pro: 'SELHRMN0011100',
            in_par: {
              p1_varchar2:
                Platform.OS === 'ios' ? selectedCurrentOrg.code : valuePb,
              p2_varchar2: 'ALL', //pos type
              p3_varchar2: 'ALL', //date type
              p4_varchar2: '', //from date
              p5_varchar2: '', //to date
              p6_varchar2: 'ALL', //status
              p7_varchar2: selectedCurrentEmployee, //employee
            },
            out_par: {
              p1_sys: 'data',
            },
          },
          tokenLogin,
        ).then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('onRequestToServer2');
          }
          if (rs != 'Token Expired') {
            if (rs.results === 'S') {
              setData(rs.data.data);
            }
            setIsLoading(false);
          }
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  //onFilter
  const onFilter = () => {
    onRequestToServer();
  };

  //render item
  const renderItem = ({item}) => <RenderItem item={item} onUpdate={onUpdate} />;

  //update image web user upgrade new image employee
  const onUpdate = (pk, image) => {
    const temp = [];
    data.map(item => {
      if (item._pk === pk) {
        temp.push({
          ...item,
          _image: image,
        });
      } else {
        temp.push(item);
      }
    });
    setData(temp);
  };

  const getState = async result => {
    setTimeout(() => {
      setLabelPb(result.code_nm);
      setValuePb(result.code);
      setModalVisible(false);
    }, 100);
  };
  const modalPB = (
    <TVSControlPopup
      title={'CHỌN PHÒNG BAN'}
      maxHeight={400}
      isShow={modalVisible}
      onHide={() => setModalVisible(false)}>
      <FlatList
        data={dataPb}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getState(item);
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

  return (
    <Block flex>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          'MBHRMN001',
          dataMenuMBHRs.filter(x => x.menu_cd === 'MBHRMN001')[0].p_pk,
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <View
          style={{
            flex: 1,
          }}>
          {/* render org */}
          <View
            style={{
              zIndex: 999,
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
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setIsShowSelectionOrg(!isShowSelectionOrg);
                      setHideAllSelect(!hideAllSelect);
                    }}
                    style={{
                      padding: 10,
                      marginTop: 5,
                      backgroundColor: Color.white,
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: Color.mainColor,
                      }}>
                      {selectedCurrentOrg.code_nm}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Button
                    nextScreen={() => setModalVisible(true)}
                    row
                    style={{
                      padding: 8,
                      marginTop: 5,
                      backgroundColor: Color.white,
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}>
                    <Block flex justifyCenter>
                      <Text
                        numberOfLines={1}
                        size={16}
                        style={{color: Color.mainColor}}>
                        {labelPb}
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
                )}
              </View>
              {modalPB}
              <View
                style={{
                  justifyContent: 'flex-end',
                  marginLeft: 10,
                }}>
                <TouchableOpacity
                  onPress={() => setIsFilter(!isFilter)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: Color.white,
                  }}>
                  <Icon
                    name={isFilter ? 'filter-outline' : 'filter'}
                    color={Color.mainColor}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TVSSelect
              data={arrOrg}
              isShow={isShowSelectionOrg}
              onSelected={item => {
                setSelectedCurrentOrg(item);
                setIsShowSelectionOrg(false);
              }}
              currentItem={selectedCurrentOrg}
            />
            <View
              style={{
                flex: 0,
                marginTop: 5,
                flexDirection: 'row',
                zIndex: 1,
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text>Nhân viên</Text>
                <TextInput
                  onChangeText={newText => setSelectedCurrentEmployee(newText)}
                  style={{
                    padding: Platform.OS === 'ios' ? 10 : 6,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}
                />
              </View>
              {!isFilter ? (
                <View
                  style={{
                    justifyContent: 'flex-end',
                    marginLeft: 10,
                  }}>
                  <TouchableOpacity onPress={() => onRequestToServer2()}>
                    <LinearGradient
                      colors={['#01acec', '#2E86C1']}
                      style={{
                        backgroundColor: Color.white,
                        borderRadius: 10,
                        padding: 10,
                      }}>
                      <Icon name={'account-search'} size={20} color={'white'} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              padding: 10,
              zIndex: 1,
            }}>
            {isFilter ? (
              <Filter
                onFilter={onFilter}
                onHide={() => setIsFilter(false)}
                arrDate={arrDate}
                arrPos={arrPos}
                arrStatus={arrStatus}
                hideOn={hideAllSelect}
                currentPos={selectedCurrentPos}
                setCurrentPos={item => setSelectedCurrentPos(item)}
                currentStatus={selectedCurrentStatus}
                setCurrentStatus={item => setSelectedCurrentStatus(item)}
                currentDate={selectedCurrentDate}
                setCurrentDate={item => setSelectedCurrentDate(item)}
                fromDate={fromDate}
                setFromDate={item => setFromDate(item)}
                toDate={toDate}
                setToDate={item => setToDate(item)}
                startDatePickerVisible={startDatePickerVisible}
                setStartDatePickerVisible={item =>
                  setStartDatePickerVisible(item)
                }
                endDatePickerVisible={endDatePickerVisible}
                setEndDatePickerVisible={item => setEndDatePickerVisible(item)}
                dataPos={dataPos}
                labelPos={labelPos}
                setLabelPos={item => setLabelPos(item)}
                setValuePos={item => setValuePos(item)}
                dataStatus={dataStatus}
                labelStatus={labelStatus}
                setLabelStatus={item => setLabelStatus(item)}
                setValueStatus={item => setValueStatus(item)}
                dataDateType={dataDateType}
                labelDateType={labelDateType}
                setLabelDateType={item => setLabelDateType(item)}
                setValueDateType={item => setValueDateType(item)}
              />
            ) : isLoading ? (
              <LoadingTemp />
            ) : isShowSelectionOrg ? null : (
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
              />
            )}
          </View>
          <TouchableOpacity
            style={{zIndex: 999}}
            onPress={() => {
              navigate('MBHRMN001_CREATE_NEW_EMPLOYEE');
            }}>
            <LinearGradient
              colors={['#01acec', '#2E86C1']}
              style={{
                backgroundColor: 'red',
                position: 'absolute',
                bottom: 30,
                right: 30,
                borderRadius: 50,
                padding: 10,
              }}>
              <Icon name={'account-plus'} size={30} color={'white'} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Block>
    </Block>
  );
};

//render one item
const RenderItem = ({item, onUpdate}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [isShow, setIsShow] = useState(false);
  const [oldItem, setOldItem] = useState(item);
  let tokenLogin2 = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );

  let userPk2 = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken2 = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const takePhoto = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Thông báo',
          message: 'Xin hãy cấp quyền truy cập camera cho ứng dụng.',
          buttonNegative: 'Hủy bỏ',
          buttonPositive: 'Xác nhận',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return Alert.alert(
          'Thông báo',
          'Xin hãy cấp quyền truy cập camera cho ứng dụng.',
          [{text: 'Đóng'}],
        );
      }
    }
    launchCamera(
      {
        maxWidth: 390,
        maxHeight: 520,
        quality: 1,
        cameraType: 'back',
        includeBase64: true,
        mediaType: 'photo',
      },
      res => {
        try {
          if (res.didCancel) {
            return;
          }
          const image = res.assets[0].base64;
          onUpdate(item._pk, image);
          Alert.alert(
            'Thông báo',
            'Bạn có muốn sao lưu?',
            [
              {
                text: 'Hủy bỏ',
                onPress: () => {
                  // setOldItem(oldItem);
                  onUpdate(item._pk, oldItem._image);
                },
                style: 'cancel',
              },
              {
                text: 'Xác nhận',
                onPress: () => {
                  onSave(image);
                },
              },
            ],
            {cancelable: false},
          );
        } catch (error) {
          console.log(error);
        }
      },
    );
  };
  const onSave = image => {
    sysFetch2(
      API,
      {
        pro: 'UPDHRMN0010100',
        in_par: {
          p1_varchar2: 'UPDATE',
          p2_varchar2: item._pk, //thr_emp_pk
          p3_varchar2: image, //image
        },
        out_par: {
          p1_varchar2: 'message',
        },
      },
      tokenLogin2,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken2('onSave', image);
        }
        if (rs != 'Token Expired') {
          if (rs.result === 'S') {
            // onUpdate(item._pk, image);
            setIsShow(false);
          }
          if (rs.result === 'F') {
            Alert.alert(
              'Thông báo',
              'Cập nhật hình ảnh thất bại. ' + rs.content,
            );
            // setData(oldData);
          }
        }
      })
      .catch(error => {
        console.log('error ', error);
        Alert.alert('Thông báo', 'Cập nhật hình ảnh thất bại. ' + error);
        // setData(oldData);
      });
  };
  const refreshNewToken2 = (obj, p1) => {
    axios
      .post(API + 'User/RefreshToken/', {
        token: tokenLogin2,
        userPk: userPk2,
        refreshToken: refreshToken2,
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
        tokenLogin2 = response.data.token;
        refreshToken2 = response.data.refreshToken;
        if (obj == 'onSave') {
          onSave(p1);
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
    <>
      <TVSControlPopup
        maxHeight={500}
        isShow={isShow}
        onHide={() => setIsShow(false)}
        title={'Thông tin nhân viên'}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 5,
          }}>
          <TouchableOpacity
            onPress={takePhoto}
            style={{
              width: 79,
              height: 104,
              marginRight: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#ccc',
            }}>
            {item._image ? (
              <Image
                style={{
                  width: 75,
                  height: 100,
                  borderRadius: 10,
                }}
                source={{
                  uri: 'data:image/jpeg;base64,' + item._image,
                }}
              />
            ) : (
              <Person />
            )}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                padding: 2,
                backgroundColor: 'white',
                borderRadius: 5,
              }}>
              <Icon name={'camera'} color={'#ccc'} size={20} />
            </View>
          </TouchableOpacity>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                color: Color.mainColor,
                fontWeight: 'bold',
                marginBottom: 5,
                fontSize: 20,
              }}>
              {item._name}
            </Text>
            <Text>{item._code}</Text>
            <Text>{item._org_name}</Text>
          </View>
        </View>
        <FlatList
          data={Object.entries(item)}
          renderItem={({item}) => {
            return item[0].substr(0, 1) === '_' ? null : (
              <View
                style={{
                  padding: 10,
                  marginBottom: 5,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    flex: 1,
                  }}>
                  {item[0].charAt(0).toUpperCase() + item[0].slice(1)}
                </Text>
                <Text
                  style={{
                    flex: 1,
                  }}>
                  {item[1]}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </TVSControlPopup>
      <TouchableOpacity
        onPress={() => setIsShow(true)}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}>
        <View style={{width: 60, height: 80}}>
          {item._image ? (
            <Image
              style={{
                width: 60,
                height: 80,
                // borderRadius: 10,
              }}
              source={{
                uri: 'data:image/jpeg;base64,' + item._image,
              }}
            />
          ) : (
            <Person />
          )}
        </View>
        <View
          style={{
            marginLeft: 10,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Color.mainColor,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            {item._name}
          </Text>
          <Text>{item._code}</Text>
          <Text>{item._org_name}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default MBHRMN001_NhanVien;

const LoadingTemp = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x => (
    <Skeleton key={x.toString()}>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 70,
            height: 70,
            marginRight: 10,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              borderRadius: 5,
              height: 20,
              marginBottom: 5,
            }}
          />
          <View
            style={{
              borderRadius: 4,
              height: 15,
              marginBottom: 5,
            }}
          />
          <View
            style={{
              borderRadius: 4,
              height: 15,
              marginBottom: 5,
            }}
          />
        </View>
      </View>
    </Skeleton>
  ));
};

const Filter = ({
  onHide,
  arrPos,
  arrDate,
  arrStatus,
  hideOn,
  currentPos,
  currentStatus,
  currentDate,
  setCurrentPos,
  setCurrentStatus,
  setCurrentDate,
  onFilter,
  fromDate,
  toDate,
  endDatePickerVisible,
  setEndDatePickerVisible,
  startDatePickerVisible,
  setStartDatePickerVisible,
  setFromDate,
  setToDate,
  dataPos,
  labelPos,
  setValuePos,
  setLabelPos,
  dataStatus,
  labelStatus,
  setValueStatus,
  setLabelStatus,
  dataDateType,
  labelDateType,
  setValueDateType,
  setLabelDateType,
}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [isShowPos, setIsShowPos] = useState(false);
  const [isShowStatus, setIsShowStatus] = useState(false);
  const [isShowDate, setIsShowDate] = useState(false);

  const [modalPosVisible, setModalPosVisible] = useState(false);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [modalDateVisible, setModalDateVisible] = useState(false);
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
  useEffect(() => {
    handleHideOnSelect();
  }, [hideOn]);

  const getStatePos = async result => {
    setTimeout(() => {
      setLabelPos(result.code_nm);
      setValuePos(result.code);
      setModalPosVisible(false);
    }, 100);
  };
  const getStateStatus = async result => {
    setTimeout(() => {
      setLabelStatus(result.code_nm);
      setValueStatus(result.code);
      setModalStatusVisible(false);
    }, 100);
  };
  const getStateDate = async result => {
    setTimeout(() => {
      setLabelDateType(result.code_nm);
      setValueDateType(result.code);
      setModalDateVisible(false);
    }, 100);
  };
  const modalPos = (
    <TVSControlPopup
      title={'CHỌN CHỨC VỤ'}
      maxHeight={400}
      isShow={modalPosVisible}
      onHide={() => setModalPosVisible(false)}>
      <FlatList
        data={dataPos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStatePos(item);
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
  const modalStatus = (
    <TVSControlPopup
      title={'CHỌN TRẠNG THÁI'}
      isShow={modalStatusVisible}
      onHide={() => setModalStatusVisible(false)}>
      <FlatList
        data={dataStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateStatus(item);
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
  const modalDate = (
    <TVSControlPopup
      title={'CHỌN LOẠI NGÀY'}
      isShow={modalDateVisible}
      onHide={() => setModalDateVisible(false)}>
      <FlatList
        data={dataDateType}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateDate(item);
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
  return (
    <ANT.View
      style={{
        flex: 1,
      }}
      animation={'fadeInDown'}
      duration={500}>
      <View style={{flex: 0}}>
        <View>
          <View
            style={{
              zIndex: 10,
            }}>
            <View
              style={{
                marginBottom: 10,
              }}>
              <Text>Chức vụ</Text>
              {Platform.OS === 'ios' ? (
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
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      color: Color.mainColor,
                    }}>
                    {currentPos.code_nm}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Button
                  nextScreen={() => setModalPosVisible(true)}
                  row
                  style={{
                    padding: 8,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Block flex justifyCenter>
                    <Text
                      numberOfLines={1}
                      size={16}
                      style={{color: Color.mainColor}}>
                      {labelPos}
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
              )}
            </View>
            {modalPos}
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
              zIndex: 9,
            }}>
            <View
              style={{
                marginBottom: 10,
              }}>
              <Text>Trạng thái</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsShowStatus(!isShowStatus);
                    setIsShowDate(false);
                  }}
                  style={{
                    padding: 10,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      color: Color.mainColor,
                    }}>
                    {currentStatus.code_nm}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Button
                  nextScreen={() => setModalStatusVisible(true)}
                  row
                  style={{
                    padding: 8,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Block flex justifyCenter>
                    <Text
                      numberOfLines={1}
                      size={16}
                      style={{color: Color.mainColor}}>
                      {labelStatus}
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
              )}
            </View>
            {modalStatus}
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
              zIndex: 8,
            }}>
            <View
              style={{
                marginBottom: 10,
              }}>
              <Text>Loại ngày</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsShowDate(!isShowDate);
                  }}
                  style={{
                    padding: 10,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      color: Color.mainColor,
                    }}>
                    {currentDate.code_nm}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Button
                  nextScreen={() => setModalDateVisible(true)}
                  row
                  style={{
                    padding: 8,
                    marginTop: 5,
                    backgroundColor: Color.white,
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Block flex justifyCenter>
                    <Text
                      numberOfLines={1}
                      size={16}
                      style={{color: Color.mainColor}}>
                      {labelDateType}
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
              )}
            </View>
            {modalDate}
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

          <View style={{zIndex: 7}}>
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
                    backgroundColor: Color.white,
                    borderRadius: 8,
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
                    backgroundColor: Color.white,
                    borderRadius: 8,
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

          <View
            style={{
              zIndex: 7,
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: '#ccc',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TVSButton type={'danger'} icon={'close'} onPress={onHide}>
              Đóng
            </TVSButton>
            <TVSButton
              icon={'account-search'}
              onPress={() => {
                if (currentDate.code == '') {
                  return Alert.alert('Thông báo', 'Vui lòng chọn loại ngày.', [
                    {text: 'Đóng'},
                  ]);
                } else if (currentPos.code == '') {
                  return Alert.alert('Thông báo', 'Vui lòng chọn chức vụ.', [
                    {text: 'Đóng'},
                  ]);
                } else {
                  onFilter();
                  onHide();
                }
              }}>
              Tìm kiếm
            </TVSButton>
          </View>
        </View>
      </View>
    </ANT.View>
  );
};
