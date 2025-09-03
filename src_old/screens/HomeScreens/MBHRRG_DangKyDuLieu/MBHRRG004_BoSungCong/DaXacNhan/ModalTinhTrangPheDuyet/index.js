import React, {useEffect, useState} from 'react';
import {FlatList, Modal, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../../../components/Block';
import Button from '../../../../../../components/Button';
import Text from '../../../../../../components/Text';
import TVSButton from '../../../../../../components/Tvs/Button';
import TVSControlPopup from '../../../../../../components/Tvs/ControlPopup2';
const ModalApproveStatus = ({isShow, item, close, approve_data}) => {
  console.log(approve_data);
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
      borderRadius: 10,
      marginBottom: 10,
      backgroundColor: Color.inputBackgroundColor,
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
  const pk = item ? item['0_pk'] : 0;
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
  //function callback for close this modal
  const onCloseModal = () => {
    close();
  };
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
          <Text style={styles.label}>Trạng thái</Text>
          <Text style={styles.content} color={Color.mainColor}>
            {item.approve_status}
          </Text>
        </View>
        <View style={styles.oneField}>
          <Text style={styles.label}>Ngày</Text>
          <Text style={styles.content} color={Color.mainColor}>
            {item.approve_date}
          </Text>
        </View>
        <View>
          <Text style={styles.label} paddingLeft={10}>
            Nội dung
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
      isShow={isShow}
      onHide={onCloseModal}
      title="Tình trạng phê duyệt"
      bottom={
        <TVSButton
          buttonStyle={'3'}
          onPress={() => onCloseModal()}
          icon={'close'}
          type={'danger'}>
          Đóng lại
        </TVSButton>
      }>
      <FlatList
        data={approve_data.filter(x => x.thr_reg_pk === pk)}
        keyExtractor={(itemF, key) => key.toString()}
        renderItem={renderOneItem}
      />
    </TVSControlPopup>
  );
};
export default ModalApproveStatus;
