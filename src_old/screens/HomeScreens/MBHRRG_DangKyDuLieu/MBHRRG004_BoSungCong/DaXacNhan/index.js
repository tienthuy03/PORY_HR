import React, {useEffect, useState} from 'react';
import {Alert, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import Load from '../../../../../components/Loading';
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

const DaXacNhan = ({
  data,
  dataApprove,
  dataApproveDefault,
  limitRegDt,
  note,
  dataStatus,
  onReload,
}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const xntcReducer = useSelector(state => state.xntcReducer);
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const loginReducers = useSelector(state => state.loginReducers);
  const [approveStatusItem, setApproveStatusItem] = useState();
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  const DanhSachBoSungCong = useSelector(state =>
    state.HRRE008_BoSungCongReducer.DanhSachBoSungCong.filter(
      x => x['0_pk'] !== '',
    ),
  );
  const DanhSachPheDuyet = useSelector(
    state => state.HRRE008_BoSungCongReducer.DanhSachPheDuyet,
  );
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  let approve_data = [];
  let thr_emp_pks;
  let fullnames;
  let [lengthDataProps, setLengthDataProps] = useState(0);
  let [numberRecord, setNumberRecord] = useState(3);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);

  try {
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    approve_data = xntcReducer.data.data.approve_data;
  } catch (error) {
    //
  }
  const [load, setLoad] = useState(false);

  const handleLoadMore = lengthData => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };

  const onSelectedAS = value => {
    setIsShowModalAS(true);
    setApproveStatusItem(value);
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
        if (obj == 'updateExperience') {
          updateExperience(p1);
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
  const updateExperience = pk => {
    console.log({
      p1_varchar2: 'DELETE',
      p2_varchar2: pk.toString(),
      p3_varchar2: thr_emp_pks,
      p4_varchar2: '',
      p5_varchar2: '',
      p6_varchar2: '',
      p7_varchar2: '',
      p8_varchar2: '',
      p9_varchar2: '',
      p10_varchar2: '',
      p11_varchar2: '',
      p12_varchar2: '',
      p13_varchar2: '',
      p14_varchar2: APP_VERSION,
      p15_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: 'UPDHRRG004000',
        in_par: {
          p1_varchar2: 'DELETE',
          p2_varchar2: pk.toString(),
          p3_varchar2: thr_emp_pks,
          p4_varchar2: '',
          p5_varchar2: '',
          p6_varchar2: '',
          p7_varchar2: '',
          p8_varchar2: '',
          p9_varchar2: '',
          p10_varchar2: '',
          p11_varchar2: '',
          p12_varchar2: '',
          p13_varchar2: '',
          p14_varchar2: APP_VERSION,
          p15_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: 'upd_dxn_exits',
          p2_sys: 'noti',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log(rs);
        if (rs == 'Token Expired') {
          refreshNewToken('updateExperience', pk);
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

  const comfirmAlert = pk => {
    Alert.alert(
      'Thông báo',
      'Bạn có xóa bổ sung công không?',
      [
        {
          text: 'Đóng',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            updateExperience(pk);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item, index}) => {
    console.log(item);
    return (
      <Block shadow flex marginLeft={10} marginRight={10} marginBottom={10}>
        <ModalApproveStatus
          isShow={isShowModalAS}
          item={approveStatusItem}
          close={() => setIsShowModalAS(false)}
          approve_data={dataStatus}
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
          {Object.entries(item).map((oitem, index) => {
            if (
              oitem[0].substr(0, 1) === '3' ||
              oitem[0].substr(0, 1) === '2'
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
          <Block flex alignCenter>
            <TVSButton
              buttonStyle={'3'}
              disabled={item['active_button'] === 'N'}
              onPress={() => comfirmAlert(item['0_pk'])}
              icon={'delete-forever'}
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
      <Block flex>
        <Block flex>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={onReload}
            refreshing={false}
            data={data}
            renderItem={renderItem}
            onEndReached={() => handleLoadMore(lengthDataProps)}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => (
              <Block flex alignCenter justifyCenter marginTop={20}>
                <Text>Không có dữ liệu !</Text>
              </Block>
            )}
          />
        </Block>
        <Load visible={load} />
      </Block>
    </Block>
  );
};

export default DaXacNhan;
