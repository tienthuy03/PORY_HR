import React, {Component} from 'react';
import Block from '../components/Block';
import Text from '../components/Text';
import Button from '../components/Button';
import {View, Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';

const {width, height} = Dimensions.get('screen');
const ListTTCT_MBHRIN003 = ({datas}) => {
  function setDateType(value) {
    if (value === 'Ngày lễ') {
      return value;
    } else if (value === 'Chủ nhật') {
      return value;
    } else {
      return 'Thứ ' + value;
    }
  }
  const renderItem = ({item, index}) => {
    return (
      <Block column marginLeft={20} marginRight={20} marginBottom={15}>
        <Block flex>
          <Block
            marginBottom={5}
            height={40}
            backgroundColor={Color.mainColor}
            width={width / 3}
            alignCenter
            radius={8}
            justifyCenter>
            <Text color={'#fff'} size={13}>
              {moment(item.work_date).format('DD-MM-YYYY')}
            </Text>
          </Block>
        </Block>
        <Block backgroundColor={'#fff'} radius={6} paddingBottom={5}>
          <Block
            row
            borderBottomWidth={1}
            borderBottomColor={'#D9DCE3'}
            paddingTop={15}
            paddingBottom={15}
            paddingRight={5}
            paddingLeft={5}
            alignCenter
            justifyContent={'space-between'}>
            <Text color={Color.mainColor} flex={1}>
              Loại vắng:
            </Text>
            <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
              {item.abs_type}
            </Text>
          </Block>
          <Block
            row
            borderBottomWidth={1}
            borderBottomColor={'#D9DCE3'}
            paddingTop={15}
            paddingBottom={15}
            paddingRight={5}
            paddingLeft={5}
            alignCenter
            justifyContent={'space-between'}>
            <Text color={Color.mainColor} flex={1}>
              Giờ vắng từ - đến
            </Text>
            <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
              {item.start_hours ? item.start_hours : '--:--'}
            </Text>
          </Block>
          <Block
            row
            borderBottomWidth={1}
            borderBottomColor={'#D9DCE3'}
            paddingTop={15}
            paddingBottom={15}
            paddingRight={5}
            paddingLeft={5}
            alignCenter
            justifyContent={'space-between'}>
            <Text color={Color.mainColor} flex={1}>
              Giờ vắng:
            </Text>
            <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
              {item.abs_hours}
            </Text>
          </Block>
          <Block
            row
            borderBottomWidth={1}
            borderBottomColor={'#D9DCE3'}
            paddingTop={15}
            paddingBottom={15}
            paddingRight={5}
            paddingLeft={5}
            alignCenter
            justifyContent={'space-between'}>
            <Text color={Color.mainColor} flex={1}>
              Lý do vắng:
            </Text>
            <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
              {item.description}
            </Text>
          </Block>
        </Block>
      </Block>
    );
  };

  return (
    <Block>
      <FlatList
        data={datas}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </Block>
  );
};

export default ListTTCT_MBHRIN003;
