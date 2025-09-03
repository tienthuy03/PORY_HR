import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HRDB001LayDuLieuThongKe} from '../../../services/redux/Dashboard/action';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
import {APP_VERSION} from '../../../config/Pro';

const GeneralInfomation = () => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );

  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {},
    titleView: {
      padding: 10,
      backgroundColor: Color.btnMain,
    },
    titleText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    body: {
      padding: 10,
    },
    oneRow: {
      flexDirection: 'row',
    },
    oneItemView: {
      padding: 10,
      flex: 1,
      borderRadius: 10,
      backgroundColor: 'white',
      margin: 5,
      shadowColor: Color.mainColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    oneItemValue: {
      color: Color.mainColor,
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    oneItemName: {
      fontSize: 12,
      color: '#404040',
      textAlign: 'center',
    },
  });
  useEffect(() => {
    dispatch(HRDB001LayDuLieuThongKe());
  }, []);

  // const data = useSelector(
  //   state => state.HRDB001_DashboardReducer.DuLieuThongKe,
  // );
  let data = [];
  useEffect(() => {
    setRow(
      data.length % 3 > 0 ? Math.floor(data.length / 3) + 1 : data.length / 3,
    );
  }, [data]);
  const [Row, setRow] = useState(0);
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
  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRDB001000',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'single',
          p2_sys: 'menu',
          p3_sys: 'detail',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
            data = rs.data;
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const OneItem = ({name, value}) => {
    return (
      <View style={styles.oneItemView}>
        <Text style={styles.oneItemValue}>{value}</Text>
        <Text style={styles.oneItemName}>{name}</Text>
      </View>
    );
  };
  const RenderItem = () => {
    let item = [];
    for (let i = 0; i < Row; i++) {
      const j = i * 3;
      item.push(
        <View style={styles.oneRow} key={i + 'a'}>
          <OneItem name={data[j].name} value={data[j].value} />
          {data[j + 1] === undefined ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{padding: 10, flex: 1, borderRadius: 5, margin: 5}} />
          ) : (
            <OneItem name={data[j + 1].name} value={data[j + 1].value} />
          )}
          {data[j + 2] === undefined ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{padding: 10, flex: 1, borderRadius: 5, margin: 5}} />
          ) : (
            <OneItem name={data[j + 2].name} value={data[j + 2].value} />
          )}
        </View>,
      );
    }
    return (
      <View
        style={{
          padding: 10,
        }}>
        {item}
      </View>
    );
  };
  return <RenderItem />;
};

export default GeneralInfomation;
