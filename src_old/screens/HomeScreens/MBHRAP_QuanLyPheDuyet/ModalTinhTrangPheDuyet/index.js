import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
const ModalApproveStatus = ({isShow, item, close, approveStatus}) => {
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
  const pk_req_over = item['0_pk'] ?? 0;
  //function callback for close this modal
  const onCloseModal = () => {
    close();
  };
  const renderOneItem = ({item}) => {
    return (
      <>
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
            <Text style={styles.label}>Ngày duyệt</Text>
            <Text style={styles.content} color={Color.mainColor}>
              {item.approve_date}
            </Text>
          </View>
          <View style={styles.oneField}>
            <Text style={styles.label}>Phản hồi phê duyệt</Text>
            <Text style={styles.content}>
              {item.approve_note.length === 0 ? '' : item.approve_note}
            </Text>
          </View>
        </View>
      </>
    );
  };
  return (
    <TVSControlPopup
      title={'Tình trạng phê duyệt'}
      onHide={onCloseModal}
      isShow={isShow}>
      <FlatList
        data={approveStatus.filter(item => item.thr_reg_pk === pk_req_over)}
        keyExtractor={(itemF, key) => key.toString()}
        renderItem={renderOneItem}
        ListEmptyComponent={() => (
          <View
            style={{
              padding: 20,
            }}>
            <Text>Không có dữ liệu</Text>
          </View>
        )}
      />
    </TVSControlPopup>
  );
};
export default ModalApproveStatus;
