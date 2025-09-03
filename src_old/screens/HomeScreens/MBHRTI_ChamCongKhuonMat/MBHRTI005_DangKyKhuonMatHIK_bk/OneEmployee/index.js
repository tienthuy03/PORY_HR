/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import TVSControlPopupRegisterFace from '../Popup_DangKyKhuonMat';

const OneEmployee = ({item, onCheck, sortImage, arrWS, arrAG, arrMachine}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const {width, height} = Dimensions.get('screen');
  const [modalVisible, setModalVisible] = useState(false);
  const styles = StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
      marginTop: 5,
      // flexDirection: 'row',
      backgroundColor: Color.white,
      borderRadius: 5,
    },
    viewAvatar: {
      width: 75,
      height: 100,
    },
    avatar: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
      borderRadius: 5,
      borderColor: Color.grayPlahoder,
      borderWidth: 1,
    },
    viewContent: {
      flex: 1,
      padding: 10,
    },
    fullname: {
      fontSize: 14,
      fontWeight: 'bold',
      color: Color.mainColor,
      marginBottom: 5,
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
    btnRegisterFace: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: 10,
      backgroundColor: Color.btnMain,
      marginRight: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    btnRegisterFaceText: {
      color: Color.white,
    },
  });
  const dispatch = useDispatch();
  // let dsNhanVien = useSelector(state =>
  //   state.HRTI005_DangKyKhuonMatHIKReducer.DanhSachNhanVien.filter(x =>
  //     sortImage ? x.image.length > 0 : x.image.length === 0,
  //   ),
  // );
  let dsNhanVien = useState(item);
  const {CheckAll} = useSelector(
    state => state.HRTI005_DangKyKhuonMatHIKReducer,
  );
  const [IsRegisted, setIsRegisted] = useState(item.is_registed);
  const [Avatar, setAvatar] = useState('');
  const onChecked = () => {
    setIsRegisted(item.is_registed === 'N' ? 'Y' : 'N');
    onCheck(item.emp_id, item.is_registed === 'N' ? 'Y' : 'N');
  };
  // useEffect(() => {
  //   if (CheckAll) {
  //     setIsRegisted('Y');
  //   } else {
  //     setIsRegisted('N');
  //   }
  // }, [CheckAll]);
  useEffect(() => {
    setAvatar(
      item.image.length === 0
        ? 'data:image/png;base64,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'
        : 'data:image/png;base64, ' + item.image,
    );
  }, []);

  const onRegisterFace = () => {
    setModalVisible(true);
  };

  const popupRegister = (
    <TVSControlPopupRegisterFace
      title={'ĐĂNG KÝ KHUÔN MẶT'}
      isShow={modalVisible}
      minHeight={height * 0.7}
      onHide={() => setModalVisible(false)}
      empInfo={item}
      NewImage={item.image}
      arrayWS={arrWS}
      arrayAG={arrAG}
      arrayMachine={arrMachine}
      groupPk={item.group_pk}></TVSControlPopupRegisterFace>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onRegisterFace}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.viewAvatar}>
            <Image style={styles.avatar} source={{uri: Avatar}} />
          </View>
          <View style={styles.viewContent}>
            <Text style={styles.fullname}>
              <MaterialCommunityIcons name={'account'} size={18} />
              {'   '}
              {item.full_name}
            </Text>
            <Text style={{marginBottom: 5, fontSize: 12}}>
              <MaterialCommunityIcons
                name={'card-account-details'}
                size={18}
                color={Color.mainColor}
              />
              {'   '}
              {item.emp_id}
            </Text>
            <Text style={{fontSize: 12}}>
              <MaterialCommunityIcons
                name={'barcode'}
                size={18}
                color={Color.mainColor}
              />
              {'   '}
              {item.id_num}
            </Text>
          </View>
          <TouchableOpacity style={styles.viewCheckbox} onPress={onChecked}>
            {IsRegisted === 'N' ? null : (
              <View style={styles.checkbox}>
                <MaterialCommunityIcons name={'check'} color={Color.white} />
              </View>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity
          style={styles.btnRegisterFace}
          onPress={onRegisterFace}

          // onPress={setModalVisible(true)}
        >
          <Text style={styles.btnRegisterFaceText}>
            <MaterialCommunityIcons size={16} name="face-recognition" /> Đăng ký
            khuôn mặt
          </Text>
        </TouchableOpacity> */}
        </View>
      </TouchableOpacity>

      {item.network_status !== undefined ? (
        <View style={{alignItems: 'flex-end', padding: 5}}>
          <Text
            style={
              item.network_status === 'Đăng ký không thành công.'
                ? {color: Color.red}
                : {color: Color.green}
            }>
            {' '}
            <MaterialCommunityIcons
              size={15}
              name={
                item.network_status === 'Đăng ký không thành công.'
                  ? 'alert-octagram'
                  : 'check-decagram'
              }
            />{' '}
            {item.network_status}
          </Text>
        </View>
      ) : null}

      {popupRegister}
    </View>
  );
};

export default OneEmployee;
