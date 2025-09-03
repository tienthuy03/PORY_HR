import React from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TVSControlPopup from '../../../../../../components/Tvs/ControlPopup';
import {
  HRRE005HidePopupLyDo,
  HRRE005SetLyDoRaCong,
} from '../../../../../../services/redux/HRRE005_RaCong/action';
const PopupReason = () => {
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
    state => state.HRRE005_RaCongReducer.ShowPopupLyDo,
  );
  const DanhSachLyDo = useSelector(
    state => state.HRRE005_RaCongReducer.LyDoRaCong,
  );
  const togglePop = () => {
    dispatch(HRRE005HidePopupLyDo());
  };

  const renderItem = ({item}) => {
    const onSelect = () => {
      dispatch(HRRE005SetLyDoRaCong(item));
      togglePop();
    };
    return (
      <TouchableOpacity
        style={styles.oneFieldQues}
        activeOpacity={0.7}
        onPress={onSelect}>
        <Text>{item.code_nm}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <TVSControlPopup
      title={'Lý do ra cổng'}
      isShow={visible}
      onHide={togglePop}>
      <FlatList
        data={DanhSachLyDo}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </TVSControlPopup>
  );
};

export default PopupReason;
