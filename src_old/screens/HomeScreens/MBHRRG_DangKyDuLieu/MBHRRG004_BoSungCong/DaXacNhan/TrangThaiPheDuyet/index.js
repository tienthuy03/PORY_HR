import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import Block from '../../../../../../components/Block';
import Text from '../../../../../../components/Text';
const ApproveStatus = ({ value, onSelectedAS }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    textTitle: {
      flex: 1,
    },
    container: {
      flexDirection: 'row',
      paddingTop: 10,
      paddingLeft: 5,
      paddingBottom: 10,
      paddingRight: 5,
      borderBottomColor: '#F4F6F7',
      borderBottomWidth: 1,
      alignItems: 'center',
    },
  });
  const item = value;
  const onClickApproveStatus = () => {
    onSelectedAS(item);
  };
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onClickApproveStatus}>
        <Text style={styles.textTitle}>Trạng thái phê duyệt</Text>
        <Block
          alignCenter
          justifyCenter
          radius={4}
          borderWidth={1}
          borderColor={Color.mainColor}>
          <Text
            paddingLeft={4}
            paddingRight={4}
            padding={3}
            fontFamily={'Roboto-Medium'}
            color={Color.mainColor}>
            {item["0_approve_status"]}{' '}
            <Icon name={'eye-outline'} color={Color.mainColor} size={16} />
          </Text>
        </Block>
      </TouchableOpacity>
    </>
  );
};

export default ApproveStatus;
