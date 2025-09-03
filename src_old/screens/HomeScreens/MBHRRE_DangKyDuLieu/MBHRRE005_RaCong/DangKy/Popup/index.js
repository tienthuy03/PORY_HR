import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  HRRE005ChonToTruong,
  HRRE005ChonTruongBoPhan,
  HRRE005HidePopupNguoiPheDuyet,
} from '../../../../../../services/redux/HRRE005_RaCong/action';
const Popup = () => {
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
  const dispatch = useDispatch();
  const visible = useSelector(
    state => state.HRRE005_RaCongReducer.ShowPopupNguoiPheDuyet.isShow,
  );
  const type = useSelector(
    state => state.HRRE005_RaCongReducer.ShowPopupNguoiPheDuyet.type,
  );
  const dsToTruong = useSelector(
    state => state.HRRE005_RaCongReducer.DanhSachToTruong,
  );
  const dsTruongBoPhan = useSelector(
    state => state.HRRE005_RaCongReducer.DanhSachTruongBoPhan,
  );
  const ChonToTruong = useSelector(
    state => state.HRRE005_RaCongReducer.ChonToTruong,
  );
  const ChonTruongBoPhan = useSelector(
    state => state.HRRE005_RaCongReducer.ChonTruongBoPhan,
  );
  const data = type === 1 ? dsToTruong : dsTruongBoPhan;
  const hidePopup = () => {
    dispatch(HRRE005HidePopupNguoiPheDuyet());
  };
  const renderItem = ({item}) => {
    const onSelect = () => {
      dispatch(
        type === 1 ? HRRE005ChonToTruong(item) : HRRE005ChonTruongBoPhan(item),
      );
      hidePopup();
    };
    return (
      <TouchableOpacity
        style={styles.oneFieldQues}
        activeOpacity={0.7}
        onPress={onSelect}>
        <Text>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {visible ? (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.textHeader}>CHỌN NGƯỜI PHÊ DUYỆT</Text>
            </View>
            <View style={styles.body}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.pk.toString()}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.btnOk} onPress={hidePopup}>
                <Text style={styles.btnCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default Popup;
