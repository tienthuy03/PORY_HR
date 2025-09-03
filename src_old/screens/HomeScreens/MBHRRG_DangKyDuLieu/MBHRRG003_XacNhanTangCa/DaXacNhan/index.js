import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import OneField from '../../../../../components/OneFieldKeyValue';
import Text from '../../../../../components/Text';
import TVSButton from '../../../../../components/Tvs/Button';
import RequestSendNotification from '../../../../../services/notification/send';
import ModalApproveStatus from './ModalTinhTrangPheDuyet';
import ApproveStatus from './TrangThaiPheDuyet';
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch_v1';
import {APP_VERSION} from '../../../../../config/Pro';

const DaXacNhan = ({data, onReload}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const xntcReducer = useSelector(state => state.xntcReducer);
  const npdReducer = useSelector(state => state.npdReducer);
  const loginReducers = useSelector(state => state.loginReducers);
  const [approveStatusItem, setApproveStatusItem] = useState();
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  let dataXntc = [];
  let approve_data = [];
  let tokenLogin;
  let isLoading;
  let thr_emp_pks;
  let fullnames;
  let userPk;
  let refreshToken;
  let crt_by;

  try {
    isLoading = xntcReducer.isLoading;
    dataXntc = xntcReducer.data.data.xntc;
    approve_data = xntcReducer.data.data.approve_data;
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    console.log('error MBHRRE007 Xác nhận tăng ca -> Đã xác nhận');
    console.log(error);
  }
  const [dataDaXN, setDataDaXN] = useState([]);

  const onSelectedAS = value => {
    setIsShowModalAS(true);
    setApproveStatusItem(value);
  };
  const refreshNewToken = (obj, p1, p2) => {
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
          refreshNewToken('updateExperience', p1, p2);
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

  const updateExperience = (pk_req_over, work_dt) => {
    sysFetch(
      API,
      {
        // pro: 'UPDHRRE0070101',
        pro: 'UPDHRRE007000',
        in_par: {
          p1_varchar2: 'DELETE',
          p2_varchar2: pk_req_over,
          p3_varchar2: '',
          p4_varchar2: '',
          p5_varchar2: '',
          p6_varchar2: '',
          p7_varchar2: '',
          p8_varchar2: '',
          p9_varchar2: '',
          p10_varchar2: '',
          p11_varchar2: work_dt,
          p12_varchar2: thr_emp_pks,
          p13_varchar2: '',
          p14_varchar2: '',
          p15_varchar2: APP_VERSION,
          p16_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: 'upd_dxn_exits',
          p1_sys: 'noti',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log(rs);
        if (rs == 'Token Expired') {
          refreshNewToken('updateExperience', pk_req_over, work_dt);
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            try {
              RequestSendNotification(rs.data.noti, API, tokenLogin);
            } catch (error) {}
            Alert.alert(
              'Thông báo',
              'Xoá dữ liệu thành công.',
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
          } else if (rs.results === 'F') {
            var newText = rs.errorData.split(':');
            let errors = newText[1].trim().split('\n')[0];
            dialogNoti(errors);
          } else {
            dialogNoti('Huỷ thất bại!');
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const dialogNoti = text => {
    Alert.alert(
      'Thông báo',
      text,
      [
        {
          text: 'Thoát',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const comfirmAlert = (pk_req_over, work_dt) => {
    Alert.alert(
      'Thông báo',
      'Bạn có muốn xoá dữ liệu không?',
      [
        {
          text: 'Đóng',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            updateExperience(pk_req_over, work_dt);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <Block
        key={index + 'key007dxn'}
        shadow
        flex
        marginLeft={10}
        marginRight={10}
        marginBottom={10}>
        <ModalApproveStatus
          isShow={isShowModalAS}
          item={approveStatusItem}
          close={() => setIsShowModalAS(false)}
          approve_data={approve_data}
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
          borderWidth={1}
          paddingBottom={5}>
          <ApproveStatus value={item} onSelectedAS={onSelectedAS} />
          {Object.entries(item).map(x => {
            return (
              (x[0].substr(0, 1).toString() === '2' ||
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

          <Block flex alignCenter>
            <TVSButton
              onPress={() => comfirmAlert(item['0_pk'], item['0_work_dt'])}
              icon={'delete-forever'}
              disabled={item['active_button'] === 'N'}
              type={'danger'}>
              Xoá bỏ
            </TVSButton>
          </Block>
        </Block>
      </Block>
    );
  };
  return (
    <Block flex paddingTop={10} backgroundColor={Color.gray}>
      {isLoading ? (
        <ActivityIndicator size="large" color="grey" />
      ) : (
        <Block flex>
          <Block flex>
            <FlatList
              showsVerticalScrollIndicator={false}
              onRefresh={onReload}
              refreshing={false}
              data={data}
              renderItem={renderItem}
              extraData={data}
              keyExtractor={(item, index) => index + '' + Math.random()}
              ListEmptyComponent={() => (
                <Block flex alignCenter justifyCenter marginTop={20}>
                  <Text>Không có dữ liệu !</Text>
                </Block>
              )}
            />
          </Block>
        </Block>
      )}
    </Block>
  );
};
export default DaXacNhan;
