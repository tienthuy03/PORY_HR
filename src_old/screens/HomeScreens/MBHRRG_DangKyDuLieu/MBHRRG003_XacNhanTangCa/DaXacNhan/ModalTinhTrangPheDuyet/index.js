import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import Text from '../../../../../../components/Text';
import TVSControlPopup from '../../../../../../components/Tvs/ControlPopup';
const ModalApproveStatus = ({isShow, item, close, approve_data}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    topTitleActive: {
      color: 'white',
    },
    topTitle: {
      color: 'black',
    },
    borderR5: {
      borderRadius: 5,
    },
    title: {
      color: Color.red,
    },
    oneItem: {
      borderRadius: 5,
      backgroundColor: Color.inputBackgroundColor,
      marginBottom: 10,
      borderRadius: 10,
    },
    oneField: {
      flexDirection: 'row',
      marginBottom: 5,
      marginTop: 5,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: Color.white,
      borderBottomWidth: 1,
    },
    label: {
      flex: 0,
    },
    content: {
      flex: 1,
      textAlign: 'right',
    },
  });
  const pk_reg_over = item ? item['0_pk'] : 0;
  const [curItem, setCurItem] = useState({
    tab: 1,
    date: item ? item.tt_approve_date : '',
    name: item ? item.tt_approve_name : '',
    note: item ? item.tt_approve_note : '',
    status: item ? item.tt_approve_status : '',
  });
  useEffect(() => {
    setCurItem({
      tab: 1,
      date: item ? item.tt_approve_date : '',
      name: item ? item.tt_approve_name : '',
      note: item ? item.tt_approve_note : '',
      status: item ? item.tt_approve_status : '',
    });
  }, [item]);

  const renderOneItem = ({item}) => {
    return (
      <View style={styles.oneItem}>
        <View style={styles.oneField}>
          <Text
            style={styles.label}
            color={Color.mainColor}
            fontWeight={'bold'}>
            {item.position_name}
          </Text>
          <Text style={styles.content} color={Color.mainColor}>
            {item.approve_person}
          </Text>
        </View>
        <View style={styles.oneField}>
          <Text style={styles.label}>Trạng thái duyệt</Text>
          <Text style={styles.content} color={Color.mainColor}>
            {item.approve_status}
          </Text>
        </View>
        <View style={styles.oneField}>
          <Text style={styles.label}>Ngày duyệt</Text>
          <Text style={styles.content} color={Color.mainColor}>
            {item.approve_date}
          </Text>
        </View>
        <View>
          <Text style={styles.label} paddingLeft={10}>
            Phản hồi phê duyệt
          </Text>
          <Text style={styles.content} padding={10}>
            {item.approve_note.length === 0 ? '' : item.approve_note}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <TVSControlPopup
      title={'Tình trạng phê duyệt'}
      isShow={isShow}
      onHide={close}>
      <FlatList
        data={approve_data.filter(x => x.thr_reg_pk === pk_reg_over)}
        keyExtractor={(itemF, key) => key.toString() + Math.random()}
        renderItem={renderOneItem}
      />
    </TVSControlPopup>
  );
};
export default ModalApproveStatus;
