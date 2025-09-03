/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchXntcAction, fetchXntcSuccessAction} from '../../../../actions';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Calender from '../../../../components/Calendes';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup2';
import TVSButton from '../../../../components/Tvs/Button';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import {deviceId} from '../../../../constants/index';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import ShowError from '../../../../services/errors';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch_v1';
import {APP_VERSION} from '../../../../config/Pro';
import CXN from './ChoXacNhan';
import DXN from './DaXacNhan';
const {width} = Dimensions.get('screen');

const DangKyBoSungCong = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const menuReducer = useSelector(state => state.menuReducer);
  const loginReducers = useSelector(state => state.loginReducers);
  const xntcReducer = useSelector(state => state.xntcReducer);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  let thr_emp_pks = '';
  let tokenLogin = '';
  let fullnames = '';
  let org_pks = '';
  let dataXntc = [];
  let userPk;
  let refreshToken;
  let crt_by = loginReducers.data.data.crt_by;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    org_pks = loginReducers.data.data.org_pk;
    dataXntc = xntcReducer.data.data.xntc;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }

  const [startDay, setStartDay] = useState(
    moment(new Date()).format('YYYY-MM') + '-01',
  );
  const [endDay, setEndtDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [daySelect, setDateSelect] = useState(
    '01' +
      moment(new Date()).format('/MM/YYYY') +
      ' - ' +
      moment(new Date()).format('DD/MM/YYYY'),
  );

  const getStateCalendar = async result => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndtDay(result.endingDays);
    setDateSelect(result.daySelecteds);
    // sendDate(result.startingDays + '-' + result.endingDays);

    // await getData(result.startingDays, result.endingDays);
  };
  const [countCXN, setCountCXN] = useState(0);
  const [countDXN, setCountDXN] = useState(0);
  const modal = (
    <TVSControlPopup
      isShow={isModalVisible}
      maxHeight={500}
      title={'Chọn ngày'}
      onHide={() => setModalVisible(false)}
      bottom={
        <TVSButton
          type={'danger'}
          buttonStyle={'3'}
          icon={'close'}
          onPress={() => setModalVisible(false)}>
          Đóng lại
        </TVSButton>
      }>
      <Calender
        getState={getStateCalendar}
        startDayss={startDay}
        endDayss={endDay}
      />
    </TVSControlPopup>
  );
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        getData(startDay, endDay);
      } else {
        ShowError('No internet');
      }
    });
  }, [startDay, endDay]);

  const [data, setData] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [dataApprove, setDataApprove] = useState([]);
  const [dataApproveDefault, setDataApproveDefault] = useState([]);
  const [dataReason, setDataReason] = useState([]);

  let limit_reg_dt;
  let note;
  const getData = async (fromdate, todate) => {
    console.log(crt_by);
    console.log(thr_emp_pks);
    sysFetch(
      API,
      {
        pro: 'SELHRRG004000',
        in_par: {
          p1_varchar2: thr_emp_pks,
          p2_varchar2: moment(fromdate).format('YYYYMMDD'),
          p3_varchar2: moment(todate).format('YYYYMMDD'),
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'lst_data',
          p2_sys: 'lst_status',
          p3_sys: 'lst_approve',
          p4_sys: 'lst_approve_default',
          p5_sys: 'lst_reason',
          p6_varchar2: 'limit_reg_date',
          p7_varchar2: 'note',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log('rs select ', rs);
        if (rs == 'Token Expired') {
          //   refreshNewToken('getData', fromdate, todate);
        }
        if (rs != 'Token Expired') {
          //Approve
          setDataApprove(rs.data.lst_approve);
          setDataApproveDefault(rs.data.lst_approve_default);
          //Approve Status
          console.log('rs.data.lst_status ', rs.data.lst_status);
          setDataStatus(rs.data.lst_status);
          limit_reg_dt = rs.data.limit_reg_date;
          note = rs.data.note;
          let cntCXN = 0;
          let cntDXN = 0;
          setData(rs.data.lst_data);
          rs.data.lst_data.map(element => {
            if (element['0_pk'] !== '') {
              cntDXN++;
            } else {
              cntCXN++;
            }
          });
          setCountCXN(cntCXN);
          setCountDXN(cntDXN);

          setDataReason(rs.data.lst_reason);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Color.backgroundColor}}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          'MBHRRG004',
          menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRRG004')[0]
            .p_pk,
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <Block
          margin={10}
          radius={8}
          backgroundColor={Color.white}
          padding={10}>
          <Button
            nextScreen={() => toggleModal()}
            row
            paddingLeft={20}
            alignCenter
            justifyContent={'space-between'}>
            <Icon_calendar color={Color.mainColor} />
            <Text
              paddingRight={10}
              center
              color={Color.mainColor}
              flex
              size={14}
              paddingLeft={10}>
              Ngày {daySelect}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        <TVSTab
          fullTab={true}
          scrollEnabled={false}
          data={[
            {
              id: 0,
              bottomColor: '#FFA800',
              name: 'Chờ xác nhận',
              count: countCXN.toString(),
              screen: (
                <CXN
                  data={data.filter(x => x['0_pk'] === '')}
                  dataApprove={dataApprove}
                  dataApproveDefault={dataApproveDefault}
                  dataReason={dataReason}
                  limitRegDt={limit_reg_dt}
                  note={note}
                  onReload={() => getData(startDay, endDay)}
                />
              ),
            },
            {
              id: 1,
              bottomColor: '#009E00',
              name: 'Đã xác nhận',
              count: countDXN.toString(),
              screen: (
                <DXN
                  data={data.filter(x => x['0_pk'] !== '')}
                  dataApprove={dataApprove}
                  dataApproveDefault={dataApproveDefault}
                  dataReason={dataReason}
                  limitRegDt={limit_reg_dt}
                  note={note}
                  dataStatus={dataStatus}
                  onReload={() => getData(startDay, endDay)}
                />
              ),
            },
          ]}
        />
      </Block>
      {modal}
    </View>
  );
};

export default DangKyBoSungCong;
