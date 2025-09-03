import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Block from '../../../../../../components/Block';
import Text from '../../../../../../components/Text';
import styles from './style';
import {useSelector} from 'react-redux';
const ApproveStatus = ({value, onSelectedAS}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
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
            {item.approve_status}{' '}
            <Icon name={'eye-outline'} color={Color.mainColor} size={16} />
          </Text>
        </Block>
      </TouchableOpacity>
    </>
  );
};

export default ApproveStatus;
