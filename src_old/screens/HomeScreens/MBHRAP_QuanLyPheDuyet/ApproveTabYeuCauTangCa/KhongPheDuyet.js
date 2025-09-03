/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import OneField from '../../../../components/OneFieldKeyValuePheDuyet';
import TVSButton from '../../../../components/Tvs/Button';
import sysFetch from '../../../../services/fetch_v1';
import RequestSendNotificationV1 from '../../../../services/notification/send_v1';
import ModalApproveStatus from '../ModalTinhTrangPheDuyet';
import ShowError from '../../../../services/errors';
import {APP_VERSION} from '../../../../config/Pro';
const KhongPheDuyet = ({
  data,
  onReload,
  approveInfo,
  approveStatusPopup,
  pro,
  flagReload,
  send_mail_yn,
}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const {isLoading} = useSelector(state => state.GlobalLoadingReducer);
  const {width, height} = Dimensions.get('screen');
  const [cntStatus1, setCntStatus1] = useState('0');
  let [arrayParam, setArrayParam] = useState([]);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  let cntS = 0;
  let cntF = 0;
  useEffect(() => {
    setCntStatus1('0');
    flagReload = 0;
  }, [flagReload]);
  const onSave = () => {
    if (arrayParam.length == 0) {
      return;
    }
    Alert.alert(
      'Thông báo',
      'Bạn có muốn xác nhận?',
      [
        {text: 'Có', onPress: () => onUpdateData()},
        {
          text: 'Không',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  const onUpdateData = () => {
    if (arrayParam.length > 0) {
      let p1_varchar2 = '';
      let p2_varchar2 = '';
      let p3_varchar2 = '';
      let p4_varchar2 = '';
      let p5_varchar2 = '';
      let p6_varchar2 = '';

      arrayParam.forEach(function (item) {
        p1_varchar2 = item.p1_varchar2;
        p2_varchar2 += item.p2_varchar2 + '|';
        p3_varchar2 += item.p3_varchar2 + '|';
        p4_varchar2 += item.p4_varchar2 + '|';
        p5_varchar2 = item.p5_varchar2;
        p6_varchar2 = item.p6_varchar2;
      });
      sysFetch(
        API,
        {
          pro,
          in_par: {
            p1_varchar2: p1_varchar2,
            p2_varchar2: p2_varchar2,
            p3_varchar2: p3_varchar2,
            p4_varchar2: p4_varchar2,
            p5_varchar2: p5_varchar2,
            p6_varchar2: p6_varchar2,
            p7_varchar2: arrayParam.length,
            p8_varchar2: APP_VERSION,
            p9_varchar2: crt_by,
          },
          out_par: {
            p1_varchar2: 'cpd_send',
            p2_sys: 'noti',
            p3_sys: 'send_mail',
          },
        },
        tokenLogin,
      ).then(rs => {
        console.log(rs);
        if (rs == 'Token Expired') {
          refreshNewToken('onUpdateData');
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            if (send_mail_yn === 'Y') {
              let arrSendMail = rs.data.send_mail;
              if (arrSendMail.length > 0) {
                arrSendMail.forEach(function (item) {
                  let mParam = {
                    FromP: item.fromp,
                    FromM: item.fromm,
                    FromPass: item.frompass,
                    ToM: item.email,
                    ToP: item.full_name,
                    Subject: item.subject,
                    BodyContent: item.slip,
                    SmtpServer: item.smtpserver,
                    SmtpPort: item.smtpport,
                  };
                  return axios
                    .post(API + 'SendMail/Basic/', mParam)
                    .then(response => {
                      return response.data;
                    })
                    .catch(error => {
                      console.log(error);
                      ShowError(error.toString());
                    });
                });
              }
            }
            console.log(rs.data.noti);
            Alert.alert(
              'Thông báo',
              'Xác nhận phê duyệt thành công',
              [
                {
                  text: 'Đóng',
                  onPress: () => {
                    setCntStatus1(0);
                    setArrayParam([]);
                    onReload();
                    RequestSendNotificationV1(rs.data.noti, API, tokenLogin);
                  },
                },
              ],
              {cancelable: true},
            );
          }
        }
      });
      //waiting();
    } else {
      console.log('No data');
    }
  };
  const processParam = param => {
    if (param.p3_varchar2 == '0') {
      let newArr = [...arrayParam];
      setArrayParam(newArr.filter(x => x.p2_varchar2 != param.p2_varchar2));
    } else {
      let newArr = [...arrayParam];
      if (newArr.filter(x => x.p2_varchar2 == param.p2_varchar2).length > 0) {
        setArrayParam(newArr.filter(x => x.p2_varchar2 != param.p2_varchar2));
        newArr = newArr.filter(x => x.p2_varchar2 != param.p2_varchar2);
        newArr.unshift(param);
        setArrayParam(newArr);
      } else {
        newArr.unshift(param);
        setArrayParam(newArr);
      }
    }
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
        if (obj == 'onUpdateData') {
          onUpdateData();
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
    <View
      style={{
        flex: 1,
        marginTop: 10,
      }}>
      {!isLoading && (
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshing={false}
          onRefresh={() => {
            onReload();
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                margin: 10,
                marginTop: 20,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Không có dữ liệu !</Text>
            </View>
          )}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <OneItem
              item={item}
              approveInfo={approveInfo}
              key={item['0_pk'].toString()}
              onReload={onReload}
              approveStatusPopup={approveStatusPopup}
              pro={pro}
              send_mail_yn={send_mail_yn}
              countStatus1={cntStatus1}
              setCountStatus1={item => setCntStatus1(item)}
              processParam={item => processParam(item)}
            />
          )}
        />
      )}
      {arrayParam.length > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            height: height / 12,
            paddingTop: 10,
            alignItems: 'flex-start',
          }}>
          <View style={{flex: 4, marginLeft: 20}}>
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={{color: '#FFA800'}}>Chọn chờ duyệt: </Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={{color: '#FFA800'}}>{cntStatus1}</Text>
            </View>
          </View>
          <View style={{flex: 6}}>
            <View>
              <TVSButton onPress={onSave} icon={'content-save'}>
                Xác nhận
              </TVSButton>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const OneItem = ({
  item,
  approveInfo,
  onReload,
  approveStatusPopup,
  pro = {pro},
  send_mail_yn,
  countStatus1,
  setCountStatus1,
  processParam,
}) => {
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const [approveStatusOneItem, setApproveStatusOneItem] = useState('0');
  //token query data
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const employee_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  const crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  const [arrApprove, setApprove] = useState([]);

  const Color = useSelector(s => s.SystemReducer.theme);
  const [description, setDescription] = useState(item['0_description']);

  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const onChangeStatus = (approveStatus, oldStatus, noNextApprove) => {
    console.log('approveStatusOneItem ', approveStatusOneItem == '0');
    switch (approveStatus) {
      case '0':
        if (oldStatus == '1') {
          setCountStatus1(parseInt(countStatus1) - 1);
        }
        break;
      case '1':
        if (approveStatusOneItem == '0') {
          setCountStatus1(parseInt(countStatus1) + 1);
        }
        break;
      default:
        console.log('out case');
    }
    setApproveStatusOneItem(approveStatus);
    processParam({
      p1_varchar2: 'UPDATE',
      p2_varchar2: item['0_pk'],
      p3_varchar2: approveStatus,
      p4_varchar2: description ? description : '',
      p5_varchar2: item['0_role_type'],
      p6_varchar2: employee_pk,
    });
  };

  return (
    <>
      <ModalApproveStatus
        item={item}
        isShow={showApprovePopup}
        close={() => setShowApprovePopup(false)}
        approveStatus={approveStatusPopup}
      />
      <Block flex marginLeft={10} marginRight={10} marginBottom={10}>
        <Block row justifyContent={'space-between'} alignCenter>
          {item['3_label'] && (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={Color.white}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}>
              <Text style={{color: Color.mainColor}}>{item['3_label']}</Text>
            </Block>
          )}
          {approveStatusOneItem == '0' ? null : (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              // borderColor={Color.primaryText}
              // borderWidth={1}
              backgroundColor={Color.primaryButton2}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}>
              <Text style={{color: Color.secondaryText}}>Chọn chờ duyệt</Text>
            </Block>
          )}
        </Block>
        <Block
          backgroundColor={Color.white}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          borderBottomRightRadius={6}
          borderBottomLeftRadius={6}
          paddingBottom={5}>
          <View style={{flexDirection: 'row', padding: 5}}>
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Text>Trạng thái phê duyệt</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowApprovePopup(true);
                }}
                style={{
                  borderRadius: 5,
                  borderColor: Color.mainColor,
                  borderWidth: 1,
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Color.mainColor,
                  }}>
                  {item['0_approve_info']}{' '}
                  <Icon name={'eye-outline'} size={16} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {Object.entries(item).map(of => {
            if (of[0] === '3_label') {
              return null;
            }
            if (of[0].substr(0, 1) === '2' || of[0].substr(0, 1) === '3') {
              const currentKey =
                of[0].substr(2, 1).toUpperCase() +
                of[0].substr(3, of[0].length);
              return <OneField value={of[1]} keyName={currentKey} />;
            }
            return null;
          })}

          {item['0_active_yn'] === 'N' ? null : (
            <View style={{padding: 5, marginTop: 10}}>
              <Text
                style={{
                  color: Color.mainColor,
                  fontWeight: 'bold',
                }}>
                Phản hồi phê duyệt
              </Text>
              <TextInput
                multiline={true}
                value={description}
                onChangeText={e => {
                  setDescription(e.toString());
                }}
                style={{
                  backgroundColor: Color.inputBackgroundColor,
                  paddingBottom: 10,
                  paddingHorizontal: 10,
                  paddingTop: 12,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
              />
            </View>
          )}

          {item['0_note'] ? (
            <View
              style={{
                padding: 10,
              }}>
              <Text style={{color: 'red', fontSize: 12}}>
                <Icon name={'alert'} /> {item['0_note']}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            {approveStatusOneItem == '1' ? (
              <TVSButton
                disabled={item['0_active_yn'] === 'N'}
                type={'danger'}
                icon={'sync'}
                buttonStyle={'2'}
                onPress={() => onChangeStatus('0', '1', false)}
                paddingHorizontal={15}>
                Huỷ bỏ
              </TVSButton>
            ) : (
              <TVSButton
                disabled={item['0_active_yn'] === 'N'}
                type={'secondary'}
                icon={'backup-restore'}
                buttonStyle={'2'}
                onPress={() => onChangeStatus('1', null, false)}
                paddingHorizontal={15}>
                Chọn chờ duyệt
              </TVSButton>
            )}
          </View>
        </Block>
      </Block>
    </>
  );
};

export default KhongPheDuyet;
