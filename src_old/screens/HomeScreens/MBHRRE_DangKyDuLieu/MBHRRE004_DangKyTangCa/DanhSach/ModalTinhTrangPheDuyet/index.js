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
      backgroundColor: Color.inputBackgroundColor,
      borderRadius: 10,
      marginBottom: 10,
    },
    oneField: {
      flexDirection: 'row',
      marginBottom: 5,
      marginTop: 5,
      padding: 10,
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
  const {pk} = item ?? 0;
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
      <>
        {item.thr_reg_pk === pk ? (
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
              <Text style={styles.label}>Tình trạng duyệt</Text>
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
        ) : null}
      </>
    );
  };
  //function callback for close this modal
  const onCloseModal = () => {
    close();
  };
  return (
    <TVSControlPopup
      isShow={isShow}
      title={'Tình trạng phê duyệt'}
      onHide={close}>
      <FlatList
        data={approve_data}
        keyExtractor={(itemF, key) => key.toString()}
        renderItem={renderOneItem}
      />
    </TVSControlPopup>
  );
};
export default ModalApproveStatus;
