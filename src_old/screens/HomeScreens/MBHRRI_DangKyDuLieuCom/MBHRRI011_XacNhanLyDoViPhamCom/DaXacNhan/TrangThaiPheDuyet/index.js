import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Block from '../../../../../../components/Block';
import Text from '../../../../../../components/Text';
import { useSelector } from 'react-redux';
const ApproveStatus = ({ value, onSelectedAS }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const item = value;
  const onClickApproveStatus = () => {
    onSelectedAS(item);
  };
  return (
    <>
      <TouchableOpacity style={{
        flexDirection: 'row',
        paddingTop: 10,
        paddingLeft: 5,
        paddingBottom: 10,
        paddingRight: 5,
        borderBottomColor: '#F4F6F7',
        borderBottomWidth: 1,
        alignItems: 'center',
      }} onPress={onClickApproveStatus}>
        <Text style={{ flex: 1, }}>Trạng thái phê duyệt</Text>
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
            {item.approve_status}{' '}
            <Icon name={'eye-outline'} color={Color.mainColor} size={16} />
          </Text>
        </Block>
      </TouchableOpacity>
    </>
  );
};

export default ApproveStatus;
