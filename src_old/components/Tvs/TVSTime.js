import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Color} from '../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Block from '../Block';
import Button from '../Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
const TVSTime = ({
  children,
  onPress = null,
  disabled = false,
  colorText,
  time,
  modalVisible,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <Button
        nextScreen={onPress}
        style={{
          // flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: Color.gray,
          borderRadius: 6,
        }}>
        <Block
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 10,
            paddingVertical: 10,
          }}>
          <Text style={{color: colorText}}>{time}</Text>
        </Block>
        <Block
          style={{
            justifyContent: 'center',
            paddingRight: 10,
          }}>
          <Icon size={25} color={Color.mainColor} name={'clock-outline'} />
        </Block>
      </Button>
      <DateTimePickerModal
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        isVisible={modalVisible}
        mode="time"
        hideTitleContainerIOS={false}
        date={new Date()}
        locale="vi_VN"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default TVSTime;
