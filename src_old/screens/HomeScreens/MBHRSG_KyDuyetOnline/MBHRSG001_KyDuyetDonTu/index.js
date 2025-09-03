import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import Block from '../../../../components/Block'
import TVSHeader from '../../../../components/Tvs/Header'
import TVSTab from '../../../../components/Tvs/Tab'
import { setHeaderChil2 } from '../../../../Language'
import ChoKy from './ChoKy'
import DaKy from './DaKy'
import HuyKy from './HuyKy'

const KyDuyetDonTu = ({ navigation: { goBack } }) => {
  // URL API
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  // Theme Color
  const Color = useSelector(s => s.SystemReducer.theme);
  // Reducers info login
  const loginReducers = useSelector(state => state.loginReducers);
  // Reducers menu
  const menuReducer = useSelector(state => state.menuReducer);
  let thr_emp_pk = '';
  let thr_det_pk = '';
  let token = '';
  let fullname = '';
  let crt_by = '';

  try {
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    thr_det_pk = loginReducers.data.data.thr_det_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
    token = loginReducers.data.data.tokenLogin;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }
  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          'MBHRSG001',
          menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRSG001')[0].p_pk,
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <TVSTab
          fullTab
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: 'Chờ ký',
              count: null,
              screen: <ChoKy />
            },
            {
              id: 1,
              name: 'Đã ký',
              count: null,
              screen: <DaKy />
            },
            {
              id: 2,
              name: 'Hủy ký',
              count: null,
              screen: <HuyKy />
            },
          ]}
        />
      </Block>
    </Block>
  );
};

export default KyDuyetDonTu