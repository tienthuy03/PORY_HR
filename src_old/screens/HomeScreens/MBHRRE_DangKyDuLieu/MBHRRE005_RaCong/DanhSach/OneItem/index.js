import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../../components/Block';
import Text from '../../../../../../components/Text';
import OneField from '../../../../../../components/OneFieldKeyValue';
import TVSButton from '../../../../../../components/Tvs/Button';
import ShowError from '../../../../../../services/errors';
import GeneralErrorFromDB from '../../../../../../services/errors/generalErrorFormDB';
import RequestSendNotification from '../../../../../../services/notification/send';
import {HRRE005LoadDataRaCong} from '../../../../../../services/redux/HRRE005_RaCong/action';
import ModalApproveStatus from '../ModalTinhTrangPheDuyet';
import ApproveStatus from '../TrangThaiPheDuyet';
import axios from 'axios';
import {updateUserAction} from '../../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../../services/fetch';

const OneItemHistory = ({item}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const fullnames = useSelector(
    state => state.loginReducers.data.data.full_name,
  );
  const approve_data = useSelector(
    state => state.HRRE005_RaCongReducer.TinhTrangPheDuyet,
  );
  const oneItem = item.item;
  const [approveStatusItem, setApproveStatusItem] = useState();
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  //callback function Approve Status
  const onSelectedAS = value => {
    setIsShowModalAS(true);
    setApproveStatusItem(value);
  };
  const comfirmAlert = () => {
    //${oneItem.work_dt_label}
    Alert.alert(
      'Thông báo',
      'Bạn có muốn xoá dữ liệu đăng ký ra cổng không?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Xác nhận', onPress: async () => UpdateData()},
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
        if (obj == 'UpdateData') {
          UpdateData();
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
  const UpdateData = () => {
    sysFetch(
      API,
      {
        pro: 'UPDHRRE0050101',
        in_par: {
          p1_varchar2: 'DELETE',
          p2_varchar2: oneItem.pk,
          p3_varchar2: thr_emp_pk,
          p4_varchar2: '',
          p5_varchar2: '',
          p6_varchar2: '',
          p7_varchar2: '',
          p8_varchar2: '',
          p9_varchar2: '',
          p10_varchar2: '',
          p11_varchar2: '',
          p12_varchar2: '',
          p13_varchar2: fullnames,
          p14_varchar2: '',
          p15_varchar2: '',
        },
        out_par: {
          p1_varchar2: 'data',
          p2_sys: 'noti',
          p3_sys: 'new_approve_list',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('UpdateData');
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            dispatch(HRRE005LoadDataRaCong());
            dialogNoti('Xoá dữ liệu thành công.');
            try {
              RequestSendNotification(rs.data.noti, API, tokenLogin);
            } catch (error) {}
          } else if (rs.results === 'F') {
            dialogNoti(GeneralErrorFromDB(rs.errorData));
          } else {
            ShowError('fail');
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
          text: 'Đóng',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <Block flex marginLeft={10} marginRight={10} marginBottom={10}>
      <ModalApproveStatus
        isShow={isShowModalAS}
        item={approveStatusItem}
        close={() => setIsShowModalAS(false)}
        approve_data={approve_data}
      />
      {oneItem.work_dt_label ? (
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
              {oneItem.work_dt_label}
            </Text>
          </Block>
          {/* <Text color={Color.white} size={13} /> */}
        </Block>
      ) : null}
      <Block
        backgroundColor={Color.white}
        borderBottomLeftRadius={6}
        borderBottomRightRadius={6}
        borderColor={Color.oneContentBorder}
        borderWidth={1}
        paddingBottom={5}>
        <ApproveStatus value={oneItem} onSelectedAS={onSelectedAS} />
        {Object.entries(oneItem).map((item, index) => {
          if (item[0].substr(0, 1) === '_') {
            return (
              <OneField
                keyName={item[0].charAt(1).toUpperCase() + item[0].slice(2)}
                value={item[1]}
                key={index}
              />
            );
          }
        })}
        <Block flex alignCenter>
          <TVSButton
            icon={'delete-forever'}
            disabled={oneItem['active_button'] === 'N'}
            type={'danger'}
            onPress={comfirmAlert}>
            Xoá bỏ
          </TVSButton>
        </Block>
      </Block>
    </Block>
  );
};
export default OneItemHistory;
