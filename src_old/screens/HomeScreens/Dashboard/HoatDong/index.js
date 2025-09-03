/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {FlatList, Image, Text, View, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HRDB001LayDuLieuHoatDong} from '../../../../services/redux/Dashboard/action';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const HoatDong = () => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
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
      padding: 5,
      borderRadius: 5,
      backgroundColor: Color.white,
      margin: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    oneItemImage: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginRight: 10,
    },
    oneItemName: {
      fontWeight: 'bold',
      color: Color.mainColor,
      fontSize: 15,
    },
    oneItemContent: {
      marginBottom: 5,
      marginTop: 5,
    },
    oneItemCD: {
      color: Color.grayPlahoder,
    },
  });
  // const data = useSelector(
  //   state => state.HRDB001_DashboardReducer.DuLieuHoatDong,
  // );
  let data = [];
  let image = '';
  try {
    image = useSelector(state => state.loginReducers.data.data.avatar);
  } catch (error) {}

  useEffect(() => {
    // dispatch(HRDB001LayDuLieuHoatDong());
    getData();
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
        pro: 'SELHRDB0011100',
        in_par: {
          p1_varchar2: thr_emp_pk,
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
          if (rs.results == 'S') {
            data = rs.data.data;
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const OneItem = ({item}) => {
    const {content, created_date, title} = item.item;
    return (
      <View style={styles.oneItemView}>
        <Image style={styles.oneItemImage} source={{uri: image}} />
        <View>
          <Text style={styles.oneItemName}>{title}</Text>
          <Text style={styles.oneItemContent}>{content}</Text>
          <Text style={styles.oneItemCD}>{created_date}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Hoạt động gần đây</Text>
      </View>
      <View style={styles.body}>
        <FlatList
          onRefresh={() => getData()}
          refreshing={false}
          data={data}
          renderItem={item => <OneItem item={item} />}
          keyExtractor={(item, index) => index + 'HD'}
        />
      </View>
    </View>
  );
};

export default HoatDong;
