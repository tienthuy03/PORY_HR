import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import {setHeaderChil2} from '../../../../Language';
import DKV from './DangKy';
import LS from './DanhSach';

const DangKyVangV2 = ({navigation: {goBack}}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector(state => state.loginReducers);
  const menuReducer = useSelector(state => state.menuReducer);
  let thr_emp_pks = '';
  let tokenss = '';
  let fullnames = '';
  try {
    tokenss = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
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

  const onCallbackReload = () => {
    // sysFetch(
    //   API,
    //   {
    //     pro: 'SELHRRE0100101',
    //     in_par: {
    //       p1_varchar2: thr_emp_pks,
    //       p2_varchar2: startDate.split('-')[0] +
    //       startDate.split('-')[1] +
    //       startDate.split('-')[2],
    //       p3_varchar2: endDate.split('-')[0] + endDate.split('-')[1] + endDate.split('-')[2],
    //     },
    //     out_par: {
    //       p1_sys: 'ls_dkvV2',
    //       p2_sys: 'approve_status',
    //       p3_sys: 'ds_lydo',
    //       p4_sys: 'ds_nguoipheduyet',
    //       p5_varchar2: 'limit_reg_dt',
    //       p6_varchar2: 'note',
    //       p7_varchar2: 'hide_time',
    //       p8_varchar2: 'send_mail',
    //     },
    //   },
    //   tokenLogin,
    // )
    //   .then(rs => {
    //     if (rs == 'Token Expired') {
    //       refreshNewToken('getData', fromday, enday);
    //     }
    //     if (rs != 'Token Expired') {
    //       if (rs.results == 'S') {
    //         dataDkv = rs.data.data.ls_dkvV2;
    //         approve_data = rs.data.data.approve_status;
    //         send_mail = rs.data.data.send_mail;
    //         setData(rs.data.data.ls_dkvV2);
    //         setLengthDataProps(rs.data.data.ls_dkvV2.length);
    //       }
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // dispatch(
    //   fetchDkvV2Action({
    //     token: tokenss,
    //     machine_id: deviceId,
    //     user_pk: thr_emp_pks,
    //     p_fromdate:
    //       startDate.split('-')[0] +
    //       startDate.split('-')[1] +
    //       startDate.split('-')[2],
    //     p_todate:
    //       endDate.split('-')[0] + endDate.split('-')[1] + endDate.split('-')[2],
    //     full_name: fullnames,
    //   }),
    // );
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          'MBHRRG001',
          menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRRG001')[0]
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
              name: 'Danh sách',
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

export default DangKyVangV2;
