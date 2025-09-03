import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';
import {Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchDkvAction} from '../../../../actions';
import {DELETE_DKV} from '../../../../actions/actionType';
import Block from '../../../../components/Block';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import {deviceId} from '../../../../constants/index';
import {setHeaderChil2} from '../../../../Language';
import DKV from './DangKy';
import LS from './DanhSach';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const Tab = createMaterialTopTabNavigator();

const DangKyVang = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const loginReducers = useSelector(state => state.loginReducers);
  const menuReducer = useSelector(state => state.menuReducer);
  let thr_emp_pks = '';
  let tokenLogin = '';
  let fullname = '';
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }
  const [startDate, setStartDate] = useState(
    moment(new Date()).format('YYYY-MM-01'),
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf('month').format('YYYY-MM-DD'),
  );

  const onCallbackSetDate = (sDate, eDate) => {
    setStartDate(sDate);
    setEndDate(eDate);
  };

  useEffect(() => {
    onCallbackReload();
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
  const onCallbackReload = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRRE0010101',
        in_par: {
          p1_varchar2: thr_emp_pks,
          p2_varchar2:
            startDate.split('-')[0] +
            startDate.split('-')[1] +
            startDate.split('-')[2],
          p3_varchar2:
            endDate.split('-')[0] +
            endDate.split('-')[1] +
            endDate.split('-')[2],
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
          refreshNewToken('onCallbackReload');
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
          }
        }
      })
      .catch(error => {
        console.log(error);
      });

    // dispatch(
    //   fetchDkvAction({
    //     token: tokenLogin,
    //     machine_id: deviceId,
    //     user_pk: thr_emp_pks,
    //     p_fromdate:
    //       startDate.split('-')[0] +
    //       startDate.split('-')[1] +
    //       startDate.split('-')[2],
    //     p_todate:
    //       endDate.split('-')[0] + endDate.split('-')[1] + endDate.split('-')[2],
    //     full_name: fullname,
    //   }),
    // );
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          'MBHRRE001',
          menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRRE001')[0]
            .p_pk,
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <TVSTab
          fullTab
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: 'Đăng ký vắng',
              count: null,
              screen: <DKV onCallbackReload={onCallbackReload} />,
            },
            {
              id: 1,
              name: 'Đã đăng ký',
              count: null,
              screen: (
                <LS
                  onCallbackSetDate={onCallbackSetDate}
                  startDate={startDate}
                  endDate={endDate}
                />
              ),
            },
          ]}
        />
      </Block>
    </Block>
  );
};

export default DangKyVang;
