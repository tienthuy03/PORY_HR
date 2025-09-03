import axios from 'axios';
import md5 from 'md5';
import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Device from 'react-native-device-info';
import {useSelector} from 'react-redux';
const PopupEmail = ({visible, togglePUChangeEmail}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 888,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    content: {
      width: 400,
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
      backgroundColor: Color.mainColor,
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
    input: {
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    oneField: {
      marginBottom: 10,
    },
    textErr: {
      color: 'red',
      textAlign: 'right',
    },
  });
  const CurPass = useSelector(state => state.loginReducers.pass_word);

  const API = useSelector(state => state.SysConfigReducer.API_URL);

  const tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const [ErrorEmail, setErrorEmail] = useState('');
  const [ErrorPassword, setErrorPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const onSave = () => {
    if (Email.length === 0) {
      setErrorEmail('Email không được bỏ trống.');
    } else {
      setErrorEmail('');
    }
    if (Password.length === 0) {
      setErrorPassword('Mật khẩu không được bỏ trống.');
    } else {
      setErrorPassword('');
    }
    if (Password.length > 0 && Email.length > 0) {
      if (md5(Password) === CurPass) {
        UpdateEmail();
      } else {
        Alert.alert('Thông báo', 'Mật khẩu không đúng.', [{text: 'Xác nhận'}]);
      }
    }
  };

  const UpdateEmail = async () => {
    const param = {
      pro: 'UPDCFQP0010100',
      in_par: {
        p1_varchar2: '',
        p2_varchar2: Email.toString().trim().toLowerCase(),
      },
      out_par: {},
      token: 'tvs',
      machine_id: Device.getUniqueId(),
    };
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
      },
    };
    return await axios
      .post(API + 'Exec/MOBILE', param, axiosConfig)
      .then(rs => {
        if (rs.data.results === 'S') {
          Alert.alert('Thông báo', 'Thay đổi email mới thành công.', [
            {
              text: 'Xác nhận',
              onPress: () => {
                togglePUChangeEmail();
              },
            },
          ]);
        } else {
          Alert.alert('Thông báo', 'Thay đổi email mới thất bại.', [
            {text: 'Xác nhận'},
          ]);
        }
      });
  };

  return (
    <>
      {visible ? (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.textHeader}>THAY ĐỔI ĐỊA CHỈ EMAIL</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.oneField}>
                <Text>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email mới."
                  onChangeText={value => setEmail(value)}
                />
                {ErrorEmail.length === 0 ? null : (
                  <Text style={styles.textErr}>{ErrorEmail}</Text>
                )}
              </View>
              <View style={styles.oneField}>
                <Text>Mật khẩu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu."
                  onChangeText={value => setPassword(value)}
                  secureTextEntry={true}
                />
                {ErrorPassword.length === 0 ? null : (
                  <Text style={styles.textErr}>{ErrorPassword}</Text>
                )}
              </View>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.btnClose}
                onPress={togglePUChangeEmail}>
                <Text style={styles.btnCloseText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOk} onPress={onSave}>
                <Text style={styles.btnCloseText}>Sao lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default PopupEmail;
