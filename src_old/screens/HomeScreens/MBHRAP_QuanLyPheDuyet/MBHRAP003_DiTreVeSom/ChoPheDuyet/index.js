/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import {CheckBox} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import Button from '../../../../../components/Button';
import OneField from '../../../../../components/OneFieldObject';
import Text from '../../../../../components/Text';
import TextInput from '../../../../../components/TextInput';
import Icon_chat from '../../../../../icons/Chat';
import sysFetch from '../../../../../services/fetch';
const CPD = ({dates, dataPD, callbackRefresh}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector(state => state.loginReducers);
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  let load;
  let emp_pk = '';
  let full_name = '';
  // let tokens = '';
  let tokenLogin;
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    emp_pk = loginReducers.data.data.thr_emp_pk;
    full_name = loginReducers.data.data.full_name;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {}
  const [isLoading, setIsLoading] = useState(true);
  const [check, setCheck] = useState(false);
  const [valueDialog, setValueDialog] = useState('');
  const [comment, setComment] = useState([]);
  let [checkBox, setCheckBox] = useState([]);
  const [numberCheck, setNumberCheck] = useState(0);
  const [commentPk, setcommentPk] = useState('');
  const [dialogComment, setDialogComment] = useState(false);
  const [dataCPD, setDataCPD] = useState([]);
  const [continues, setContinues] = useState(false);
  let [lengthDataProps, setLengthDataProps] = useState(0);
  let [numberRecord, setNumberRecord] = useState(3);
  const [roleType, setRoleType] = useState(0);
  if (roleType === 0) {
    if (dataCPD.length > 0) {
      setRoleType(dataCPD[0].role_type);
    }
  }
  useEffect(() => {
    let dataChoPD = [];
    dataPD.map(element => {
      if (element.approve_status === '1') {
        dataChoPD.push(element);
      }
    });
    setDataCPD(dataChoPD);
    setLengthDataProps(dataChoPD.length);
    setIsLoading(load);
  }, [load]);

  const toggleCheckbox = pk => {
    let checkboxes = checkBox;
    //let numberAll = 0;
    if (pk === 'All') {
      checkboxes = [];
      if (check === true) {
        checkboxes = [];
        setCheck(false);
        setCheckBox(checkboxes);
        setNumberCheck(checkboxes.length);
      } else {
        dataCPD.map(item => {
          checkboxes.push(item.pk);
        });
        setCheck(true);
        setCheckBox(checkboxes);
        setNumberCheck(checkboxes.length);
      }
    } else {
      const index = checkboxes.indexOf(pk);
      if (checkboxes && index != -1) {
        checkboxes.splice(index, 1);
      } else {
        checkboxes.push(pk);
      }
      if (checkboxes.length == dataCPD.length) {
        setCheck(true);
        setCheckBox(checkboxes);
        setNumberCheck(checkboxes.length);
      } else {
        setCheck(false);
        setCheckBox(checkboxes);
        setNumberCheck(checkboxes.length);
      }
    }
  };

  const showDialogInput = pk => {
    setDialogComment(true);
    setcommentPk(pk);
  };

  const submitInput = inputText => {
    let comments = comment;
    let commentPks = commentPk;
    setDialogComment(false);
    if (inputText === '') {
      let index = comments.findIndex(cmt => cmt.pk === commentPks);
      if (index !== -1) {
        comments.splice(index, 1);
      }
    } else {
      let index = comments.findIndex(cmt => cmt.pk === commentPks);
      if (index === -1) {
        comments.push({pk: commentPks, comment: inputText});
      } else {
        comments[index].comment = inputText;
      }
    }
    setValueDialog('');
    setComment(comments);
  };

  const handleLoadMore = lengthData => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };

  function delay(t) {
    return new Promise(resolve => setTimeout(resolve, t));
  }
  const refreshNewToken = (obj, param1) => {
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
        if (obj == 'updateExperience') {
          updateExperience(param1);
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
  const updateExperience = async p_approve_status => {
    setContinues(true);
    let dataSend = [];
    let checkboxes = checkBox;

    if (comment.length === 0) {
      let dataSend_;
      dataSend_ = checkboxes.map(pk => ({pk: pk, comment: ''}));
      dataSend = dataSend_;
    } else {
      checkboxes.map(item => {
        let itemComment = comment.filter(cmt => cmt.pk === item);
        if (itemComment.length > 0) {
          dataSend.push({pk: item, comment: itemComment[0].comment});
        } else {
          dataSend.push({pk: item, comment: ''});
        }
      });
    }
    let i = 0;
    let a = 0;
    let dataErros = '';
    while (i < dataSend.length) {
      await delay(200);
      sysFetch(
        API,
        {
          pro: 'UPDHRAP0030100',
          in_par: {
            p1_varchar2: 'UPDATE',
            p2_varchar2: dataSend[i].pk,
            p3_varchar2: p_approve_status,
            p4_varchar2: dataSend[i].comment,
            p5_varchar2: emp_pk,
            p6_varchar2: roleType,
            p7_varchar2: full_name,
          },
          out_par: {
            p1_varchar2: 'cpd_send',
            p2_sys: 'noti',
          },
        },
        tokenLogin,
      )
        .then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('updateExperience', p_approve_status);
          }
          if (rs != 'Token Expired') {
            if (rs.results == 'S') {
              if (rs.results === 'S') {
                //Gui Thong Bao START
                /////////////////////////////
                let data_noti = [];
                data_noti = rs.data.noti;
                var arrayTokens = [];
                data_noti.map(item => {
                  if (item.device_id !== '') {
                    arrayTokens.push(item.device_id);
                  }
                });
                if (data_noti.length > 0) {
                  let paramss = {
                    body: data_noti[0].ann_title,
                    title: data_noti[0].ann_content,
                    ids: arrayTokens,
                  };
                  const URL = API + 'Notification/Push';
                  let axiosConfig = {
                    headers: {
                      Authorization: `Bearer ${tokenLogin}`,
                    },
                  };
                  axios
                    .post(URL, paramss, axiosConfig)
                    .then(response => response.data)
                    .catch(error => {});
                }
                ///////////////////////
                //Gui Thong Bao END
                if (i == dataSend.length - 1) {
                  if (p_approve_status === 2) {
                    Alert.alert(
                      'Thông báo',
                      'Phê duyệt thành công!',
                      [
                        {
                          text: 'Thoát',
                          onPress: () => {
                            setContinues(false);
                            setCheck(false);
                            setNumberCheck(0);
                            callbackRefresh();
                          },
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  } else if (p_approve_status === 3) {
                    Alert.alert(
                      'Thông báo',
                      'Không phê duyệt thành công!',
                      [
                        {
                          text: 'Thoát',
                          onPress: () => {
                            setContinues(false);
                            setCheck(false);
                            setNumberCheck(0);
                            callbackRefresh();
                          },
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  }
                } else if (dataSend.length === 1) {
                  if (p_approve_status === 2) {
                    Alert.alert(
                      'Thông báo',
                      'Phê duyệt thành công!',
                      [
                        {
                          text: 'Thoát',
                          onPress: () => {
                            setContinues(false);
                            setCheck(false);
                            setNumberCheck(0);
                            callbackRefresh();
                          },
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  } else if (p_approve_status === 3) {
                    Alert.alert(
                      'Thông báo',
                      'Không phê duyệt thành công!',
                      [
                        {
                          text: 'Thoát',
                          onPress: () => {
                            setContinues(false);
                            setCheck(false);
                            setNumberCheck(0);
                            callbackRefresh();
                          },
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  }
                }
              } else if (rs.results === 'F') {
                if (p_approve_status == 2) {
                  if (dataSend.length == 1) {
                    let newText = rs.errorData.split(':');
                    let errors = newText[1].trim().split('\n')[0];
                    Alert.alert(
                      'Thông báo',
                      errors,
                      [
                        {
                          text: 'Thoát',
                          onPress: () => {
                            setContinues(false);
                            setCheck(false);
                            setNumberCheck(0);
                            callbackRefresh();
                          },
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  } else {
                    a = a + 1;
                    dataErros = rs.errorData;
                  }
                } else if (p_approve_status == 3) {
                  if (dataSend.length == 1) {
                    let newText = rs.errorData.split(':');
                    let errors = newText[1].trim().split('\n')[0];
                    Alert.alert(
                      'Thông báo',
                      errors,
                      [
                        {
                          text: 'Thoát',
                          onPress: () => {
                            setContinues(false);
                            setCheck(false);
                            setNumberCheck(0);
                            callbackRefresh();
                          },
                          style: 'cancel',
                        },
                      ],
                      {cancelable: false},
                    );
                  } else {
                    a = a + 1;
                    dataErros = rs.errorData;
                  }
                }
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

      if (a == 1) {
        if (p_approve_status == 2) {
          let newText = dataErros.split(':');
          let errors = newText[1].trim().split('\n')[0];
          Alert.alert(
            'Thông báo',
            errors,
            [
              {
                text: 'Thoát',
                onPress: () => {
                  setContinues(false);
                  setCheck(false);
                  setNumberCheck(0);
                  callbackRefresh();
                },
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
          break;
        } else if (p_approve_status == 3) {
          let newText = dataErros.split(':');
          let errors = newText[1].trim().split('\n')[0];
          Alert.alert(
            'Thông báo',
            errors,
            [
              {
                text: 'Thoát',
                onPress: () => {
                  setContinues(false);
                  setCheck(false);
                  setNumberCheck(0);
                  callbackRefresh();
                },
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
          break;
        }
      }
      i = i + 1;
    }
  };

  const dialogError = text => {
    Alert.alert(
      'Thông báo',
      text,
      [
        {
          text: 'Thoát',
          onPress: () => console.log('Error'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const comfirmAlert = p_approve_status => {
    let checkboxes = checkBox;
    if (checkboxes == '') {
      let toast = 'Phải chọn ít nhất một dòng!';
      dialogError(toast);
      return;
    }

    if (p_approve_status === 2) {
      Alert.alert(
        'Phê duyệt vắng',
        'Bạn có muốn phê duyệt?',
        [
          {
            text: 'Hủy bỏ',
            onPress: () => console.log('Cancel Pressed'),
            style: 'destructive',
          },
          {
            text: 'Xác nhận',
            onPress: async () => {
              await updateExperience(p_approve_status);
            },
          },
        ],
        {cancelable: false},
      );
    } else if (p_approve_status === 3) {
      Alert.alert(
        'Không phê duyệt vắng',
        'Bạn có muốn không phê duyệt?',
        [
          {
            text: 'Hủy bỏ',
            onPress: () => console.log('Cancel Pressed'),
            style: 'destructive',
          },
          {
            text: 'Xác nhận',
            onPress: async () => {
              await updateExperience(p_approve_status);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };
  function ModalComment(checks) {
    return (
      <Modal animationType="fade" transparent={true} visible={checks}>
        <Block
          column
          flex
          backgroundColor={'rgba(0,0,0,0.4)'}
          justifyCenter
          alignCenter
          paddingLeft={20}
          paddingRight={20}>
          <Block
            backgroundColor={Color.white}
            radius={8}
            alignCenter
            padding={5}>
            <Text
              paddingTop={10}
              color={Color.mainColor}
              fontFamily={'Roboto-Bold'}
              size={20}>
              Phản hồi phê duyệt
            </Text>
            <Block
              marginLeft={5}
              marginRight={5}
              row
              backgroundColor={Color.gray}
              marginTop={10}
              radius={7}>
              <TextInput
                padding={10}
                height={80}
                placeholder={'Nhập phản hồi...'}
                color={Color.mainColor}
                value={valueDialog}
                flex={1}
                left
                onChangeText={text => setValueDialog(text)}
              />
            </Block>
            <View style={styles.underLine} />
            <Block
              row
              justifyContent={'space-between'}
              marginBottom={10}
              alignCenter>
              <Button
                nextScreen={() => setDialogComment(false)}
                padding={10}
                margin={5}
                alignCenter
                flex
                radius={4}
                backgroundColor={Color.gray}>
                <Text color={Color.red}>Huỷ bỏ</Text>
              </Button>
              <Button
                nextScreen={() => submitInput(valueDialog)}
                padding={10}
                alignCenter
                margin={5}
                radius={4}
                backgroundColor={Color.mainColor}
                flex>
                <Text color={Color.white}>Xác nhận</Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Modal>
    );
  }

  const Item_CPD = ({item}) => {
    const checkboxes = checkBox;
    return (
      <Block flex marginLeft={10} marginRight={10} marginBottom={15}>
        <Block row justifyContent={'space-between'} alignCenter>
          <Block
            borderTopRightRadius={6}
            borderTopLeftRadius={6}
            backgroundColor={Color.white}
            height={35}
            alignCenter
            justifyCenter
            paddingLeft={10}
            paddingRight={10}>
            <Text color={Color.mainColor} size={14}>
              {item.abs_dt_label}
            </Text>
          </Block>
          <View style={{paddingtop: 20, paddingRight: 20, paddingLeft: 20}}>
            <CheckBox
              style={styles.checks}
              checked={checkboxes && checkboxes.includes(item.pk)}
              onPress={() => toggleCheckbox(item.pk)}
              color={Color.mainColor}
            />
          </View>
        </Block>
        <Block
          backgroundColor={Color.white}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          borderBottomRightRadius={6}
          borderBottomLeftRadius={6}
          paddingBottom={5}>
          <OneField value={{'Mã nhân viên': item.emp_id}} />
          <OneField value={{'Họ tên': item.full_name}} />
          <OneField value={{'Từ giờ': item.start_hours}} />
          <OneField value={{'Đến giờ': item.end_hours}} />
          <OneField value={{'Lý do': item.reason_type}} />
          <Block
            flex
            backgroundColor={Color.gray}
            marginLeft={5}
            marginRight={5}
            marginTop={10}
            column
            radius={7}>
            <Text paddingLeft={10} paddingTop={5} color={Color.mainColor}>
              Nội dung:
            </Text>
            <Text
              paddingTop={10}
              paddingBottom={10}
              paddingLeft={10}
              paddingRight={10}
              fontFamily={'Roboto-Bold'}
              color={Color.mainColor}
              flex={1}
              flexWrap={'wrap'}>
              {item.description ? item.description : ' '}
            </Text>
          </Block>
          <Block
            row
            alignCenter
            paddingTop={15}
            paddingRight={5}
            justifyContent={'space-between'}
            paddingLeft={5}>
            <Text fontFamily={'Roboto-Bold'} color={Color.mainColor} flex={1}>
              Phản hồi
            </Text>
            <Button nextScreen={() => showDialogInput(item.pk)}>
              <Icon_chat style={{marginRight: 10}} />
            </Button>
          </Block>

          {comment.map((prop, index) => {
            return prop.pk === item.pk ? (
              <Block
                key={index}
                flex
                marginLeft={5}
                marginRight={5}
                height={50}
                backgroundColor={Color.gray}
                marginTop={10}
                radius={7}>
                <Text
                  padding={10}
                  color={Color.mainColor}
                  flex={1}
                  flexWrap={'wrap'}>
                  {prop.comment}
                </Text>
              </Block>
            ) : (
              <Block key={index} />
            );
          })}
        </Block>
      </Block>
    );
  };
  return (
    <Block backgroundColor={Color.gray} flex>
      {isLoading ? (
        <Block justifyCenter alignCenter backgroundColor={Color.gray} flex>
          <ActivityIndicator size="large" color="grey" />
        </Block>
      ) : (
        <Block flex backgroundColor={Color.gray} marginBottom={10}>
          <Block flex marginTop={5} backgroundColor={Color.gray}>
            <FlatList
              onRefresh={callbackRefresh}
              refreshing={false}
              data={dataCPD.slice(0, numberRecord)}
              renderItem={Item_CPD}
              onEndReached={() => handleLoadMore(lengthDataProps)}
              onEndReachedThreshold={0.5}
              extraData={dataCPD}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <Block
                  justifyCenter
                  alignCenter
                  backgroundColor={Color.gray}
                  marginTop={20}
                  flex>
                  <Text>Không có dữ liệu !</Text>
                </Block>
              )}
            />
            {ModalComment(dialogComment)}
          </Block>
          {dataCPD.length > 0 ? (
            <>
              <Block
                row
                marginBottom={Platform.OS === 'ios' ? 12 : 0}
                paddingLeft={10}
                paddingRight={10}>
                <Button
                  nextScreen={() => comfirmAlert(3)}
                  style={[
                    styles.buttonAprove,
                    {backgroundColor: Color.btnForeign},
                  ]}>
                  <Icon name={'close'} color={Color.white} size={16} />
                  <Text size={16} color={Color.white}>
                    Không phê duyệt
                  </Text>
                </Button>
                <Button
                  nextScreen={() => comfirmAlert(2)}
                  style={[
                    styles.buttonAprove,
                    {backgroundColor: Color.btnMain},
                  ]}>
                  <Icon name={'check'} color={Color.white} size={16} />
                  <Text size={16} color={Color.white}>
                    Phê duyệt
                  </Text>
                </Button>
              </Block>
            </>
          ) : null}
        </Block>
      )}
      {/* <Load visible={continues} /> */}
    </Block>
  );
};

const styles = StyleSheet.create({
  checks: {
    width: 22,
    height: 22,
    borderRadius: 4,
    paddingLeft: Platform.OS === 'ios' ? 0 : 2,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    paddingRight: Platform.OS === 'ios' ? 2 : 0,
  },
  buttonAprove: {
    flex: 1,
    //borderWidth: 2,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    borderRadius: 8,
    flexDirection: 'row',
  },
});

export default CPD;
