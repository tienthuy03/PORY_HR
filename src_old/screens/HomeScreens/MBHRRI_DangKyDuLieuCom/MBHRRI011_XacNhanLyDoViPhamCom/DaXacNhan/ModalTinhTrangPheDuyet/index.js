import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Block from '../../../../../../components/Block';
import Button from '../../../../../../components/Button';
import Text from '../../../../../../components/Text';
import TVSButton from "../../../../../../components/Tvs/Button";
import TVSControlPopup from '../../../../../../components/Tvs/ControlPopup2';
const ModalApproveStatus = ({ isShow, item, close, approve_data }) => {
  // console.log(
  //   'approve_data ', approve_data ? approve_data : 'approve_data null-------------------',
  //   'Item pk: ', item ? item.pk : 'item null-------------------'
  // );
  const Color = useSelector(s => s.SystemReducer.theme);
  const pk = item ? item.pk : 0;
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
  const renderOneItem = ({ item }) => {
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
    );
  };
  return (
    <TVSControlPopup
      title={'Tình trạng phê duyệt'}
      isShow={isShow}
      onHide={close}
      bottom={
        <View
          flexDirection={"row"}
          justifyContent={"space-between"}
          paddingHorizontal={10}
          paddingVertical={10}
        >
          <TVSButton
            type="danger"
            onPress={close}
            icon={"close"}
            buttonStyle="3"
          >
            Đóng lại
          </TVSButton>
        </View>
      }
    >
      <FlatList
        data={approve_data.filter(x => x.thr_reg_pk === pk)}
        keyExtractor={(itemF, key) => key.toString()}
        renderItem={renderOneItem}
      />
    </TVSControlPopup>
  );
};
export default ModalApproveStatus;
