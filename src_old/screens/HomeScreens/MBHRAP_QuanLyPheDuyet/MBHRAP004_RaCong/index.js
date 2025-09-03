/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Calender from '../../../../components/Calendes';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import TVSTab from '../../../../components/Tvs/Tab';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import sysFetch from '../../../../services/fetch_v1';
import ChoPheDuyet from '../ApproveTab/ChoPheDuyet';
import DaPheDuyet from '../ApproveTab/DaPheDuyet';
import HetHan from '../ApproveTab/HetHan';
import KhongPheDuyet from '../ApproveTab/KhongPheDuyet';
import {useDispatch} from 'react-redux';
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../services/redux/GlobalLoading/action';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import {APP_VERSION} from '../../../../config/Pro';
const PheDuyetVang = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);

  const language = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const dataMenuMBHRs = useSelector(state => state.menuReducer.data.data.menu);
  const [isShowDate, setIsShowDate] = useState(false);
  const [countCPD, setCountCPD] = useState(0);
  const [countDPD, setCountDPD] = useState(0);
  const [countKPD, setCountKPD] = useState(0);
  const [countHH, setCountHH] = useState(0);
  const [flagReload, setflagReload] = useState(0);

  const [startDay, setStartDay] = useState(
    moment(new Date()).format('YYYY-MM-01'),
  );
  const [endDay, setEndDay] = useState(moment(new Date()).format('YYYY-MM-DD'));

  //current date 22/05/2021
  const [currentDateDisp, setCurrentDateDisp] = useState(
    moment().format('01/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY'),
  );

  //current date 20210522
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format('YYYYMM01') +
      '-' +
      moment(new Date()).format('YYYYMMDD'),
  );

  // handle date
  const getStateCalendar = async result => {
    setIsShowDate(false);
    setStartDay(result.startingDays);
    setEndDay(result.endingDays);
    setCurrentDateDisp(result.daySelecteds);
    setCurrentDate(result.startingDays + '-' + result.endingDays);
  };

  const [data, setData] = useState([]);
  const [approveInfo, setApproveInfo] = useState([]);
  const [approveStatus, setApproveStatus] = useState([]);

  //token query data
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const employee_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  //handle first load data
  useEffect(() => {
    fetchData();
  }, [currentDate]);
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
        if (obj == 'fetchData') {
          fetchData();
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
  const fetchData = () => {
    dispatch(ShowGlobalLoading);
    let flagReloads = flagReload;
    setflagReload(flagReloads++);
    sysFetch(
      API,
      {
        pro: 'SELHRAP004000',
        in_par: {
          p1_varchar2: employee_pk,
          p2_varchar2: currentDate.split('-')[0],
          p3_varchar2: currentDate.split('-')[1],
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'data',
          p2_sys: 'status',
          p3_sys: 'approve_info',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        setflagReload(flagReloads++);
        if (rs == 'Token Expired') {
          refreshNewToken('fetchData');
        }
        if (rs != 'Token Expired') {
          dispatch(HideGlobalLoading);
          if (rs.results === 'S') {
            setApproveStatus(rs.data.status);
            setData(rs.data.data);
            setApproveInfo(rs.data.approve_info);

            //initial count of tab
            let count1 = 0;
            let count2 = 0;
            let count3 = 0;
            let count4 = 0;

            rs.data.data.map(item => {
              switch (item['0_approve_status']) {
                case '0':
                  count4++;
                  break;
                case '1':
                  count1++;
                  break;
                case '2':
                  count2++;
                  break;
                case '3':
                  count3++;
                  break;
                default:
              }
            });

            setCountCPD(count1);
            setCountDPD(count2);
            setCountKPD(count3);
            setCountHH(count4);
          }
          if (rs.results === 'F') {
            Alert.alert('Thông báo', 'Lỗi: ' + rs.errorData, [{text: 'Đóng'}]);
          }
        }
        setflagReload(0);
      })
      .catch(error => {
        dispatch(HideGlobalLoading);
      });
  };
  const modalDate = (
    <TVSControlPopup
      maxHeight={500}
      isShow={isShowDate}
      onHide={() => setIsShowDate(false)}
      title={'Chọn ngày'}>
      <Calender
        getState={getStateCalendar}
        startDayss={startDay}
        endDayss={endDay}
      />
    </TVSControlPopup>
  );

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          'MBHRAP004',
          dataMenuMBHRs.filter(x => x.menu_cd === 'MBHRAP004')[0].p_pk,
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Block margin={10} radius={8} backgroundColor={Color.white}>
          <Button
            nextScreen={() => setIsShowDate(true)}
            row
            paddingLeft={20}
            alignCenter
            justifyContent={'space-between'}>
            <Icon_calendar color={Color.mainColor} />
            <Text
              paddingRight={20}
              center
              size={14}
              color={Color.mainColor}
              flex
              padding={10}>
              Ngày {currentDateDisp}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        <Block flex backgroundColor={Color.gray}>
          <TVSTab
            data={[
              {
                id: 0,
                name: 'Chờ duyệt',
                count: countCPD,
                screen: (
                  <ChoPheDuyet
                    data={data.filter(x => x['0_approve_status'] === '1')}
                    onReload={() => fetchData()}
                    approveInfo={approveInfo}
                    approveStatusPopup={approveStatus}
                    pro={'UPDHRAP004000'}
                    flagReload={flagReload}
                  />
                ),
              },
              {
                id: 1,
                name: 'Đã duyệt',
                count: countDPD,
                screen: (
                  <DaPheDuyet
                    data={data.filter(x => x['0_approve_status'] === '2')}
                    onReload={() => fetchData()}
                    approveInfo={approveInfo}
                    approveStatusPopup={approveStatus}
                    pro={'UPDHRAP004000'}
                    flagReload={flagReload}
                  />
                ),
              },
              {
                id: 2,
                name: 'Không duyệt',
                count: countKPD,
                screen: (
                  <KhongPheDuyet
                    data={data.filter(x => x['0_approve_status'] === '3')}
                    onReload={() => fetchData()}
                    approveInfo={approveInfo}
                    approveStatusPopup={approveStatus}
                    pro={'UPDHRAP004000'}
                    flagReload={flagReload}
                  />
                ),
              },
              {
                id: 3,
                name: 'Hết hạn',
                count: countHH,
                screen: (
                  <HetHan
                    data={data.filter(x => x['0_approve_status'] === '0')}
                    onReload={() => fetchData()}
                    approveInfo={approveInfo}
                    approveStatusPopup={approveStatus}
                  />
                ),
              },
            ]}
          />
        </Block>
      </Block>
      {modalDate}
    </Block>
  );
};

export default PheDuyetVang;
