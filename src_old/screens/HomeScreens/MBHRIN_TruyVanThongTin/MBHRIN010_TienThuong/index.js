/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Platform, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import MonthPicker from 'react-native-month-year-picker';
import TVSHeader from '../../../../components/Tvs/Header';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
const MBHRIN010_TienThuong = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const mainMenu = useSelector(state => state.menuReducer.data.data.menu);
  const language = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
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
  const [currentDate, setCurrentDate] = useState(
    moment(Date.now()).format('YYYYMM'),
  );
  const [currentDateLabel, setCurrentDateLabel] = useState(
    moment(Date.now()).format('MM/YYYY'),
  );

  const [data, setData] = useState([]);

  const [isShowModalMonthPicker, setIsShowModalMonthPicker] = useState(false);

  //first loading
  useEffect(() => {
    getData();
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
        if (obj == 'getData') {
          getData();
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
  //on request get data
  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRIN0100100',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: currentDate,
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          let temp = [];
          rs.data.data.map(x => {
            temp.push(x.txtvalue.split('|'));
          });
          setData(temp);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          mainMenu,
          'MBHRIN010',
          mainMenu.filter(x => x.menu_cd === 'MBHRIN010')[0].p_pk,
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Block shadow margin={10} radius={8} backgroundColor={Color.gray}>
          <Button
            nextScreen={() => setIsShowModalMonthPicker(true)}
            row
            alignCenter
            padding={10}
            justifyContent={'space-between'}>
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text
              paddingRight={20}
              center
              size={14}
              color={Color.mainColor}
              flex
              paddingLeft={10}
              height={60}>
              Tháng {currentDateLabel}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>

        <Block flex>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <OneField item={item} />}
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
            refreshing={false}
            onRefresh={getData}
          />
        </Block>
      </Block>
      {isShowModalMonthPicker && (
        <MonthPicker
          onChange={(a, b) => {
            setIsShowModalMonthPicker(false);
            setCurrentDate(moment(b).format('YYYYMM'));
            setCurrentDateLabel(moment(b).format('MM/YYYY'));
          }}
          value={new Date(moment(currentDateLabel, 'MM/YYYY'))}
          minimumDate={new Date(2014, 12)}
          maximumDate={new Date(2030, 12)}
          okButton="Chọn"
          cancelButton="Huỷ"
          enableAutoDarkMode={Platform.OS === 'ios' ? true : false}
        />
      )}
    </Block>
  );
};
const OneField = ({item}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  return (
    <View
      style={{
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <FlatList
        data={item}
        keyExtractor={(i, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                backgroundColor: index % 2 === 0 ? 'white' : Color.blueB,
              }}>
              <View style={{flex: 1}}>
                <Text color={Color.keyColor}>{item.split(':')[0]}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text color={Color.valueColor}>{item.split(':')[1]}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MBHRIN010_TienThuong;
