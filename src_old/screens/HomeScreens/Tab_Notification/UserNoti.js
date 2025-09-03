import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Color} from '../../../colors/colortv';
import {ntGetNotification} from '../../../services/redux/Notification/action';
import OneNotificationItem from './OneNotificationItem';
import axios from 'axios';
import {updateUserAction} from '../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../services/fetch';
const UserNoti = () => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const {notificationGen} = useSelector(state => state.NotificationReducer);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );

  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
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
        pro: 'SELHRAN0010101',
        in_par: {
          p1_varchar2: thr_emp_pk,
        },
        out_par: {
          p1_sys: 'notification',
          p2_sys: 'image',
          p3_number: 'count',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          dispatch(ntGetNotification());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const renderOneItem = ({item, index}) => (
    <OneNotificationItem key={index.toString()} item={item} />
  );
  return (
    <View style={{marginHorizontal: 10, marginVertical: 5}}>
      <FlatList
        ListHeaderComponent={() => {
          return notificationGen.filter(
            x =>
              x.post_dt.substr(0, 8) === moment(new Date()).format('YYYYMMDD'),
          ).length > 0 ? (
            <>
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginTop: 20,
                    marginBottom: 10,
                    color: Color.mainColor,
                  }}>
                  Hôm nay
                </Text>
              </View>
              <FlatList
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderOneItem}
                data={notificationGen.filter(
                  x =>
                    x.post_dt.substr(0, 8) ===
                    moment(new Date()).format('YYYYMMDD'),
                )}
                onRefresh={() => getData()}
                refreshing={false}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      padding: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>Không có dữ liệu</Text>
                  </View>
                )}
              />
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginTop: 20,
                    marginBottom: 10,
                    color: Color.mainColor,
                  }}>
                  Trước đó
                </Text>
              </View>
            </>
          ) : (
            <></>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOneItem}
        data={notificationGen.filter(
          x => x.post_dt.substr(0, 8) < moment(new Date()).format('YYYYMMDD'),
        )}
        onRefresh={() => getData()}
        refreshing={false}
        ListEmptyComponent={() => (
          <View
            style={{
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Không có dữ liệu</Text>
          </View>
        )}
      />
    </View>
  );
};

export default UserNoti;
