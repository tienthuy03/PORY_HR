import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  HRTI004LoadDanhSachMayChamCongS,
  HRTI004ShowPopupMayChamCong,
} from '../../../../../services/redux/HRTI004_DangKyKhuonMatFe/action';
import axios from 'axios';
import {updateUserAction} from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../../services/fetch';

const PopupMayChamCong = ({onRegister}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    top: {
      flex: 1,
      backgroundColor: Color.mainColor,
    },
    bottom: {
      flex: 1,
      backgroundColor: Color.mainColor,
    },
    mainContent: {
      padding: 10,
      borderRadius: 5,
      width: 300,
      backgroundColor: Color.white,
    },
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    body: {
      maxHeight: 300,
    },
    oneFieldQues: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#F3F6F9',
      marginBottom: 5,
    },
    content: {
      width: 300,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomColor: Color.mainColor,
      borderBottomWidth: 1,
    },
    textHeader: {
      fontSize: 20,
      color: Color.mainColor,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      marginTop: 10,
      paddingTop: 10,
      borderTopColor: Color.mainColor,
      borderTopWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnClose: {
      backgroundColor: Color.btnForeign,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnOk: {
      backgroundColor: Color.btnMain,
      borderRadius: 5,
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      margin: 5,
    },
    btnCloseText: {
      color: 'white',
    },
    oneField: {
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor: Color.inputBackgroundColor,
      alignItems: 'center',
      flexDirection: 'row',
    },
    checkbox: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Color.mainColor,
    },
    viewCheckbox: {
      margin: 10,
      height: 30,
      width: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
  });
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );
  const {ShowPopupMayChamCong} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  let {DanhSachMayChamCong} = useSelector(
    state => state.HRTI004_DangKyKhuonMatFeReducer,
  );
  const refreshNewToken = (obj, {p1}) => {
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
        if (obj == 'renderItem') {
          renderItem({p1});
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

  const onToggle = () => {
    dispatch(HRTI004ShowPopupMayChamCong(false));
  };
  const renderItem = ({item}) => {
    const onChecked = () => {
      sysFetch(
        API,
        {
          pro: 'SELHRTI0042100',
          in_par: {},
          out_par: {
            p1_sys: 'data',
          },
        },
        tokenLogin,
      )
        .then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('renderItem', {item});
          }
          if (rs != 'Token Expired') {
            DanhSachMayChamCong.filter(i => i.id === item.id)[0].is_selected =
              !item.is_selected;
            dispatch(HRTI004LoadDanhSachMayChamCongS(DanhSachMayChamCong));
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
    return (
      <TouchableOpacity style={styles.oneField} onPress={onChecked}>
        <View style={styles.viewCheckbox}>
          {item.is_selected ? (
            <View style={styles.checkbox}>
              <MaterialCommunityIcons name={'check'} color={Color.white} />
            </View>
          ) : null}
        </View>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      {ShowPopupMayChamCong ? (
        <View style={styles.container}>
          <TouchableOpacity style={styles.top} onPress={onToggle} />
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.textHeader}>CHỌN MÁY CHẤM CÔNG</Text>
            </View>
            <View style={styles.body}>
              <FlatList
                data={DanhSachMayChamCong}
                renderItem={renderItem}
                keyExtractor={item => item.name}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.btnClose} onPress={onToggle}>
                <Text style={styles.btnCloseText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOk} onPress={onRegister}>
                <Text style={styles.btnCloseText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.bottom} />
        </View>
      ) : null}
    </>
  );
};

export default PopupMayChamCong;
