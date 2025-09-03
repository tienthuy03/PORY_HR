/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import Button from '../../../../../components/Button';
import Calender from '../../../../../components/Calendes';
import OneField from '../../../../../components/OneFieldKeyValue';
import Text from '../../../../../components/Text';
import TVSButton from '../../../../../components/Tvs/Button';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup';
import Icon_time from '../../../../../icons/Datev';
import ShowError from '../../../../../services/errors';
import RequestSendNotification from '../../../../../services/notification/send';
import ModalApproveStatus from './ModalTinhTrangPheDuyet';
import ApproveStatus from './TrangThaiPheDuyet';
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch';

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../../services/redux/GlobalLoading/action';

const LS = ({onCallbackSetDate, startDate, endDate}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const loginReducers = useSelector(state => state.loginReducers);
  let thr_emp_pk = '';
  let tokenLogin = '';
  let fullname = '';
  // let approve_data = [];
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {}

  // const [startDay, setStartDay] = useState(
  //   moment(new Date()).format('YYYY-MM-DD'),
  // );
  // const [endDay, setEndtDay] = useState(
  //   moment(new Date()).format('YYYY-MM-DD'),
  // );
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format('01/MM/YYYY') +
      ' - ' +
      moment(new Date()).endOf('month').format('DD/MM/YYYY'),
  );
  const [approve_data, setApprove_data] = useState([]);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // const [dates, setDates] = useState('');
  const [approveStatusItem, setApproveStatusItem] = useState();
  const [isShowModalAS, setIsShowModalAS] = useState(false);
  let [lengthDataProps, setLengthDataProps] = useState(0);
  let [numberRecord, setNumberRecord] = useState(3);

  const getStateCalendar = async result => {
    setModalVisible(false);
    onCallbackSetDate(result.startingDays, result.endingDays);
    setDateSelect(result.daySelecteds);
    // setDates(result.startingDays + ' - ' + result.endingDays);
    getData(result.startingDays, result.endingDays);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLoadMore = lengthData => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };
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

  const getData = (fromday, enday) => {
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: 'SELHRRE0010101',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: moment(fromday).format('YYYYMMDD'),
          p3_varchar2: moment(enday).format('YYYYMMDD'),
        },
        out_par: {
          p1_sys: 'ls_dkv',
          p2_sys: 'approve_status',
          p3_sys: 'ds_lydo',
          p4_sys: 'ds_nguoipheduyet',
          p5_varchar2: 'limit_reg_dt',
          p6_varchar2: 'note',
          p7_varchar2: 'hide_time',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData', fromday, enday);
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
            console.log(rs.data.approve_status);
            dataDkv = rs.data.ls_dkv;
            setApprove_data(rs.data.approve_status);
            setData(rs.data.ls_dkv);
            setLengthDataProps(rs.data.ls_dkv.length);
            dispatch(HideGlobalLoading);
          }
          if (rs.results == 'F') {
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch(error => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        getData(startDate, endDate);
      } else {
        ShowError('No internet');
      }
    });
  }, []);

  // useEffect(() => {
  //   setData(dataDkv);
  //   setLengthDataProps(dataDkv.length);
  // }, [loading]);

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

  const updateExperience = p_pk => {
    let P_PK_TABLE = p_pk;
    sysFetch(
      API,
      {
        pro: 'UPDHRRE0010101',
        in_par: {
          p1_varchar2: 'DELETE',
          p2_varchar2: P_PK_TABLE,
          p3_varchar2: thr_emp_pk,
          p4_varchar2: '',
          p5_varchar2: '',
          p6_varchar2: '',
          p7_varchar2: '',
          p8_varchar2: '',
          p9_varchar2: '',
          p10_varchar2: fullname,
          p11_varchar2: '',
          p12_varchar2: '',
        },
        out_par: {
          p1_varchar2: 'upd_dkv',
          p2_sys: 'noti',
          p3_sys: 'new_approve_list',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('updateExperience', p_pk);
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            let a = daySelect.split('-');
            let startDt = a[0].trim().split('/');
            let endDt = a[1].trim().split('/');
            let startDtCV = '';
            let endDtCV = '';
            startDtCV = startDt[2] + '' + startDt[1] + '' + startDt[0];
            endDtCV = endDt[2] + '' + endDt[1] + '' + endDt[0];

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
                    getData(
                      moment(startDtCV).format('YYYYMMDD'),
                      moment(endDtCV).format('YYYYMMDD'),
                    );
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
            dialogNoti('Cập nhật không thành công!');
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const onSelectedAS = value => {
    setIsShowModalAS(true);
    setApproveStatusItem(value);
  };
  const comfirmAlert = p_pk => {
    Alert.alert(
      'Thông báo',
      'Bạn có muốn xoá dữ liệu vắng không?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Xác nhận', onPress: async () => updateExperience(p_pk)},
      ],
      {cancelable: false},
    );
  };
  const modal = (
    <TVSControlPopup
      maxHeight={500}
      title={'Chọn ngày'}
      onHide={() => setModalVisible(false)}
      isShow={modalVisible}>
      <Calender
        getState={getStateCalendar}
        startDayss={startDate}
        endDayss={endDate}
      />
    </TVSControlPopup>
  );
  const Item_LS = ({item}) => {
    return (
      <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
        <ModalApproveStatus
          isShow={isShowModalAS}
          item={approveStatusItem}
          close={() => setIsShowModalAS(false)}
          approve_data={approve_data}
        />
        <Block row justifyContent={'space-between'}>
          {item.label && (
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
                {item.label}
              </Text>
            </Block>
          )}
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
          {Object.entries(item).map((oneField, index) => {
            return (
              oneField[0].substr(0, 1) === '_' && (
                <OneField
                  value={oneField[1]}
                  keyName={
                    oneField[0].replace('_', '').substr(0, 1).toUpperCase() +
                    oneField[0]
                      .replace('_', '')
                      .substr(1, oneField[0].replace('_', '').length)
                  }
                />
              )
            );
          })}

          <Block flex alignCenter>
            <TVSButton
              onPress={() => comfirmAlert(item.pk)}
              disabled={item['active_button'] === 'N'}
              type={'danger'}
              icon={'delete-forever'}>
              Xoá bỏ
            </TVSButton>
          </Block>
        </Block>
      </Block>
    );
  };
  const onRenderNoItem = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text>Không có dữ liệu !</Text>
      </Block>
    );
  };
  return (
    <Block paddingTop={10} backgroundColor={Color.gray} flex>
      <Block
        marginLeft={10}
        marginRight={10}
        radius={8}
        backgroundColor={Color.white}>
        <Button
          nextScreen={toggleModal}
          row
          alignCenter
          justifyContent={'space-between'}>
          <Icon_time style={{marginLeft: 20}} />
          <Text center color={Color.mainColor} flex size={14} padding={10}>
            Ngày {daySelect}
          </Text>
          <Text marginRight={10} />
        </Button>
      </Block>
      <Block flex>
        <Block marginTop={5} flex>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={() => getData(startDate, endDate)}
            refreshing={false}
            data={data.slice(0, numberRecord)}
            renderItem={Item_LS}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => handleLoadMore(lengthDataProps)}
            onEndReachedThreshold={0.5}
            extraData={data}
            ListEmptyComponent={onRenderNoItem}
          />
        </Block>
      </Block>
      {modal}
    </Block>
  );
};

export default LS;
